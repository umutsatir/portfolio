import { getTranslations } from "next-intl/server";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Timeline from "@/components/timeline";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const t = await getTranslations("about");
  return { title: t("title") };
}

const stackGroups = [
  {
    label: "currently using",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Solidity",
      "ethers.js",
      "MongoDB",
      "Node.js",
    ],
  },
  {
    label: "comfortable with",
    items: ["Python", "PostgreSQL", "Docker", "AWS", "Ubuntu admin", "Linux networking"],
  },
  {
    label: "exploring",
    items: ["Rust", "distributed consensus", "zk-proofs", "Move"],
  },
];

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("about");

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

          {/* Now (extended) */}
          <section className="mb-16">
            <div
              className="max-w-[680px] flex flex-col gap-5 text-body"
              style={{ color: "var(--color-text-dim)", lineHeight: 1.7 }}
            >
              <p>
                I&apos;m a final-year computer science student at Gebze Technical
                University and a software engineer at node101, where I work on
                blockchain infrastructure and distributed systems. My current focus is
                building production-grade on-chain protocols — things that actually run
                in adversarial environments, not toy demos.
              </p>
              <p>
                I&apos;ve been building in the Ethereum ecosystem since 2022 — through
                university club work, ETHGlobal hackathons, and eventually full-time at
                node101. I&apos;m drawn to the intersection of distributed systems theory
                and practical protocol design: consensus mechanisms, p2p networking,
                economic incentive structures. These aren&apos;t just interesting
                abstractions to me — they&apos;re the foundation of systems I want to
                spend the next decade building on.
              </p>
              <p>
                I&apos;m targeting an MSc in distributed systems for the September 2027
                intake, with Politecnico di Milano as my top choice and Politecnico di
                Torino as a realistic alternative. The goal is to go deeper on the
                theory that underpins the systems I already work on — formal verification,
                fault tolerance, consensus algorithms — and come out the other side
                positioned to build or research at the protocol layer.
              </p>
            </div>
          </section>

          {/* Timeline */}
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
            <Timeline />
          </section>

          {/* Stack */}
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
