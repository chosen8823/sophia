# Roadmap

The roadmap is organized around evidence capability rather than feature count.

## Phase 0 — Skeleton

Status: in progress

- FastAPI surface
- typed semantic atoms
- Wayback CDX adapter
- Common Crawl adapter shell
- multi-source query orchestration
- source-failure residue
- local-first / allow-list trust model

Exit condition: one query can fan out to multiple public historical sources and return normalized evidence with provenance.

## Phase 1 — Historical body retrieval

- resolve Common Crawl index hits to WARC ranges
- fetch and decode WARC records safely
- retrieve Wayback snapshot bodies where policy permits
- normalize text / metadata
- content hashing
- persistent atom store
- deterministic replay fixtures

Exit condition: a historical URL can be reconstructed into source-addressable atoms rather than only index metadata.

## Phase 2 — Hybrid retrieval

- SQLite / DuckDB baseline store
- FTS5 / BM25 lexical index
- optional vector index
- temporal index
- provenance-aware filters
- cache layer
- deduplication by content digest

Exit condition: local historical evidence is searchable without re-querying upstream archives.

## Phase 3 — Entity / OSINT graph

- entity extraction
- alias resolution
- domain / organization / person / file observables
- temporal relationship edges
- contradiction / corroboration edges
- STIX 2.1 export profile for compatible observables

Exit condition: the system can answer "what changed, when, according to which sources?" with a graph-backed trace.

## Phase 4 — Provenance-native synthesis

- W3C PROV-compatible export
- answer objects with support / contradiction sets
- confidence dimensions
- unresolved evidence queue
- source-quality metrics
- claim tracing API

Exit condition: every generated answer can be decomposed into a complete evidence trace.

## Phase 5 — Agent-native interface

- MCP server
- query / trace / compare tools
- atom and timeline resources
- streaming retrieval
- typed machine-readable next actions
- integration with multi-model conversational surfaces

Exit condition: an external AI can consume Akashic as infrastructure without scraping a human UI.

## Phase 6 — Local diagnostic membrane

- read-only collector contract
- hardware / storage / power / event-log adapters
- signed capability manifest
- local execution receipts
- cross-view correlation
- explicit privilege boundary

Exit condition: an authorized local computer can expose diagnostic evidence to the same semantic-atom substrate used for web evidence.

## Phase 7 — Distributed compute router

- worker registry
- policy engine
- local CPU / GPU capability discovery
- deny-by-default remote execution
- explicitly approved remote workers
- job receipts
- data-class constraints

Exit condition: compute placement is explainable and auditable.

## Phase 8 — Archive commons

- optional ArchiveBox adapter
- user-owned capture store
- import / export WARC
- content-addressable artifact store
- shared metadata without mandatory raw-data centralization

Exit condition: a user can preserve evidence locally and still participate in the same AI-native evidence model.

## Phase 9 — Spatial / parallax views

- graph view
- timeline view
- provenance view
- source-comparison view
- 3D / spatial relationship experiment

The goal is not decorative 3D. Each view must be a projection over the same canonical atoms so perspective changes do not create competing truth stores.

## Phase 10 — Recursive commons

- source-health learning
- route-quality learning
- parser failure clustering
- learned cache policy
- shared surplus event bus
- replayable improvement experiments

Exit condition: useful overflow improves future behavior while raw evidence and decision provenance remain stable.

## Non-goals

The project is not intended to become:

- an unrestricted crawler with no policy controls
- a remote execution backdoor
- a system that silently treats model output as primary evidence
- a monolithic database that erases source distinctions
- a chatbot whose only durable state is conversation text

## Near-term issue candidates

1. Implement Common Crawl WARC range retrieval.
2. Add persistent atom storage with SQLite.
3. Add deterministic adapter fixtures and tests.
4. Add OpenAPI examples for evidence traces.
5. Define JSON-LD / PROV export mapping.
6. Add Memento-compatible temporal vocabulary.
7. Add MCP read-only prototype.
8. Add source / worker capability manifest schema.
9. Add contradiction and corroboration relation types.
10. Add safe local diagnostic collector interface.
