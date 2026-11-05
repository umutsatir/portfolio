import { listSignatures } from "./_lib/supabase.ts";

/** GET /api/signatures -> latest visible signers (address, ens, signed_at). Cached briefly at the edge. */
export async function GET() {
  try {
    const rows = await listSignatures();
    return Response.json(rows, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
