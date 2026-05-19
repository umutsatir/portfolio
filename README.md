# umutsatir.dev

Personal portfolio for Umut Satır — software engineer specializing in blockchain and distributed systems.

## Structure

```
app/[locale]/          Routes for each locale (en, tr)
  page.tsx             Home: node graph hero, now block, featured projects, terminal
  about/               About page with extended now, timeline, stack
  projects/            All projects list with category filter
  projects/[slug]/     Individual project detail (renders MDX)
  writing/             Writing skeleton (ready for posts)
  contact/             Contact links
app/api/og/[slug]/     Dynamic OG image generation (1200x630)

components/
  node-graph/          d3-force SVG graph (center node = Umut, edges = connections)
  terminal/            Interactive keyboard-driven terminal with command history
  hero.tsx             Split layout: text left, node graph right
  now-block.tsx        "NOW" section with current building/learning/reading
  nav.tsx              Fixed top nav with locale toggle (EN/TR)
  project-card.tsx     Two-column card (metadata | content)
  timeline.tsx         Expandable vertical timeline for about page

content/projects/      MDX files: {slug}.en.mdx and {slug}.tr.mdx
content/writing/       Empty — add {slug}.en.mdx to publish posts

lib/
  projects.ts          Reads MDX frontmatter, returns typed ProjectMeta
  github.ts            Fetches last public push event from GitHub API
locales/en|tr/         Translation strings (common.json)
```

## Run locally

```bash
pnpm install
pnpm dev
# → http://localhost:3000 (redirects / → /en automatically)
```

## Deploy

```bash
vercel
# or for production:
vercel --prod
```

## TODO before launch

- [ ] **Project MDX bodies** — all `content/projects/*.mdx` files have section headers but empty bodies
- [ ] **Email** — replace `TODO@TODO.com` in `app/[locale]/contact/page.tsx` and `components/terminal/commands.ts`
- [ ] **Telegram** — replace `@TODO` and `https://t.me/TODO`
- [ ] **Twitter** — replace `twitter.com/TODO`
- [ ] **GitHub repo URL** — update in `components/footer.tsx`
- [ ] **`public/og-default.png`** — 1200×630 fallback OG image (currently empty)
- [ ] **`public/cv.pdf`** — real CV
- [ ] **Roam-Swarm prize** — update `prize` field in frontmatter when finalized
- [ ] **Turkish MDX bodies** — fill `.tr.mdx` project content
