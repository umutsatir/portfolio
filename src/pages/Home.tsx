import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import StackPanel from "../components/StackPanel";
import { useReveal } from "../hooks/useReveal";
import { site, stackTiers, workItems } from "../data/site";

const CH = "#$%&@X0123456789ABCDEF";

function scramble(el: HTMLElement, final: string) {
  let frame = 0;
  const iv = window.setInterval(() => {
    frame++;
    const solved = Math.max(0, Math.floor((frame - 6) / 2));
    if (solved >= final.length) {
      window.clearInterval(iv);
      el.textContent = final;
      return;
    }
    el.textContent = final
      .split("")
      .map((c, i) => (c === " " ? " " : i < solved ? c : CH[Math.floor(Math.random() * CH.length)]))
      .join("");
  }, 34);
  return iv;
}

const T0 = 1755561600;
const B0 = 23641200;

function formatBlock(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function Home() {
  useReveal(90);
  const [block, setBlock] = useState(B0);
  const location = useLocation();

  useEffect(() => {
    const tick = () => setBlock(B0 + Math.floor((Date.now() / 1000 - T0) / 12));
    tick();
    const iv = window.setInterval(tick, 12000);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    const startTimer = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-decipher]").forEach((el) => {
        timers.push(scramble(el, el.getAttribute("data-decipher") ?? ""));
      });
    }, 1650);

    const words = ["BLOCKCHAIN", "FULLSTACK", "PROTOCOL"];
    let wi = 0;
    const rot = window.setInterval(() => {
      const el = document.querySelector<HTMLElement>('[data-decipher="BLOCKCHAIN"]');
      if (!el) return;
      wi = (wi + 1) % words.length;
      timers.push(scramble(el, words[wi]));
    }, 3800);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(rot);
      timers.forEach((t) => window.clearInterval(t));
    };
  }, []);

  useEffect(() => {
    if (location.hash === "#work") {
      document.getElementById("work")?.scrollIntoView();
    }
  }, [location.hash]);

  const marqueeText =
    "OPEN FOR WORK ///// ETHGLOBAL ISTANBUL WINNER ///// ZERO-KNOWLEDGE ///// DISTRIBUTED SYSTEMS ///// GTU BLOCKCHAIN ///// BUILDING SINCE 2022 ///// ";

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
      <div
        className="dc-gate"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "#D8FF3E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="dc-blink"
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
            fontSize: "clamp(20px,4vw,44px)",
            letterSpacing: ".04em",
            color: "#0C0C0C",
          }}
        >
          SYNCING BLOCK {formatBlock(block)}…
        </span>
      </div>

      <div style={{ overflow: "hidden", borderBottom: "1px solid #2A2A2A", background: "#0C0C0C" }}>
        <div
          className="dc-marquee"
          style={{
            display: "flex",
            width: "max-content",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            letterSpacing: ".12em",
            color: "#D8FF3E",
            padding: "10px 0",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{marqueeText}</span>
          <span style={{ whiteSpace: "nowrap" }}>{marqueeText}</span>
        </div>
      </div>

      <Nav current="home" />

      <header style={{ padding: "80px 28px 70px", borderBottom: "1px solid #2A2A2A" }}>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "clamp(56px,10.5vw,150px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <span data-decipher="BLOCKCHAIN">BLOCKCHAIN</span>
          <br />
          <span data-decipher="ENGINEER">ENGINEER</span>
          <span style={{ color: "#D8FF3E" }}>*</span>
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 40,
            marginTop: 48,
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) .15s both",
          }}
        >
          <p style={{ margin: 0, maxWidth: 480, fontSize: 19, fontWeight: 300, lineHeight: 1.6, color: "rgba(237,237,230,.7)" }}>
            *The kind that ships to mainnet. Building on Ethereum since 2022, four ETHGlobal hackathons, one trophy,
            zero exploits. Final-year CS — MSc in distributed systems next.
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
            STATUS: SHIPPING
          </div>
        </div>
      </header>

      <section id="work" style={{ borderBottom: "1px solid #2A2A2A" }}>
        <p
          style={{
            margin: 0,
            padding: "20px 28px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            letterSpacing: ".12em",
            color: "rgba(237,237,230,.5)",
            borderBottom: "1px solid #2A2A2A",
          }}
        >
          SELECTED WORK — 03 PROJECTS
        </p>
        {workItems.map((item, i) => (
          <Link
            key={item.number}
            to={`/work/${item.slug}`}
            data-reveal
            className="dc-work-row"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 36,
              alignItems: "center",
              padding: "36px 28px",
              borderBottom: i < workItems.length - 1 ? "1px solid #2A2A2A" : undefined,
              transition: "background .15s ease,color .15s ease",
            }}
          >
            <span
              className="wm"
              style={{
                fontWeight: 800,
                fontSize: "clamp(60px,8vw,120px)",
                lineHeight: 1,
                letterSpacing: "-.04em",
                opacity: 0.25,
                transition: "opacity .2s ease",
              }}
            >
              {item.number}
            </span>
            <span>
              <span style={{ display: "block", fontWeight: 700, fontSize: "clamp(28px,3.6vw,48px)", letterSpacing: "-.02em" }}>
                {item.title}
              </span>
              <span style={{ display: "block", marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, letterSpacing: ".04em", opacity: 0.6 }}>
                {item.subtitle}
              </span>
            </span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26 }}>↗</span>
          </Link>
        ))}
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
            hot
          />
        ))}
      </section>

      <footer style={{ padding: "80px 28px 40px" }}>
        <Link
          to="/contact"
          data-reveal
          className="dc-cta"
          style={{ display: "block", fontWeight: 800, fontSize: "clamp(44px,8.5vw,120px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          GOT A HARD
          <br />
          PROBLEM? →
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 56,
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
