import type { StoredRow } from "./_lib/supabase.ts";
import { listSignatures, updateEns } from "./_lib/supabase.ts";
import { resolveEns } from "./_lib/ens.ts";

const STALE_MS = 24 * 3600 * 1000;
const REFRESH_PER_REQUEST = 4;

/**
 * GET /api/signatures -> { total, items: latest visible signers (address, ens, note, signed_at) }.
 * Cached briefly at the edge. ENS names that were never checked, or not for 24h, are re-resolved a few at a
 * time, so a name registered (or changed) after signing shows up without any manual step.
 */
export async function GET() {
  try {
    const { items, total } = await listSignatures();
    const stale = items.filter((r) => !r.ens_checked_at || Date.now() - Date.parse(r.ens_checked_at) > STALE_MS).slice(0, REFRESH_PER_REQUEST);
    await Promise.all(
      stale.map(async (r: StoredRow) => {
        const ens = await resolveEns(r.address as `0x${string}`);
        r.ens = ens;
        await updateEns(r.address, ens).catch(() => {});
      }),
    );
    const out = items.map(({ address, ens, note, signed_at }) => ({ address, ens, note, signed_at }));
    return Response.json({ total, items: out }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
