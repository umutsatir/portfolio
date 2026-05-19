import { getTranslations } from "next-intl/server";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ProjectsClient from "./projects-client";
import { getAllProjectsMeta } from "@/lib/projects";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("projects");
  return { title: t("title") };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  const projects = getAllProjectsMeta(locale);

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-24 md:py-32">
          <ProjectsClient projects={projects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
