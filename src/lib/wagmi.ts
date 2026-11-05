import { createConfig, createStorage, http, noopStorage } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { injected, walletConnect } from "@wagmi/connectors";

/**
 * Headless wallet layer (wagmi). No wagmi UI is used: our own WalletModal renders everything.
 * Loaded lazily (dynamic import) the first time the wallet modal opens, so it never weighs on the first paint.
 */
export const WC_PROJECT_ID = import.meta.env.WALLETCONNECT_PROJECT_ID as string | undefined;

export const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  // we only need a signature, so don't restore sessions across visits
  storage: createStorage({ storage: noopStorage }),
  multiInjectedProviderDiscovery: true, // EIP-6963: every installed wallet shows up as its own connector
  connectors: [
    injected(), // fallback for wallets that only expose window.ethereum
    ...(WC_PROJECT_ID
      ? [
          walletConnect({
            projectId: WC_PROJECT_ID,
            showQrModal: false, // we draw the QR ourselves
            metadata: { name: "umutsatir.dev", description: "Umut Satır — blockchain & fullstack engineer", url: "https://umutsatir.dev", icons: [] },
          }),
        ]
      : []),
  ],
});
