# umutsatir.dev — v3

Pixel-exact port of the Claude Design project `umutsatir.dev` (page `umut-4-pop-v3`, plus `Blog` and `Blog Post`).
Stack: Vite + React 19 + TypeScript, MDX for the blog. Deployed on Vercel.

## Two origins, one project

| Origin | What | Local dev |
| --- | --- | --- |
| `umutsatir.dev` | portfolio (`src/pages/Home.tsx`) | `http://localhost:5173/` |
| `blog.umutsatir.dev` | blog (`src/blog/*`) | `http://localhost:5173/blog` |

`src/lib/config.ts` decides which app boots (`blog.` hostname, or `/blog` in dev). The two apps are separate lazy chunks.
In Vercel, add both domains to the same project; `vercel.json` rewrites everything to `index.html`.
DNS: `blog` CNAME -> `cname.vercel-dns.com` (or just add the domain in the Vercel dashboard).

## Writing a post

Add `src/content/posts/<slug>.mdx` — the filename is the URL slug:

```mdx
---
title: "Unconstrained is not free"
hl: "not free"        # substring of title rendered in the yellow highlight
tag: "ZK / Noir"      # Security | ZK / Noir | Hackathon | Backend | Post-mortem | TIL
essay: true
mins: 9
date: 2026-10-14
tldr: "One-line summary."
excerpt: "Shown on the list page."
---

## Heading

Paragraph. Fenced blocks (```solidity / noir / sql) get the design's code card.
```

Sticky notes / cite / highlight / PNG capture on post pages is the design's `blog-tools.js`, unchanged.

## Signature wall

Wallet signatures are verified by `api/sign.ts` and stored in Supabase. Setup, env vars, moderation: see `supabase/README.md`.

## Dev

```
pnpm install
pnpm dev      # pnpm build, pnpm lint
```

## Notes

- Inline styles and `style-hover` / `style-active` come straight from the design (`src/lib/ui.ts` reproduces the design runtime's pseudo-class behaviour).
- Previous work is preserved on the `main` / `v2` (Vite) and `v1` (Next.js) branches.
