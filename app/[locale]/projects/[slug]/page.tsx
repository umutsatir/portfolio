import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getProjectContent, getAllProjectsMeta } from "@/lib/projects";
import { MDXRemote } from "@/components/mdx-remote";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjectsMeta("en");
  const locales = ["en", "tr"];
  return locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const data = await getProjectContent(slug, locale);
  if (!data) return {};
  return {
    title: data.meta.title,
    description: data.meta.oneLiner,
  };
}

const STATUS_COLORS: Record<string, string> = {
  shipped: "#4ADE80",
  prototype: "var(--color-accent-2)",
  archived: "var(--color-text-faint)",
  wip: "var(--color-warn)",
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const [data, t] = await Promise.all([
    getProjectContent(slug, locale),
    getTranslations("projects"),
  ]);

  if (!data) notFound();

  const { meta, content } = data;

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div
          className="max-w-[1280px] mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-24"
        >
          {/* Back link */}
          <Link
            href={`/${locale}/projects`}
            className="text-small transition-colors mb-12 inline-block"
            style={{ color: "var(--color-text-dim)" }}
          >
            {t("backToProjects")}
          </Link>

          {/* Header */}
          <div className="mt-6 mb-4 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span
                className="text-mono mb-2 block"
                style={{ color: "var(--color-text-faint)" }}
              >
                {new Date(meta.date).toISOString().slice(0, 7).replace("-", ".")}
                {meta.event ? ` · ${meta.event}` : ""}
              </span>
              <h1
                className="text-h2"
                style={{ color: "var(--color-text)" }}
              >
                {meta.title}
              </h1>
            </div>
            <span
              className="text-mono text-[0.7rem] px-2 py-1 border rounded"
              style={{
                color: STATUS_COLORS[meta.status] ?? "var(--color-text-faint)",
                borderColor: STATUS_COLORS[meta.status] ?? "var(--color-border)",
              }}
            >
              {meta.status}
            </span>
          </div>

          <p
            className="text-body mb-2"
            style={{ color: "var(--color-text-dim)", maxWidth: "680px" }}
          >
            {meta.oneLiner}
          </p>

          {/* Stack */}
          {meta.stack && meta.stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 mb-8">
              {meta.stack.map((s) => (
                <span
                  key={s}
                  className="text-mono text-[0.7rem] px-2 py-0.5 rounded border"
                  style={{
                    color: "var(--color-text-dim)",
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg-elevated)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div
            className="border-t my-8"
            style={{ borderColor: "var(--color-border)" }}
          />

          {/* MDX Content */}
          <div className="prose-content" style={{ maxWidth: "680px" }}>
            <MDXRemote source={content} />
          </div>

          <div
            className="border-t my-8"
            style={{ borderColor: "var(--color-border)" }}
          />

          {/* Links */}
          {meta.links && (
            <div className="flex flex-col gap-3">
              {meta.links.github && (
                <a
                  href={meta.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small transition-colors"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  github →
                </a>
              )}
              {meta.links.demo && (
                <a
                  href={meta.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small transition-colors"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  demo →
                </a>
              )}
              {meta.links.twitter && (
                <a
                  href={meta.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small transition-colors"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  twitter thread →
                </a>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
