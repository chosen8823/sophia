# Deployment Profiles

Akashic Native Internet is designed to run from a single local machine through a distributed enterprise deployment without changing the evidence model.

The deployment profile changes resources, throughput, and policy. It does not change what counts as evidence.

## Profile A — Local laptop / diagnostic node

Purpose: private inspection, research, offline-first retrieval, and local machine diagnostics.

Recommended shape:

```text
chat / CLI / MCP client
        |
        v
local Akashic daemon
        |
   +----+------------------+
   |                       |
Wayback/Common Crawl   local read-only adapters
   |                       |
   +-----------+-----------+
               v
      DuckDB / Parquet cache
               |
       local semantic index
```

Characteristics:

- read-only acquisition by default
- no required cloud account
- CPU-first execution
- optional local embeddings
- local provenance store
- remote compute disabled unless explicitly approved
- suitable for USB diagnostic membrane workflows

## Profile B — Workstation / researcher node

Purpose: larger historical retrieval, local vector indexing, richer OSINT correlation, and multimodel experimentation.

Add:

- larger content-addressable cache
- OpenSearch or equivalent hybrid index
- local embedding / reranking model
- graph projection
- optional GPU worker
- background WARC extraction jobs
- OpenTelemetry collector

The GPU is a capability, not an authority boundary. Jobs must still satisfy data-class and worker policy.

## Profile C — Team / lab deployment

Purpose: shared evidence commons for multiple agents, researchers, and applications.

Recommended services:

```text
API / MCP gateway
      |
planner + policy router
      |
adapter workers ---- compute workers
      |                  |
      +--------+---------+
               v
      canonical evidence store
      /        |         \
 provenance  hybrid     entity/time
    DAG       index       graph
```

Add:

- authenticated client identities
- signed worker capability manifests
- durable queue
- replicated object storage
- deterministic transform versioning
- structured receipts for state-changing actions
- dataset / source access policies

## Profile D — Enterprise / distributed mesh

Purpose: governed historical-web + OSINT infrastructure spanning local and approved remote environments.

Add:

- policy decision point and policy enforcement points
- per-source and per-data-class access control
- tenant isolation
- retention / legal-hold profiles
- signed provenance receipts
- immutable audit stream
- distributed tracing
- bounded remote compute pools
- secrets broker rather than secrets in worker configuration
- offline / air-gapped ingestion lanes where needed

## Storage roles

Do not use one database for every job.

| Role | Suggested implementation class |
|---|---|
| Raw archive payloads | WARC / object storage / local archive |
| Canonical operational metadata | PostgreSQL or equivalent relational store |
| Local analytical cache | DuckDB |
| Bulk exchange | Arrow / Parquet |
| Lexical + semantic retrieval | OpenSearch or equivalent hybrid index |
| Graph projection | graph DB or relational edge tables |
| Embedding cache | vector index projection |
| Execution telemetry | OpenTelemetry-compatible backend |

Indexes are disposable projections. Canonical evidence and provenance are not.

## Local-computer attachment model

A local computer should attach through a narrow adapter rather than handing the platform unrestricted control.

```text
machine
  -> read-only collectors
  -> observation atoms
  -> correlation
  -> candidate diagnosis
  -> optional explicitly authorized action
```

Examples of useful collectors:

- PnP/problem device inventory
- power requests
- last wake source
- wake-armed devices
- firmware and system event records
- storage health
- driver topology
- network state
- container/runtime capability

This makes the same evidence machinery useful for the internet and for a single computer: both are observable systems that emit traceable residue.

## Hybrid retrieval profile

For serious deployments, query planning should combine multiple retrieval channels rather than choosing one globally:

1. exact identifiers / URLs
2. lexical BM25 or sparse search
3. semantic vector search
4. graph neighborhood expansion
5. temporal windows
6. source / trust / policy filters

Rank fusion or score normalization happens after each source keeps its own evidence identity. Search rank never replaces provenance.

## Agent-native attachment

Expose the substrate through a thin agent protocol surface:

```text
resources:
  akashic://atom/{id}
  akashic://trace/{id}
  akashic://timeline/{entity}
  akashic://source/{id}/capabilities

tools:
  query_history
  compare_snapshots
  resolve_entity
  find_contradictions
  trace_claim
```

The transport can be MCP, REST, CLI, or another adapter. The canonical evidence model stays transport-neutral.

## Deployment invariant

Moving from laptop to enterprise must not silently increase authority.

More compute means more capacity, not fewer boundaries.
