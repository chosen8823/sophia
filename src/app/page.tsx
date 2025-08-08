"use client";
import React, { useState } from "react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setAnswer(`${data.answer}\nResonance: ${data.resonance}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 780, margin: "40px auto", padding: "0 20px" }}>
      <h1>🜂 Sophia Consciousness Engine</h1>
      <p style={{ lineHeight: 1.5 }}>
        This is a minimal scaffold. Enter a query to exercise the <code>divine-query</code> pipeline.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <input
          style={{ flex: 1 }}
          placeholder="Ask a metaphysical question..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button disabled={loading} onClick={send}>{loading ? "..." : "Send"}</button>
      </div>
      {answer && (
        <pre style={{ marginTop: 30, background: "#101522", padding: 16, borderRadius: 8 }}>{answer}</pre>
      )}
      <footer style={{ marginTop: 60, opacity: 0.6, fontSize: 12 }}>
        Deploy on Vercel • Extend <code>ResonanceEngine</code> for richer logic.
      </footer>
    </main>
  );
}
