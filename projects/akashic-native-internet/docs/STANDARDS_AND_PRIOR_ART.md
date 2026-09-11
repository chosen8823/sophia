# Standards and Adjacent Systems Crosswalk

Akashic Native Internet deliberately reuses mature standards and lessons from systems that solve neighboring problems. The project should be novel where necessary and boring where interoperability already exists.

## Web archives and durable capture

### Common Crawl

Role: web-scale historical corpus and crawl index substrate.

Use in Akashic:

- discover historical crawl records
- resolve WARC/WAT/WET references
- retrieve machine-oriented crawl material
- seed large-scale temporal and entity indexes

Do not treat Common Crawl as the only historical source. Coverage, timing, and extraction quality vary.

### Internet Archive / Wayback Machine

Role: historical capture index and replay system.

Use in Akashic:

- CDX capture discovery
- timeline reconstruction
- snapshot comparison
- source provenance

The Wayback index and Common Crawl should be treated as independent observers. Agreement raises corroboration; disagreement is useful evidence.

### WARC

Role: durable interchange format for web crawl payloads and metadata.

Use in Akashic:

- raw archival evidence container
- replayable acquisition record
- export / import boundary

Semantic atoms should point to WARC records when a record exists rather than replacing them.

### ArchiveBox

Role: local / self-hosted preservation and collection management.

Relevant design lessons:

- preserve in multiple ordinary formats
- keep local ownership viable
- expose CLI/API/webhook integration points
- separate archive preservation from higher-level interpretation

Akashic can eventually use ArchiveBox as an optional local capture adapter rather than duplicating every capture format itself.

## Temporal web interoperability

### Memento / RFC 7089

Role: datetime negotiation for prior versions of web resources.

Use in Akashic:

- normalize temporal retrieval concepts
- expose historical resource negotiation cleanly
- represent original resource, memento, TimeGate, and TimeMap relationships

A future Akashic temporal API should be compatible in spirit with Memento even when the internal query model is richer.

## Provenance

### W3C PROV / PROV-O

Role: interoperable provenance model.

Core concepts:

- Entity
- Activity
- Agent
- derivation / generation / usage relations

Use in Akashic:

- provenance DAG vocabulary
- JSON-LD / RDF export
- trace interchange across systems

Akashic adds domain-specific concepts such as confidence, contradiction, source trust, historical capture semantics, and residue, but should map cleanly back to PROV primitives.

## OSINT and observable graphs

### STIX 2.1

Role: structured cyber-threat and observable information interchange.

Use in Akashic:

- optional export profile for domains, IPs, files, URLs, certificates, infrastructure, identities, and relationships
- reuse established identifiers and relationship semantics where appropriate

Do not force general historical-web evidence into STIX. STIX is a specialized projection over the broader semantic-atom graph.

## Agent-native interfaces

### Model Context Protocol (MCP)

Role: a standard agent-facing interface for exposing tools and resources.

Use in Akashic:

Potential resources:

```text
akashic://atom/{id}
akashic://trace/{id}
akashic://timeline/{entity}
akashic://source/{adapter}/capabilities
```

Potential tools:

```text
query_history
resolve_entity
trace_claim
compare_snapshots
find_contradictions
fetch_atom
```

MCP should be an adapter over the Akashic API, not the core storage model.

## Knowledge graphs and retrieval systems

Akashic overlaps with several established patterns:

- knowledge graphs
- retrieval-augmented generation
- vector databases
- event sourcing
- CQRS-style separation of writes and views
- content-addressable storage
- append-only provenance logs
- temporal databases
- data lineage platforms

The distinguishing combination is:

```text
historical web + live evidence
+ semantic atoms
+ explicit uncertainty
+ contradiction preservation
+ provenance-first reasoning
+ local-first agent interface
+ shared operational residue
```

## Internal Sophia ecosystem crosswalk

The current Sophia workspace already contains adjacent architectural work that can inform this project without coupling Akashic to any one application.

### Enterprise CRM / OSINT architecture

Reusable concepts:

- zero-trust relational evidence fabric
- immutable / append-oriented state
- explicit transaction stages
- evidence hierarchy separation
- typed OSINT enrichment

Akashic should remain the evidence substrate, while CRM-specific entities and mutations live above it.

### OmniThread

Reusable concepts:

- multi-model participation in one shared thread
- universal context normalization
- routing without pretending models share native state

Akashic can become the common evidence plane beneath a multi-model conversation so each participant receives the same source-addressable substrate.

### Canonical index / glossary

Reusable concepts:

- stable vocabulary
- explicit distinctions between measured, inferred, symbolic, and operational states
- shared names across distributed components

Akashic should maintain a machine-readable vocabulary file as the implementation grows.

### 3-Pole Atom / interactive spatial models

Reusable concept:

- multiple spatial perspectives over a shared object

For Akashic this maps naturally to graph, timeline, and provenance views over the same evidence atom rather than creating separate copies of truth.

### Diagnostic membrane / firmware evidence work

Reusable concepts:

- read-only acquisition boundary
- evidence collected before interpretation
- cross-view correlation
- capability gating

This is directly compatible with Akashic's adapter contract and future local-computer inspection source.

## Recommended compatibility targets

| Concern | Target |
|---|---|
| Raw web archive | WARC |
| Historical negotiation | Memento / RFC 7089 concepts |
| Provenance | W3C PROV / PROV-O |
| Cyber observables | STIX 2.1 export |
| Agent interface | MCP adapter |
| Batch analytics | Arrow / Parquet |
| Linked data | JSON-LD |
| API | OpenAPI / JSON |
| Content identity | SHA-256 or stronger content digests |

## References

- Common Crawl documentation: https://commoncrawl.org/
- Internet Archive: https://archive.org/
- W3C PROV-O: https://www.w3.org/TR/prov-o/
- Memento / RFC 7089: https://www.rfc-editor.org/rfc/rfc7089
- STIX 2.1: https://www.oasis-open.org/standard/stix-version-2-1/
- ArchiveBox: https://archivebox.io/
- MCP: https://modelcontextprotocol.io/

These links are reference material, not runtime dependencies.
