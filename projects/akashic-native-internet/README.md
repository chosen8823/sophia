# Akashic Native Internet

**An AI-native evidence fabric over the live and historical internet.**

Akashic Native Internet treats the web as a traceable machine-readable field instead of a pile of human-facing pages. A request becomes a retrieval plan; source adapters collect evidence; evidence becomes provenance-bearing semantic atoms; OSINT and temporal enrichment connect those atoms; and agents receive answers that can be traced all the way back to source observations.

> **Core rule:** nothing useful should be trapped, and nothing should be promoted without provenance.

## Why this exists

Most AI web workflows still imitate a person using a browser:

```text
question -> search results -> pages -> model reads -> answer
```

Akashic aims for a machine-native path:

```text
intent
  -> temporal / source-aware plan
  -> evidence observations
  -> semantic atoms
  -> provenance + entity graph
  -> retrieval / reasoning
  -> answer + evidence trace
  -> useful residue back into shared state
```

Historical captures, live observations, extracted claims, failures, contradictions, and model interpretations remain distinct objects instead of being flattened into one opaque context window.

## Current sources

- **Common Crawl** — web-scale crawl index / WARC substrate, including historical collections dating back to 2008.
- **Internet Archive / Wayback CDX** — historical capture discovery and timeline evidence.
- **Live web adapter** — optional current-web retrieval surface.
- **Local archive / diagnostic adapters** — planned read-only local evidence sources.
- **External generator/search adapters** — configurable and explicitly bounded rather than hard-coded.

## Architecture

```text
                    chat / agent / MCP client
                              |
                              v
                       intent + planner
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        Wayback CDX      Common Crawl      local / live
             |                |                |
             +----------------+----------------+
                              |
                              v
                     semantic atom layer
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
      provenance DAG      search indexes    entity graph
             |                |                |
             +----------------+----------------+
                              |
                              v
                    synthesis / response
                              |
                              v
                        shared residue
```

The system can also be viewed across two coupled axes:

```text
Observation: evidence -> atom -> interpretation -> state
Action:      intent -> plan -> execution -> residue
```

The provenance frame stabilizes both: any interpretation can be traced backward to evidence, and any action can be traced forward to its effects.

## Semantic atoms

A semantic atom is the smallest durable evidence object in the system. Depending on type, it may represent:

- a directly observed archive record
- normalized content
- a claim extracted from evidence
- a relationship
- an artifact
- a failed retrieval attempt

Atoms preserve source identity, time, integrity digests, transformation history, epistemic state, and parent evidence. Raw evidence remains separately addressable.

See [`docs/SEMANTIC_ATOMS.md`](docs/SEMANTIC_ATOMS.md).

## Provenance first

The provenance model is designed to map cleanly onto **W3C PROV / PROV-O** concepts:

- Entity — evidence, atom, artifact, answer
- Activity — retrieval, parse, extraction, enrichment, synthesis
- Agent — source adapter, model, worker, user

Akashic extends that vocabulary with contradiction, confidence, capture time, source trust, and reusable operational residue.

## Temporal web + OSINT

Time is first-class. The system distinguishes event time, capture time, observation time, and derivation time.

The design borrows from and interoperates with mature neighboring systems and standards, including:

- WARC
- Common Crawl
- Internet Archive / Wayback
- Memento / RFC 7089 concepts
- W3C PROV
- STIX 2.1 export profiles
- ArchiveBox-style local preservation
- MCP-style agent-native resources and tools

See [`docs/STANDARDS_AND_PRIOR_ART.md`](docs/STANDARDS_AND_PRIOR_ART.md).

## Local-first trust boundary

Akashic prefers local execution. Remote compute is unavailable until a worker/provider is explicitly declared and policy-approved.

A compute worker should advertise both capability and permission, such as:

```text
GPU vendor / model
runtime availability
network egress policy
filesystem access
allowed data classes
job limits
trust level
```

A GPU being visible does not imply exclusive ownership by a container, and lack of an NVIDIA runtime is a normal capability result rather than a fatal system condition.

See [`docs/SECURITY_AND_COMPUTE.md`](docs/SECURITY_AND_COMPUTE.md).

## Failure is evidence

Akashic preserves source failure instead of silently deleting it.

Examples:

```text
source_unavailable
record_missing
parse_failure
unsupported_media
conflicting_evidence
disallowed_remote_compute
insufficient_provenance
```

A missing or contradictory observation is part of the trace.

## API

Current prototype surface:

- `POST /v1/query` — fan out a question to configured evidence sources.
- `GET /v1/capabilities` — report configured source / compute capabilities.

Target surface:

- `GET /v1/atoms/{atom_id}` — inspect one evidence atom.
- `GET /v1/traces/{trace_id}` — walk a provenance graph.
- `GET /v1/timelines/{entity}` — retrieve temporal evidence.
- `POST /v1/compare` — compare snapshots / claims / source states.
- `POST /v1/resolve` — resolve an entity across evidence sources.

## Quick start

Requirements: Python 3.11+

```bash
cd projects/akashic-native-internet
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e .
uvicorn akashic.main:app --reload
```

Then inspect:

```text
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/v1/capabilities
```

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system planes, invariants, residue loop, bi-axis model.
- [`docs/SEMANTIC_ATOMS.md`](docs/SEMANTIC_ATOMS.md) — evidence unit contract and epistemic rules.
- [`docs/STANDARDS_AND_PRIOR_ART.md`](docs/STANDARDS_AND_PRIOR_ART.md) — Common Crawl, Wayback, WARC, PROV, STIX, ArchiveBox, MCP, and adjacent Sophia architecture crosswalk.
- [`docs/SECURITY_AND_COMPUTE.md`](docs/SECURITY_AND_COMPUTE.md) — trust boundaries, diagnostic membrane, worker capability policy.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phased path from archive retrieval to an agent-native evidence commons.

## Relationship to the wider Sophia stack

Akashic is intended to be a substrate, not another monolith. Adjacent Sophia work already explores CRM/OSINT evidence fabrics, multi-model unified threads, canonical vocabularies, spatial/parallax views, and read-only diagnostic membranes. Akashic gives those surfaces one common historical and provenance-native evidence layer while keeping application-specific behavior above the substrate.

## Project invariants

1. Raw evidence remains separately addressable.
2. Every derived claim can identify its parents.
3. Acquisition is read-only by default.
4. Remote execution is deny-by-default and allow-list gated.
5. Historical time is first-class.
6. Contradictions remain representable.
7. Uncertainty is preserved rather than silently collapsed.
8. Useful operational surplus may be shared without forcing synchronous coupling.
9. Retrieved source content is data, never instruction authority.
10. Local-first operation is a first-class deployment mode.

## Status

The branch currently contains the first runnable skeleton: typed semantic atoms, source adapter protocols, Common Crawl and Wayback adapter shells, query fan-out, failure residue, a FastAPI surface, and the initial architecture documentation.

The next concrete implementation milestone is **historical body retrieval + persistent atom storage**. See the roadmap for the staged build-out.
