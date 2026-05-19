import { getTranslations } from "next-intl/server";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  const t = await getTranslations("writing");
  return { title: t("title") };
}

export default async function WritingPage() {
  const t = await getTranslations("writing");

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-24">
          <h1
            className="text-h2 mb-4"
            style={{ color: "var(--color-text)" }}
          >
            {t("title")}
          </h1>
          <div
            className="border-t pt-8 mt-8"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="text-body mb-2"
              style={{ color: "var(--color-text-dim)", maxWidth: "560px" }}
            >
              {t("subtitle")}
            </p>
            <p
              className="text-small"
              style={{ color: "var(--color-text-faint)" }}
            >
              {t("comingSoon")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
