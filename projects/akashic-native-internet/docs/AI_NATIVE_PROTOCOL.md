# AI-Native Query and Evidence Protocol

## Design goal

Humans browse pages. Agents should be able to request evidence structures directly.

Instead of:

```text
search -> ten links -> browser tabs -> context dump
```

Akashic targets:

```text
intent -> machine query -> evidence set -> trace -> synthesis/action
```

## Query envelope

A future query request should be able to express:

```json
{
  "intent": "resolve historical ownership changes for example.org",
  "entities": ["example.org"],
  "time": {"from": "2008-01-01", "to": "2016-12-31"},
  "sources": ["wayback", "commoncrawl", "live"],
  "retrieval": ["exact", "lexical", "graph", "dense"],
  "evidence_policy": {
    "minimum_independent_sources": 2,
    "preserve_contradictions": true,
    "include_failures": true
  },
  "output": {
    "atoms": true,
    "trace": true,
    "timeline": true,
    "synthesis": true
  }
}
```

The initial API remains intentionally smaller. This document defines the direction without pretending all fields are implemented yet.

## Evidence packet

An AI-facing response should separate facts from interpretation:

```json
{
  "trace_id": "...",
  "observations": [],
  "atoms": [],
  "relations": [],
  "contradictions": [],
  "source_status": {},
  "synthesis": null,
  "uncertainty": {},
  "next_queries": []
}
```

This lets a consuming model ignore prose synthesis and reason over source-addressable evidence when desired.

## Semantic atom contract

An atom should eventually carry:

- stable ID
- kind / schema version
- normalized payload
- source identity
- source URI or archival locator
- content digest
- event, capture, observation, derivation times
- parent atoms / evidence
- transform chain
- confidence and confidence basis
- epistemic state
- contradiction links
- security / data-class labels

Indexes, embeddings, summaries, and model interpretations are projections or derived atoms. They are not allowed to overwrite source atoms.

## Epistemic states

Recommended values:

```text
observed
extracted
inferred
corroborated
contested
retracted
unknown
failed_observation
```

Confidence should not substitute for epistemic state. `0.92 inferred` is meaningfully different from `0.92 observed`.

## Absence and failure

Failures are first-class machine-readable residue:

```json
{
  "kind": "failed_observation",
  "reason": "source_timeout",
  "source": "wayback",
  "query_fragment": "...",
  "retryable": true,
  "observed_at": "..."
}
```

This prevents an agent from interpreting "the source did not respond" as "the evidence does not exist."

## Contradiction model

Contradiction is an edge, not a deletion policy.

```text
claim A ----contradicts---- claim B
   |                           |
 evidence A                 evidence B
```

A resolver may score or explain the conflict, but both sides remain traceable.

## Temporal retrieval

Historical web queries should support at least:

- closest capture before/after a datetime
- all captures in a window
- first known / last known observation
- snapshot delta
- source-to-source capture comparison
- timeline over a resolved entity

Memento concepts provide useful interoperability language: original resource, memento, TimeGate, and TimeMap.

## Multi-model use

In a shared thread such as OmniThread, models should receive the same evidence packet and identify which atoms support their outputs. This creates productive model disagreement without requiring models to share hidden state.

Recommended response metadata:

```json
{
  "model": "...",
  "used_atoms": ["sha256:..."],
  "created_atoms": ["sha256:..."],
  "confidence": 0.0,
  "unresolved": []
}
```

## Agent interface

MCP or another agent protocol should expose Akashic as resources + tools, not as an opaque chatbot.

Candidate resources:

```text
akashic://atom/{id}
akashic://trace/{id}
akashic://timeline/{entity}
akashic://capabilities
```

Candidate tools:

```text
query_history
resolve_entity
compare_snapshots
trace_claim
find_contradictions
fetch_evidence
```

## Local-computer bridge

The same protocol can carry read-only computer diagnostics:

```text
collector -> observation atoms -> correlation -> diagnosis -> evidence trace
```

A diagnostic conclusion should point back to concrete evidence such as an event record, device state, power report, SMART observation, driver version, or capability result.

Acquisition permission and mutation permission remain separate capabilities.