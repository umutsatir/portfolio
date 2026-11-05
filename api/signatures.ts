import { listSignatures } from "./_lib/supabase.ts";

/** GET /api/signatures -> { total, items: latest visible signers (address, ens, note, signed_at) }. Cached briefly at the edge. */
export async function GET() {
  try {
    const data = await listSignatures();
    return Response.json(data, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
