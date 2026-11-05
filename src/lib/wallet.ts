/**
 * Wallet connection on top of wagmi (headless). Everything here is loaded lazily via `wagmi()`.
 * Supports injected wallets (EIP-6963 discovery) and WalletConnect (QR / mobile). Smart-contract wallets
 * are not supported yet (the API verifies EOA signatures only).
 */
import type { Connector } from "@wagmi/core";

const wagmi = () => import("./wagmi");
const core = () => import("@wagmi/core");

export type WalletOption = { id: string; name: string; icon?: string; kind: "injected" | "walletconnect"; connector: Connector };
export type Connected = { address: string; sign: (message: string) => Promise<string>; disconnect: () => Promise<void>; connector: Connector };

/** Wallets available in this browser, plus WalletConnect when a project id is configured. */
export async function listWallets(): Promise<WalletOption[]> {
  const { config } = await wagmi();
  // EIP-6963 announcements arrive asynchronously right after the config is created
  await new Promise((r) => setTimeout(r, 300));
  const injected = config.connectors.filter((c) => c.type === "injected");
  const specific = injected.filter((c) => c.id !== "injected");
  const hasLegacy = typeof window !== "undefined" && !!(window as unknown as { ethereum?: unknown }).ethereum;
  const browser = (specific.length ? specific : hasLegacy ? injected : []).map<WalletOption>((c) => ({
    id: c.id,
    name: c.id === "injected" ? "Browser wallet" : c.name,
    icon: c.icon,
    kind: "injected",
    connector: c,
  }));
  const wc = config.connectors.find((c) => c.id === "walletConnect");
  return [...browser, ...(wc ? [{ id: wc.id, name: "WalletConnect", kind: "walletconnect" as const, connector: wc }] : [])];
}

/**
 * Connect a wallet. For WalletConnect, `onUri` receives the pairing URI so our own UI can show the QR code.
 */
export async function connectWallet(w: WalletOption, onUri?: (uri: string) => void): Promise<Connected> {
  const { config } = await wagmi();
  const { connect, disconnect, signMessage } = await core();

  let off: (() => void) | undefined;
  if (w.kind === "walletconnect" && onUri) {
    const handler = (m: { type: string; data?: unknown }) => {
      if (m.type === "display_uri" && typeof m.data === "string") onUri(m.data);
    };
    w.connector.emitter.on("message", handler);
    off = () => w.connector.emitter.off("message", handler);
  }
  try {
    const res = await connect(config, { connector: w.connector });
    const address = res.accounts[0];
    if (!address) throw new Error("no_account");
    return {
      address,
      connector: w.connector,
      sign: (message) => signMessage(config, { connector: w.connector, account: address, message }),
      disconnect: () => disconnect(config, { connector: w.connector }),
    };
  } finally {
    off?.();
  }
}

/** Abort a pending connection (e.g. the visitor closed the QR step). */
export async function cancelConnect(w: WalletOption) {
  const { config } = await wagmi();
  const { disconnect } = await core();
  await disconnect(config, { connector: w.connector }).catch(() => {});
}

/** Turn wallet / API errors into a short line for the modal. */
export function explain(e: unknown): string {
  const err = e as { code?: number; name?: string; message?: string };
  if (err?.code === 4001 || err?.name === "UserRejectedRequestError" || /user (rejected|denied|closed)|rejected/i.test(err?.message ?? "")) {
    return "You closed the request in your wallet. No problem, try again when you like.";
  }
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
