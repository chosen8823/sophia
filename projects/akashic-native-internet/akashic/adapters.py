from __future__ import annotations

from typing import Protocol
from urllib.parse import quote
import httpx

from .models import SemanticAtom


class SourceAdapter(Protocol):
    name: str

    async def search(self, query: str, limit: int = 8) -> list[SemanticAtom]: ...


class WaybackAdapter:
    name = "wayback"
    endpoint = "https://web.archive.org/cdx/search/cdx"

    async def search(self, query: str, limit: int = 8) -> list[SemanticAtom]:
        # Treat URL-like queries as direct historical lookups. Free-text routing can
        # later be expanded with a discovery/index layer instead of pretending CDX
        # is a general-purpose search engine.
        if "." not in query or " " in query:
            return []
        params = {
            "url": query,
            "output": "json",
            "filter": "statuscode:200",
            "fl": "timestamp,original,mimetype,statuscode,digest,length",
            "limit": str(limit),
        }
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(self.endpoint, params=params)
            r.raise_for_status()
            rows = r.json()
        if not rows:
            return []
        header, *data = rows
        atoms: list[SemanticAtom] = []
        for row in data:
            item = dict(zip(header, row))
            ts = item.get("timestamp", "")
            original = item.get("original", query)
            replay = f"https://web.archive.org/web/{ts}/{original}"
            atoms.append(
                SemanticAtom.from_text(
                    kind="capture",
                    text=f"Historical capture of {original} at {ts}",
                    source=self.name,
                    source_uri=replay,
                    metadata=item,
                )
            )
        return atoms


class CommonCrawlAdapter:
    name = "commoncrawl"
    index_catalog = "https://index.commoncrawl.org/collinfo.json"

    async def search(self, query: str, limit: int = 8) -> list[SemanticAtom]:
        # Common Crawl's index is URL-oriented. We use the newest index and return
        # capture metadata; content retrieval from WARC is intentionally a separate
        # operation so evidence boundaries stay explicit.
        if "." not in query or " " in query:
            return []
        async with httpx.AsyncClient(timeout=20) as client:
            catalog_response = await client.get(self.index_catalog)
            catalog_response.raise_for_status()
            catalog = catalog_response.json()
            if not catalog:
                return []
            newest = catalog[0]
            index_url = newest["cdx-api"]
            r = await client.get(
                index_url,
                params={"url": query, "output": "json", "limit": str(limit)},
            )
            r.raise_for_status()

        atoms: list[SemanticAtom] = []
        for line in r.text.splitlines():
            if not line.strip():
                continue
            import json
            item = json.loads(line)
            atoms.append(
                SemanticAtom.from_text(
                    kind="capture",
                    text=f"Common Crawl capture of {item.get('url', query)} at {item.get('timestamp', '')}",
                    source=self.name,
                    source_uri=index_url,
                    metadata={**item, "crawl": newest.get("id")},
                )
            )
        return atoms


class ConfiguredHTTPAdapter:
    """Read-only hook for optional services such as a Perchance generator.

    This does not assume undocumented APIs. A specific endpoint/contract must be
    configured before the router will call it.
    """

    def __init__(self, name: str, endpoint: str | None = None):
        self.name = name
        self.endpoint = endpoint

    async def search(self, query: str, limit: int = 8) -> list[SemanticAtom]:
        if not self.endpoint:
            return []
        return [
            SemanticAtom.from_text(
                kind="observation",
                text=f"Configured adapter {self.name} is available for query: {query}",
                source=self.name,
                source_uri=self.endpoint,
                metadata={"configured": True, "limit": limit},
            )
        ]
