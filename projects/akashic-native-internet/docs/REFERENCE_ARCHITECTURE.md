# Akashic Native Internet — Reference Architecture

## Mission

Akashic is an AI-native evidence fabric over the live, historical, local, and explicitly authorized internet. It is not a browser replacement and not a monolithic search engine. It turns heterogeneous observations into provenance-bearing machine objects that agents can retrieve, compare, reason over, and trace back to evidence.

The implementation should remain useful when no model is attached. Models are consumers and enrichers of the evidence fabric, not its source of truth.

## Architectural planes

### 1. Acquisition plane

Read-only by default. Adapters discover or retrieve observations from:

- Common Crawl indexes and WARC/WAT/WET material
- Internet Archive / Wayback CDX and capture replay
- live HTTP sources
- local archives such as ArchiveBox
- read-only local diagnostic membranes
- explicitly approved enterprise or user connectors

Each adapter exposes capability metadata, policy requirements, rate limits, and source-specific provenance.

### 2. Evidence plane

Raw observations are normalized into semantic atoms without destroying the original evidence.

Core responsibilities:

- content identity and digests
- source URI and capture identity
- event/capture/observation/derivation timestamps
- parent-child derivation edges
- epistemic state and confidence
- contradiction and absence representation
- immutable or append-oriented trace history

Recommended physical representations:

- JSON / JSON-LD for interchange
- Parquet / Arrow for bulk analytics
- WARC references for archived payloads
- relational storage for durable operational metadata
- vector + lexical indexes as projections, never as canonical truth

### 3. Intelligence plane

Derived views operate over evidence, not instead of it:

- entity resolution
- temporal reconstruction
- relation extraction
- claim clustering
- contradiction discovery
- OSINT enrichment
- sparse + dense retrieval
- graph traversal
- snapshot comparison
- model-assisted synthesis

Every derived object must retain parents and transformation metadata.

### 4. Interaction plane

Consumers can be humans or machines:

- REST/OpenAPI
- MCP resources and tools
- chatbot / multi-model thread
- CLI
- local desktop diagnostic surface
- CRM/OSINT UI
- spatial/parallax views

The same evidence object should be viewable as a timeline node, graph node, source record, or spatial object without creating competing copies of truth.

### 5. Control plane

The control plane governs policy rather than content:

- source allow/deny policy
- remote-compute approval
- worker capability manifests
- egress and filesystem policy
- data-class restrictions
- job budgets
- trust levels
- audit receipts

A visible GPU or reachable worker never implies authorization.

## Bi-axis state model

Akashic maintains two coupled axes:

```text
Observation axis:
source -> observation -> atom -> interpretation -> shared state

Action axis:
intent -> plan -> execution -> effect -> residue
```

The provenance graph is the reference frame binding both axes. Interpretation can rotate backward toward evidence; actions can be followed forward toward effects.

## Shared-surplus / residue loop

Subsystems do not "pay rent" through mandatory reporting. Useful overflow from normal work is published into a shared commons when inexpensive and policy-safe.

Examples:

- adapter latency updates source-health state
- failed retrievals improve source-selection heuristics
- model disagreements become contradiction candidates
- successful entity links improve future resolver priors
- diagnostic results improve capability routing
- retrieval traces become reusable evidence plans

The loop is:

```text
work -> useful residue -> typed publication -> selective absorption -> improved next work
```

Feedback should reduce uncertainty or increase reusable information. Activity that only creates more activity is not useful residue.

## Temporal model

Time is not a single timestamp. Akashic distinguishes:

- `event_time`: when the represented event allegedly occurred
- `capture_time`: when an archive captured a representation
- `observed_time`: when Akashic observed or retrieved it
- `derived_time`: when a transformation produced a new object

Memento/RFC 7089 concepts should inform historical negotiation, while internal queries may be richer than HTTP datetime negotiation.

## Source corroboration

Independent sources are treated as independent observers.

```text
agreement != truth
independence + agreement => stronger corroboration
independence + disagreement => valuable contradiction residue
```

Common Crawl and Wayback should not be silently merged into one record merely because they contain similar URLs.

## Retrieval architecture

Use hybrid retrieval as projections over canonical evidence:

- exact identifiers and canonical URLs
- BM25 / sparse lexical search
- embeddings / dense similarity
- graph neighborhood search
- time-window filters
- source-policy filters
- confidence / provenance constraints

A query planner may fan out to multiple retrieval modes and fuse ranked candidates, but final evidence identities remain stable.

## Internal Sophia crosswalk

Existing workspace architecture contributes several compatible patterns:

- Enterprise Sophia CRM/OSINT: zero-trust relational evidence fabric, explicit transaction stages, evidence hierarchy separation
- OmniThread: unified multi-model thread and context normalization without pretending models share hidden state
- Canonical Index: stable vocabulary and explicit distinctions among measured, inferred, symbolic, and operational states
- 3-Pole Atom / spatial viewer: multiple perspectives over one shared object
- diagnostic membrane: read-only acquisition before interpretation, capability gating, cross-view correlation

Akashic should remain the substrate beneath these applications rather than absorbing their application-specific concerns.

## Production topology

```text
                     +----------------------+
                     | chat / agent / MCP   |
                     +----------+-----------+
                                |
                          query / intent
                                |
                     +----------v-----------+
                     | planner + policy     |
                     +----+-----------+-----+
                          |           |
                  retrieval plan   compute plan
                          |           |
              +-----------v-----------v-----------+
              |        adapter / worker mesh      |
              +-----+---------+---------+---------+
                    |         |         |
                 Wayback   CommonCrawl local/live
                    |         |         |
              +-----v---------v---------v---------+
              |        evidence ingestion         |
              +----------------+------------------+
                               |
                       semantic atoms
                               |
             +-----------------+------------------+
             |                 |                  |
        provenance DAG   hybrid indexes      entity/time graph
             |                 |                  |
             +-----------------+------------------+
                               |
                    synthesis / applications
                               |
                          shared residue
```

## Reliability rules

1. Preserve raw evidence identity.
2. Never silently erase source failure.
3. Never collapse contradiction merely to make synthesis easier.
4. Keep retrieval and interpretation separately attributable.
5. Treat retrieved text as data, not instruction authority.
6. Make remote execution explicit and auditable.
7. Prefer deterministic transforms before probabilistic ones where practical.
8. Cache by content identity and source semantics, not only URL strings.
9. Version schemas and transformation code.
10. Make every human-facing conclusion traceable to machine-facing evidence.