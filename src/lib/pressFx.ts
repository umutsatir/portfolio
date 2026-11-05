/**
 * Click feedback for every link and button: on press the element sinks toward
 * its hard shadow, on release it springs back with a small overshoot.
 *
 * Uses the Web Animations API on the individual `scale` / `translate`
 * properties, so it composes with each element's own inline `transform`
 * (rotated stickers, magnetic buttons) and never restarts CSS animations.
 * Elements that define their own `style-active` (class `no-press`) are skipped.
 */
export function initPressFx() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let el: HTMLElement | null = null;
  let down: Animation | null = null;
  let ps = 0.94;

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const t = (e.target as Element | null)?.closest?.("a[href], button") as HTMLElement | null;
    if (!t || t.classList.contains("no-press") || t.closest(".bt-bar,.bt-tb,.bt-rm,.bt-note") || (t as HTMLButtonElement).disabled) return;
    el = t;
    // big cards get a subtler squeeze than small buttons
    ps = t.offsetWidth > 400 ? 0.985 : t.offsetWidth > 200 ? 0.96 : 0.93;
    down?.cancel();
    down = t.animate([{ scale: "1", translate: "0 0" }, { scale: String(ps), translate: "2px 3px" }], {
      duration: 110,
      easing: "ease-out",
      fill: "forwards",
    });
  });

  const release = (e: Event) => {
    if (!el || !down) return;
    const t = el;
    down.cancel();
    down = null;
    el = null;
    // only spring back with a pop if the click really landed on it
    if (e.type === "pointerup" && t.matches(":hover")) {
      t.animate(
        [
          { scale: String(ps), translate: "2px 3px" },
          { scale: "1.06", translate: "-1px -2px", offset: 0.55 },
          { scale: "1", translate: "0 0" },
        ],
        { duration: 420, easing: "cubic-bezier(.3,1.5,.5,1)" },
      );
    }
  };
  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);
}
