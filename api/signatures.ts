import type { StoredRow } from "./_lib/supabase.js";
import { listSignatures, updateEns } from "./_lib/supabase.js";
import { resolveEns } from "./_lib/ens.js";
import { isProfane } from "../shared/profanity.js";

const STALE_MS = 24 * 3600 * 1000; // rows that have a name
const STALE_NO_NAME_MS = 10 * 60 * 1000; // rows without one: look again soon, the owner may just have set it up
const REFRESH_PER_REQUEST = 4;

/**
 * GET /api/signatures -> { total, items: latest visible signers (address, ens, note, signed_at) }.
 * Cached briefly at the edge. ENS names that were never checked, or not for 24h (10 min if there is no name yet), are re-resolved a few at a
 * time, so a name registered (or changed) after signing shows up without any manual step.
 */
export async function GET() {
  try {
    const { items, total } = await listSignatures();
    const stale = items
      .filter((r) => !r.ens_checked_at || Date.now() - Date.parse(r.ens_checked_at) > (r.ens ? STALE_MS : STALE_NO_NAME_MS))
      .slice(0, REFRESH_PER_REQUEST);
    await Promise.all(
      stale.map(async (r: StoredRow) => {
        const ens = await resolveEns(r.address as `0x${string}`);
        r.ens = ens;
        await updateEns(r.address, ens).catch(() => {});
      }),
    );
    // a note that is not allowed (e.g. stored before a word was added to the list) is simply not shown
    const out = items.map(({ address, ens, note, signed_at }) => ({ address, ens, note: note && !isProfane(note) ? note : null, signed_at }));
    return Response.json({ total, items: out }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
