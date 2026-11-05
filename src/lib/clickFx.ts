/**
 * Click feedback for every link and button: a neo-brutalist "pop" at the
 * pointer — an ink ring plus a few sticker-coloured confetti dots that fly out.
 *
 * The effect lives in its own fixed layer, so it never touches an element's
 * own transform / shadow / animation and works the same on every control.
 */
const COLORS = ["#ffe680", "#b5efcf", "#ffa77a", "#b9defa", "#d9ccff"];
const SKIP = ".bt-bar,.bt-tb,.bt-rm,.bt-note";

function layer() {
  const d = document.createElement("div");
  d.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;z-index:5000;pointer-events:none";
  document.body.appendChild(d);
  return d;
}

function burst(x: number, y: number) {
  const root = layer();
  const done: Promise<unknown>[] = [];

  const ring = document.createElement("i");
  ring.style.cssText = `position:absolute;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;box-sizing:border-box;border:3px solid #111;border-radius:50%`;
  root.appendChild(ring);
  done.push(
    ring.animate(
      [
        { transform: "scale(.2)", opacity: 1 },
        { transform: "scale(2.6)", opacity: 0 },
      ],
      { duration: 480, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" },
    ).finished,
  );

  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.6;
    const r = 34 + Math.random() * 26;
    const s = 7 + Math.random() * 6;
    const dot = document.createElement("i");
    const square = i % 3 === 0;
    dot.style.cssText = `position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;box-sizing:border-box;background:${COLORS[i % COLORS.length]};border:2px solid #111;border-radius:${square ? "2px" : "50%"}`;
    root.appendChild(dot);
    done.push(
      dot.animate(
        [
          { transform: "translate(0,0) rotate(0deg) scale(.4)", opacity: 1 },
          { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) rotate(${square ? 200 : 0}deg) scale(1)`, opacity: 1, offset: 0.65 },
          { transform: `translate(${Math.cos(a) * r * 1.15}px,${Math.sin(a) * r * 1.15 + 10}px) rotate(${square ? 260 : 0}deg) scale(.6)`, opacity: 0 },
        ],
        { duration: 560 + Math.random() * 120, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" },
      ).finished,
    );
  }
  Promise.all(done).finally(() => root.remove());
}

export function initClickFx() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const t = (e.target as Element | null)?.closest?.("a[href], button") as HTMLElement | null;
    if (!t || t.closest(SKIP) || (t as HTMLButtonElement).disabled) return;
    burst(e.clientX, e.clientY);
  });
}
