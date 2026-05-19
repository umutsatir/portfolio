import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const otherLocale = locale === "en" ? "tr" : "en";

  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-6 flex items-center justify-between gap-4">
        <span className="text-mono" style={{ color: "var(--color-text-faint)" }}>
          {t("builtWith")}{" "}
          <a
            href="https://github.com/umutsatir/umutsatir-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-text-dim)] transition-colors"
          >
            github
          </a>{" "}
          · 2026 · {t("version")}
        </span>

        <div
          className="flex items-center gap-1 text-mono text-[0.75rem]"
          style={{ color: "var(--color-text-faint)" }}
        >
          <span
            style={{
              color: locale === "en" ? "var(--color-accent)" : undefined,
            }}
          >
            EN
          </span>
          <span>|</span>
          <Link
            href={`/${otherLocale}`}
            style={{
              color: locale === "tr" ? "var(--color-accent)" : undefined,
            }}
            className="hover:text-[var(--color-text-dim)] transition-colors"
          >
            TR
          </Link>
        </div>
      </div>
    </footer>
  );
}
