import { buildSignMessage, cleanNote } from "../../shared/signMessage";
import { isProfane } from "../../shared/profanity";

export type Signer = { address: string; ens: string | null; note: string | null; signed_at: string };
export type SignatureList = { total: number; items: Signer[] };

/** Latest signers for the wall + the total count. */
export async function fetchSignatures(): Promise<SignatureList> {
  const res = await fetch("/api/signatures");
  if (!res.ok) throw new Error("signatures unavailable");
  return (await res.json()) as SignatureList;
}

export type SignResult = { ok: true; created: boolean; signer: Signer | null };

/** The text the wallet will show. Same builder the API verifies against. */
export function messageFor(address: string, issuedAt: string, note?: string) {
  return buildSignMessage(address, issuedAt, cleanNote(note));
}

/**
 * Ask the wallet for the signature (`sign` = personal_sign of the connected wallet) and send it to the API.
 */
export async function signAndSubmit(address: string, sign: (message: string) => Promise<string>, noteInput = ""): Promise<SignResult> {
  const note = cleanNote(noteInput);
  if (note && isProfane(note)) throw new Error("note_not_allowed"); // checked before the wallet is asked for anything
  const issuedAt = new Date().toISOString();
  const signature = await sign(messageFor(address, issuedAt, note ?? undefined));
  const res = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature, issuedAt, note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "sign_failed");
  return data as SignResult;
}

export const noteAllowed = (n: string) => !isProfane(cleanNote(n) ?? "");

export const shortAddress = (a: string) => a.slice(0, 6) + "…" + a.slice(-4);
export const signerName = (s: Pick<Signer, "address" | "ens">) => s.ens || shortAddress(s.address);

export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}
