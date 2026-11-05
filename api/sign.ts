import { isAddress, isHex, verifyMessage } from "viem";
import { isProfane } from "../shared/profanity.ts";
import { SIGN_MAX_AGE_MS, buildSignMessage, cleanNote } from "../shared/signMessage.ts";
import { resolveEns } from "./_lib/ens.ts";
import { insertSignature } from "./_lib/supabase.ts";

/**
 * POST /api/sign  { address, signature, issuedAt, note? }
 * Verifies that `address` really signed the fixed message (EOA wallets), then stores one row per address.
 */
export async function POST(request: Request) {
  let body: { address?: unknown; signature?: unknown; issuedAt?: unknown; note?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const { address, signature, issuedAt } = body;
  if (body.note != null && typeof body.note !== "string") return json({ error: "bad_note" }, 400);
  const note = cleanNote(body.note);
  if (note && isProfane(note)) return json({ error: "note_not_allowed" }, 422);

  if (typeof address !== "string" || !isAddress(address)) return json({ error: "bad_address" }, 400);
  if (typeof signature !== "string" || !isHex(signature) || signature.length !== 132) return json({ error: "bad_signature" }, 400);
  if (typeof issuedAt !== "string" || Number.isNaN(Date.parse(issuedAt))) return json({ error: "bad_issued_at" }, 400);
  if (Math.abs(Date.now() - Date.parse(issuedAt)) > SIGN_MAX_AGE_MS) return json({ error: "expired" }, 400);

  const message = buildSignMessage(address, issuedAt, note);
  const valid = await verifyMessage({ address, message, signature }).catch(() => false);
  if (!valid) return json({ error: "signature_mismatch" }, 401);

  const lower = address.toLowerCase();
  const ens = await resolveEns(address);

  try {
    const { row, created } = await insertSignature({ address: lower, ens, note, message, signature, ens_checked_at: new Date().toISOString() });
    return json({ ok: true, created, signer: row }, created ? 201 : 200);
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}
