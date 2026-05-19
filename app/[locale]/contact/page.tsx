import { getTranslations } from "next-intl/server";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return { title: t("title") };
}

const contactLinks = [
  {
    label: "email",
    display: "TODO@TODO.com",
    href: "mailto:TODO@TODO.com",
  },
  {
    label: "github",
    display: "github.com/umutsatir",
    href: "https://github.com/umutsatir",
  },
  {
    label: "telegram",
    display: "@TODO",
    href: "https://t.me/TODO",
  },
  {
    label: "twitter",
    display: "twitter.com/TODO",
    href: "https://twitter.com/TODO",
  },
];

export default async function ContactPage() {
  const t = await getTranslations("contact");

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
              className="text-body mb-8"
              style={{ color: "var(--color-text-dim)" }}
            >
              {t("intro")}
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {contactLinks.map((link) => (
                <div key={link.label} className="flex gap-4 items-baseline">
                  <span
                    className="text-mono w-20 shrink-0"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    {link.label}
                  </span>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-mono transition-colors hover:text-[var(--color-text)]"
                    style={{ color: "var(--color-accent-2)" }}
                  >
                    {link.display} →
                  </a>
                </div>
              ))}
            </div>

            <p
              className="text-small"
              style={{ color: "var(--color-text-faint)", maxWidth: "480px" }}
            >
              {t("closing")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
