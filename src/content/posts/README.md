# Writing blog posts

Every `*.mdx` file in this folder is a post. **The filename is the URL**:
`idempotency-keys-boring-and-perfect.mdx` → `blog.umutsatir.dev/idempotency-keys-boring-and-perfect`.
Use lowercase words separated by `-`. Renaming a file changes (and breaks) its link.

Posts are sorted by `date`, newest first, and grouped by month on the list page.
No registration needed: drop a file in, run `pnpm dev`, open `http://localhost:5173/blog`.

## Template

```mdx
---
title: "Unconstrained is not free"
hl: "not free"
tag: "ZK / Noir"
essay: true
mins: 9
date: 2026-10-14
tldr: "If you didn’t constrain it, the prover can lie."
excerpt: "Shown on the list page under the title."
---

## First heading

A paragraph.
```

## Frontmatter

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Page title and list title. |
| `hl` | no | The part of the title drawn with the **yellow highlighted box** (see below). |
| `tag` | yes | One of `Security`, `ZK / Noir`, `Hackathon`, `Backend`, `Post-mortem`, `TIL`. Sets the chip colour and the filter. |
| `essay` | no | `true` adds the black `ESSAY` badge. Use it for long write-ups; leave it out for short notes. |
| `mins` | yes | Number shown as "N min read". Written by hand. |
| `date` | yes | `YYYY-MM-DD`. Decides ordering and the day number on the timeline. |
| `tldr` | yes | The yellow TL;DR box at the top of the post. |
| `excerpt` | yes | One or two sentences on the list page. |

Quote any value containing `:` or `"`. Use the curly apostrophe `’` for a nicer look, but keep it identical in `title` and `hl`.

### The yellow highlight in the title

`hl` must be an **exact substring of `title`**, same spelling, case and apostrophes. That text gets the yellow box.

```yaml
title: "Reentrancy moved, it didn’t die"
hl: "didn’t die"            # -> Reentrancy moved, [didn’t die]
```

- Pick the 1–3 words that carry the point of the title.
- Omit `hl` (or let it not match) and the title renders plain, with no box.
- The highlight is always one box. For several highlights you would need to change `BlogPost.tsx`.

### Adding a new tag

Tags are defined in `src/blog/posts.ts` (`tags` and `tagColor`). Add the name to `tags` and a colour to `tagColor`, then use it in frontmatter. Colours that fit the design: `#ffe680` yellow, `#b5efcf` mint, `#b9defa` blue, `#ffc7a1` peach, `#e4d9ff` lilac, `#fffbea` cream.

## Body

Plain Markdown. What each piece looks like:

| You write | You get |
| --- | --- |
| `## Heading` | Big Syne section heading. Use `##` only; the page title is the `h1`. |
| a paragraph | Body text. |
| `` `code` `` | Inline code chip. |
| `**bold**`, `*italic*` | Normal bold / italic. |
| `[text](https://…)` | Link with a yellow hover. |
| `- item` / `1. item` | Lists. |
| fenced code block | Dark code card with a yellow language badge. |

### Code blocks

````md
```solidity
function withdraw(uint amt) external {
    balances[msg.sender] -= amt;
}
```
````

Syntax colours exist for `solidity`, `noir` and `sql`. Any other language name (for example `ts`) still renders the card with its badge, just without colours. To add a language, extend `KW` and `TY` in `src/blog/highlight.ts`.

### Not supported yet

- Images: there is no styled `img`. Add an `img` entry to `components` in `src/blog/BlogPost.tsx` first.
- Block quotes and tables fall back to browser defaults.
- Drafts: there is no `draft` flag. Keep unfinished posts on a branch.

### Custom components

It is MDX, so you can import a React component at the top of a post and use it in the text. Keep them in `src/blog/components/` and style them like the rest of the site (3px `#111` borders, hard offset shadow).

## What readers get for free

Post pages load `blog-tools.js` automatically: readers can select text to **highlight** or **cite** it, drop **sticky notes**, and **capture the page as a PNG**. Everything is stored in their browser only. It works on any post without extra markup, but it relies on the `article` element, so do not remove it from `BlogPost.tsx`.

## Load animation

Elements fade and rise in one after another. Posts use the `rise-kids` class on `<article>`, so every top-level block (meta row, title, TL;DR, each paragraph or code card) is staggered automatically. Nothing to do per post. Users with "reduce motion" enabled see no animation. The keyframes are at the end of `src/styles.css`.
