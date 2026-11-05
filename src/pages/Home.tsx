import { useEffect, useRef, useState } from "react";
import { BLOG_URL } from "../lib/config";
import { P, css } from "../lib/ui";
import { useHomeEffects, resetChips } from "../hooks/useHomeEffects";
import { projects, skills } from "../data/work";
import { EMAIL, aboutWords, kv, links, navTabs, timeline } from "../data/site";
import { CaseModal, WalletModal } from "../components/Modals";

const SPRING = "cubic-bezier(.34,1.56,.64,1)";
const MONO = "'JetBrains Mono',monospace";
const rots = ["-3deg", "2deg", "-1.5deg", "3deg", "-2.5deg", "1deg"];
const tabRot = [-1.5, 1, -1, 1.5];

type Modal = null | "wallet" | "case";

export default function Home() {
  const [active, setActive] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [ci, setCi] = useState(0);
  const [sk, setSk] = useState(0);
  const [ah, setAh] = useState(-1);
  const skUser = useRef(false);

  useHomeEffects({ skillCount: skills.length, skUser, setSk, setActive });

  // body scroll lock while a modal is open
  useEffect(() => {
    document.documentElement.style.overflow = modal ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [modal]);

  const pickSkill = (n: number) => {
    setSk(n);
    skUser.current = true;
    resetChips();
  };

  const aboutCur =
    ah < 0
      ? { label: "HOVER A WORD", d: "The highlighted words are the short version. Point at one for the story behind it." }
      : { label: aboutWords[ah].t.toUpperCase(), d: aboutWords[ah].d };
  const aboutAnim = ah % 2 === 0 ? "abA" : "abB";
  const g = skills[sk];
  const skAnim = sk % 2 ? "stB" : "stA";
  const idx = String(sk + 1).padStart(2, "0") + " / " + String(skills.length).padStart(2, "0");

  return (
    <div style={css("min-height:100vh;overflow:hidden;position:relative")}>
      <div data-bar style={css("position:fixed;top:0;left:0;height:5px;width:0;z-index:1100;background:#ffe680;border-bottom:2px solid #111")} />

      <header style={css("position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:16px clamp(14px,3vw,36px);pointer-events:none")}>
        <a
          href="#top"
          {...P(
            `pointer-events:auto;flex:none;padding:8px 18px;background:#fff;border:3px solid #111;border-radius:16px;box-shadow:4px 4px 0 #111;font:800 21px Syne,sans-serif;letter-spacing:-.03em;transform:rotate(-3deg);transition:transform .2s ${SPRING},box-shadow .2s,background .15s;--i:0`,
            { h: "background:#ffe680;transform:rotate(3deg) scale(1.1);box-shadow:6px 7px 0 #111" },
            "rise-t",
          )}
        >
          umut<span style={{ color: "#ffd21f" }}>.</span>
        </a>
        <nav className="rise-t" style={css("pointer-events:auto;display:flex;gap:10px;padding:14px 14px 14px 10px;margin:-12px -8px -12px -8px;overflow-x:auto;min-width:0;scrollbar-width:none;--i:1")}>
          {navTabs.map(([id, label], i) => (
            <a
              key={id}
              href={"#" + id}
              {...P(
                `flex:none;padding:9px 16px;background:${active === id ? "#ffe680" : "#fff"};border:3px solid #111;border-radius:14px;box-shadow:3px 3px 0 #111;font:700 14px 'DM Sans',sans-serif;transform:${active === id ? "rotate(0deg) translateY(-2px)" : "rotate(" + tabRot[i] + "deg)"};transition:transform .2s ${SPRING},box-shadow .2s,background .15s`,
                { h: "background:#ffe680;transform:translateY(-4px) rotate(0deg) scale(1.08);box-shadow:5px 7px 0 #111" },
              )}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="rise-t" style={css("pointer-events:auto;flex:none;display:flex;align-items:center;gap:14px;--i:2")}>
          <a
            href={BLOG_URL}
            {...P(
              `flex:none;padding:10px 18px;background:#111;color:#fff;border:3px solid #111;border-radius:16px;box-shadow:4px 4px 0 #ffe680;font:700 14px 'DM Sans',sans-serif;transition:transform .2s ${SPRING},box-shadow .2s,background .15s,color .15s`,
              { h: "background:#ffe680;color:#111;transform:translate(-2px,-3px);box-shadow:6px 7px 0 #111" },
            )}
          >
            Blog ↗
          </a>
          <button
            onClick={() => {
              setModal("wallet");
              setStep(done ? 2 : 0);
            }}
            {...P(
              `pointer-events:auto;flex:none;cursor:pointer;padding:10px 18px;background:#ffe680;border:3px solid #111;border-radius:16px;box-shadow:4px 4px 0 #111;font:700 14px 'DM Sans',sans-serif;color:#111;transform:rotate(2deg);transition:transform .2s ${SPRING},box-shadow .2s,background .15s`,
              { h: "background:#fff;transform:rotate(-2deg) scale(1.08);box-shadow:6px 7px 0 #111" },
            )}
          >
            {done ? "Connected ✓" : "Connect wallet"}
          </button>
        </div>
      </header>

      <section id="top" data-hero style={css("position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,600px),1fr));gap:30px 40px;align-items:center;padding:130px clamp(18px,4vw,52px) 90px;max-width:1380px;margin:0 auto;box-sizing:border-box;min-height:100vh")}>
        <div style={css("position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,150,100,.6) 1.5px,transparent 2px);background-size:28px 28px;-webkit-mask-image:radial-gradient(360px circle at var(--hx,70%) var(--hy,40%),#000,transparent 70%);mask-image:radial-gradient(360px circle at var(--hx,70%) var(--hy,40%),#000,transparent 70%)")} />
        <div style={css("position:relative;min-width:0")}>
          <div className="rise-t" style={css("display:inline-block;padding:8px 16px;background:#fff;border:3px solid #111;border-radius:99px;font-weight:700;font-size:14px;transform:rotate(-2deg);--i:2")}>
            <i style={css("display:inline-block;width:9px;height:9px;border-radius:50%;background:#22c55e;margin-right:8px;animation:blink 1.2s infinite")} />
            Online · Istanbul, UTC+3
          </div>
          <h1 className="rise-t" style={css("margin:22px 0 0;font:800 clamp(44px,6.4vw,112px)/.94 Syne,sans-serif;letter-spacing:-.045em;--i:3")}>
            I make{" "}
            <span
              data-decrypt
              {...P(
                "background:#ffe680;padding:0 .12em;border:3px solid #111;display:inline-block;white-space:nowrap;text-align:center;box-sizing:content-box;transform:rotate(-1.5deg);box-shadow:6px 6px 0 #111;transition:transform .2s ease,box-shadow .2s ease,background .2s ease,color .2s ease;cursor:default",
                { h: "background:#ffa77a;color:#111;transform:rotate(1.5deg) scale(1.04);box-shadow:10px 10px 0 #111" },
              )}
            >
              blockchains
            </span>{" "}
            less scary.
          </h1>
          <p className="rise-t" style={css("margin:28px 0 0;max-width:540px;font-size:19px;line-height:1.55;font-weight:500;--i:4")}>
            I'm <b>Umut Satır</b>, a blockchain &amp; fullstack engineer. Day to day:{" "}
            <span data-rotate data-words="APIs & databases|distributed systems|smart contracts|zk-proofs" style={css(`display:inline-block;padding:0 8px;background:#ffa77a;color:#111;border-radius:8px;font:700 17px ${MONO}`)}>
              APIs &amp; databases
            </span>
          </p>
          <div className="rise-t" style={css("margin-top:32px;display:flex;flex-wrap:wrap;gap:14px;--i:5")}>
            <a href="#work" data-magnet style={css("padding:16px 26px;background:#111;color:#fff;border-radius:99px;font-weight:700;font-size:16px;border:3px solid #111")}>
              See my work ↓
            </a>
            <a href="#contact" data-magnet style={css("padding:16px 26px;background:#fff;border:3px solid #111;border-radius:99px;box-shadow:4px 4px 0 #111;font-weight:700;font-size:16px")}>
              Say hi
            </a>
          </div>
        </div>
        <div className="rise-t" style={css("position:relative;height:min(560px,92vw);min-height:440px;min-width:0;--i:4")}>
          <div style={css("position:absolute;left:0;top:0;width:min(60%,360px);padding:20px;background:#fff;border:3px solid #111;border-radius:26px;box-shadow:8px 8px 0 #111;transform:rotate(-5deg);animation:bob1 5s ease-in-out infinite")}>
            <div style={css("font:700 12px 'JetBrains Mono';text-transform:uppercase;letter-spacing:.08em;opacity:.6")}>pragma solidity ^0.8</div>
            <div style={css("margin-top:8px;font:800 28px/1.05 Syne,sans-serif;letter-spacing:-.03em")}>Code that holds money should be boring.</div>
          </div>
          <div style={css("position:absolute;right:0;top:28%;width:min(48%,300px);padding:20px;background:#ffe680;color:#111;border:3px solid #111;border-radius:26px;box-shadow:8px 8px 0 #111;transform:rotate(6deg);animation:bob2 6s ease-in-out infinite .6s")}>
            <div style={css("font:800 25px/1.05 Syne,sans-serif")}>
              gm.
              <br />
              gas-optimised since birth.
            </div>
          </div>
          <div style={css("position:absolute;left:2%;bottom:0;width:min(52%,320px);padding:16px 20px;background:#b5efcf;border:3px solid #111;border-radius:99px;box-shadow:8px 8px 0 #111;transform:rotate(-3deg);animation:bob3 7s ease-in-out infinite 1.2s;display:flex;gap:10px;align-items:center;font-weight:700")}>
            <i style={css("width:14px;height:14px;border-radius:50%;background:#111")} />
            <span>
              Software engineer @{" "}
              <a href="https://node101.io" target="_blank" {...P("font-weight:800;border-bottom:2px solid #111;transition:background .15s", { h: "background:#ffe680" })}>
                node101
              </a>
            </span>
          </div>
          <div style={css("position:absolute;right:0;bottom:0;width:120px;height:120px;display:grid;place-items:center")}>
            <svg viewBox="0 0 200 200" style={css("position:absolute;inset:0;width:100%;height:100%;animation:spin 16s linear infinite")}>
              <defs>
                <path id="cp" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text fontFamily="JetBrains Mono" fontWeight="700" fontSize="16" letterSpacing="2.4" fill="#111">
                <textPath href="#cp">FULLSTACK · BACKEND · WEB3 ·</textPath>
              </text>
            </svg>
            <div style={css("width:52px;height:52px;border-radius:50%;background:#ffe680;border:3px solid #111;display:grid;place-items:center;font:800 22px Syne,sans-serif")}>U</div>
          </div>
        </div>
      </section>

      <div style={css("background:#ffe680;border-block:3px solid #111;overflow:hidden;white-space:nowrap;padding:16px 0")}>
        <div data-marquee data-dir="-1" style={css("display:inline-flex;font:800 30px Syne,sans-serif;letter-spacing:-.02em;will-change:transform")}>
          <span>NODE.JS ★ TYPESCRIPT ★ PHP ★ POSTGRESQL ★ MONGODB ★ DOCKER ★ AWS ★ REACT ★ NEXT.JS ★ SOLIDITY ★ ZK ★&nbsp;</span>
          <span>NODE.JS ★ TYPESCRIPT ★ PHP ★ POSTGRESQL ★ MONGODB ★ DOCKER ★ AWS ★ REACT ★ NEXT.JS ★ SOLIDITY ★ ZK ★&nbsp;</span>
        </div>
      </div>

      <section id="about" style={css("max-width:1380px;margin:0 auto;padding:110px clamp(18px,4vw,52px) 90px")}>
        <div data-reveal style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:56px;align-items:start")}>
          <div style={css("min-width:0")}>
            <div style={css(`font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.08em;color:#6d3fd6`)}>/ about</div>
            <div style={css("margin-top:18px;font:800 clamp(22px,2.4vw,34px)/1.7 Syne,sans-serif;letter-spacing:-.03em")}>
              {aboutWords.map((w, i) => (
                <span key={w.t}>
                  {w.pre}
                  <span
                    onMouseEnter={() => setAh(i)}
                    style={css(
                      `display:inline-block;padding:0 .2em;margin:0 .03em;line-height:1.2;background:${w.bg};border:3px solid #111;border-radius:14px;box-shadow:${ah === i ? "5px 6px 0 #111" : "3px 3px 0 #111"};translate:${ah === i ? "-2px -3px" : "0 0"};cursor:default;transition:translate .25s cubic-bezier(.3,1.5,.5,1),box-shadow .25s ease`,
                    )}
                  >
                    {w.t}
                  </span>
                  {w.after}
                </span>
              ))}
            </div>
            <div
              style={css(`margin-top:30px;padding:20px 24px;background:#fff;border:3px solid #111;border-radius:22px;box-shadow:6px 6px 0 #111;min-height:86px;animation:${aboutAnim} .4s cubic-bezier(.3,1.5,.5,1) both;transition:background .3s ease`)}
            >
              <div style={css(`font:700 12px ${MONO};color:#6d3fd6;letter-spacing:.08em`)}>{aboutCur.label}</div>
              <div style={css("margin-top:8px;font-size:17px;line-height:1.55;font-weight:500")}>{aboutCur.d}</div>
            </div>
          </div>
          <div style={css("display:flex;justify-content:center;min-width:0;padding-top:70px")}>
            <div {...P("position:relative;width:min(100%,330px);transform-origin:50% 0;animation:swing 3.6s ease-in-out infinite alternate", { h: "animation-play-state:paused" })}>
              <div style={css("width:44px;height:90px;margin:-90px auto 0;background:#111;border-radius:0 0 8px 8px")} />
              <div style={css("width:64px;height:26px;margin:-4px auto 0;background:#fffbea;border:3px solid #111;border-radius:12px 12px 0 0;position:relative;z-index:2")} />
              <div style={css("margin-top:-3px;background:#fffbea;border:3px solid #111;border-radius:28px;box-shadow:9px 10px 0 #111;overflow:hidden")}>
                <div style={css("padding:16px 22px;background:#ffe680;border-bottom:3px solid #111;display:flex;justify-content:space-between;align-items:center;gap:8px")}>
                  <span style={css("font:800 20px Syne,sans-serif;letter-spacing:-.03em")}>umut.</span>
                  <span style={css(`padding:3px 12px;background:#111;color:#ffe680;border-radius:99px;font:700 11px ${MONO};letter-spacing:.08em;white-space:nowrap`)}>ACCESS: ALL AREAS</span>
                </div>
                <div style={css("padding:22px")}>
                  <div style={css("position:relative;height:190px;border:3px solid #111;border-radius:20px;overflow:hidden;background-color:#e4d9ff;background-image:radial-gradient(rgba(17,17,17,.18) 2px,transparent 2.5px);background-size:22px 22px")}>
                    <img src="/umut.webp" alt="Umut Satır" width={640} height={640} style={css("position:absolute;left:50%;bottom:0;height:100%;width:auto;aspect-ratio:1;translate:-50% 0;user-select:none;pointer-events:none")} draggable={false} />
                    <div style={css("position:absolute;top:12px;right:12px;padding:3px 10px;background:#fff;border:3px solid #111;border-radius:12px;box-shadow:3px 3px 0 #111;rotate:6deg;font:800 15px Syne,sans-serif")}>0x</div>
                    <div style={css("position:absolute;top:14px;left:12px;padding:3px 10px;background:#b5efcf;border:3px solid #111;border-radius:12px;box-shadow:3px 3px 0 #111;rotate:-6deg;font:800 15px Syne,sans-serif")}>{"{ }"}</div>
                  </div>
                  <div style={css("margin-top:18px;font:800 32px/1 Syne,sans-serif;letter-spacing:-.04em")}>Umut Satır</div>
                  <div style={css("margin-top:6px;font:700 15px 'DM Sans',sans-serif")}>
                    Software engineer @{" "}
                    <a href="https://node101.io" target="_blank" {...P("font-weight:800;border-bottom:2px solid #111", { h: "background:#ffe680" })}>
                      node101
                    </a>
                  </div>
                  <div style={css("margin-top:16px;padding-top:14px;border-top:2px dashed rgba(17,17,17,.4);font:500 13px/2 'JetBrains Mono',monospace")}>
                    {kv.map((r) => (
                      <div key={r.k} style={css("display:flex;gap:12px")}>
                        <span style={css("flex:0 0 78px;color:#6d3fd6;font-weight:700")}>{r.k}</span>
                        <span style={css("min-width:0")}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={css("margin-top:14px;height:34px;background:repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 8px,#111 8px 11px,transparent 11px 13px)")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" style={css("background:#b8a4ff;color:#111;border-block:3px solid #111;padding:110px 0")}>
        <div style={css("max-width:1380px;margin:0 auto;padding:0 clamp(18px,4vw,52px)")}>
          <div data-reveal style={css("margin-bottom:44px")}>
            <div style={css(`font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.08em;color:#111`)}>/ selected work</div>
            <h2 style={css("margin:12px 0 0;font:800 clamp(42px,6.4vw,100px)/.95 Syne,sans-serif;letter-spacing:-.045em")}>Things I've built</h2>
          </div>
          <div style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr));gap:30px")}>
            {projects.map((p, i) => (
              <article key={p.num} data-tilt style={css("display:flex;flex-direction:column;background:#fffbea;color:#111;border:3px solid #111;border-radius:28px;overflow:hidden;box-shadow:9px 9px 0 #111;transition:transform .18s ease-out;will-change:transform")}>
                <div style={css(`height:180px;background-color:${p.bg};border-bottom:3px solid #111;position:relative;display:grid;place-items:center;background-image:radial-gradient(rgba(17,17,17,.2) 2px,transparent 2.5px);background-size:22px 22px`)}>
                  <span style={css("font:800 clamp(40px,4.4vw,62px)/1 Syne,sans-serif;letter-spacing:-.05em;padding:6px 18px;background:#fff;border:3px solid #111;border-radius:18px;box-shadow:5px 5px 0 #111;transform:rotate(-3deg)")}>{p.glyph}</span>
                  <span style={css(`position:absolute;left:14px;top:14px;padding:5px 12px;background:#111;color:#fff;border-radius:99px;font:700 11px ${MONO};text-transform:uppercase;letter-spacing:.06em`)}>{p.badge}</span>
                </div>
                <div style={css("padding:24px 26px 26px;display:flex;flex-direction:column;flex:1")}>
                  <div style={css(`font:700 12px ${MONO};color:#6d3fd6;text-transform:uppercase;letter-spacing:.05em`)}>{p.event}</div>
                  <h3 style={css("margin:8px 0 0;font:800 30px/1 Syne,sans-serif;letter-spacing:-.03em")}>{p.title}</h3>
                  <p style={css("margin:12px 0 0;font-size:15.5px;line-height:1.55;flex:1")}>{p.short}</p>
                  <div style={css("margin-top:16px;display:flex;flex-wrap:wrap;gap:7px")}>
                    {p.tags.map((t) => (
                      <span key={t} style={css(`padding:4px 10px;border:2px solid #111;border-radius:99px;font:700 11.5px ${MONO}`)}>{t}</span>
                    ))}
                  </div>
                  <div style={css("margin-top:20px;display:flex;flex-wrap:wrap;gap:12px;font-weight:700;font-size:15px")}>
                    {p.hasCase && (
                      <button
                        onClick={() => {
                          setCi(i);
                          setModal("case");
                        }}
                        {...P(
                          "cursor:pointer;padding:9px 16px;background:#ffe680;border:3px solid #111;border-radius:99px;font:700 14px 'DM Sans',sans-serif;color:#111;box-shadow:3px 3px 0 #111;transition:transform .18s cubic-bezier(.3,1.6,.5,1),box-shadow .18s ease,background .2s ease,color .2s ease;",
                          { h: "background:#ffa77a;color:#111;transform:translate(-2px,-3px) rotate(-2deg) scale(1.06);box-shadow:5px 6px 0 #111", a: "transform:translate(2px,2px) scale(.98);box-shadow:0 0 0 #111" },
                        )}
                      >
                        Case study →
                      </button>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        {...P(
                          "padding:9px 16px;background:#111;color:#fff;border:3px solid #111;border-radius:99px;font-size:14px;box-shadow:3px 3px 0 #111;transition:transform .18s cubic-bezier(.3,1.6,.5,1),box-shadow .18s ease,background .2s ease,color .2s ease",
                          { h: "background:#b5efcf;color:#111;transform:translate(-2px,-3px) rotate(-2deg) scale(1.06);box-shadow:5px 6px 0 #111", a: "transform:translate(2px,2px) scale(.98);box-shadow:0 0 0 #111" },
                        )}
                      >
                        Live app ↗
                      </a>
                    )}
                    {p.hasCode && (
                      <a
                        href={p.github}
                        target="_blank"
                        {...P(
                          "padding:9px 16px;background:#fff;border:3px solid #111;border-radius:99px;font-size:14px;box-shadow:3px 3px 0 #111;transition:transform .18s cubic-bezier(.3,1.6,.5,1),box-shadow .18s ease,background .2s ease",
                          { h: "background:#d9ccff;transform:translate(-2px,-3px) rotate(-2deg) scale(1.06);box-shadow:5px 6px 0 #111", a: "transform:translate(2px,2px) scale(.98);box-shadow:0 0 0 #111" },
                        )}
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={css("max-width:1380px;margin:0 auto;padding:110px clamp(18px,4vw,52px) 40px")}>
        <div data-reveal>
          <div style={css(`font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.08em;color:#6d3fd6`)}>/ toolbox</div>
          <h2 style={css("margin:12px 0 40px;font:800 clamp(38px,5.4vw,82px)/.98 Syne,sans-serif;letter-spacing:-.045em")}>What I reach for</h2>
          <div style={css("display:flex;flex-wrap:wrap;gap:28px;align-items:stretch")}>
            <div style={css("flex:1 1 260px;max-width:380px;display:flex;flex-direction:column;gap:14px;padding:4px 10px 10px 4px")}>
              {skills.map((t, n) => (
                <button
                  key={t.name}
                  onClick={() => pickSkill(n)}
                  {...P(
                    `cursor:pointer;display:flex;align-items:center;gap:14px;text-align:left;padding:14px 18px;background:${n === sk ? t.bg : "#fff"};border:3px solid #111;border-radius:20px;box-shadow:${n === sk ? "5px 5px 0 #111" : "2px 2px 0 #111"};transform:${n === sk ? "translateX(10px)" : "none"};transition:transform .25s cubic-bezier(.3,1.5,.5,1),translate .25s cubic-bezier(.3,1.5,.5,1),box-shadow .2s ease,background .25s ease;font:inherit;color:#111`,
                    { h: "translate:6px -3px;box-shadow:6px 7px 0 #111", a: "translate:0 2px;box-shadow:1px 1px 0 #111" },
                  )}
                >
                  <span style={css(`font:700 13px ${MONO};opacity:.7`)}>{String(n + 1).padStart(2, "0")}</span>
                  <span style={css("font:800 22px Syne,sans-serif;letter-spacing:-.02em;flex:1")}>{t.name}</span>
                  <span style={css(`font:800 20px Syne,sans-serif;transform:${n === sk ? "translateX(4px)" : "none"};transition:transform .25s ease`)}>→</span>
                </button>
              ))}
            </div>
            <div data-card style={css(`flex:3 1 400px;min-width:0;position:relative;overflow:hidden;min-height:420px;padding:clamp(24px,3vw,40px);background:${g.bg};border:3px solid #111;border-radius:32px;box-shadow:10px 10px 0 #111;transition:background .4s ease;display:flex;flex-direction:column`)}>
              <div style={css("position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(17,17,17,.16) 1.5px,transparent 2px);background-size:26px 26px")} />
              <div style={css(`position:relative;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.06em`)}>
                <span>{idx}</span>
                <span>{g.note}</span>
              </div>
              <div style={css("position:relative;margin:14px 0 26px;font:800 clamp(40px,5.6vw,84px)/.95 Syne,sans-serif;letter-spacing:-.045em")}>{g.name}</div>
              <div style={css("position:relative;display:flex;flex-wrap:wrap;gap:16px 14px;align-content:flex-start;flex:1")}>
                {g.items.map((name, n) => (
                  <span
                    key={sk + name}
                    data-chip
                    {...P(
                      `display:inline-block;cursor:grab;touch-action:none;user-select:none;padding:10px 20px;background:#fff;border:3px ${g.line} #111;border-radius:99px;box-shadow:4px 4px 0 #111;font:800 clamp(16px,1.8vw,22px) Syne,sans-serif;rotate:${rots[n % rots.length]};animation:${skAnim} .55s cubic-bezier(.3,1.5,.5,1) ${n * 70}ms both;transition:scale .25s cubic-bezier(.3,1.5,.5,1),box-shadow .25s ease`,
                      { h: "scale:1.1" },
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>
              <div style={css("position:relative;margin-top:22px;font:500 12px 'JetBrains Mono',monospace;opacity:.75")}>// drag the stickers around</div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" style={css("max-width:1380px;margin:0 auto;padding:100px clamp(18px,4vw,52px) 110px")}>
        <div data-reveal>
          <div style={css(`font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.08em;color:#6d3fd6`)}>/ experience</div>
          <h2 style={css("margin:12px 0 40px;font:800 clamp(38px,5.4vw,82px)/.98 Syne,sans-serif;letter-spacing:-.045em")}>The career chain</h2>
          <div style={css("background:#fff;border:3px solid #111;border-radius:30px;box-shadow:10px 10px 0 #111;overflow:hidden")}>
            {timeline.map((e) => (
              <div
                key={e.title}
                data-row
                {...P(
                  `display:grid;grid-template-columns:minmax(90px,150px) minmax(0,1fr) auto;gap:10px 30px;padding:26px clamp(20px,3vw,40px);border-top:3px solid #111;background:${e.bg};transition:background .2s,padding-left .25s ${SPRING}`,
                  { h: "background:#ffe680;padding-left:clamp(34px,4.5vw,64px)" },
                )}
              >
                <div style={css(`font:700 14px ${MONO};color:#6d3fd6;padding-top:6px`)}>{e.year}</div>
                <div>
                  <div style={css("font:800 clamp(22px,2.4vw,32px)/1.05 Syne,sans-serif;letter-spacing:-.03em")}>{e.title}</div>
                  <p style={css("margin:8px 0 0;max-width:660px;font-size:16px;line-height:1.55")}>{e.desc}</p>
                </div>
                <div style={css(`align-self:start;padding:5px 12px;border:2px solid #111;border-radius:99px;font:700 11px ${MONO};text-transform:uppercase;letter-spacing:.06em;background:${e.tagBg}`)}>{e.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={css("padding:0 clamp(18px,4vw,52px) 80px;max-width:1380px;margin:0 auto")}>
        <div data-reveal style={css("padding:clamp(30px,6vw,80px);background:#fff;border:3px solid #111;border-radius:36px;box-shadow:10px 10px 0 #111")}>
          <div style={css(`font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.08em`)}>{"/ contact · replies < 24h, usually < 2h"}</div>
          <div style={css("margin-top:12px;font:800 clamp(44px,8vw,128px)/.92 Syne,sans-serif;letter-spacing:-.05em")}>
            Got a hard problem?
            <br />
            <span style={css("display:inline-block;margin-top:8px;padding:0 .14em;background:#ffe680;border:3px solid #111;border-radius:.2em;transform:rotate(-1.5deg);box-shadow:6px 6px 0 #111")}>Let's ship it.</span>
          </div>
          <div style={css("margin-top:38px;display:flex;flex-wrap:wrap;gap:14px")}>
            <a href={"mailto:" + EMAIL} data-magnet style={css("padding:18px 30px;background:#ffe680;color:#111;border:3px solid #111;border-radius:99px;box-shadow:5px 5px 0 #111;font:800 20px Syne,sans-serif")}>
              {EMAIL} ↗
            </a>
            <a href="https://cal.com/umutsatir" target="_blank" data-magnet style={css("padding:18px 30px;background:#d9ccff;border:3px solid #111;border-radius:99px;box-shadow:5px 5px 0 #111;font:800 20px Syne,sans-serif")}>
              Book a call ↗
            </a>
          </div>
          <div style={css("margin-top:34px;display:flex;flex-wrap:wrap;gap:12px")}>
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" {...P("padding:11px 20px;background:#fff;border:3px solid #111;border-radius:99px;font-weight:700", { h: "background:#ffe680" })}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>
      <footer style={css("max-width:1380px;margin:0 auto;padding:0 clamp(18px,4vw,52px) 40px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font:700 13px 'JetBrains Mono',monospace")}>
        <span>© 2026 Umut Satır · umut.eth · built once, with intent</span>
        <a href="#top" style={css("border-bottom:2px solid #111")}>Back to top ↑</a>
      </footer>

      {modal && (
        <div onClick={() => setModal(null)} style={css("position:fixed;inset:0;z-index:2000;background:rgba(26,11,59,.6);display:grid;place-items:center;padding:20px;overflow:auto;overscroll-behavior:contain")}>
          {modal === "wallet" && <WalletModal step={step} onNext={() => { setStep(step + 1); setDone(step + 1 === 2); }} />}
          {modal === "case" && <CaseModal p={projects[ci]} onClose={() => setModal(null)} />}
        </div>
      )}
    </div>
  );
}
