/** The exact text a visitor signs. Used by the browser (to ask for the signature) and the API (to verify it). */
export const SIGN_STATEMENT = "Hi Umut, I'd like to talk about something interesting.";
export const SIGN_DOMAIN = "umutsatir.dev";
/** How long a signature request stays valid. */
export const SIGN_MAX_AGE_MS = 10 * 60 * 1000;
export const NOTE_MAX = 80;

/** Single line, trimmed, capped. Empty -> null. */
export function cleanNote(n: unknown): string | null {
  if (typeof n !== "string") return null;
  const t = n.replace(/\s+/g, " ").trim().slice(0, NOTE_MAX);
  return t || null;
}

export function buildSignMessage(address: string, issuedAt: string, note?: string | null): string {
  const base = `${SIGN_STATEMENT}\n\nSite: ${SIGN_DOMAIN}\nAddress: ${address.toLowerCase()}\nIssued: ${issuedAt}`;
  return note ? `${base}\nNote: ${note}` : base;
}
