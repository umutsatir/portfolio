import { useTranslations } from "next-intl";

interface NowBlockProps {
  updatedDate?: string;
}

export default function NowBlock({ updatedDate = "2026-05-19" }: NowBlockProps) {
  const t = useTranslations("now");

  const items = [
    { label: "building", value: t("building") },
    { label: "learning", value: t("learning") },
    { label: "reading", value: t("reading") },
  ];

  return (
    <section
      className="max-w-[1280px] mx-auto px-8 md:px-16 py-12 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex justify-between items-baseline mb-6">
        <span className="text-mono" style={{ color: "var(--color-text-faint)" }}>
          {t("title")}
        </span>
        <span className="text-mono" style={{ color: "var(--color-text-faint)" }}>
          {t("updated")} {updatedDate}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex gap-4">
            <span
              className="text-mono w-20 shrink-0"
              style={{ color: "var(--color-text-dim)" }}
            >
              {">"} {item.label}
            </span>
            <span
              className="text-mono"
              style={{ color: "var(--color-text)" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
