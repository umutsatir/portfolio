import { P, css } from "../lib/ui";
import { EMAIL, wallets } from "../data/site";
import type { Project } from "../data/work";

const MONO = "'JetBrains Mono',monospace";
const stop = (e: React.MouseEvent) => e.stopPropagation();

export function WalletModal({ step, onNext }: { step: number; onNext: () => void }) {
  return (
    <div onClick={stop} style={css("width:min(440px,100%);padding:30px;background:#fff;border:3px solid #111;border-radius:30px;box-shadow:10px 10px 0 #111;animation:pop .25s ease-out")}>
      {step === 0 && (
        <div>
          <div style={css("font:800 32px/1 Syne,sans-serif;letter-spacing:-.03em")}>Connect wallet</div>
          <p style={css("margin:10px 0 20px;font-size:15px;line-height:1.5")}>Just a joke. Nothing real connects. Pick any and I'll let you through.</p>
          {wallets.map((w) => (
            <button key={w.t} onClick={onNext} style={css(`cursor:pointer;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:12px;padding:16px 18px;background:${w.bg};border:3px solid #111;border-radius:18px;font:700 17px 'DM Sans',sans-serif;color:#111`)}>
              {w.t}
              <span>→</span>
            </button>
          ))}
        </div>
      )}
      {step === 1 && (
        <div>
          <div style={css("font:800 32px/1 Syne,sans-serif;letter-spacing:-.03em")}>Sign message</div>
          <div style={css("margin:16px 0;padding:16px;background:#f3efff;border:3px dashed #111;border-radius:16px;font:500 14px/1.5 'JetBrains Mono',monospace")}>"Hi Umut, I'd like to talk about something interesting."</div>
          <button onClick={onNext} style={css("cursor:pointer;width:100%;padding:16px;background:#111;color:#ffe680;border:3px solid #111;border-radius:99px;font:800 18px Syne,sans-serif")}>
            Sign (free, no gas)
          </button>
        </div>
      )}
      {step >= 2 && (
        <div>
          <div style={css("font:800 32px/1 Syne,sans-serif;letter-spacing:-.03em")}>Signature accepted ✓</div>
          <p style={css("margin:10px 0 20px;font-size:15px;line-height:1.5")}>Here's where to actually reach me:</p>
          <a href={"mailto:" + EMAIL} style={css("display:block;padding:16px 18px;background:#ffe680;border:3px solid #111;border-radius:18px;font:700 17px 'DM Sans',sans-serif;margin-bottom:12px")}>
            {EMAIL} ↗
          </a>
          <div style={css("display:flex;gap:10px")}>
            <a href="https://github.com/umutsatir" target="_blank" style={css("flex:1;text-align:center;padding:12px;background:#ffe680;color:#111;border:3px solid #111;border-radius:14px;font-weight:700")}>GitHub</a>
            <a href="https://twitter.com/umut_satir" target="_blank" style={css("flex:1;text-align:center;padding:12px;background:#b5efcf;border:3px solid #111;border-radius:14px;font-weight:700")}>X</a>
            <a href="https://t.me/umutsatir" target="_blank" style={css("flex:1;text-align:center;padding:12px;background:#d9ccff;border:3px solid #111;border-radius:14px;font-weight:700")}>Telegram</a>
          </div>
        </div>
      )}
    </div>
  );
}

export function CaseModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const live = p.live || "";
  return (
    <div onClick={stop} style={css("width:min(780px,100%);max-height:90vh;overflow:auto;padding:clamp(22px,4vw,40px);background:#fffbea;border:3px solid #111;border-radius:30px;box-shadow:10px 10px 0 #111;animation:pop .25s ease-out;box-sizing:border-box")}>
      <div style={css("display:flex;justify-content:space-between;align-items:start;gap:16px")}>
        <div>
          <div style={css(`font:700 12px ${MONO};color:#6d3fd6;letter-spacing:.06em`)}>{p.num} · {p.badge}</div>
          <div style={css("margin-top:8px;font:800 clamp(34px,5vw,56px)/1 Syne,sans-serif;letter-spacing:-.04em")}>{p.title}</div>
        </div>
        <button
          onClick={onClose}
          {...P(
            "flex:none;cursor:pointer;width:44px;height:44px;border-radius:50%;background:#ffe680;border:3px solid #111;font:800 18px 'DM Sans',sans-serif;color:#111;box-shadow:3px 3px 0 #111;transition:transform .18s ease-out,box-shadow .18s ease,background .2s ease",
            { h: "background:#ffa77a;transform:translate(-1px,-2px);box-shadow:4px 5px 0 #111", a: "transform:translate(2px,2px);box-shadow:0 0 0 #111" },
          )}
        >
          ✕
        </button>
      </div>
      <p style={css("margin:18px 0 22px;font-size:18px;line-height:1.55;font-weight:500")}>{p.tagline || ""}</p>
      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:12px")}>
        {(p.facts || []).map((f) => (
          <div key={f.label} style={css("padding:12px 14px;background:#fff;border:3px solid #111;border-radius:16px")}>
            <div style={css(`font:700 10.5px ${MONO};color:#6d3fd6;letter-spacing:.08em`)}>{f.label}</div>
            <div style={css("margin-top:4px;font-weight:700;font-size:14.5px")}>{f.value}</div>
          </div>
        ))}
      </div>
      {(p.sections || []).map((s) => (
        <div key={s.label} style={css("margin-top:28px;padding-top:22px;border-top:3px solid #111")}>
          <div style={css(`font:700 12px ${MONO};color:#b8481f;letter-spacing:.06em`)}>{s.label}</div>
          <div style={css("margin-top:6px;font:800 clamp(22px,3vw,30px)/1.05 Syne,sans-serif;letter-spacing:-.03em")}>{s.heading}</div>
          {s.code && (
            <div style={css("margin-top:14px;padding:16px 18px;background:#111;color:#b5efcf;border-radius:16px;font:500 13px/1.8 'JetBrains Mono',monospace;overflow:auto")}>
              {s.code.map((c, i) => (
                <div key={i} style={css("white-space:pre")}>{c}</div>
              ))}
            </div>
          )}
          <p style={css("margin:12px 0 0;font-size:16.5px;line-height:1.65")}>{s.body}</p>
        </div>
      ))}
      {live && (
        <a href={live} target="_blank" {...P("display:inline-block;margin:30px 12px 0 0;padding:14px 24px;background:#ffe680;color:#111;border:3px solid #111;border-radius:99px;font:800 17px Syne,sans-serif", { h: "background:#b5efcf" })}>
          Open live app ↗
        </a>
      )}
      {p.hasCode && (
        <a href={p.github || "#"} target="_blank" {...P("display:inline-block;margin-top:30px;padding:14px 24px;background:#111;color:#fff;border-radius:99px;font:800 17px Syne,sans-serif", { h: "background:#ffe680;color:#111" })}>
          View on GitHub ↗
        </a>
      )}
    </div>
  );
}
