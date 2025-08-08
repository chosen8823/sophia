import { resonanceEngine } from "./ResonanceEngine.ts";

describe("ResonanceEngine", () => {
  it("returns a response with resonance score", () => {
    const res = resonanceEngine.process({ query: "What is light?" });
    expect(res.answer).toContain("What is light?");
    expect(res.resonance).toBeGreaterThan(0);
    expect(res.trace.length).toBeGreaterThan(0);
  });
});
