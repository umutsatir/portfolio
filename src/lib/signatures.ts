import { buildSignMessage } from "../../shared/signMessage";

export type Signer = { address: string; ens: string | null; signed_at: string };

/** Latest signers for the wall. */
export async function fetchSignatures(): Promise<Signer[]> {
  const res = await fetch("/api/signatures");
  if (!res.ok) throw new Error("signatures unavailable");
  return (await res.json()) as Signer[];
}

export type SignResult = { ok: true; created: boolean; signer: Signer | null };

/**
 * Ask the wallet for the signature and send it to the API.
 * `request` is the EIP-1193 `provider.request` of the connected wallet.
 */
export async function signAndSubmit(
  address: string,
  request: (args: { method: string; params: unknown[] }) => Promise<unknown>,
): Promise<SignResult> {
  const issuedAt = new Date().toISOString();
  const message = buildSignMessage(address, issuedAt);
  const signature = (await request({ method: "personal_sign", params: [message, address] })) as string;
  const res = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature, issuedAt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "sign_failed");
  return data as SignResult;
}

export const shortAddress = (a: string) => a.slice(0, 6) + "…" + a.slice(-4);
