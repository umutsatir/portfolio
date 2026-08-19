import { Link, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { useDecipher } from "../hooks/useDecipher";
import { useReveal } from "../hooks/useReveal";
import { workDetails, workItems, site } from "../data/site";

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const detail = slug ? workDetails[slug] : undefined;
  useDecipher([slug]);
  useReveal();

  if (!detail) {
    return (
      <div style={{ minHeight: "100vh", background: "#0C0C0C", color: "#EDEDE6" }}>
        <Nav current="work" />
        <main style={{ padding: "70px 28px", fontFamily: "'JetBrains Mono',monospace" }}>
          <p>Project not found.</p>
          <Link to="/#work" style={{ color: "#D8FF3E" }}>
            ← back to work
          </Link>
        </main>
      </div>
    );
  }

  const total = String(workItems.length).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0C0C",
        color: "#EDEDE6",
        backgroundImage:
          "repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.04) 1px,transparent 1px,transparent 12.5vw)",
        overflowX: "hidden",
      }}
    >
      <Nav current="work" />

      <header style={{ padding: "70px 28px 56px", borderBottom: "1px solid #2A2A2A" }}>
        <p
          style={{
            margin: "0 0 18px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            letterSpacing: ".12em",
            color: "rgba(237,237,230,.5)",
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          CASE STUDY — {detail.number}/{total}
        </p>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "clamp(64px,13vw,190px)",
            lineHeight: 0.92,
            letterSpacing: "-.03em",
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) .1s both",
          }}
        >
          <span data-decipher={detail.title}>{detail.title}</span>
          <span style={{ color: "#D8FF3E" }}>{detail.dot}</span>
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 40,
            marginTop: 40,
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) .2s both",
          }}
        >
          <p style={{ margin: 0, maxWidth: 540, fontSize: 21, fontWeight: 300, lineHeight: 1.55, color: "rgba(237,237,230,.75)" }}>
            {detail.tagline}
          </p>
          <div
            style={{
              background: "#D8FF3E",
              color: "#0C0C0C",
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".06em",
              padding: "14px 20px",
              whiteSpace: "nowrap",
            }}
          >
            {detail.badge}
          </div>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          borderBottom: "1px solid #2A2A2A",
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        {detail.facts.map((fact, i) => (
          <div
            key={fact.label}
            style={{ padding: "26px 28px", borderRight: i < detail.facts.length - 1 ? "1px solid #2A2A2A" : undefined }}
          >
            <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: ".12em", color: "rgba(237,237,230,.45)" }}>{fact.label}</p>
            <p style={{ margin: 0, fontSize: 14 }}>{fact.value}</p>
          </div>
        ))}
      </section>

      {detail.sections.map((section, i) => (
        <section
          key={section.label}
          data-reveal
          style={{
            padding: "56px 28px",
            borderBottom: i < detail.sections.length - 1 ? "1px solid #2A2A2A" : undefined,
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 40,
          }}
        >
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: ".12em", color: "#D8FF3E" }}>
            {section.label}
          </p>
          <div style={{ maxWidth: 680 }}>
            <h2 style={{ margin: "0 0 18px", fontWeight: 700, fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "-.02em" }}>
              {section.heading}
            </h2>
            {section.code && (
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13.5,
                  lineHeight: 2,
                  border: "1px solid #2A2A2A",
                  background: "rgba(255,255,255,.02)",
                  padding: "24px 28px",
                  color: "rgba(237,237,230,.8)",
                  marginBottom: 20,
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                {section.code.join("\n")}
              </div>
            )}
            <p style={{ margin: 0, fontSize: 17, fontWeight: 300, lineHeight: 1.7, color: "rgba(237,237,230,.7)" }}>{section.body}</p>
          </div>
        </section>
      ))}

      <section style={{ padding: "0 28px", borderBottom: "1px solid #2A2A2A" }}>
        <a
          href={detail.github}
          target="_blank"
          rel="noopener noreferrer"
          className="dc-channel"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "22px 4px",
            transition: "transform .2s ease",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 20 }}>View source</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "rgba(237,237,230,.5)" }}>
            {detail.github.replace("https://", "")}
          </span>
        </a>
      </section>

      <footer style={{ borderTop: "1px solid #2A2A2A", padding: "70px 28px 40px" }}>
        <Link
          to="/#work"
          className="dc-cta"
          style={{ display: "block", fontWeight: 800, fontSize: "clamp(40px,7.5vw,110px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          MORE WORK →
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 48,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            letterSpacing: ".08em",
            color: "rgba(237,237,230,.5)",
          }}
        >
          <span>©2026 — BUILT ONCE, WITH INTENT</span>
          <div style={{ display: "flex", gap: 24 }}>
            <a href={site.github.href} target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
            <a href={site.twitter.href} target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href="https://ethglobal.com" target="_blank" rel="noopener noreferrer">
              ETHGLOBAL
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
