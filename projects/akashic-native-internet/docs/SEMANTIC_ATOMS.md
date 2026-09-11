# Semantic Atom Contract

Semantic atoms are the native evidence units of Akashic Native Internet. They are designed to be small enough to compose, rich enough to audit, and stable enough to survive re-indexing or model changes.

## Design goals

A semantic atom should answer five questions without external guesswork:

1. What was observed?
2. Where did it come from?
3. When was it observed or captured?
4. What transformations were applied?
5. How certain are we that the normalized representation means what we think it means?

## Minimal logical schema

```json
{
  "atom_id": "sha256:...",
  "kind": "observation|claim|artifact|relation|failure",
  "content": "normalized content or assertion",
  "source": {
    "adapter": "wayback_cdx",
    "locator": "https://...",
    "source_id": "..."
  },
  "time": {
    "observed_at": "2026-09-11T00:00:00Z",
    "captured_at": "2024-03-10T12:30:00Z"
  },
  "integrity": {
    "content_digest": "sha256:...",
    "raw_digest": "sha256:..."
  },
  "provenance": {
    "parents": [],
    "activity_id": "...",
    "agent_id": "...",
    "transforms": []
  },
  "epistemics": {
    "confidence": 0.82,
    "status": "observed|derived|inferred|contested|unknown",
    "uncertainty": []
  },
  "annotations": {
    "entities": [],
    "relations": [],
    "topics": [],
    "places": []
  }
}
```

The runtime schema may be leaner than this during the prototype phase, but the conceptual fields above define the compatibility target.

## Atom classes

### Observation atom

A directly acquired source fragment or source metadata record.

Examples:

- one Wayback CDX capture row
- one Common Crawl index result
- one HTTP response header set
- one locally observed device diagnostic event

Observation atoms should not contain conclusions that were not present in the acquisition result.

### Claim atom

A normalized proposition extracted or synthesized from evidence.

Example:

```text
Organization X acquired Organization Y in 2019.
```

A claim atom must link to supporting evidence atoms. It may also link to contradicting evidence.

### Relation atom

A typed edge between entities or evidence objects.

Examples:

- SAME_AS
- MENTIONS
- CAPTURE_OF
- DERIVED_FROM
- CORROBORATES
- CONTRADICTS
- PRECEDES
- LOCATED_IN

### Artifact atom

A durable object such as a file, WARC record, image, archive snapshot, model output, or generated report.

### Failure atom

A first-class record of an attempted operation that did not produce the expected evidence.

Examples:

- HTTP timeout
- blocked robots policy
- malformed WARC segment
- missing local capability
- disallowed remote route

Failure atoms prevent invisible gaps in a trace.

## Identity

Atom IDs should be content-addressable where practical. The recommended shape is a digest over a canonical serialization of stable fields.

Do not include volatile fields such as access latency or current confidence in the identity hash unless identity semantics explicitly require them.

This allows:

- deduplication across adapters
- cache reuse
- replay
- integrity checking
- graph convergence

## Provenance

An atom should retain enough provenance to reconstruct the path from raw observation to current representation.

Recommended minimum:

- source adapter
- source locator
- retrieval activity
- parent atom IDs
- transformations
- software / model identity when relevant
- timestamps

The conceptual mapping should remain compatible with W3C PROV Entity / Activity / Agent semantics.

## Confidence is not truth

`confidence=0.95` means the system has high confidence in a specific interpretation under a specific trace. It does not elevate a derived claim above contradictory primary evidence.

Prefer separate dimensions when needed:

```text
source_quality
extraction_confidence
entity_resolution_confidence
claim_support
recency
```

A single composite confidence score may be produced for ranking, but the underlying dimensions should remain available.

## Contradiction preservation

Do not collapse incompatible atoms into one guessed answer.

Instead:

```text
claim A --SUPPORTED_BY--> evidence 1
claim B --SUPPORTED_BY--> evidence 2
claim A --CONTRADICTS--> claim B
```

A later observation may strengthen one branch, weaken another, or reveal that both were locally valid in different time windows.

## Temporal semantics

At minimum distinguish:

- event time — when something happened
- capture time — when a source snapshot was made
- observation time — when Akashic retrieved it
- derivation time — when an atom was created

Historical-web systems become unreliable when these timestamps are conflated.

## Surplus / residue

Atoms may emit useful overflow into shared indexes without mutating the atom itself. Examples:

- new alias discovered
- better entity match
- source availability score
- embedding
- sparse terms
- contradiction edge
- route-quality update

These are derivative state layers, not silent rewrites of the original evidence.

## Interchange

Future export profiles should include:

- JSON / JSONL for agent pipelines
- JSON-LD for linked-data and PROV compatibility
- STIX 2.1 mapping for cyber / infrastructure observables
- Parquet / Arrow for batch analytics
- MCP resources / tools for agent-native access

The semantic atom is the internal lingua franca; export schemas are views over it.
