# World Memory Cartridge

A self-contained mirror model for a local-first memory world.

It treats memory as a nested cartridge instead of a flat folder:

- `world-memory.wmc` is the primary cartridge artifact and custom filetype.
- `state/local-world/` is the grounded local store.
- `state/cloud-shadow/` is the mirrored cloud-facing shadow.
- `state/web-cache/` is the browser-facing projection layer.
- `/cartridge/state/` is the container mount target.

## Custom filetype

The cartridge now has its own file extension:

- `.wmc` means `World Memory Cartridge`.
- The payload is still JSON, so it stays inspectable and easy for agents to parse.
- `memory-manifest.json` remains as a compatibility mirror for tools that expect `.json`.

## Folder type

The folder itself is now also a typed artifact:

- `world-folder.json` marks this directory as a runnable `world-folder`.
- `start-local.ps1` boots it with a free port instead of assuming one.
- `run-world.cmd` gives it a double-clickable local launcher.
- `state/local-world/runtime/runtime.json` records the live URL and PID after boot.
- `C:\Users\chose\Downloads\database4` is promoted as the durable world-root anchor.

## Start locally

From this folder run:

```powershell
./start-local.ps1
```

Then open `http://127.0.0.1:4033`.

You can also run:

```powershell
./run-world.cmd
```

The launcher will find a free port if `4033` is already taken.

## Start in a container

From this folder run:

```powershell
docker compose up --build
```

Then open `http://127.0.0.1:4033`.

## What you get

- `index.html` renders the cartridge as a nested geometry world.
- `world-memory.wmc` is the primary world-model artifact.
- `world-folder.json` makes the directory itself recognisable as a runnable world.
- `middleware/file-router.py` is the first real agent middleware process.
- `memory-manifest.json` mirrors the same structure for compatibility.
- `state/` is where local, cloud-shadow, and web-cache roots can diverge or reconcile.

## Next extension

The next natural step is to let `middleware/file-router.py` claim tasks from
`state/local-world/swarm/tasks.jsonl`, update `presence.json`, and append receipts so the
cartridge becomes both a visual model and a working shared memory spine.
