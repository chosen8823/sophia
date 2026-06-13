from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "world-memory.wmc"
MIDDLEWARE_PATH = ROOT / "middleware" / "agent-middleware.json"
KNOWLEDGE_PATH = ROOT / "sources" / "knowledge-sources.json"
DISCOVERIES_PATH = ROOT / "sources" / "discovered-memory-paths.json"
RUNTIME_DIR = ROOT / "state" / "local-world" / "runtime"
RECEIPTS_DIR = ROOT / "state" / "local-world" / "receipts"
FRAGMENTS_DIR = ROOT / "fragments"
FRAGMENT_INDEX_PATH = RUNTIME_DIR / "fragment-index.json"
CANDIDATES_PATH = RUNTIME_DIR / "candidates.json"
ACTIVE_PATH = RUNTIME_DIR / "active-surface.json"
HEALTH_PATH = RUNTIME_DIR / "health.json"
RENDER_RECEIPTS_PATH = RECEIPTS_DIR / "render.jsonl"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def append_jsonl(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def slug(value: str) -> str:
    lowered = value.lower()
    parts: list[str] = []
    current = []
    for character in lowered:
        if character.isalnum():
            current.append(character)
        elif current:
            parts.append("".join(current))
            current = []
    if current:
        parts.append("".join(current))
    return "-".join(parts) or "item"


def summarize_awesome_stars(path_value: str) -> list[dict[str, Any]]:
    candidate = Path(path_value)
    if not candidate.is_absolute():
        candidate = ROOT / path_value
    if not candidate.exists():
        return []

    try:
        payload = json.loads(candidate.read_text(encoding="utf-8"))
    except Exception:
        return []

    if not isinstance(payload, dict):
        return []

    fragments: list[dict[str, Any]] = []
    topic_names = [name for name in payload.keys() if name.lower() != "contents"][:8]
    for topic_name in topic_names:
        value = payload.get(topic_name)
        if isinstance(value, list):
            entry_count = len(value)
        elif isinstance(value, dict):
            entry_count = len(value.keys())
        else:
            entry_count = 1

        fragments.append(
            {
                "id": f"topic-{slug(topic_name)}",
                "kind": "topic",
                "label": topic_name,
                "trust": "local",
                "weight": 0.72,
                "summary": f"Curated stars topic with {entry_count} indexed entries.",
                "location": str(candidate),
                "tags": ["index", "topic", "stars", "private-index"],
            }
        )
    return fragments


def build_fragments(
    manifest: dict[str, Any],
    middleware: dict[str, Any],
    knowledge: dict[str, Any],
    discoveries: dict[str, Any],
) -> list[dict[str, Any]]:
    fragments: list[dict[str, Any]] = []

    for root in manifest.get("worldRoots", []):
        fragments.append(
            {
                "id": root["id"],
                "kind": "root",
                "label": root["label"],
                "trust": root.get("trust", "mixed"),
                "weight": 0.9 if root["id"] == "database4-durable" else 0.72,
                "summary": root["role"],
                "location": root["path"],
                "tags": ["root", "local-first", slug(root["kind"])],
            }
        )

    for specialist in middleware.get("specialists", []):
        fragments.append(
            {
                "id": specialist["id"],
                "kind": "specialist",
                "label": specialist["label"],
                "trust": "local",
                "weight": 0.76,
                "summary": ", ".join(specialist.get("handles", [])),
                "location": "./middleware/agent-middleware.json",
                "tags": ["specialist", "swarm", *[slug(item) for item in specialist.get("handles", [])]],
            }
        )

    for source in knowledge.get("sources", []):
        fragments.append(
            {
                "id": source["id"],
                "kind": "source",
                "label": source["label"],
                "trust": source.get("trust", "mixed"),
                "weight": 0.78 if source.get("trust") == "local" else 0.58,
                "summary": source["role"],
                "location": source.get("path", source.get("url", "unknown")),
                "tags": ["source", slug(source["kind"]), "index" if "index" in source["kind"] else "catalog"],
            }
        )

    for discovery in discoveries.get("discoveries", []):
        fragments.append(
            {
                "id": discovery["id"],
                "kind": discovery["kind"],
                "label": discovery["role"],
                "trust": discovery.get("trust", "mixed"),
                "weight": 0.82 if discovery.get("trust") == "local" else 0.62,
                "summary": discovery.get("path", discovery.get("role", "discovery")),
                "location": discovery.get("path", "unknown"),
                "tags": ["discovery", slug(discovery["kind"]), "memory" if "memory" in discovery["kind"] else "runtime"],
            }
        )

    for source in knowledge.get("sources", []):
        if source["id"] == "awesome-stars-index":
            fragments.extend(summarize_awesome_stars(source["path"]))

    return fragments


def select_fragments(fragments: list[dict[str, Any]], focus_tags: list[str], limit: int = 8) -> list[dict[str, Any]]:
    scored = []
    for fragment in fragments:
        focus_hits = len(set(focus_tags) & set(fragment.get("tags", [])))
        score = fragment["weight"] + (focus_hits * 0.14)
        scored.append((score, fragment))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [fragment for _, fragment in scored[:limit]]


def score_candidate(selected: list[dict[str, Any]]) -> dict[str, float]:
    local_count = sum(1 for fragment in selected if fragment.get("trust") == "local")
    kind_diversity = len({fragment["kind"] for fragment in selected})
    substrate_count = sum(1 for fragment in selected if "index" in fragment.get("tags", []) or "catalog" in fragment.get("tags", []))
    swarm_count = sum(1 for fragment in selected if "specialist" in fragment.get("tags", []))
    runtime_count = sum(1 for fragment in selected if "runtime" in fragment.get("tags", []) or "memory" in fragment.get("tags", []))

    metrics = {
        "locality": round(local_count / max(len(selected), 1), 3),
        "diversity": round(kind_diversity / 6, 3),
        "substrateCoverage": round(substrate_count / max(len(selected), 1), 3),
        "swarmCoverage": round(swarm_count / max(len(selected), 1), 3),
        "runtimeAwareness": round(runtime_count / max(len(selected), 1), 3),
    }
    metrics["total"] = round(
        (metrics["locality"] * 0.3)
        + (metrics["diversity"] * 0.15)
        + (metrics["substrateCoverage"] * 0.25)
        + (metrics["swarmCoverage"] * 0.15)
        + (metrics["runtimeAwareness"] * 0.15),
        3,
    )
    return metrics


def build_candidates(fragments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    strategies = [
        {
            "id": "index-atlas",
            "title": "Index Atlas",
            "thesis": "Treat public and private indexes as programmable matter, then assemble a page from typed fragments instead of hand-authored static sections.",
            "focus": ["index", "topic", "catalog", "private-index", "memory"],
            "actions": [
                "Query private indices first, then widen into public sources.",
                "Promote high-signal fragments into the local substrate.",
                "Keep generated structure inspectable and reversible.",
            ],
        },
        {
            "id": "tool-forge",
            "title": "Tool Forge",
            "thesis": "Use specialists, MCP endpoints, and local runtime surfaces as the shaping tools that turn indexed matter into live interfaces.",
            "focus": ["specialist", "runtime", "swarm", "memory", "source"],
            "actions": [
                "Route composition through specialists instead of one giant prompt.",
                "Keep tool discovery visible through runtime receipts.",
                "Use browser-native compute only where it changes the surface.",
            ],
        },
        {
            "id": "ritual-console",
            "title": "Ritual Console",
            "thesis": "Compile each page as a repeatable ritual: query, compose, evaluate, promote. The page improves because the loop is explicit, not mystical.",
            "focus": ["root", "specialist", "memory", "runtime", "index"],
            "actions": [
                "Start at the cartridge center, walk the mirrors, return with a receipt.",
                "Compare candidate surfaces before promoting one to active.",
                "Write the result back as durable local memory.",
            ],
        },
    ]

    candidates: list[dict[str, Any]] = []
    for strategy in strategies:
        selected = select_fragments(fragments, strategy["focus"])
        metrics = score_candidate(selected)
        candidates.append(
            {
                "id": strategy["id"],
                "title": strategy["title"],
                "thesis": strategy["thesis"],
                "focusTags": strategy["focus"],
                "actions": strategy["actions"],
                "metrics": metrics,
                "fragments": selected,
                "sections": [
                    {
                        "id": "thesis",
                        "heading": "Working Thesis",
                        "body": strategy["thesis"],
                    },
                    {
                        "id": "matter",
                        "heading": "Programmable Matter In Focus",
                        "body": "These fragments are the current high-signal particles the surface would assemble from.",
                    },
                    {
                        "id": "operations",
                        "heading": "Operational Posture",
                        "body": "This candidate is scored on locality, diversity, substrate coverage, swarm coverage, and runtime awareness.",
                    },
                ],
            }
        )
    return candidates


def promote_candidate(candidates: list[dict[str, Any]], previous_active: dict[str, Any] | None) -> dict[str, Any]:
    ordered = sorted(candidates, key=lambda item: item["metrics"]["total"], reverse=True)
    winner = ordered[0]
    promotion = "initial"
    if previous_active:
        previous_score = previous_active.get("score", 0)
        promotion = "retained" if previous_score >= winner["metrics"]["total"] else "promoted"
        if previous_score >= winner["metrics"]["total"]:
            winner = {
                **winner,
                "id": previous_active.get("strategyId", winner["id"]),
                "title": previous_active.get("title", winner["title"]),
                "thesis": previous_active.get("thesis", winner["thesis"]),
            }

    return {
        "kind": "programmable-web-surface",
        "version": "0.1.0",
        "builtAt": utc_now(),
        "strategyId": winner["id"],
        "title": winner["title"],
        "thesis": winner["thesis"],
        "score": winner["metrics"]["total"],
        "promotion": promotion,
        "sections": winner["sections"],
        "fragmentCards": winner["fragments"],
        "actions": winner["actions"],
        "metrics": winner["metrics"],
    }


def build_health(
    fragments: list[dict[str, Any]],
    candidates: list[dict[str, Any]],
    active: dict[str, Any],
) -> dict[str, Any]:
    return {
        "kind": "world-runtime-health",
        "updatedAt": utc_now(),
        "status": "ready",
        "activeStrategy": active["strategyId"],
        "fragmentCount": len(fragments),
        "candidateCount": len(candidates),
        "highestScore": max(candidate["metrics"]["total"] for candidate in candidates),
        "notes": [
            "The browser surface is being compiled from typed fragments, not hard-coded prose alone.",
            "This loop is still heuristic and file-backed; there is no transactional substrate yet.",
            "Promotion is deterministic and inspectable through runtime files and receipts.",
        ],
    }


def main() -> None:
    manifest = load_json(MANIFEST_PATH)
    middleware = load_json(MIDDLEWARE_PATH)
    knowledge = load_json(KNOWLEDGE_PATH)
    discoveries = load_json(DISCOVERIES_PATH)

    previous_active = load_json(ACTIVE_PATH) if ACTIVE_PATH.exists() else None

    fragments = build_fragments(manifest, middleware, knowledge, discoveries)
    candidates = build_candidates(fragments)
    active = promote_candidate(candidates, previous_active)
    health = build_health(fragments, candidates, active)

    fragment_index = {
        "kind": "fragment-index",
        "version": "0.1.0",
        "generatedAt": utc_now(),
        "count": len(fragments),
        "fragments": fragments,
    }

    write_json(FRAGMENT_INDEX_PATH, fragment_index)
    write_json(CANDIDATES_PATH, {"kind": "surface-candidates", "generatedAt": utc_now(), "candidates": candidates})
    write_json(ACTIVE_PATH, active)
    write_json(HEALTH_PATH, health)

    append_jsonl(
        RENDER_RECEIPTS_PATH,
        {
            "kind": "render-cycle",
            "timestamp": utc_now(),
            "activeStrategy": active["strategyId"],
            "score": active["score"],
            "fragmentCount": len(fragments),
            "candidateCount": len(candidates),
            "promotion": active["promotion"],
        },
    )

    print(
        json.dumps(
            {
                "status": "ok",
                "activeStrategy": active["strategyId"],
                "score": active["score"],
                "fragmentCount": len(fragments),
                "candidateCount": len(candidates),
                "runtimeFiles": [
                    str(FRAGMENT_INDEX_PATH),
                    str(CANDIDATES_PATH),
                    str(ACTIVE_PATH),
                    str(HEALTH_PATH),
                ],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
