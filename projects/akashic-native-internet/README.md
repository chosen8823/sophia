# Akashic Native Internet

An AI-native retrieval and provenance layer over the public web and historical web archives.

The project treats the internet as a machine-readable field rather than a page collection. A query becomes a plan, source adapters retrieve evidence, evidence is normalized into traceable **semantic atoms**, OSINT enrichers connect entities/times/places, and the system returns both an answer and the provenance graph that produced it.

## Initial sources

- **Common Crawl** — web-scale crawl corpus, including archives collected since 2008.
- **Internet Archive / Wayback CDX** — historical capture index and replay references.
- **Live web adapter** — optional current-web retrieval.
- **Perchance adapter** — pluggable conversational/generative surface; exact generator URL is intentionally configurable rather than hard-coded.

## Core rule

> Nothing useful should be trapped.

Every operation may publish non-taxing surplus back into the commons: normalized observations, source fingerprints, embeddings, entity links, confidence changes, cache entries, route quality, and failure residue. Raw evidence remains separately addressable.

## Shape

```text
chat / agent / MCP client
        |
        v
   query planner
        |
        +--> Common Crawl
        +--> Wayback CDX
        +--> live web
        +--> local computer / approved worker
        +--> optional external adapters
        |
        v
 semantic atom normalizer
        |
        +--> provenance DAG
        +--> entity/time/place graph
        +--> embeddings + sparse index
        +--> OSINT enrichers
        |
        v
 answer + evidence + trace
```

## API sketch

- `POST /v1/query` — ask a question against configured sources.
- `GET /v1/atoms/{atom_id}` — inspect a normalized semantic atom.
- `GET /v1/traces/{trace_id}` — walk the evidence/provenance graph.
- `GET /v1/capabilities` — expose local/approved compute and source capabilities.

## Safety / trust boundaries

The router is allow-list first. Local compute is preferred. Remote compute remains unavailable until a provider and worker protocol are explicitly declared. Source adapters are read-only by default. Every derived claim retains source and transform provenance.

## Status

This branch contains the first runnable skeleton: typed semantic atoms, source adapter protocol, a query orchestrator, Wayback/Common Crawl adapter shells, and a FastAPI surface.