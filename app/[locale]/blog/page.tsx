import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getAllPostsMeta } from "@/lib/writing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  const t = await getTranslations("blog");
  return { title: t("title") };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("blog");
  const posts = getAllPostsMeta(locale);

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-24">
          <h1 className="text-h2 mb-4" style={{ color: "var(--color-text)" }}>
            {t("title")}
          </h1>

          <div
            className="border-t pt-8 mt-8"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="text-body mb-10"
              style={{ color: "var(--color-text-dim)", maxWidth: "560px" }}
            >
              {t("subtitle")}
            </p>

            {posts.length === 0 ? (
              <p
                className="text-small"
                style={{ color: "var(--color-text-faint)" }}
              >
                {t("comingSoon")}
              </p>
            ) : (
              <div className="flex flex-col">
                {posts.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 py-5 transition-opacity hover:opacity-70"
                    style={{
                      borderTop: i === 0 ? undefined : "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      className="text-mono shrink-0 w-28"
                      style={{ color: "var(--color-text-faint)" }}
                    >
                      {post.date}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-body"
                        style={{ color: "var(--color-text)" }}
                      >
                        {post.title}
                      </span>
                      {post.summary && (
                        <span
                          className="text-small"
                          style={{ color: "var(--color-text-dim)" }}
                        >
                          {post.summary}
                        </span>
                      )}
                      {post.tags?.length > 0 && (
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-mono"
                              style={{
                                color: "var(--color-text-faint)",
                                fontSize: "0.7rem",
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
