/** Minimal Supabase REST client (PostgREST) for the serverless functions. Service-role key: server only. */

export type SignatureRow = { address: string; ens: string | null; signed_at: string };

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extra };
}

export async function listSignatures(limit = 200): Promise<SignatureRow[]> {
  const { url, key } = config();
  const q = `select=address,ens,signed_at&hidden=eq.false&order=signed_at.desc&limit=${limit}`;
  const res = await fetch(`${url}/rest/v1/signatures?${q}`, { headers: headers(key) });
  if (!res.ok) throw new Error(`supabase list failed: ${res.status}`);
  return (await res.json()) as SignatureRow[];
}

/** Insert once per address. Returns the stored row, and whether it already existed. */
export async function insertSignature(row: { address: string; ens: string | null; message: string; signature: string }) {
  const { url, key } = config();
  const res = await fetch(`${url}/rest/v1/signatures?on_conflict=address&select=address,ens,signed_at`, {
    method: "POST",
    headers: headers(key, { Prefer: "resolution=ignore-duplicates,return=representation" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`supabase insert failed: ${res.status}`);
  const rows = (await res.json()) as SignatureRow[];
  if (rows.length) return { row: rows[0], created: true };
  // duplicate: fetch the existing one
  const existing = await fetch(`${url}/rest/v1/signatures?address=eq.${row.address}&select=address,ens,signed_at`, { headers: headers(key) });
  const found = (await existing.json()) as SignatureRow[];
  return { row: found[0] ?? null, created: false };
}
