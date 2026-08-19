import { useEffect } from "react";

const CH = "#$%&@X0123456789ABCDEF";

/**
 * Ports the `data-decipher` scramble effect from the Claude Design canvas
 * (componentDidMount): 250ms after mount, every `[data-decipher]` element
 * scrambles at a 34ms interval and resolves one character per two frames
 * after a six-frame lead-in.
 */
export function useDecipher(deps: React.DependencyList = []) {
  useEffect(() => {
    const timers: number[] = [];

    const startTimer = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-decipher]").forEach((el) => {
        const final = el.getAttribute("data-decipher") ?? "";
        let frame = 0;
        const iv = window.setInterval(() => {
          frame++;
          const solved = Math.max(0, Math.floor((frame - 6) / 2));
          if (solved >= final.length) {
            window.clearInterval(iv);
            el.textContent = final;
            return;
          }
          el.textContent = final
            .split("")
            .map((c, i) => (c === " " ? " " : i < solved ? c : CH[Math.floor(Math.random() * CH.length)]))
            .join("");
        }, 34);
        timers.push(iv);
      });
    }, 250);

    return () => {
      window.clearTimeout(startTimer);
      timers.forEach((t) => window.clearInterval(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
