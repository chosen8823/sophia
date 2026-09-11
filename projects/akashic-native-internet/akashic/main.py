from fastapi import FastAPI

from .models import QueryRequest, QueryResponse
from .orchestrator import AkashicOrchestrator

app = FastAPI(title="Akashic Native Internet", version="0.1.0")
orchestrator = AkashicOrchestrator()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/v1/capabilities")
async def capabilities() -> dict:
    return {
        "sources": sorted(orchestrator.adapters),
        "remote_compute": "disabled_until_explicitly_configured",
        "mode": "read_only_retrieval",
        "provenance": "required",
    }


@app.post("/v1/query", response_model=QueryResponse)
async def query(request: QueryRequest) -> QueryResponse:
    return await orchestrator.query(request)
