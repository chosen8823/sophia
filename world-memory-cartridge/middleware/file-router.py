from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
import uuid


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


@dataclass
class RouterPaths:
    root: Path
    middleware: Path
    swarm_root: Path
    specialists: Path
    tasks: Path
    receipts: Path
    presence: Path


def resolve_paths() -> RouterPaths:
    root = Path(__file__).resolve().parent.parent
    swarm_root = root / "state" / "local-world" / "swarm"
    return RouterPaths(
        root=root,
        middleware=root / "middleware" / "agent-middleware.json",
        swarm_root=swarm_root,
        specialists=swarm_root / "specialists.json",
        tasks=swarm_root / "tasks.jsonl",
        receipts=swarm_root / "receipts.jsonl",
        presence=swarm_root / "presence.json",
    )


def ensure_paths(paths: RouterPaths) -> None:
    paths.swarm_root.mkdir(parents=True, exist_ok=True)
    if not paths.tasks.exists():
        paths.tasks.write_text("", encoding="utf-8")
    if not paths.receipts.exists():
        paths.receipts.write_text("", encoding="utf-8")
    if not paths.presence.exists():
        paths.presence.write_text(json.dumps({"updatedAt": None, "agents": []}, indent=2) + "\n", encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        rows.append(json.loads(line))
    return rows


def append_jsonl(path: Path, payload: dict[str, Any]) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def load_specialists(paths: RouterPaths) -> dict[str, dict[str, Any]]:
    specialist_payload = read_json(paths.specialists)
    return {item["id"]: item for item in specialist_payload.get("specialists", [])}


def claim_pending_task(paths: RouterPaths, specialists: dict[str, dict[str, Any]]) -> dict[str, Any] | None:
    tasks = read_jsonl(paths.tasks)
    claimed: dict[str, Any] | None = None
    updated: list[dict[str, Any]] = []
    for task in tasks:
        if claimed is None and task.get("status") == "pending" and task.get("targetSpecialist") in specialists:
            task = {
                **task,
                "status": "claimed",
                "claimedAt": utc_now(),
            }
            claimed = task
        updated.append(task)

    if claimed is not None:
        payload = "\n".join(json.dumps(item) for item in updated) + ("\n" if updated else "")
        paths.tasks.write_text(payload, encoding="utf-8")
    return claimed


def update_presence(paths: RouterPaths, specialist_id: str, task_id: str | None) -> None:
    payload = read_json(paths.presence)
    lease_until = (datetime.now(timezone.utc) + timedelta(minutes=5)).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    agent_record = {
        "id": specialist_id,
        "state": "working" if task_id else "idle",
        "currentTaskId": task_id,
        "heartbeatAt": utc_now(),
        "leaseUntil": lease_until,
        "pid": None,
        "endpoint": "file-router",
    }
    others = [item for item in payload.get("agents", []) if item.get("id") != specialist_id]
    payload["updatedAt"] = utc_now()
    payload["agents"] = [agent_record, *others]
    write_json(paths.presence, payload)


def write_receipt(paths: RouterPaths, task: dict[str, Any], specialist: dict[str, Any]) -> dict[str, Any]:
    receipt = {
        "receiptId": f"receipt-{uuid.uuid4().hex[:12]}",
        "taskId": task["taskId"],
        "agentId": specialist["id"],
        "startedAt": task.get("claimedAt", utc_now()),
        "finishedAt": utc_now(),
        "outcome": "simulated",
        "summary": f"{specialist['label']} claimed {task['taskType']}",
        "artifacts": [],
        "writes": [],
        "handoff": specialist.get("handoffTo", []),
        "traceId": task.get("traceId"),
    }
    append_jsonl(paths.receipts, receipt)
    return receipt


def dispatch_once() -> dict[str, Any]:
    paths = resolve_paths()
    ensure_paths(paths)
    specialists = load_specialists(paths)
    task = claim_pending_task(paths, specialists)
    if task is None:
        return {
            "status": "idle",
            "checkedAt": utc_now(),
            "message": "No pending tasks were available.",
        }

    specialist = specialists[task["targetSpecialist"]]
    update_presence(paths, specialist["id"], task["taskId"])
    receipt = write_receipt(paths, task, specialist)
    update_presence(paths, specialist["id"], None)
    return {
        "status": "claimed",
        "checkedAt": utc_now(),
        "task": task,
        "receipt": receipt,
    }


if __name__ == "__main__":
    print(json.dumps(dispatch_once(), indent=2))
