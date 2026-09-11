# Akashic Documentation Map

This directory is the engineering map for the AI-native internet layer.

## Start here

1. [REFERENCE_ARCHITECTURE.md](REFERENCE_ARCHITECTURE.md) — production topology, planes, bi-axis model, shared residue, temporal model, and Sophia crosswalk.
2. [AI_NATIVE_PROTOCOL.md](AI_NATIVE_PROTOCOL.md) — machine-oriented query envelopes, evidence packets, contradictions, temporal retrieval, and agent interfaces.
3. [SEMANTIC_ATOMS.md](SEMANTIC_ATOMS.md) — durable evidence-object contract.
4. [ARCHITECTURE.md](ARCHITECTURE.md) — core invariants and current prototype architecture.
5. [STANDARDS_AND_PRIOR_ART.md](STANDARDS_AND_PRIOR_ART.md) — compatibility targets and neighboring systems.
6. [SECURITY_AND_COMPUTE.md](SECURITY_AND_COMPUTE.md) — local-first trust boundary and worker gating.
7. [OPERATIONS_AND_OBSERVABILITY.md](OPERATIONS_AND_OBSERVABILITY.md) — telemetry, receipts, health, capability manifests, and diagnostic membrane profile.
8. [ROADMAP.md](ROADMAP.md) — staged implementation path.

## Architectural stance

Akashic is a substrate, not an application monolith.

```text
archives / live / local evidence
            |
            v
      acquisition plane
            |
            v
      semantic atoms
            |
   +--------+---------+
   |        |         |
provenance indexes entity/time graph
   |        |         |
   +--------+---------+
            |
            v
 agents / chat / OSINT / diagnostics / spatial views
```

## External reference baseline

The project intentionally interoperates with established public work instead of reinventing basic archive and provenance mechanics:

- Common Crawl — WARC/WAT/WET corpus and URL/columnar indexes
- Internet Archive / Wayback — historical capture discovery and replay
- WARC — archival payload container
- Memento / RFC 7089 — time-based web access concepts
- W3C PROV / PROV-O — provenance vocabulary
- STIX 2.1 — optional cyber-observable export profile
- ArchiveBox — local/self-hosted preservation patterns
- MCP — agent-facing resource/tool transport
- OpenTelemetry — operational traces/metrics/log transport
- Arrow/Parquet — bulk analytic projections
- JSON-LD — linked-data interchange

These are compatibility references, not authority over the internal evidence model.

## Internal architecture crosswalk

The current Sophia workspace already contains useful adjacent designs:

- Enterprise Sophia CRM/OSINT v1: evidence hierarchy, zero-trust relational fabric, explicit transaction lifecycle
- OmniThread AI: shared multi-model thread, context normalization, model routing
- Sophia Canonical Index: stable vocabulary and state-class distinctions
- 3-Pole Atom CAD: multiple perspectives over one shared object
- local diagnostic/power evidence work: read-only acquisition, cross-view correlation, capability gating

Akashic uses these as design inputs while keeping its core protocol general and independently testable.

## Definition of done for a feature

A feature is not complete merely because it returns an answer. It should also answer:

- What source observations produced this?
- What transformations happened?
- What uncertainty remains?
- What contradicted it?
- What did the operation change?
- What useful residue can be reused by the rest of the system?

If those questions cannot be answered, the feature is still a prototype.