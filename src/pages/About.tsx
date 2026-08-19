import { Fragment } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import StackPanel from "../components/StackPanel";
import { useDecipher } from "../hooks/useDecipher";
import { useReveal } from "../hooks/useReveal";
import { site, stackTiers, careerChain } from "../data/site";

export default function About() {
  useDecipher();
  useReveal();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0C0C",
        backgroundImage:
          "repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.04) 1px,transparent 1px,transparent 12.5vw)",
        overflowX: "hidden",
      }}
    >
      <Nav current="about" />

      <header style={{ padding: "70px 28px 56px", borderBottom: "1px solid #2A2A2A" }}>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "clamp(52px,9.5vw,140px)",
            lineHeight: 0.95,
            letterSpacing: "-.03em",
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <span data-decipher="ABOUT">ABOUT</span>
          <span style={{ color: "#D8FF3E" }}>/</span>
          <span data-decipher="ME">ME</span>
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            marginTop: 48,
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) .15s both",
          }}
        >
          <p style={{ margin: 0, fontSize: 20, fontWeight: 300, lineHeight: 1.65, color: "rgba(237,237,230,.8)" }}>
            I'm Umut — a final-year CS student at Gebze Technical University and a software engineer at node101,
            building zero-knowledge and blockchain-based products close to the infrastructure layer. I won ETHGlobal
            Istanbul with Cryptle, built a ZK voting system because elections deserve secret ballots, and co-founded
            GTU Blockchain to close the gap between research-level ideas and working code.
          </p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 300, lineHeight: 1.65, color: "rgba(237,237,230,.8)" }}>
            Before this I spent over a year at XON doing PHP backend work — database design, API architecture, and
            large-scale system design for corporate projects — which carried straight into the on-chain work I do
            now. Next chapter: an MSc in distributed systems in Italy, Politecnico di Milano first on the list, going
            deeper on consensus and fault tolerance before working at the protocol layer long-term.
          </p>
        </div>
      </header>

      <section data-reveal style={{ padding: "56px 0 64px", borderBottom: "1px solid #2A2A2A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 28px" }}>
          <p style={{ margin: "0 0 32px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: ".12em", color: "#D8FF3E" }}>
            §01 — THE CAREER CHAIN
          </p>
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".08em", color: "rgba(237,237,230,.4)" }}>
            EVERY BLOCK HASHES THE ONE BEFORE IT · SCROLL →
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto", padding: "8px 28px 20px" }}>
          {careerChain.map((b, i) => (
            <Fragment key={b.block}>
              <div
                className="dc-chain-block"
                style={{
                  flex: "0 0 280px",
                  position: "relative",
                  border: b.filled ? "1px solid #D8FF3E" : b.future ? "1px dashed #3A3A3A" : "1px solid #2A2A2A",
                  background: b.filled ? "#D8FF3E" : b.future ? undefined : "rgba(255,255,255,.02)",
                  color: b.filled ? "#0C0C0C" : undefined,
                  padding: "22px 22px 26px",
                }}
              >
                {b.winner && (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      right: -1,
                      background: "#D8FF3E",
                      color: "#0C0C0C",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      padding: "5px 10px",
                    }}
                  >
                    ★ WINNER
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    fontWeight: b.filled ? 700 : undefined,
                    letterSpacing: ".1em",
                    color: b.filled ? undefined : b.future ? "rgba(237,237,230,.4)" : "rgba(237,237,230,.5)",
                  }}
                >
                  <span>{b.block}</span>
                  <span>{b.year}</span>
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    marginTop: 10,
                    opacity: b.filled ? 0.7 : undefined,
                    color: b.filled ? undefined : b.future ? "rgba(237,237,230,.4)" : "rgba(237,237,230,.45)",
                  }}
                >
                  hash&nbsp;{b.filled ? b.hash : <span style={{ color: b.future ? undefined : "#D8FF3E" }}>{b.hash}</span>}
                  <br />
                  prev&nbsp;{b.prev}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 24,
                    letterSpacing: "-.02em",
                    marginTop: 16,
                    color: b.future ? "rgba(237,237,230,.75)" : undefined,
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: b.filled ? 400 : 300,
                    lineHeight: 1.55,
                    marginTop: 8,
                    color: b.filled ? undefined : b.future ? "rgba(237,237,230,.5)" : "rgba(237,237,230,.65)",
                  }}
                >
                  {b.desc}
                  {b.future && (
                    <>
                      {" "}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#D8FF3E" }}>
                        status: awaiting confirmation<span className="dc-blink">_</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
              {i < careerChain.length - 1 && (
                <div style={{ flex: "0 0 44px", display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      borderTop: `2px dashed ${i === careerChain.length - 2 ? "rgba(237,237,230,.25)" : "rgba(216,255,62,.5)"}`,
                    }}
                  ></div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <p style={{ margin: "12px 28px 0", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".08em", color: "rgba(237,237,230,.4)" }}>
          chain integrity: <span style={{ color: "#D8FF3E" }}>verified</span> · 6 blocks confirmed · 1 pending
        </p>
      </section>

      <section id="stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #2A2A2A" }}>
        {stackTiers.map((tier, i) => (
          <StackPanel
            key={tier.letter}
            letter={tier.letter}
            tier={tier.tier}
            items={tier.items}
            note={tier.note}
            dashed={tier.dashed}
            borderRight={i < stackTiers.length - 1}
            hot={false}
          />
        ))}
      </section>

      <section
        data-reveal
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, padding: "48px 28px", borderBottom: "1px solid #2A2A2A" }}
      >
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 2.4, color: "rgba(237,237,230,.65)" }}>
          <div>
            <span style={{ color: "#D8FF3E" }}>education</span> — BSc Computer Engineering · GTU, class of 2027
          </div>
          <div>
            <span style={{ color: "#D8FF3E" }}>applying </span> — MSc distributed systems · Italy · fall 2027
          </div>
          <div>
            <span style={{ color: "#D8FF3E" }}>languages</span> — turkish native · english fluent
          </div>
          <div>
            <span style={{ color: "#D8FF3E" }}>pgp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> — {site.pgp.replace("pgp: ", "")}
          </div>
        </div>
        <p style={{ margin: 0, alignSelf: "center", fontSize: 19, fontWeight: 300, lineHeight: 1.6, color: "rgba(237,237,230,.7)" }}>
          Based Istanbul, UTC+3, relocating to the EU in 2027 for the MSc. If you're a founder with a hard protocol
          problem or an admissions committee wondering if I'm serious — the answer is in the chain above.
        </p>
      </section>

      <footer style={{ padding: "70px 28px 40px" }}>
        <Link
          to="/contact"
          className="dc-cta"
          style={{ display: "block", fontWeight: 800, fontSize: "clamp(40px,7.5vw,110px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          SAY HELLO →
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
