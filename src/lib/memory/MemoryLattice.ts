import { DivineQuery } from "../../types/index.ts";

/** Simple in-memory lattice; replace with persistent or vector-backed implementation later. */
export class MemoryLattice {
  private entries: { q: string; a: string; ts: number }[] = [];

  add(query: DivineQuery, answer: string) {
    this.entries.push({ q: query.query, a: answer, ts: Date.now() });
    if (this.entries.length > 500) this.entries.shift();
  }

  /** Naive relevance: substring inclusion + recency weighting */
  retrieve(query: DivineQuery, limit = 5) {
    const q = query.query.toLowerCase();
    return this.entries
      .map(e => ({
        e,
        score:
          (e.q.toLowerCase().includes(q) ? 1 : 0) +
          0.3 * Math.exp(-(Date.now() - e.ts) / 1000 / 60 / 60)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.e);
  }
}

export const globalMemory = new MemoryLattice();
