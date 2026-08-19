import { useRef, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useDecipher } from "../hooks/useDecipher";
import { site } from "../data/site";

type Phase = "request" | "signing" | "confirmed";
type LogLine = { text: string; color: string };

const Y = "#D8FF3E";
const DIM = "rgba(237,237,230,.45)";

function rhex(n: number) {
  let s = "";
  while (s.length < n) s += Math.random().toString(16).slice(2);
  return s.slice(0, n);
}

export default function Contact() {
  useDecipher();

  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("request");
  const [txHash, setTxHash] = useState("");

  const timers = useRef<number[]>([]);

  const push = (text: string, color: string = "rgba(237,237,230,.7)") => {
    setLogs((prev) => [...prev, { text, color }]);
  };

  const body = msg + (from ? "\n\n— " + from : "");
  const mailtoHref =
    "mailto:" +
    site.email +
    "?subject=" +
    encodeURIComponent(subject || "hello from the internet") +
    "&body=" +
    encodeURIComponent(body);

  const sign = () => {
    if (busy) return;
    setBusy(true);
    setDone(false);
    setLogs([]);
    setPhase("signing");

    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const steps: [number, () => void][] = [
      [200, () => push("> hashing payload — keccak256")],
      [700, () => push("  0x" + rhex(64), DIM)],
      [1250, () => push("> eth_signTypedData_v4 — requesting signature…")],
      [2100, () => push("  sig 0x" + rhex(40) + "… v=27", DIM)],
      [2500, () => push("  signature valid ✓", Y)],
      [2900, () => push("> broadcasting to mempool…")],
      [3500, () => push("  confirmation 1/3", DIM)],
      [4000, () => push("  confirmation 2/3", DIM)],
      [4500, () => push("  confirmation 3/3", DIM)],
      [
        4900,
        () => {
          setPhase("confirmed");
          setTxHash("0x" + rhex(64));
        },
      ],
      [
        7200,
        () => {
          setBusy(false);
          setDone(true);
          setModalOpen(false);
          setPhase("request");
          window.location.href = mailtoHref;
        },
      ],
    ];
    steps.forEach(([t, fn]) => {
      timers.current.push(window.setTimeout(fn, t));
    });
  };

  const byteCount = new Blob([msg]).size + " / ∞";
  const btnLabel = busy ? "SIGNING…" : "SIGN & BROADCAST →";
  const fromDisplay = from || "anonymous";
  const subjectDisplay = subject || "hello from the internet";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0C0C",
        backgroundImage:
          "repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.04) 1px,transparent 1px,transparent 12.5vw)",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Nav />

      <header style={{ padding: "70px 28px 48px", borderBottom: "1px solid #2A2A2A" }}>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "clamp(56px,11vw,160px)",
            lineHeight: 0.95,
            letterSpacing: "-.03em",
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <span data-decipher="BROADCAST">BROADCAST</span>
          <br />
          <span data-decipher="A MESSAGE">A MESSAGE</span>
          <span style={{ color: "#D8FF3E" }}>_</span>
        </h1>
        <p
          style={{
            margin: "32px 0 0",
            maxWidth: 520,
            fontSize: 19,
            fontWeight: 300,
            lineHeight: 1.6,
            color: "rgba(237,237,230,.7)",
            animation: "fadeUp .7s cubic-bezier(.16,1,.3,1) .15s both",
          }}
        >
          No forms disappearing into a CRM. This composes a message, you sign it with your mail
          client, I answer within 24 hours. Gas: free, forever.
        </p>
      </header>

      <section
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          borderBottom: "1px solid #2A2A2A",
        }}
      >
        <div style={{ padding: "48px 28px", borderRight: "1px solid #2A2A2A" }}>
          <p
            style={{
              margin: "0 0 24px",
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              letterSpacing: ".12em",
              color: "#D8FF3E",
            }}
          >
            §00 — COMPOSE TRANSACTION
          </p>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 13.5,
              border: "1px solid #2A2A2A",
              background: "rgba(255,255,255,.02)",
              padding: 28,
              maxWidth: 640,
              display: "grid",
              gap: 18,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "center" }}>
              <span style={{ color: "rgba(237,237,230,.45)" }}>to</span>
              <span style={{ color: "#D8FF3E" }}>
                {site.ensLike} <span style={{ color: "rgba(237,237,230,.4)" }}>({site.email})</span>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "center" }}>
              <span style={{ color: "rgba(237,237,230,.45)" }}>from</span>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="you@yourdomain.xyz"
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13.5,
                  background: "transparent",
                  border: "1px solid #2A2A2A",
                  color: "#EDEDE6",
                  padding: "12px 14px",
                  transition: "border-color .2s ease",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "center" }}>
              <span style={{ color: "rgba(237,237,230,.45)" }}>subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="a hard protocol problem"
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13.5,
                  background: "transparent",
                  border: "1px solid #2A2A2A",
                  color: "#EDEDE6",
                  padding: "12px 14px",
                  transition: "border-color .2s ease",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "start" }}>
              <span style={{ color: "rgba(237,237,230,.45)", paddingTop: 12 }}>payload</span>
              <textarea
                rows={6}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="What are we building? Founders, recruiters, admissions committees — all welcome."
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13.5,
                  background: "transparent",
                  border: "1px solid #2A2A2A",
                  color: "#EDEDE6",
                  padding: "12px 14px",
                  resize: "vertical",
                  lineHeight: 1.7,
                  transition: "border-color .2s ease",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, color: "rgba(237,237,230,.45)" }}>
              <span>gas</span>
              <span>
                0 ETH — <span style={{ color: "#D8FF3E" }}>free, always</span>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, color: "rgba(237,237,230,.45)" }}>
              <span>bytes</span>
              <span>{byteCount}</span>
            </div>

            {!done ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!busy && !done) {
                    setModalOpen(true);
                    setPhase("request");
                  }
                }}
                className="dc-btn-sign"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#D8FF3E",
                  color: "#0C0C0C",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: ".08em",
                  padding: 18,
                  marginTop: 6,
                  transition: "transform .15s ease",
                  cursor: "pointer",
                }}
              >
                {btnLabel}
              </a>
            ) : (
              <div
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "transparent",
                  border: "1px solid #D8FF3E",
                  color: "#D8FF3E",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: ".08em",
                  padding: 17,
                  marginTop: 6,
                }}
              >
                SENT ✓ — TALK SOON
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "48px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
          <p
            style={{
              margin: "0 0 24px",
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              letterSpacing: ".12em",
              color: "#D8FF3E",
            }}
          >
            §01 — OTHER CHANNELS
          </p>

          <a
            href={`mailto:${site.email}`}
            className="dc-channel"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "22px 4px",
              borderTop: "1px solid #2A2A2A",
              transition: "transform .2s ease",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 24 }}>Email</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "rgba(237,237,230,.5)" }}>
              {site.email}
            </span>
          </a>
          <a
            href={site.github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dc-channel"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "22px 4px",
              borderTop: "1px solid #2A2A2A",
              transition: "transform .2s ease",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 24 }}>GitHub</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "rgba(237,237,230,.5)" }}>
              {site.github.label}
            </span>
          </a>
          <a
            href={site.twitter.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dc-channel"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "22px 4px",
              borderTop: "1px solid #2A2A2A",
              transition: "transform .2s ease",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 24 }}>X / Twitter</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "rgba(237,237,230,.5)" }}>
              {site.twitter.label}
            </span>
          </a>
          <a
            href={site.telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dc-channel"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "22px 4px",
              borderTop: "1px solid #2A2A2A",
              transition: "transform .2s ease",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 24 }}>Telegram</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "rgba(237,237,230,.5)" }}>
              {site.telegram.label}
            </span>
          </a>
          <a
            href={site.cal.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dc-channel"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "22px 4px",
              borderTop: "1px solid #2A2A2A",
              borderBottom: "1px solid #2A2A2A",
              transition: "transform .2s ease",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 24 }}>Book a call</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "rgba(237,237,230,.5)" }}>
              {site.cal.label}
            </span>
          </a>

          <div
            style={{
              marginTop: "auto",
              paddingTop: 40,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 13,
              lineHeight: 2.2,
              color: "rgba(237,237,230,.55)",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  background: "#D8FF3E",
                  marginRight: 10,
                  animation: "pulse 1.6s infinite",
                }}
              ></span>
              {site.status}
            </div>
            <div>{site.latency}</div>
            <div>{site.pgp}</div>
          </div>
        </div>
      </section>

      <Footer />

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(12,12,12,.82)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: 460,
              maxWidth: "100%",
              border: "1px solid #D8FF3E",
              background: "#0C0C0C",
              boxShadow: "10px 10px 0 rgba(216,255,62,.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: "1px solid #2A2A2A",
                background: "rgba(216,255,62,.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  color: "#D8FF3E",
                }}
              >
                ⬒ SIGNATURE REQUEST
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(237,237,230,.45)" }}>
                {site.walletLabel}
              </span>
            </div>

            {phase === "request" && (
              <div style={{ padding: "22px 20px" }}>
                <p style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: "rgba(237,237,230,.75)" }}>
                  This site is requesting your signature to broadcast a message. Review before approving:
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    gap: "8px 16px",
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12,
                    color: "rgba(237,237,230,.55)",
                    border: "1px solid #2A2A2A",
                    padding: "16px 18px",
                  }}
                >
                  <span>to</span>
                  <span style={{ color: "#D8FF3E" }}>{site.ensLike}</span>
                  <span>from</span>
                  <span style={{ color: "#EDEDE6" }}>{fromDisplay}</span>
                  <span>subject</span>
                  <span style={{ color: "#EDEDE6" }}>{subjectDisplay}</span>
                  <span>bytes</span>
                  <span style={{ color: "#EDEDE6" }}>{byteCount}</span>
                  <span>gas</span>
                  <span style={{ color: "#EDEDE6" }}>0 ETH — free</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalOpen(false);
                      setPhase("request");
                    }}
                    className="dc-reject"
                    style={{
                      display: "block",
                      textAlign: "center",
                      border: "1px solid #3A3A3A",
                      color: "rgba(237,237,230,.7)",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      padding: 14,
                      cursor: "pointer",
                    }}
                  >
                    REJECT
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      sign();
                    }}
                    className="dc-approve"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#D8FF3E",
                      color: "#0C0C0C",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      padding: 14,
                      cursor: "pointer",
                    }}
                  >
                    APPROVE ✓
                  </a>
                </div>
              </div>
            )}

            {phase === "confirmed" && (
              <div style={{ padding: "36px 20px 40px", textAlign: "center" }}>
                <div
                  style={{
                    width: 74,
                    height: 74,
                    margin: "0 auto",
                    border: "2px solid #D8FF3E",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#D8FF3E",
                    animation: "pop .45s cubic-bezier(.16,1.6,.3,1) both",
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    marginTop: 18,
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: "-.02em",
                    color: "#D8FF3E",
                    animation: "fadeUp .5s .15s both",
                  }}
                >
                  TX CONFIRMED
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11.5,
                    color: "rgba(237,237,230,.5)",
                    wordBreak: "break-all",
                    animation: "fadeUp .5s .3s both",
                  }}
                >
                  tx {txHash}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12,
                    letterSpacing: ".08em",
                    color: "rgba(237,237,230,.7)",
                    animation: "fadeUp .5s .45s both",
                  }}
                >
                  opening secure channel<span style={{ animation: "pulse .8s infinite" }}>…</span>
                </div>
              </div>
            )}

            {phase === "signing" && (
              <div
                style={{
                  padding: "18px 20px",
                  height: 210,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  lineHeight: 1.9,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {logs.map((line, i) => (
                  <div key={i} style={{ color: line.color }}>
                    {line.text}
                  </div>
                ))}
                <span style={{ color: "#D8FF3E", animation: "pulse .8s infinite" }}>▌</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
