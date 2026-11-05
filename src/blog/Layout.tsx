import { useState, type ReactNode } from "react";
import { P, css } from "../lib/ui";
import { SITE_URL } from "../lib/config";

const PAPER = "position:relative;min-height:100vh;overflow:hidden;background-color:var(--bg);background-image:radial-gradient(var(--dots) 1.3px,transparent 1.7px);background-size:24px 24px";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  const dark = theme === "dark";
  const flip = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("blog-theme", next);
    } catch {
      /* private mode: the choice just won't persist */
    }
    setTheme(next);
  };
  return (
    <button
      onClick={flip}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      {...P(
        "cursor:pointer;display:flex;align-items:center;gap:8px;padding:9px 16px;background:var(--card);color:var(--ink);border:3px solid var(--ink);border-radius:14px;box-shadow:3px 3px 0 var(--ink);font:700 14px 'DM Sans',sans-serif;transition:translate .2s,background .2s",
        { h: "background:#ffe680;color:#111;translate:0 -3px" },
      )}
    >
      <span key={theme} style={css("display:inline-block;font-size:16px;line-height:1;animation:pop .35s cubic-bezier(.3,1.5,.5,1) both")}>{dark ? "☀" : "☾"}</span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}

export function Paper({ children, headMargin, footMargin }: { children: ReactNode; headMargin: string; footMargin: number }) {
  return (
    <div data-paper style={css(PAPER)}>
      <div style={css("max-width:1180px;margin:0 auto;padding:0 clamp(18px,4vw,56px) 40px")}>
        <div data-bt-hide className="rise" style={css(`display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px;padding-top:20px;margin-bottom:${headMargin}`)}>
          <a
            href={SITE_URL}
            {...P(
              "flex:none;padding:8px 18px;background:var(--card);color:var(--ink);border:3px solid var(--ink);border-radius:16px;box-shadow:4px 4px 0 var(--ink);font:800 21px Syne,sans-serif;letter-spacing:-.03em;rotate:-3deg;transition:rotate .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,background .15s",
              { h: "background:#ffe680;color:#111;rotate:3deg;scale:1.1;box-shadow:6px 7px 0 var(--ink)" },
            )}
          >
            umut<span style={{ color: "#ffd21f" }}>.</span>
          </a>
          <nav style={css("display:flex;flex-wrap:wrap;gap:10px;padding:6px")}>
            <a
              href={SITE_URL}
              {...P(
                "padding:9px 16px;background:var(--card);color:var(--ink);border:3px solid var(--ink);border-radius:14px;box-shadow:3px 3px 0 var(--ink);font:700 14px 'DM Sans',sans-serif;transition:translate .2s,background .2s",
                { h: "background:#ffe680;color:#111;translate:0 -3px" },
              )}
            >
              ← Back to site
            </a>
            <ThemeToggle />
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
