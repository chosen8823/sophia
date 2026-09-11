# Akashic Native Internet — Reference Architecture

## Mission

Akashic Native Internet is an AI-native evidence fabric over the live and historical web. It is not a replacement browser and not a conventional search engine. Its job is to convert heterogeneous internet observations into machine-consumable, traceable evidence objects that agents can query, compare, enrich, and reason over without losing the underlying source record.

The core loop is:

```text
intent
  -> retrieval plan
  -> source observations
  -> semantic atoms
  -> enrichment / correlation
  -> provenance graph
  -> answer / action
  -> residue
  -> shared state
```

The system is deliberately local-first and read-only at the acquisition boundary. Mutation and remote compute are separate capabilities that must be explicitly enabled.

## Planes

### 1. Interaction plane

Chatbots, agents, CLIs, notebooks, MCP clients, and future UI surfaces submit intents rather than low-level crawl instructions. An intent may contain:

- natural-language question
- entities, domains, URLs, hashes, or identifiers
- time ranges or historical constraints
- evidence-quality requirements
- source restrictions
- privacy / locality constraints
- desired output form

### 2. Planning plane

The query planner expands an intent into a typed retrieval plan. Planning is observable and traceable. The planner may decide to:

- query a live source
- query historical snapshots
- retrieve Common Crawl indexes or WARC records
- consult local cached material
- request OSINT enrichment
- perform lexical, vector, graph, or temporal retrieval
- stop because a capability is unavailable or disallowed

A plan is evidence-neutral: it says what will be attempted, not what the answer is.

### 3. Acquisition plane

Adapters are narrow, read-only collectors. Every adapter emits observations in a common envelope and preserves source-specific metadata.

Initial adapters:

- Internet Archive / Wayback CDX
- Common Crawl index catalog and record references
- optional live-web retrieval
- local cache / archive
- configurable external generator or search adapters

Future adapters may include ArchiveBox, RSS/Atom, code forges, public datasets, DNS, certificates, package registries, and explicitly authorized local-computer diagnostics.

### 4. Semantic atom plane

Every observation becomes one or more semantic atoms. A semantic atom is the minimum durable unit of evidence in the system. It contains:

- stable atom ID
- source identity
- source URL / record locator
- observed time and, when known, captured time
- normalized content or claim
- content digest
- media / schema type
- confidence and uncertainty
- transformation history
- links to parent evidence
- optional entity, relation, time, place, and topic annotations

Raw evidence is never replaced by the semantic interpretation. Interpretation points back to evidence.

### 5. Provenance plane

All derived objects participate in a provenance DAG. The preferred conceptual model is compatible with W3C PROV:

- Entity — evidence, atom, artifact, dataset, answer
- Activity — retrieval, parse, normalization, extraction, enrichment, ranking, synthesis
- Agent — adapter, model, user, worker, service

This gives the project a standards-aligned path for interoperable provenance while allowing Akashic-specific fields such as confidence, contradiction state, and source trust.

### 6. Correlation / OSINT plane

Atoms may be connected through enrichers that infer or retrieve:

- entity identity
- aliases
- organization / person / domain relationships
- temporal ordering
- geospatial relationships
- hashes and file lineage
- infrastructure links
- contradiction / corroboration edges

Security-oriented observables can optionally be exported into STIX 2.1-compatible objects without forcing the whole system to use a cyber-threat schema.

### 7. Retrieval plane

The system should support several retrieval modes concurrently:

- exact / lexical search
- sparse ranking
- embeddings / semantic search
- graph traversal
- temporal search
- provenance-constrained search
- contradiction search
- locality-aware search

No single index is canonical. The canonical object is the evidence atom plus provenance.

### 8. Synthesis plane

Answers are projections over evidence, not replacements for it. A synthesis response should be able to include:

- direct answer
- supporting atoms
- contradicting atoms
- confidence / uncertainty
- source timeline
- provenance trace
- unresolved questions
- machine-readable next actions

### 9. Residue / commons plane

Every operation may emit useful surplus back to the system without imposing a reporting tax on the component that produced it.

Useful residue includes:

- source health
- fetch latency
- cache value
- route quality
- parser success / failure signatures
- newly discovered aliases
- embeddings
- graph edges
- confidence updates
- contradiction edges
- worker capability observations

The design rule is: **nothing useful should be trapped, but nothing should be promoted without provenance.**

## Bi-axis / gyroscopic model

The architecture can be viewed as two coupled axes:

```text
Observation axis: evidence -> atom -> interpretation -> state
Action axis:      intent -> plan -> execution -> residue
```

The provenance frame stabilizes both axes. Any interpretation can be rotated backward toward its evidence, and any action can be traced forward toward its effects.

The same structure applies fractally at multiple scales: one fetch, one query, one agent, one computer, or a distributed deployment.

## Failure semantics

Failure is data.

A failed source request should produce typed residue rather than vanish. Examples:

- source_unavailable
- timeout
- disallowed_remote_compute
- parse_failure
- record_missing
- conflicting_evidence
- unsupported_media
- insufficient_provenance

This makes failure patterns searchable and useful for routing and system improvement.

## Deployment shape

```text
                    +----------------------+
                    | chat / agent / MCP   |
                    +----------+-----------+
                               |
                               v
                    +----------+-----------+
                    | intent + query plan  |
                    +----------+-----------+
                               |
             +-----------------+-----------------+
             |                 |                 |
             v                 v                 v
        Wayback CDX      Common Crawl      local / live
             |                 |                 |
             +-----------------+-----------------+
                               |
                               v
                    +----------+-----------+
                    | semantic atom layer  |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
       provenance DAG      search indexes    entity graph
              |                |                |
              +----------------+----------------+
                               |
                               v
                    +----------+-----------+
                    | synthesis / response |
                    +----------+-----------+
                               |
                               v
                          shared residue
```

## Architectural invariants

1. Raw evidence remains separately addressable.
2. Every derived claim can point to its parents.
3. Collection is read-only by default.
4. Remote execution is deny-by-default and allow-list gated.
5. Historical time is first-class, not a metadata afterthought.
6. Contradictions are preserved rather than flattened.
7. Uncertainty may decrease, increase, or remain unresolved.
8. Useful operational residue can be shared without forcing synchronous coupling.
9. Human-facing pages are inputs; machine-facing evidence objects are the native substrate.
10. Local-first operation is a feature, not a degraded fallback.
