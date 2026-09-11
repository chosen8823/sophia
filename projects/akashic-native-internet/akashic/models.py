from __future__ import annotations

from datetime import datetime, timezone
from hashlib import sha256
from typing import Any, Literal
from pydantic import BaseModel, Field


class Provenance(BaseModel):
    source: str
    source_uri: str
    retrieved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    observed_at: datetime | None = None
    content_digest: str | None = None
    transform: list[str] = Field(default_factory=list)


class SemanticAtom(BaseModel):
    atom_id: str
    kind: Literal["document", "capture", "entity", "claim", "event", "relation", "observation"]
    text: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    provenance: Provenance
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    parents: list[str] = Field(default_factory=list)

    @classmethod
    def from_text(
        cls,
        *,
        kind: str,
        text: str,
        source: str,
        source_uri: str,
        metadata: dict[str, Any] | None = None,
        parents: list[str] | None = None,
    ) -> "SemanticAtom":
        digest = sha256(text.encode("utf-8", errors="ignore")).hexdigest()
        return cls(
            atom_id=f"sha256:{digest}",
            kind=kind,
            text=text,
            metadata=metadata or {},
            provenance=Provenance(
                source=source,
                source_uri=source_uri,
                content_digest=digest,
            ),
            parents=parents or [],
        )


class QueryRequest(BaseModel):
    query: str
    sources: list[str] = Field(default_factory=lambda: ["commoncrawl", "wayback"])
    limit_per_source: int = Field(default=8, ge=1, le=50)
    include_trace: bool = True


class QueryResponse(BaseModel):
    query: str
    atoms: list[SemanticAtom]
    source_status: dict[str, str]
    trace_id: str
