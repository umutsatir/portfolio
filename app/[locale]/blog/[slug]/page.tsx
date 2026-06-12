import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { MDXRemote } from "@/components/mdx-remote";
import { getPostContent, getAllPostSlugs } from "@/lib/writing";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  const locales = ["en", "tr"];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getPostContent(slug, locale);
  if (!post) return {};
  return { title: post.meta.title };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getPostContent(slug, locale);

  if (!post) notFound();

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-24">
          <Link
            href={`/${locale}/blog`}
            className="text-small block mb-12 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-dim)" }}
          >
            ← {locale === "tr" ? "bloga dön" : "back to blog"}
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
            {post.meta.tags?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {post.meta.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-mono"
                    style={{ color: "var(--color-text-faint)", fontSize: "0.7rem" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
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
