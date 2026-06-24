import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ProjectMeta {
  slug: string;
  title: string;
  oneLiner: string;
  date: string;
  status: "shipped" | "prototype" | "archived" | "wip";
  category: "hackathon" | "saas" | "research" | "oss";
  stack: string[];
  role?: string;
  team?: number;
  event?: string;
  prize?: string;
  /** Org/club this project belongs to — matches a work node id (e.g. "gtu-blockchain"). */
  org?: string;
  links?: {
    github?: string;
    demo?: string;
    twitter?: string;
  };
  featured: boolean;
  order?: number;
}

const contentDir = path.join(process.cwd(), "content/projects");

export function getProjectMeta(slug: string, locale: string): ProjectMeta | null {
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
  return data as ProjectMeta;
}

export function getAllProjectsMeta(locale: string): ProjectMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const projects: ProjectMeta[] = [];

  const slugs = new Set<string>();
  files.forEach((file) => {
    const match = file.match(/^(.+)\.(en|tr)\.mdx$/);
    if (match) slugs.add(match[1]);
  });

  slugs.forEach((slug) => {
    const meta = getProjectMeta(slug, locale);
    if (meta) projects.push({ ...meta, slug });
  });

  return projects.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getFeaturedProjects(locale: string): ProjectMeta[] {
  return getAllProjectsMeta(locale).filter((p) => p.featured);
}

export async function getProjectContent(slug: string, locale: string) {
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
  return { meta: data as ProjectMeta, content };
}
