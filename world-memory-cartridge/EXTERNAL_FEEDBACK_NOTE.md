# World Folder Feedback Note

## Purpose

We are developing a local-first `world folder` for agent memory, orchestration, and projection.
I am sharing this note to gather technical feedback, pressure-test the direction, and form a
clear implementation plan with outside input.

## What It Is

The current prototype treats a folder itself as a typed runtime artefact rather than just a
container for files.

Inside that folder are:

- a primary cartridge file (`.wmc`) that describes the world model
- a compatibility manifest for tools that expect JSON
- a browser surface that renders the model as nested geometry
- a boot layer that starts the folder locally on an available port
- file-backed swarm middleware for specialist agents, queues, presence, and receipts

The design goal is to make agent state inspectable, portable, and recoverable without hiding it
inside a black-box service.

## Why This Matters

Most agent systems still depend on fragmented runtime state, opaque databases, or vendor-specific
control planes. That makes them difficult to inspect, difficult to recover, and difficult to move
between local, web, and cloud contexts.

This prototype is exploring a different path:

- local-first by default
- file-backed instead of database-dependent
- human-readable and agent-readable
- able to mirror across local storage, web surfaces, and cloud shadows
- able to route work through specialists while keeping hand-offs visible

## Current Shape

The present prototype already includes:

- a typed `world folder`
- a `world-memory.wmc` cartridge
- a local boot script that finds a free port automatically
- a file router for swarm middleware
- specialist definitions for filesystem mapping, runtime healing, memory curation, projection, and source curation
- explicit world roots for `C:\Users\chose`, `C:\Users\chose\Downloads`, and `C:\Users\chose\Downloads\database4`
- source references for the local `awesome_stars.json` index and the `public-apis` catalogue

## What We Want Feedback On

We would especially value feedback on these questions:

1. Is the `folder as runtime artefact` model technically sound and worth pursuing?
2. What is the best minimal protocol for file-backed agent coordination and hand-off?
3. Which parts should remain local-first, and which parts should become cloud-addressable?
4. What are the biggest reliability or security risks in a file-backed swarm design?
5. What would make this useful as a real middleware layer rather than only a prototype?

## Proposed Near-Term Plan

The next practical steps look like this:

1. Stabilise the world-folder boot and runtime lifecycle.
2. Let the middleware claim and complete real queue tasks.
3. Add bounded scanning and source ingestion for selected roots and curated indices.
4. Write receipts and summaries that can be mirrored across local, web, and cloud views.
5. Define a small public-facing schema so other tools or teams can interoperate with the folder.

## What We Are Not Claiming Yet

This is not being presented as a finished platform, a full operating system, or a solved memory
architecture. It is an early but concrete prototype intended to test whether a typed, inspectable,
local-first world folder can become a useful substrate for serious agent systems.

## Invitation

If this direction seems promising, I would welcome:

- technical critique
- architectural suggestions
- failure-mode analysis
- interoperability ideas
- thoughts on where this should be narrow and disciplined before it becomes broader

The goal here is not hype. The goal is to determine whether this can become a dependable,
inspectable foundation for agent work.
