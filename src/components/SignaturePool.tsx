import { useEffect, useMemo, useRef, useState } from "react";
import { P, css } from "../lib/ui";
import { signerName, timeAgo, type Signer } from "../lib/signatures";

const PALETTE = ["#ffe680", "#ffa77a", "#b5efcf", "#b9defa", "#d9ccff", "#ffc7a1"];

type Look = { bg: string; d: number; cells: boolean[] };

/** Deterministic identicon (5x5, mirrored) + colour + size per address, so a ball never changes between visits. */
function look(seedStr: string): Look {
  let h = 7;
  for (const c of seedStr) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const seed = h;
  const rnd = () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return h / 4294967296;
  };
  const cells: boolean[] = [];
  for (let r = 0; r < 5; r++) {
    const row = [rnd() > 0.45, rnd() > 0.45, rnd() > 0.45];
    [0, 1, 2, 1, 0].forEach((k) => cells.push(row[k]));
  }
  return { bg: PALETTE[seed % 6], d: 56 + ((seed >>> 3) % 4) * 10, cells };
}

/** ENS avatar from the official ENS metadata service (it resolves ipfs / NFT avatars for us). Falls back to the identicon. */
function EnsAvatar({ name }: { name: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={`https://metadata.ens.domains/mainnet/avatar/${encodeURIComponent(name)}`}
      alt=""
      referrerPolicy="no-referrer"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      style={css(`position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;pointer-events:none;opacity:${loaded ? 1 : 0};transition:opacity .35s ease`)}
    />
  );
}

type Body = { r: number; x: number; y: number; vx: number; vy: number };

export type PoolStatus = "loading" | "ok" | "offline";

/**
 * The signature pool: one ball per signer, falling under gravity, colliding, draggable and throwable.
 * Physics is ported from the design (4 sub-steps, 5 contact iterations, restitution .8-.85).
 */
export default function SignaturePool({ items, total, status, onSign }: { items: Signer[]; total: number; status: PoolStatus; onSign: () => void }) {
  const poolRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const bodies = useRef(new Map<string, Body>());
  const active = useRef(false);
  const drag = useRef<string | null>(null);
  const looks = useMemo(() => new Map(items.map((s) => [s.address, look(s.address)])), [items]);

  const defaultInfo =
    status === "offline" ? "// the wall is offline right now" : status === "loading" ? "// loading signatures…" : items.length ? "// hover a ball · drag to throw" : "// be the first to sign";
  const defaultRef = useRef(defaultInfo);
  defaultRef.current = defaultInfo;
  useEffect(() => {
    if (infoRef.current) infoRef.current.textContent = defaultInfo;
  }, [defaultInfo]);

  // keep the simulation bodies in sync with the data: new signers drop in from the top
  useEffect(() => {
    const pool = poolRef.current;
    if (!pool) return;
    const W = pool.clientWidth;
    const have = new Set(items.map((s) => s.address));
    for (const k of [...bodies.current.keys()]) if (!have.has(k)) bodies.current.delete(k);
    let fresh = 0;
    items.forEach((s) => {
      if (bodies.current.has(s.address)) return;
      const r = (looks.get(s.address)?.d ?? 60) / 2;
      bodies.current.set(s.address, { r, x: r + Math.random() * Math.max(1, W - 2 * r), y: -r - fresh++ * 70, vx: (Math.random() - 0.5) * 3, vy: 0 });
    });
  }, [items, looks]);

  useEffect(() => {
    const pool = poolRef.current!;
    const cl: Array<() => void> = [];
    const on = <K extends keyof DocumentEventMap>(t: Document, e: K, f: (ev: DocumentEventMap[K]) => void) => {
      t.addEventListener(e, f);
      cl.push(() => t.removeEventListener(e, f));
    };

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            active.current = true;
            io.disconnect();
          }
        }),
      { threshold: 0.35 },
    );
    io.observe(pool);
    cl.push(() => io.disconnect());

    const ballKey = (t: EventTarget | null) => ((t as Element | null)?.closest?.("[data-ball]") as HTMLElement | null)?.dataset.key ?? null;

    on(document, "pointerdown", (ev) => {
      const k = ballKey(ev.target);
      const b = k && bodies.current.get(k);
      if (!k || !b) return;
      drag.current = k;
      b.vx = b.vy = 0;
      const e = els.current.get(k);
      if (e) {
        e.style.cursor = "grabbing";
        e.style.zIndex = "3";
      }
    });
    on(document, "pointermove", (ev) => {
      const k = drag.current;
      const b = k ? bodies.current.get(k) : null;
      if (!b) return;
      const r = pool.getBoundingClientRect();
      const nx = Math.max(b.r, Math.min(r.width - b.r, ev.clientX - r.left));
      const ny = Math.max(b.r, Math.min(r.height - b.r, ev.clientY - r.top));
      b.vx = Math.max(-30, Math.min(30, nx - b.x));
      b.vy = Math.max(-30, Math.min(30, ny - b.y));
      b.x = nx;
      b.y = ny;
    });
    const up = () => {
      const k = drag.current;
      if (!k) return;
      const e = els.current.get(k);
      if (e) {
        e.style.cursor = "";
        e.style.zIndex = "1";
      }
      drag.current = null;
    };
    on(document, "pointerup", up);
    on(document, "pointercancel", up);
    on(document, "pointerover", (ev) => {
      const k = ballKey(ev.target);
      const info = infoRef.current;
      if (!k || !info) return;
      const e = els.current.get(k)!;
      info.textContent = e.dataset.name + " · " + e.dataset.time + (e.dataset.note ? ' — "' + e.dataset.note + '"' : "");
    });

    let raf = 0;
    const loop = () => {
      const W = pool.clientWidth;
      const H = pool.clientHeight;
      const map = bodies.current;
      const keys = [...map.keys()];
      const bs = keys.map((k) => map.get(k)!);
      const dragged = drag.current ? map.get(drag.current) : null;
      if (active.current) {
        const S = 4;
        const h = 1 / S;
        const wall = (b: Body) => {
          b.x = Math.max(b.r, Math.min(W - b.r, b.x));
          const fl = H - b.r - 3;
          if (b.y > fl) b.y = fl;
        };
        if (dragged) {
          dragged.vx *= 0.8;
          dragged.vy *= 0.8;
        }
        for (let s = 0; s < S; s++) {
          bs.forEach((b) => {
            if (b === dragged) return;
            b.vy += 0.07 * h;
            b.x += b.vx * h;
            b.y += b.vy * h;
            if (b.x < b.r) {
              b.x = b.r;
              if (b.vx < 0) b.vx *= -0.8;
            }
            if (b.x > W - b.r) {
              b.x = W - b.r;
              if (b.vx > 0) b.vx *= -0.8;
            }
            const fl = H - b.r - 3;
            if (b.y > fl) {
              b.y = fl;
              if (b.vy > 0) b.vy = b.vy > 0.5 ? -b.vy * 0.8 : 0;
              b.vx *= 0.995;
            }
          });
          for (let it = 0; it < 5; it++) {
            for (let i = 0; i < bs.length; i++)
              for (let j = i + 1; j < bs.length; j++) {
                const a = bs[i];
                const c = bs[j];
                const dx = c.x - a.x;
                const dy = c.y - a.y;
                const dist = Math.hypot(dx, dy) || 0.001;
                const min = a.r + c.r;
                if (dist >= min) continue;
                const nx = dx / dist;
                const ny = dy / dist;
                const o = min - dist;
                const ad = a === dragged;
                const cd = c === dragged;
                if (ad) {
                  c.x += nx * o;
                  c.y += ny * o;
                } else if (cd) {
                  a.x -= nx * o;
                  a.y -= ny * o;
                } else {
                  a.x -= (nx * o) / 2;
                  a.y -= (ny * o) / 2;
                  c.x += (nx * o) / 2;
                  c.y += (ny * o) / 2;
                }
                const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
                if (rv < 0) {
                  const e = rv < -0.3 ? 0.85 : 0;
                  const j2 = (-(1 + e) * rv) / 2;
                  if (!ad) {
                    a.vx -= j2 * nx;
                    a.vy -= j2 * ny;
                  }
                  if (!cd) {
                    c.vx += j2 * nx;
                    c.vy += j2 * ny;
                  }
                }
              }
            bs.forEach(wall);
          }
        }
        bs.forEach((b) => {
          b.vx *= 0.985;
          b.vy *= 0.985;
        });
      }
      keys.forEach((k, i) => {
        const e = els.current.get(k);
        const b = bs[i];
        if (e) e.style.transform = "translate(" + (b.x - b.r) + "px," + (b.y - b.r) + "px)";
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    cl.push(() => cancelAnimationFrame(raf));
    return () => cl.forEach((f) => f());
  }, []);

  return (
    <section id="signatures" style={css("max-width:1380px;margin:0 auto;padding:100px clamp(18px,4vw,52px) 60px")}>
      <div data-reveal>
        <div ref={poolRef} data-pool style={css("position:relative;height:clamp(460px,52vw,580px);overflow:hidden;background:#b8a4ff;border:3px solid #111;border-radius:32px;box-shadow:10px 10px 0 #111")}>
          <div style={css("position:absolute;left:clamp(16px,2.4vw,30px);top:clamp(16px,2.4vw,28px);z-index:3;pointer-events:none")}>
            <div style={css("font:700 12px 'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em")}>/ signatures</div>
            <div style={css("margin-top:10px;display:inline-block;padding:10px 18px;background:#111;color:#ffe680;border-radius:20px;box-shadow:5px 5px 0 #fff;font:800 clamp(44px,5vw,68px)/1 Syne,sans-serif;letter-spacing:-.05em;transform:rotate(-3deg)")}>
              {total} <span style={css("font-size:.38em;color:#fff;letter-spacing:-.02em")}>signed</span>
            </div>
          </div>
          {items.map((s) => {
            const l = looks.get(s.address)!;
            return (
              <div
                key={s.address}
                ref={(el) => {
                  if (el) els.current.set(s.address, el);
                  else els.current.delete(s.address);
                }}
                data-ball
                data-key={s.address}
                data-name={signerName(s)}
                data-note={s.note ?? ""}
                data-time={timeAgo(s.signed_at)}
                style={css(`position:absolute;left:0;top:0;z-index:1;width:${l.d}px;height:${l.d}px;box-sizing:border-box;border-radius:50%;background:${l.bg};border:3px solid #111;box-shadow:2px 3px 0 #111;overflow:hidden;display:grid;place-items:center;cursor:grab;touch-action:none;user-select:none;will-change:transform`)}
              >
                <div style={css("pointer-events:none;display:grid;grid-template-columns:repeat(5,1fr);width:46%;height:46%;border-radius:6px;overflow:hidden")}>
                  {l.cells.map((on, i) => (
                    <i key={i} style={{ background: on ? "#111" : "transparent" }} />
                  ))}
                </div>
                {s.ens && <EnsAvatar name={s.ens} />}
              </div>
            );
          })}
          <div
            ref={infoRef}
            data-info
            style={css("position:absolute;left:clamp(12px,1.8vw,22px);right:clamp(150px,18vw,230px);bottom:clamp(12px,1.8vw,20px);z-index:4;pointer-events:none;padding:11px 18px;background:#fff;border:3px solid #111;border-radius:99px;box-shadow:4px 4px 0 #111;font:700 13px 'JetBrains Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}
          />
          <button
            onClick={onSign}
            {...P(
              "position:absolute;right:clamp(12px,1.8vw,22px);bottom:clamp(12px,1.8vw,20px);z-index:4;cursor:pointer;padding:12px 20px;background:#ffe680;color:#111;border:3px solid #111;border-radius:99px;box-shadow:4px 4px 0 #111;font:800 16px Syne,sans-serif;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s",
              { h: "transform:translate(-2px,-3px) rotate(-2deg);box-shadow:6px 7px 0 #111" },
            )}
          >
            Sign ↗
          </button>
        </div>
      </div>
    </section>
  );
}
