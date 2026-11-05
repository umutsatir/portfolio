import { createPublicClient, http, isAddress, isHex, verifyMessage } from "viem";
import { mainnet } from "viem/chains";
import { SIGN_MAX_AGE_MS, buildSignMessage } from "../shared/signMessage.ts";
import { insertSignature } from "./_lib/supabase.ts";

/**
 * POST /api/sign  { address, signature, issuedAt }
 * Verifies that `address` really signed the fixed message (EOA wallets), then stores one row per address.
 */
export async function POST(request: Request) {
  let body: { address?: unknown; signature?: unknown; issuedAt?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const { address, signature, issuedAt } = body;

  if (typeof address !== "string" || !isAddress(address)) return json({ error: "bad_address" }, 400);
  if (typeof signature !== "string" || !isHex(signature) || signature.length !== 132) return json({ error: "bad_signature" }, 400);
  if (typeof issuedAt !== "string" || Number.isNaN(Date.parse(issuedAt))) return json({ error: "bad_issued_at" }, 400);
  if (Math.abs(Date.now() - Date.parse(issuedAt)) > SIGN_MAX_AGE_MS) return json({ error: "expired" }, 400);

  const message = buildSignMessage(address, issuedAt);
  const valid = await verifyMessage({ address, message, signature }).catch(() => false);
  if (!valid) return json({ error: "signature_mismatch" }, 401);

  const lower = address.toLowerCase();
  const ens = await resolveEns(address);

  try {
    const { row, created } = await insertSignature({ address: lower, ens, message, signature });
    return json({ ok: true, created, signer: row }, created ? 201 : 200);
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

/** Best effort: a slow or failing ENS lookup must never block signing. */
async function resolveEns(address: `0x${string}`): Promise<string | null> {
  try {
    const client = createPublicClient({ chain: mainnet, transport: http(process.env.MAINNET_RPC_URL, { timeout: 2500 }) });
    return (await client.getEnsName({ address })) ?? null;
  } catch {
    return null;
  }
}
