/**
 * Click feedback for every link and button: the element grows while pressed
 * and eases back on release.
 *
 * Uses the Web Animations API on the individual `scale` property, so it
 * composes with each element's own inline `transform` (rotated stickers,
 * magnetic buttons) and never restarts their CSS animations.
 */
export function initPressFx() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SKIP = ".bt-bar,.bt-tb,.bt-rm,.bt-note";
  let el: HTMLElement | null = null;
  let grow: Animation | null = null;
  let to = 1.1;

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const t = (e.target as Element | null)?.closest?.("a[href], button") as HTMLElement | null;
    if (!t || t.closest(SKIP) || (t as HTMLButtonElement).disabled) return;
    el = t;
    // big cards grow subtly, small buttons noticeably
    to = t.offsetWidth > 400 ? 1.02 : t.offsetWidth > 200 ? 1.06 : 1.12;
    grow?.cancel();
    grow = t.animate([{ scale: "1" }, { scale: String(to) }], {
      duration: 140,
      easing: "cubic-bezier(.3,1.5,.5,1)",
      fill: "forwards",
    });
  });

  const release = () => {
    if (!el || !grow) return;
    const t = el;
    grow.cancel();
    grow = null;
    el = null;
    t.animate([{ scale: String(to) }, { scale: "1" }], { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" });
  };
  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);
}
