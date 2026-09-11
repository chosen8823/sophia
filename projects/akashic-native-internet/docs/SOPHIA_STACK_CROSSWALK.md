# Sophia Stack Crosswalk

This document maps Akashic Native Internet onto the current Sophia workspace so the evidence layer strengthens existing systems without collapsing them into one monolith.

## Enterprise Sophia CRM/OSINT v1

The current Enterprise Sophia CRM/OSINT specification already defines a zero-trust relational evidence fabric with explicit separation among raw observations, extracted relations, provenance, action receipts, and enterprise memory.

Akashic should reuse that separation directly:

```text
Akashic observation -> CRM/OSINT observation
Akashic semantic atom -> normalized evidence object
Akashic relation -> CRM/OSINT relation edge
Akashic provenance trace -> provenance receipt / DAG
Akashic contradiction -> competing relation edge
Akashic resolver -> identity resolution primitive
```

The CRM/OSINT architecture also defines a useful primitive vocabulary: Observe, Crawl, Extract, Resolve, Relate, Compare, Verify, Remember, Retrieve, Hypothesize, Challenge, Plan, Act, and Witness. Akashic primarily owns Observe/Crawl/Retrieve/Compare/Witness and provides evidence to the higher-level primitives.

## Provenance lifecycle

The Enterprise Sophia transaction pattern can be adapted into a lighter evidence lifecycle for Akashic:

```text
intent
  -> observation
  -> plan
  -> retrieval
  -> normalization
  -> verification
  -> receipt
  -> reflection
  -> bounded evolution
```

Read-only retrieval should stay cheap; heavyweight transaction gating belongs only on state-changing operations.

## OmniThread AI

OmniThread provides the conversational surface for multiple models in one shared thread. Akashic should sit beneath it as the common evidence substrate.

Instead of each model independently browsing and producing incompatible context:

```text
shared query
  -> Akashic evidence packet
  -> GPT / Claude / Gemini / local model
  -> per-model interpretation atoms
  -> disagreement / corroboration edges
```

Models do not need shared hidden state. They need shared, source-addressable evidence.

## Sophia Canonical Index

The canonical index establishes stable vocabulary and explicit distinctions among state types. Akashic should follow the same discipline by keeping separate:

- observed state
- extracted state
- inferred state
- symbolic/semantic state
- operational state
- action state

This prevents an inference from silently acquiring the authority of a measurement.

## Diagnostic membrane and machine evidence

Recent local-system artifacts such as power configuration reports, wake evidence, device/problem inventories, firmware/event records, and runtime capability checks are a strong fit for Akashic's local adapter model.

The machine-diagnostic pipeline should be:

```text
read-only collector
  -> immutable observation atoms
  -> cross-view correlation
  -> candidate diagnosis
  -> evidence trace
```

Examples of independent evidence views include:

- `powercfg /requests`
- `powercfg /lastwake`
- wake-armed devices
- PnP/problem devices
- OS event records
- storage health
- driver/device topology
- Docker/runtime capability

A diagnosis is promoted only when it can identify the observations that support it.

## Spatial / parallax systems

The 3D atom/CAD and Deja Vortex-style architectural work suggests a useful presentation principle: one canonical object may be viewed from multiple perspectives without duplicating truth.

For Akashic, the same atom can appear in:

- graph view
- timeline view
- source/capture view
- provenance view
- spatial/parallax view
- diagnostic topology view

The view is a projection. The atom remains the shared object.

## Shared-surplus rule

Across the Sophia stack, subsystem output should be reusable without imposing a reporting tax.

Examples:

- retrieval latency improves route selection
- parser failures improve adapter policy
- model disagreements become contradiction edges
- successful entity resolution improves future priors
- diagnostic evidence improves worker capability routing
- historical capture deltas improve temporal models

This is semantic surplus sharing: useful overflow becomes communal state while provenance remains attached.

## Boundary of responsibility

Akashic should not absorb every Sophia application.

Akashic owns:

- evidence acquisition
- temporal retrieval
- semantic atoms
- provenance
- contradiction/corroboration
- historical internet access
- hybrid evidence indexes
- read-only local evidence adapters

Higher layers own:

- CRM mutation
- email/workflow actions
- conversational orchestration
- domain-specific policy
- visualization
- user-facing agent personalities
- external action execution

That boundary keeps Akashic reusable as infrastructure.