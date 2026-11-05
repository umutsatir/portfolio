import { useEffect, useRef } from "react";

type Opts = {
  skillCount: number;
  skUser: React.RefObject<boolean>;
  setSk: (f: (n: number) => number) => void;
  setActive: (id: string) => void;
};

type Chip = HTMLElement & { _tx?: number; _ty?: number };

export const resetChips = () =>
  document.querySelectorAll<Chip>("[data-chip]").forEach((c) => {
    c.style.translate = "";
    c._tx = c._ty = 0;
  });

/**
 * Imperative page effects, ported 1:1 from the design's componentDidMount:
 * sticker dragging, skill auto-rotate, text scramble/decrypt, hero spotlight,
 * card tilt, magnetic buttons, scroll-velocity marquee, scroll-spy, progress
 * bar and the reveal-on-scroll observers.
 */
export function useHomeEffects({ skillCount, skUser, setSk, setActive }: Opts) {
  const activeRef = useRef("");
  const setActiveRef = useRef(setActive);
  const setSkRef = useRef(setSk);
  setActiveRef.current = setActive;
  setSkRef.current = setSk;

  useEffect(() => {
    const d = document;
    const cl: Array<() => void> = [];
    const on = <K extends keyof DocumentEventMap>(t: Document, e: K, f: (ev: DocumentEventMap[K]) => void) => {
      t.addEventListener(e, f);
      cl.push(() => t.removeEventListener(e, f));
    };

    // ---- draggable stickers
    let drag: { c: Chip; x: number; y: number; tx: number; ty: number; lx: number; hx: number; ly: number; hy: number } | null = null;
    on(d, "pointerdown", (e) => {
      const tgt = e.target as Element | null;
      const c = tgt?.closest?.("[data-chip]") as Chip | null;
      if (!c) return;
      const k = (c.closest("[data-card]") as HTMLElement).getBoundingClientRect();
      const q = c.getBoundingClientRect();
      drag = { c, x: e.clientX, y: e.clientY, tx: c._tx || 0, ty: c._ty || 0, lx: k.left + 8 - q.left, hx: k.right - 8 - q.right, ly: k.top + 8 - q.top, hy: k.bottom - 8 - q.bottom };
      c.setPointerCapture(e.pointerId);
      c.style.cursor = "grabbing";
      c.style.zIndex = "5";
      c.style.scale = "1.12";
      c.style.boxShadow = "8px 9px 0 #111";
      skUser.current = true;
    });
    on(d, "pointermove", (e) => {
      if (!drag) return;
      const c = drag.c;
      c._tx = drag.tx + Math.max(drag.lx, Math.min(drag.hx, e.clientX - drag.x));
      c._ty = drag.ty + Math.max(drag.ly, Math.min(drag.hy, e.clientY - drag.y));
      c.style.translate = c._tx + "px " + c._ty + "px";
    });
    const drop = () => {
      if (!drag) return;
      const c = drag.c;
      c.style.cursor = "";
      c.style.scale = "";
      c.style.boxShadow = "4px 4px 0 #111";
      drag = null;
    };
    on(d, "pointerup", drop);
    on(d, "pointercancel", drop);

    // ---- skills auto-rotate until the visitor touches them
    const ski = setInterval(() => {
      if (!skUser.current) {
        setSkRef.current((s) => (s + 1) % skillCount);
        resetChips();
      }
    }, 4500);
    cl.push(() => clearInterval(ski));

    const bar = d.querySelector<HTMLElement>("[data-bar]");

    // ---- text scramble (rotating role)
    const chars = "!<>-_\\/[]{}=+*^?#01";
    const scramble = (el: HTMLElement & { _s?: number }, txt: string, dur = 500) => {
      if (el._s) cancelAnimationFrame(el._s);
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = txt
          .split("")
          .map((c, i) => (c === " " || i < p * txt.length ? c : chars[Math.floor(Math.random() * chars.length)]))
          .join("");
        if (p < 1) el._s = requestAnimationFrame(step);
      };
      el._s = requestAnimationFrame(step);
    };
    const rot = d.querySelector<HTMLElement>("[data-rotate]");
    if (rot) {
      const w = (rot.dataset.words || "").split("|");
      let i = 0;
      const iv = setInterval(() => {
        i = (i + 1) % w.length;
        scramble(rot, w[i]);
      }, 2600);
      cl.push(() => clearInterval(iv));
    }

    // ---- decrypt-on-hover headline word
    const lett = "abcdefghijklmnopqrstuvwxyz0123456789";
    on(d, "mouseover", (e) => {
      const el = (e.target as Element | null)?.closest?.("[data-decrypt]") as (HTMLElement & { _t?: string; _run?: boolean }) | null;
      if (!el || el._run) return;
      const txt = el._t || (el._t = el.textContent || "");
      el._run = true;
      el.style.width = el.offsetWidth - parseFloat(getComputedStyle(el).paddingLeft) * 2 - 6 + "px";
      const t0 = performance.now();
      const dur = 700;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const k = Math.floor(p * txt.length);
        el.textContent = txt
          .split("")
          .map((c, i) => (i < k ? c : lett[Math.floor(Math.random() * lett.length)]))
          .join("");
        if (p < 1) requestAnimationFrame(step);
        else {
          el.textContent = txt;
          el.style.width = "";
          el._run = false;
        }
      };
      requestAnimationFrame(step);
    });

    // ---- hero spotlight, card tilt, magnetic buttons
    const hero = d.querySelector<HTMLElement>("[data-hero]");
    let tiltEl: HTMLElement | null = null;
    on(d, "mousemove", (e) => {
      const tgt = e.target as Element | null;
      if (hero) {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--hx", e.clientX - r.left + "px");
        hero.style.setProperty("--hy", e.clientY - r.top + "px");
      }
      const t = (tgt?.closest?.("[data-tilt]") as HTMLElement | null) ?? null;
      if (tiltEl && tiltEl !== t) tiltEl.style.transform = "";
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = "perspective(900px) rotateX(" + -py * 9 + "deg) rotateY(" + px * 11 + "deg) translateY(-8px)";
      }
      tiltEl = t;
      let best: { m: HTMLElement; dx: number; dy: number } | null = null;
      let bd = 1e9;
      const ms = [...d.querySelectorAll<HTMLElement>("[data-magnet]")];
      ms.forEach((m) => {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < Math.max(r.width * 0.55, 90) && dist < bd) {
          bd = dist;
          best = { m, dx, dy };
        }
      });
      const b = best as { m: HTMLElement; dx: number; dy: number } | null;
      ms.forEach((m) => {
        if (b && b.m === m) {
          const x = Math.max(-10, Math.min(10, b.dx * 0.15));
          const y = Math.max(-7, Math.min(7, b.dy * 0.22));
          m.style.transition = "transform .25s ease-out";
          m.style.transform = "translate(" + x + "px," + y + "px) scale(1.03)";
        } else if (m.style.transform) {
          m.style.transition = "transform .35s ease-out";
          m.style.transform = "";
        }
      });
    });

    // ---- marquee (scroll-velocity), scroll-spy, progress bar
    const mq = [...d.querySelectorAll<HTMLElement>("[data-marquee]")].map((el) => ({ el, x: 0, dir: +(el.dataset.dir || -1) }));
    let lastY = scrollY;
    let vel = 0;
    let raf = 0;
    let spyT = -1;
    const loop = () => {
      const y = scrollY;
      vel = vel * 0.9 + (y - lastY) * 0.1;
      lastY = y;
      mq.forEach((m) => {
        const half = m.el.scrollWidth / 2;
        m.x += m.dir * (1.1 + Math.min(Math.abs(vel) * 0.6, 14));
        if (m.x <= -half) m.x += half;
        if (m.x > 0) m.x -= half;
        m.el.style.transform = "translateX(" + m.x + "px)";
      });
      if (spyT < 0 || performance.now() - spyT > 120) {
        spyT = performance.now();
        let cur = "";
        ["about", "work", "experience", "contact"].forEach((id) => {
          const el = d.getElementById(id);
          if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) cur = id;
        });
        if (cur !== activeRef.current) {
          activeRef.current = cur;
          setActiveRef.current(cur);
        }
      }
      if (bar) bar.style.width = (scrollY / Math.max(1, d.documentElement.scrollHeight - innerHeight)) * 100 + "%";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    cl.push(() => cancelAnimationFrame(raf));

    // ---- reveal on scroll
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            const t = en.target as HTMLElement;
            t.style.opacity = "1";
            t.style.transform = "none";
            io.unobserve(t);
          }
        }),
      { threshold: 0.12 },
    );
    d.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.9) {
        el.style.opacity = "0";
        el.style.transform = "translateY(50px)";
        el.style.transition = "opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1)";
        io.observe(el);
      }
    });
    const rio = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "none";
            }, (+(el.dataset.i || 0)) * 90);
            rio.unobserve(el);
          }
        }),
      { threshold: 0.2 },
    );
    const baseTransition = new WeakMap<HTMLElement, string>();
    d.querySelectorAll<HTMLElement>("[data-row]").forEach((el, i) => {
      if (!baseTransition.has(el)) baseTransition.set(el, el.style.transition);
      el.dataset.i = String(i);
      el.style.opacity = "0";
      el.style.transform = "translateX(-48px)";
      el.style.transition = baseTransition.get(el) + ", opacity .5s ease, transform .6s cubic-bezier(.2,.7,.2,1)";
      rio.observe(el);
    });
    cl.push(() => {
      io.disconnect();
      rio.disconnect();
    });

    return () => cl.forEach((f) => f());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillCount]);
}
