# Security, Trust Boundaries, and Compute Routing

Akashic Native Internet is designed to be useful on a single local machine and to scale outward only when explicitly authorized.

## Trust model

The default posture is:

```text
read-only acquisition
local processing preferred
remote compute denied unless allow-listed
external mutation denied unless explicitly requested
raw evidence immutable / separately addressable
all derivations traceable
```

The system should never silently convert "I need more compute" into "send data to a remote service."

## Capability manifest

Each local or remote worker should publish a machine-readable capability manifest.

Suggested fields:

```json
{
  "worker_id": "local-desktop",
  "trust_level": "local",
  "compute": {
    "cpu": "x86_64",
    "gpu_vendor": "intel",
    "gpu_model": "UHD 620",
    "vram_mb": null,
    "cuda": false
  },
  "network": {
    "egress": false,
    "allow_hosts": []
  },
  "filesystem": {
    "mode": "read-only",
    "roots": []
  },
  "data_classes": ["public", "local-diagnostic"],
  "max_job_seconds": 300
}
```

The router selects workers based on both technical capability and policy.

## Compute routing rules

A route is valid only when all of these are true:

1. The worker is declared.
2. The worker is currently available.
3. The required runtime is present.
4. The data class is allowed on that worker.
5. Network and filesystem permissions satisfy the job.
6. The requested operation is within time / resource limits.
7. Remote execution has been explicitly approved when remote execution is required.

A GPU being available does not mean the GPU owns or isolates the data. Containers share whatever device capacity and permissions the host runtime exposes.

## Local GPU behavior

For machines without NVIDIA hardware or an NVIDIA container runtime, NVIDIA Compose overlays should remain optional and inactive.

The architecture should represent:

```text
GPU unavailable
```

as a normal capability result, not an error condition.

Alternative execution paths may include:

- CPU inference
- Intel-compatible runtimes where supported
- remote approved worker
- defer / plan-only response

## Diagnostic membrane model

An optional local diagnostic adapter can expose computer state into Akashic without granting arbitrary control.

Recommended acquisition categories:

- hardware inventory
- storage SMART / health state
- OS event logs
- device / driver state
- USB / PCI topology
- network configuration and diagnostics
- power / wake evidence
- Docker / container runtime state
- thermal / sensor readings when exposed safely

The collection boundary should be read-only wherever possible.

A diagnostic conclusion should be able to point back to the exact evidence that supported it.

Example:

```text
claim: storage controller instability likely
  -> event atom: controller reset
  -> event atom: filesystem stall
  -> SMART atom: media healthy
  -> topology atom: affected NVMe path
```

This is preferable to a model making a conclusion from a lossy summary.

## Data classification

At minimum:

- public — safe for configured public sources
- local — must remain on authorized local machine unless explicitly exported
- sensitive — never remote by default
- secret — excluded from acquisition unless a dedicated secret-safe workflow exists

Adapters and workers should declare which classes they accept.

## Source security

External content is untrusted input.

Never let retrieved HTML, scripts, archive payloads, or model-generated content become executable merely because they were fetched.

Treat fetched material as data. Use:

- content-type validation
- size limits
- decompression limits
- timeout budgets
- parser isolation
- safe archive extraction rules
- redirect limits
- SSRF defenses for server-side fetchers
- domain allow / deny policy where appropriate

## Prompt-injection boundary

Archived or live webpages may contain text specifically written to manipulate an agent.

Akashic should distinguish:

```text
source content
from
system instruction
```

Source content may be quoted, indexed, embedded, and analyzed, but it must never gain instruction authority from being retrieved.

## Immutable evidence and mutable views

Raw evidence and acquisition metadata should be immutable or append-only.

Mutable layers may include:

- rankings
- embeddings
- entity resolution scores
- trust scores
- graph projections
- caches

If a mutable layer changes, the underlying source trace remains stable.

## Receipts

Every external or privileged action should eventually produce a receipt containing:

- requested action
- effective capability
- worker / adapter identity
- inputs by digest
- outputs by digest
- start / finish time
- policy decision
- success / failure state

Receipts make autonomous execution auditable without forcing every subsystem to synchronously report to a central controller.
