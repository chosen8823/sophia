export interface DivineQuery {
  query: string;
  context?: string;
}

export interface DivineResponse {
  answer: string;
  resonance: number; // 0..1 heuristic score
  trace: string[];
  latencyMs?: number;
}
