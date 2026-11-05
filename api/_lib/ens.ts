import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

/** Public RPC by default; set MAINNET_RPC_URL (Alchemy, Infura…) for something more reliable. */
const RPC = process.env.MAINNET_RPC_URL || "https://ethereum-rpc.publicnode.com";

/** Primary ENS name of an address (viem also checks the forward record). Best effort: never throws. */
export async function resolveEns(address: `0x${string}`): Promise<string | null> {
  try {
    const client = createPublicClient({ chain: mainnet, transport: http(RPC, { timeout: 3000, retryCount: 0 }) });
    return (await client.getEnsName({ address })) ?? null;
  } catch {
    return null;
  }
}
