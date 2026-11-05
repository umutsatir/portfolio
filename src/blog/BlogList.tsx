import { useState } from "react";
import { P, css } from "../lib/ui";
import { BLOG_BASENAME } from "../lib/config";
import { MONTHS_LONG, posts, tagColor, tags } from "./posts";
import { Paper } from "./Layout";

const MONO = "'JetBrains Mono',monospace";

export default function BlogList() {
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = posts.filter((n) => (f === "All" || n.tag === f) && (!s || (n.title + " " + n.tag + " " + n.excerpt).toLowerCase().includes(s)));

  const groups: { key: string; label: string; rows: typeof list }[] = [];
  list.forEach((n) => {
    const [y, m] = n.date.split("-").map(Number);
    const key = y + "-" + m;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, label: MONTHS_LONG[m - 1] + " " + y, rows: [] };
      groups.push(g);
    }
    g.rows.push(n);
  });

  return (
    <Paper headMargin="clamp(40px,7vw,72px)" footMargin={60}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px")}>
        <div>
          <div style={css(`font:700 13px ${MONO};text-transform:uppercase;letter-spacing:.08em;color:#6d3fd6`)}>/ blog</div>
          <h1 style={css("margin:14px 0 0;font:800 clamp(44px,5.8vw,84px)/1 Syne,sans-serif;letter-spacing:-.045em")}>
            Notes &amp; <span style={css("display:inline-block;padding:0 .14em;background:#ffe680;border:3px solid #111;border-radius:14px")}>writing</span>
          </h1>
          <p style={css("margin:20px 0 0;max-width:540px;font-size:18px;line-height:1.55;font-weight:500")}>Short notes when I learn something, long write-ups when a project teaches me a lot.</p>
        </div>
        <label style={css("display:flex;align-items:center;gap:10px;padding:12px 20px;background:#fff;border:2px solid #111;border-radius:99px;min-width:min(100%,280px)")}>
          <span style={css("font:800 16px Syne,sans-serif")}>⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" style={css("flex:1;min-width:0;border:0;outline:0;background:transparent;font:500 15px 'DM Sans',sans-serif;color:#111")} />
        </label>
      </div>
      <div style={css("display:flex;flex-wrap:wrap;gap:10px;margin:30px 0 48px")}>
        {["All", ...tags].map((l) => {
          const on = f === l;
          return (
            <button
              key={l}
              onClick={() => setF(l)}
              {...P(`cursor:pointer;padding:8px 16px;background:${on ? "#111" : l === "All" ? "#fff" : tagColor[l]};color:${on ? "#fff" : "#111"};border:2px solid #111;border-radius:99px;font:700 14px 'DM Sans',sans-serif;transition:translate .2s cubic-bezier(.3,1.5,.5,1),background .2s ease`, { h: "translate:0 -3px" })}
            >
              {l}
            </button>
          );
        })}
      </div>
      <div style={css("position:relative;padding-left:clamp(48px,6vw,64px)")}>
        <div style={css("position:absolute;left:15px;top:6px;bottom:0;width:2px;background:#111")} />
        {groups.map((g) => (
          <div key={g.key} style={css("margin-bottom:12px")}>
            <div style={css("margin:0 0 22px")}>
              <span style={css(`display:inline-block;padding:6px 16px;background:#111;color:#fff;border-radius:99px;font:700 12px ${MONO};letter-spacing:.08em;text-transform:uppercase`)}>{g.label}</span>
            </div>
            {g.rows.map((n) => {
              const bg = tagColor[n.tag];
              return (
                <div key={n.slug} style={css("position:relative;margin-bottom:26px")}>
                  <span style={css(`position:absolute;left:calc(-1 * clamp(48px,6vw,64px));top:26px;width:34px;height:34px;border-radius:50%;background:${bg};border:2px solid #111;display:grid;place-items:center;font:800 13px Syne,sans-serif;box-sizing:border-box`)}>{Number(n.date.slice(8))}</span>
                  <a
                    href={BLOG_BASENAME + "/" + n.slug}
                    {...P("display:block;max-width:900px;padding:24px 30px;background:#fff;border:2px solid #111;border-radius:22px;box-shadow:4px 4px 0 #111;transition:translate .25s cubic-bezier(.3,1.5,.5,1),box-shadow .25s ease", { h: "translate:8px 0;box-shadow:8px 6px 0 #111" })}
                  >
                    <div style={css("display:flex;align-items:center;gap:12px;flex-wrap:wrap")}>
                      <span style={css(`padding:2px 10px;background:${bg};border:2px solid #111;border-radius:99px;font:700 11px ${MONO};text-transform:uppercase;letter-spacing:.04em`)}>{n.tag}</span>
                      {n.essay && <span style={css(`padding:2px 9px;background:#111;color:#fff;border-radius:99px;font:700 10px ${MONO};letter-spacing:.06em`)}>ESSAY</span>}
                      <span style={css(`font:700 12px ${MONO};opacity:.6`)}>{n.mins} min read</span>
                    </div>
                    <div style={css("margin-top:12px;font:800 clamp(22px,2.4vw,30px)/1.1 Syne,sans-serif;letter-spacing:-.035em;overflow-wrap:anywhere")}>{n.title}</div>
                    <p style={css("margin:10px 0 0;max-width:660px;font-size:16.5px;line-height:1.6")}>{n.excerpt}</p>
                  </a>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {!list.length && <div style={css("padding:60px 0;text-align:center;font:800 26px Syne,sans-serif")}>Nothing matches. Try another topic.</div>}
    </Paper>
  );
}
