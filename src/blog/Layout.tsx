import type { ReactNode } from "react";
import { P, css } from "../lib/ui";
import { SITE_URL } from "../lib/config";

const PAPER = "position:relative;min-height:100vh;overflow:hidden;background-color:#fff;background-image:radial-gradient(rgba(17,17,17,.3) 1.3px,transparent 1.7px);background-size:24px 24px";

export function Paper({ children, headMargin, footMargin }: { children: ReactNode; headMargin: string; footMargin: number }) {
  return (
    <div data-paper style={css(PAPER)}>
      <div style={css("max-width:1180px;margin:0 auto;padding:0 clamp(18px,4vw,56px) 40px")}>
        <div data-bt-hide className="rise" style={css(`display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px;padding-top:20px;margin-bottom:${headMargin}`)}>
          <a
            href={SITE_URL}
            {...P(
              "flex:none;padding:8px 18px;background:#fff;border:3px solid #111;border-radius:16px;box-shadow:4px 4px 0 #111;font:800 21px Syne,sans-serif;letter-spacing:-.03em;rotate:-3deg;transition:rotate .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,background .15s",
              { h: "background:#ffe680;rotate:3deg;scale:1.1;box-shadow:6px 7px 0 #111" },
            )}
          >
            umut<span style={{ color: "#ffd21f" }}>.</span>
          </a>
          <nav style={css("display:flex;flex-wrap:wrap;gap:10px;padding:6px")}>
            <a
              href={SITE_URL}
              {...P(
                "padding:9px 16px;background:#fff;border:3px solid #111;border-radius:14px;box-shadow:3px 3px 0 #111;font:700 14px 'DM Sans',sans-serif;transition:translate .2s,background .2s",
                { h: "background:#ffe680;translate:0 -3px" },
              )}
            >
              ← Back to site
            </a>
          </nav>
        </div>
        {children}
        <div data-bt-footer style={css(`margin-top:${footMargin}px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font:700 13px 'JetBrains Mono',monospace`)}>
          <span>© 2026 Umut Satır</span>
          <span>Servers first. Chains too.</span>
        </div>
        <div data-bt-footer style={css("height:48px")} />
      </div>
    </div>
  );
}
