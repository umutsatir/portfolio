/** The exact text a visitor signs. Used by the browser (to ask for the signature) and the API (to verify it). */
export const SIGN_STATEMENT = "Hi Umut, I'd like to talk about something interesting.";
export const SIGN_DOMAIN = "umutsatir.dev";
/** How long a signature request stays valid. */
export const SIGN_MAX_AGE_MS = 10 * 60 * 1000;

export function buildSignMessage(address: string, issuedAt: string): string {
  return `${SIGN_STATEMENT}\n\nSite: ${SIGN_DOMAIN}\nAddress: ${address.toLowerCase()}\nIssued: ${issuedAt}`;
}
