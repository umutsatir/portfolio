import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { MDXRemote } from "@/components/mdx-remote";

interface WritingMeta {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  lang: string;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getPost(slug: string, locale: string) {
  const contentDir = path.join(process.cwd(), "content/writing");
  const filePath = path.join(contentDir, `${slug}.${locale}.mdx`);
  const fallback = path.join(contentDir, `${slug}.en.mdx`);

  let fileContent: string | null = null;
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, "utf-8");
  } else if (fs.existsSync(fallback)) {
    fileContent = fs.readFileSync(fallback, "utf-8");
  }

  if (!fileContent) return null;

  const { data, content } = matter(fileContent);
  return { meta: data as WritingMeta, content };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);

  if (!post) notFound();

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-24">
          <Link
            href={`/${locale}/writing`}
            className="text-small block mb-12 transition-colors"
            style={{ color: "var(--color-text-dim)" }}
          >
            ← back to writing
          </Link>

          <div className="mb-8">
            <span
              className="text-mono block mb-3"
              style={{ color: "var(--color-text-faint)" }}
            >
              {post.meta.date}
            </span>
            <h1
              className="text-h2 mb-3"
              style={{ color: "var(--color-text)" }}
            >
              {post.meta.title}
            </h1>
            {post.meta.summary && (
              <p
                className="text-body"
                style={{ color: "var(--color-text-dim)", maxWidth: "680px" }}
              >
                {post.meta.summary}
              </p>
            )}
          </div>

          <div
            className="border-t my-8"
            style={{ borderColor: "var(--color-border)" }}
          />

          <div style={{ maxWidth: "680px" }}>
            <MDXRemote source={post.content} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
