/** Minimal Supabase REST client (PostgREST) for the serverless functions. Service-role key: server only. */

export type SignatureRow = { address: string; ens: string | null; note: string | null; signed_at: string };
export type StoredRow = SignatureRow & { ens_checked_at: string | null };

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  // New-style keys (sb_secret_...) are not JWTs: they go in `apikey` only. Legacy service_role keys are JWTs and also go in Authorization.
  const auth: Record<string, string> = key.startsWith("sb_") ? {} : { Authorization: `Bearer ${key}` };
  return { apikey: key, ...auth, "Content-Type": "application/json", ...extra };
}

export async function listSignatures(limit = 60): Promise<{ items: StoredRow[]; total: number }> {
  const { url, key } = config();
  const q = `select=address,ens,note,signed_at,ens_checked_at&hidden=eq.false&order=signed_at.desc&limit=${limit}`;
  const res = await fetch(`${url}/rest/v1/signatures?${q}`, { headers: headers(key, { Prefer: "count=exact" }) });
  if (!res.ok) throw new Error(`supabase list failed: ${res.status}`);
  const items = (await res.json()) as StoredRow[];
  const total = Number(res.headers.get("content-range")?.split("/")[1]);
  return { items, total: Number.isFinite(total) ? total : items.length };
}

export async function updateEns(address: string, ens: string | null) {
  const { url, key } = config();
  await fetch(`${url}/rest/v1/signatures?address=eq.${address}`, {
    method: "PATCH",
    headers: headers(key),
    body: JSON.stringify({ ens, ens_checked_at: new Date().toISOString() }),
  });
}

/** Insert once per address. Returns the stored row, and whether it already existed. */
export async function insertSignature(row: { address: string; ens: string | null; note: string | null; message: string; signature: string; ens_checked_at: string }) {
  const { url, key } = config();
  const res = await fetch(`${url}/rest/v1/signatures?on_conflict=address&select=address,ens,note,signed_at`, {
    method: "POST",
    headers: headers(key, { Prefer: "resolution=ignore-duplicates,return=representation" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`supabase insert failed: ${res.status}`);
  const rows = (await res.json()) as SignatureRow[];
  if (rows.length) return { row: rows[0], created: true };
  // duplicate: fetch the existing one
  const existing = await fetch(`${url}/rest/v1/signatures?address=eq.${row.address}&select=address,ens,note,signed_at`, { headers: headers(key) });
  const found = (await existing.json()) as SignatureRow[];
  return { row: found[0] ?? null, created: false };
}

/** Whether this address already has a row (hidden ones count: moderation must not let them sign again). */
export async function hasSignature(address: string): Promise<boolean> {
  const { url, key } = config();
  const res = await fetch(`${url}/rest/v1/signatures?address=eq.${address.toLowerCase()}&select=address&limit=1`, { headers: headers(key) });
  if (!res.ok) throw new Error(`supabase lookup failed: ${res.status}`);
  return ((await res.json()) as unknown[]).length > 0;
}
