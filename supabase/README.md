# Signature wall backend (Supabase)

Visitors sign a fixed message with their wallet; the API verifies it and stores one row per address.

## Setup

1. Create a Supabase project (free tier is fine).
2. SQL editor → run `supabase/migrations/0001_signatures.sql`, then `0002_signature_note.sql` and `0003_ens_checked_at.sql`.
3. Project Settings → API: copy the **Project URL** and the **service_role** key.
4. Local: copy `.env.example` to `.env.local` and fill the values. Vercel: add the same variables
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, optional `MAINNET_RPC_URL`) in Project Settings → Environment Variables.

The service-role key is server-only: it is read by `api/*` (Vercel Functions), never shipped to the browser, never prefixed with `VITE_`.

## Flow

```
browser: personal_sign(message)  ->  POST /api/sign { address, signature, issuedAt }
api/sign: verify signature (viem) -> best-effort ENS lookup -> insert (unique address) -> 201 / 200 (already signed)
browser: GET /api/signatures      ->  { total, items: latest 60 visible signers } (cached 30s at the edge)
```

- The message is built by `shared/signMessage.ts` (statement, site, lowercase address, issued-at, optional note up to 80 chars). The note is part of what is signed, so it cannot be altered afterwards. A request is valid for 10 minutes.
- **ENS:** the name is resolved when someone signs and again (a few rows per request, at most daily) when the wall is loaded, so names registered later show up on their own. The avatar is fetched in the browser from the official ENS metadata service (`metadata.ens.domains`) and falls back to the identicon. Set `MAINNET_RPC_URL` for a more reliable RPC than the public default.
- RLS: only `select` on `address, ens, signed_at` of non-hidden rows is open to the anon role. All writes go through the service role.
- **Moderation:** in the Supabase table editor set `hidden = true` on a row to remove it from the wall (or delete the row).
- **Limitation:** verification is EOA-only (MetaMask, Rabby, Coinbase Wallet, hardware wallets). Smart-contract wallets (Safe, etc.) need ERC-1271 verification through an RPC and are rejected for now.

## Client helpers

`src/lib/signatures.ts`: `fetchSignatures()`, `signAndSubmit(address, provider.request, note)`. `src/lib/wagmi.ts` + `src/lib/wallet.ts`: headless wagmi (EIP-6963 injected wallets + WalletConnect with our own QR), lazy-loaded when the wallet modal opens. The wallet list (450+ wallets with logos, search, mobile deep links) comes from the WalletConnect explorer. WalletConnect needs `VITE_WALLETCONNECT_PROJECT_ID` (free, dashboard.reown.com); without it that option is hidden. UI: `src/components/SignaturePool.tsx` (physics pool) and `WalletModal` in `src/components/Modals.tsx`.

Preview the pool without a database: open `/?demo-pool` (sample signers).

## Local dev

`pnpm dev` serves `/api/*` through a small Vite plugin (same handlers Vercel runs in production), reading `.env.local`.
