import { useEffect, type ComponentProps, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { P, css } from "../lib/ui";
import { BLOG_BASENAME } from "../lib/config";
import { MONTHS_SHORT, posts, tagColor } from "./posts";
import { highlight } from "./highlight";
import { Paper } from "./Layout";

const MONO = "'JetBrains Mono',monospace";

function textOf(n: ReactNode): string {
  if (typeof n === "string") return n;
  if (Array.isArray(n)) return n.map(textOf).join("");
  return "";
}

function Pre({ children }: ComponentProps<"pre">) {
  const el = children as React.ReactElement<{ className?: string; children?: ReactNode }>;
  const lang = /language-(\w+)/.exec(el.props.className || "")?.[1] || "code";
  const lines = textOf(el.props.children).replace(/\n$/, "").split("\n");
  return (
    <div style={css("position:relative;margin-top:22px;padding:34px 22px 18px;background:#111;border-radius:16px;font:500 14px/1.85 'JetBrains Mono',monospace;overflow:auto;color:#f3efff")}>
      <span style={css(`position:absolute;top:10px;right:14px;padding:2px 10px;background:#ffe680;color:#111;border-radius:99px;font:700 10.5px ${MONO};letter-spacing:.08em;text-transform:uppercase`)}>{lang}</span>
      {highlight(lines, lang).map((toks, i) => (
        <div key={i} style={css("white-space:pre;min-height:1.85em")}>
          {toks.map((k, j) => (
            <span key={j} style={{ color: k.c }}>{k.t}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

const components = {
  h2: (p: ComponentProps<"h2">) => <h2 style={css("margin:46px 0 0;font:800 clamp(26px,3vw,34px)/1.05 Syne,sans-serif;letter-spacing:-.035em")} {...p} />,
  p: (p: ComponentProps<"p">) => <p style={css("margin:18px 0 0;max-width:820px;font-size:18.5px;line-height:1.75")} {...p} />,
  pre: Pre,
  code: (p: ComponentProps<"code">) => <code style={css(`font:600 .86em ${MONO};background:rgba(17,17,17,.1);padding:1px 6px;border-radius:6px`)} {...p} />,
  a: (p: ComponentProps<"a">) => <a {...P("border-bottom:2px solid #111", { h: "background:#ffe680" })} {...p} />,
  ul: (p: ComponentProps<"ul">) => <ul style={css("margin:18px 0 0;max-width:820px;font-size:18.5px;line-height:1.75;padding-left:1.3em")} {...p} />,
  ol: (p: ComponentProps<"ol">) => <ol style={css("margin:18px 0 0;max-width:820px;font-size:18.5px;line-height:1.75;padding-left:1.3em")} {...p} />,
};

export default function BlogPost() {
  const { slug } = useParams();
  const i = posts.findIndex((x) => x.slug === slug);

  useEffect(() => {
    (window as unknown as { htmlToImage: typeof htmlToImage }).htmlToImage = htmlToImage;
    let live = true;
    // Sticky notes / highlights / cite / PNG capture: vanilla module from the design.
    import("./blog-tools.js").then(() => {
      const el = document.querySelector("[data-paper]");
      const w = window as unknown as { BlogTools?: { init: (e: Element) => void } };
      if (live && el && w.BlogTools) w.BlogTools.init(el);
    });
    return () => {
      live = false;
    };
  }, []);

  if (i < 0) return <Navigate to="/" replace />;
  const n = posts[i];
  const nx = posts[(i + 1) % posts.length];
  const at = n.title.indexOf(n.hl);
  const [y, m, d] = n.date.split("-").map(Number);
  const date = MONTHS_SHORT[m - 1] + " " + d + ", " + y;
  const { Body } = n;

  return (
    <>
      <Paper headMargin="clamp(36px,6vw,56px)" footMargin={72}>
        <a
          href={BLOG_BASENAME + "/"}
          data-bt-hide
          {...P("white-space:nowrap;display:inline-block;padding:9px 18px;background:#fff;border:2px solid #111;border-radius:99px;font:700 14px 'DM Sans',sans-serif;transition:translate .2s cubic-bezier(.3,1.5,.5,1)", { h: "translate:-4px 0" })}
        >
          ← All notes
        </a>
        <article style={css("max-width:960px;margin-top:34px")}>
          <div style={css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
            <span style={css(`padding:3px 12px;background:${tagColor[n.tag]};border:2px solid #111;border-radius:99px;font:700 12px ${MONO};text-transform:uppercase;letter-spacing:.04em`)}>{n.tag}</span>
            {n.essay && <span style={css(`padding:3px 11px;background:#111;color:#fff;border-radius:99px;font:700 11px ${MONO};letter-spacing:.06em`)}>ESSAY</span>}
            <span style={css(`font:700 12px ${MONO};opacity:.7`)}>{date} · {n.mins} min read</span>
          </div>
          <h1 style={css("margin:22px 0 0;font:800 clamp(34px,4.6vw,60px)/1.05 Syne,sans-serif;letter-spacing:-.045em;overflow-wrap:break-word")}>
            {n.title.slice(0, at)}
            <span style={css("display:inline-block;padding:0 .12em;background:#ffe680;border:3px solid #111;border-radius:12px")}>{n.hl}</span>
            {n.title.slice(at + n.hl.length)}
          </h1>
          <div style={css("margin-top:32px;padding:18px 22px;background:#ffe680;border:2px solid #111;border-radius:18px")}>
            <div style={css(`font:700 12px ${MONO};letter-spacing:.08em`)}>TL;DR</div>
            <div style={css("margin-top:6px;font:700 19px/1.45 'DM Sans',sans-serif")}>{n.tldr}</div>
          </div>
          <Body components={components} />
          <div data-bt-hide style={css("margin-top:64px;padding-top:26px;border-top:2px solid #111")}>
            <div style={css(`font:700 12px ${MONO};color:#6d3fd6;letter-spacing:.08em`)}>NEXT NOTE</div>
            <a
              href={BLOG_BASENAME + "/" + nx.slug}
              {...P("display:inline-block;margin-top:10px;font:800 clamp(24px,3vw,36px)/1.08 Syne,sans-serif;letter-spacing:-.035em;background-image:linear-gradient(#ffe680,#ffe680);background-repeat:no-repeat;background-position:0 90%;background-size:0% 38%;transition:background-size .35s ease,translate .25s cubic-bezier(.3,1.5,.5,1)", { h: "background-size:100% 38%;translate:6px 0" })}
            >
              {nx.title} →
            </a>
          </div>
        </article>
      </Paper>
    </>
  );
}
