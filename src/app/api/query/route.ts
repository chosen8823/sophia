import { NextRequest } from "next/server";
import { resonanceEngine } from "../../../lib/core/ResonanceEngine.ts";
import { DivineQuery } from "../../../types/index.ts";

export const runtime = "edge"; // fast startup on Vercel

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<DivineQuery>;
    if (!body.query || typeof body.query !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'query' string" }), { status: 400 });
    }
    const result = resonanceEngine.process({ query: body.query, context: body.context });
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Internal error" }), { status: 500 });
  }
}
