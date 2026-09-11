# Operations, Observability, and Provenance Profile

## Principle

Akashic should be observable without becoming noisy. Operational telemetry is another evidence stream and should use the same traceable discipline as internet evidence.

## Minimum telemetry

Every request or job should have:

- trace ID
- parent trace ID when nested
- adapter / worker identity
- start and finish time
- policy decision
- source status
- bytes / records observed
- cache status
- transform versions
- error class
- output atom IDs

## Suggested event shape

```json
{
  "trace_id": "01...",
  "event": "adapter.fetch.complete",
  "component": "wayback",
  "started_at": "...",
  "finished_at": "...",
  "status": "ok",
  "policy": "local-readonly",
  "inputs": ["query:..."],
  "outputs": ["sha256:..."],
  "metrics": {"records": 8, "bytes": 14320}
}
```

## OpenTelemetry alignment

Where practical, expose traces, metrics, and logs through OpenTelemetry-compatible exporters while retaining Akashic-specific evidence semantics. OpenTelemetry is an observability transport/view; it is not the canonical provenance model.

Recommended mapping:

- OTel trace/span IDs -> execution trace
- span attributes -> operational metadata
- PROV Entity -> evidence or artifact
- PROV Activity -> retrieval / transformation / enrichment
- PROV Agent -> adapter / model / worker / user

## Receipts

State-changing actions above the read-only evidence layer should emit receipts that capture:

- requested intent
- normalized plan
- authorization / policy result
- exact mutation attempted
- observed result
- verification result
- affected object identities

This mirrors the wider Sophia transaction-lifecycle pattern without forcing every read operation through a heavyweight mutation protocol.

## Health model

A component should advertise more than `up/down`.

Suggested health fields:

```text
reachable
healthy
degraded
rate_limited
unauthorized
policy_blocked
unsupported
stale
unknown
```

Adapter health is itself time-scoped evidence and should not permanently poison future routing.

## Capability manifests

Workers and adapters should publish signed or locally trusted capability manifests.

```yaml
id: local-desktop
kind: worker
compute:
  cpu: true
  gpu:
    vendor: intel
    model: UHD 620
    runtimes: []
permissions:
  network_egress: false
  filesystem: readonly
  data_classes: [public, local-diagnostic]
limits:
  max_job_seconds: 300
trust:
  level: local
```

The router chooses only among workers that satisfy both technical requirements and policy requirements.

## Diagnostic membrane profile

For local machine inspection, collectors should prefer read-only commands and produce evidence atoms before any diagnosis is synthesized.

Candidate evidence classes:

- hardware inventory
- storage / SMART status
- device and driver inventory
- OS event records
- boot / wake evidence
- power configuration
- process / service inventory
- network interface state
- container/runtime capability
- sensor data where exposed

Multiple independent views should be correlated before a component is blamed. A single noisy event log entry is not sufficient evidence of root cause.

## Security logging

Never log secrets, authorization headers, full cookies, private keys, or raw credential material. Logs should carry references or redacted hashes where correlation is needed.

Retrieved content is untrusted input. Prompt-like text inside retrieved content never receives instruction authority over Akashic itself.

## Service-level goals

Early prototype targets should optimize for correctness and traceability before throughput. Useful initial SLOs:

- every returned atom has provenance
- every failed adapter call has typed failure residue
- every derived atom has parent references
- every remote-compute decision is policy-traceable
- every schema/transform has a version
- no source failure is silently converted to an empty evidence set

Latency and throughput objectives can then be added per deployment.