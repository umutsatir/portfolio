/** Injected wallet discovery (EIP-6963, with a window.ethereum fallback) and connection. */

export type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
export type WalletInfo = { id: string; name: string; icon?: string; provider: Eip1193 };

type Announce = CustomEvent<{ info: { uuid: string; name: string; icon: string }; provider: Eip1193 }>;

/** Collects the wallets installed in this browser. Resolves shortly after asking, once they've announced themselves. */
export function discoverWallets(): Promise<WalletInfo[]> {
  return new Promise((resolve) => {
    const found = new Map<string, WalletInfo>();
    const onAnnounce = (e: Event) => {
      const { info, provider } = (e as Announce).detail;
      found.set(info.uuid, { id: info.uuid, name: info.name, icon: info.icon, provider });
    };
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      const legacy = (window as unknown as { ethereum?: Eip1193 }).ethereum;
      if (!found.size && legacy) found.set("injected", { id: "injected", name: "Browser wallet", provider: legacy });
      resolve([...found.values()]);
    }, 250);
  });
}

export async function connect(w: WalletInfo): Promise<string> {
  const accounts = (await w.provider.request({ method: "eth_requestAccounts" })) as string[];
  if (!accounts?.[0]) throw new Error("no_account");
  return accounts[0];
}

/** Turn wallet / API errors into a short line for the modal. */
export function explain(e: unknown): string {
  const err = e as { code?: number; message?: string };
  if (err?.code === 4001 || /user (rejected|denied)/i.test(err?.message ?? "")) return "You closed the request in your wallet. No problem, try again when you like.";
  switch (err?.message) {
    case "signature_mismatch":
      return "That signature didn't verify. Smart-contract wallets aren't supported yet, try a regular wallet.";
    case "expired":
      return "The request took too long. Please try again.";
    case "unavailable":
      return "The signature wall is offline right now. Your signature wasn't saved.";
    default:
      return "Something went wrong. Please try again.";
  }
}
