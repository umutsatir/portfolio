import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import NowBlock from "@/components/now-block";
import ProjectCard from "@/components/project-card";
import Footer from "@/components/footer";
import TerminalWrapper from "@/components/terminal-wrapper";
import { getFeaturedProjects } from "@/lib/projects";
import { getLastCommit, formatRelativeTime } from "@/lib/github";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  const [lastCommit, featured, t] = await Promise.all([
    getLastCommit(),
    Promise.resolve(getFeaturedProjects(locale)),
    getTranslations("featured"),
  ]);

  const relativeTime = lastCommit ? formatRelativeTime(lastCommit.when) : null;

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 flex flex-col">
        <Hero lastCommit={lastCommit} relativeTime={relativeTime} />

        <NowBlock />

        {/* Featured projects */}
        <section
          className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 border-t w-full"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-h2" style={{ color: "var(--color-text)" }}>
              {t("title")}
            </h2>
            <Link
              href={`/${locale}/projects`}
              className="text-small transition-colors hover:text-[var(--color-text)]"
              style={{ color: "var(--color-text-dim)" }}
            >
              {t("viewAll")} →
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* Terminal */}
        <section
          className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 border-t w-full"
          style={{ borderColor: "var(--color-border)" }}
        >
          <TerminalWrapper />
        </section>
      </main>
      <Footer />
    </>
  );
}
