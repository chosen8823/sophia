from __future__ import annotations

import asyncio
from hashlib import sha256

from .adapters import CommonCrawlAdapter, ConfiguredHTTPAdapter, SourceAdapter, WaybackAdapter
from .models import QueryRequest, QueryResponse


class AkashicOrchestrator:
    def __init__(self) -> None:
        self.adapters: dict[str, SourceAdapter] = {
            "commoncrawl": CommonCrawlAdapter(),
            "wayback": WaybackAdapter(),
            "perchance": ConfiguredHTTPAdapter("perchance"),
        }

    async def query(self, request: QueryRequest) -> QueryResponse:
        selected = [(name, self.adapters[name]) for name in request.sources if name in self.adapters]

        async def run(name: str, adapter: SourceAdapter):
            try:
                return name, await adapter.search(request.query, request.limit_per_source), "ok"
            except Exception as exc:  # preserve source failure as observable residue
                return name, [], f"error:{type(exc).__name__}:{exc}"

        results = await asyncio.gather(*(run(name, adapter) for name, adapter in selected))
        atoms = [atom for _, batch, _ in results for atom in batch]
        status = {name: state for name, _, state in results}

        trace_seed = request.query + "|" + "|".join(atom.atom_id for atom in atoms)
        trace_id = "sha256:" + sha256(trace_seed.encode()).hexdigest()

        return QueryResponse(
            query=request.query,
            atoms=atoms,
            source_status=status,
            trace_id=trace_id,
        )
