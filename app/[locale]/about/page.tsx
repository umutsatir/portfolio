import { getTranslations } from "next-intl/server";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Timeline, { type TimelineEvent } from "@/components/timeline";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const t = await getTranslations("about");
  return { title: t("title") };
}

export default async function AboutPage({ params }: PageProps) {
  const t = await getTranslations("about");

  const stackGroups = [
    {
      label: t("stackCurrentlyUsing"),
      items: ["TypeScript", "React", "Next.js", "MongoDB", "MySQL", "PHP", "Solidity", "Node.js"],
    },
    {
      label: t("stackComfortableWith"),
      items: ["Python", "PostgreSQL", "Docker", "AWS", "Linux"],
    },
    {
      label: t("stackExploring"),
      items: ["Rust", "distributed systems", "zk-proofs", "Move"],
    },
  ];

  const events: TimelineEvent[] = [
    { date: "2021.09", title: t("events.bscTitle") },
    { date: "2022.03", title: t("events.ethereumTitle"), description: t("events.ethereumDesc") },
    { date: "2022.09", title: t("events.gtuTitle"), description: t("events.gtuDesc") },
    { date: "2023.11", title: t("events.istanbulTitle"), description: t("events.istanbulDesc") },
    { date: "2024.01", title: t("events.ituTitle"), description: t("events.ituDesc") },
    { date: "2024.08", title: t("events.xonTitle"), description: t("events.xonDesc") },
    { date: "2025.01", title: t("events.ituLeftTitle") },
    { date: "2025.05", title: t("events.pragueTitle"), description: t("events.pragueDesc") },
    { date: "2025.09", title: t("events.node101Title"), description: t("events.node101Desc") },
    { date: "2025.10", title: t("events.romeTitle"), description: t("events.romeDesc") },
    { date: "2026.04", title: t("events.cannesTitle"), description: t("events.cannesDesc") },
    { date: "2027.02", title: t("events.bscGradTitle") },
    { date: "2027.Q4", title: t("events.mscTitle"), description: t("events.mscDesc") },
  ];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-24">
          <h1
            className="text-h2 mb-16"
            style={{ color: "var(--color-text)" }}
          >
            {t("title")}
          </h1>

          <section className="mb-16">
            <div
              className="max-w-[680px] flex flex-col gap-5 text-body"
              style={{ color: "var(--color-text-dim)", lineHeight: 1.7 }}
            >
              <p>{t("bio1")}</p>
              <p>{t("bio2")}</p>
              <p>{t("bio3")}</p>
              <p>{t("bio4")}</p>
            </div>
          </section>

          <section
            className="border-t pt-12 mb-16"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="text-h3 mb-8"
              style={{ color: "var(--color-text)" }}
            >
              {t("timeline")}
            </h2>
            <Timeline events={events} />
          </section>

          <section
            className="border-t pt-12"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="text-h3 mb-8"
              style={{ color: "var(--color-text)" }}
            >
              {t("stack")}
            </h2>
            <div className="flex flex-col gap-6">
              {stackGroups.map((group) => (
                <div key={group.label}>
                  <span
                    className="text-mono block mb-2"
                    style={{ color: "var(--color-text-faint)" }}
                  >
                    {group.label}
                  </span>
                  <span
                    className="text-body"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    {group.items.join(" · ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
