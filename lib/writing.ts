import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

const contentDir = path.join(process.cwd(), "content/writing");

export function getPostMeta(slug: string, locale: string): PostMeta | null {
  const filePath = path.join(contentDir, `${slug}.${locale}.mdx`);
  const fallbackPath = path.join(contentDir, `${slug}.en.mdx`);

  let fileContent: string | null = null;

  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, "utf-8");
  } else if (fs.existsSync(fallbackPath)) {
    fileContent = fs.readFileSync(fallbackPath, "utf-8");
  }

  if (!fileContent) return null;

  const { data } = matter(fileContent);
  return { ...data, slug } as PostMeta;
}

export function getAllPostsMeta(locale: string): PostMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const slugs = new Set<string>();

  files.forEach((file) => {
    const match = file.match(/^(.+)\.(en|tr)\.mdx$/);
    if (match) slugs.add(match[1]);
  });

  const posts: PostMeta[] = [];
  slugs.forEach((slug) => {
    const meta = getPostMeta(slug, locale);
    if (meta) posts.push(meta);
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const slugs = new Set<string>();

  files.forEach((file) => {
    const match = file.match(/^(.+)\.(en|tr)\.mdx$/);
    if (match) slugs.add(match[1]);
  });

  return Array.from(slugs);
}

export async function getPostContent(slug: string, locale: string) {
  const filePath = path.join(contentDir, `${slug}.${locale}.mdx`);
  const fallbackPath = path.join(contentDir, `${slug}.en.mdx`);

  let fileContent: string | null = null;

  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, "utf-8");
  } else if (fs.existsSync(fallbackPath)) {
    fileContent = fs.readFileSync(fallbackPath, "utf-8");
  }

  if (!fileContent) return null;

  const { data, content } = matter(fileContent);
  return { meta: data as PostMeta, content };
}
