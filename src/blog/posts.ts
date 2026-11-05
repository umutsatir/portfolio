import type { ComponentType } from "react";

export type Meta = {
  title: string;
  hl: string;
  tag: string;
  essay?: boolean;
  mins: number;
  date: string;
  tldr: string;
  excerpt: string;
};

export type Post = Meta & { slug: string; Body: ComponentType<{ components?: Record<string, unknown> }> };

type Mod = { default: Post["Body"]; frontmatter: Meta };

// Every file in src/content/posts becomes a post; the filename is the slug.
const mods = import.meta.glob<Mod>("../content/posts/*.mdx", { eager: true });

export const posts: Post[] = Object.entries(mods)
  .map(([path, m]) => ({
    ...m.frontmatter,
    date: String(m.frontmatter.date).slice(0, 10),
    slug: path.split("/").pop()!.replace(/\.mdx$/, ""),
    Body: m.default,
  }))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const tags = ["Security", "ZK / Noir", "Hackathon", "Backend", "Post-mortem", "TIL"];

export const tagColor: Record<string, string> = {
  Security: "#ffc7a1",
  "ZK / Noir": "#e4d9ff",
  Hackathon: "#ffe680",
  Backend: "#b9defa",
  "Post-mortem": "#b5efcf",
  TIL: "#fffbea",
};

export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
