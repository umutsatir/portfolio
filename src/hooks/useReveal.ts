import { useEffect } from "react";

/**
 * Ports the `[data-reveal]` IntersectionObserver fade-up from the Claude
 * Design canvas: elements below the fold start hidden/offset, then fade
 * and slide in once 15% visible. `staggerMs`, when set, delays each
 * subsequent element's transition by index * staggerMs (Home's variant).
 */
export function useReveal(staggerMs = 0) {
  useEffect(() => {
    let io: IntersectionObserver | undefined;

    const timer = window.setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.style.transition =
                "opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)";
              if (staggerMs) target.style.transitionDelay = `${i * staggerMs}ms`;
              target.style.opacity = "1";
              target.style.transform = "translateY(0)";
              io?.unobserve(target);
            }
          });
        },
        { threshold: 0.15 },
      );
      els.forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
          el.style.opacity = "0";
          el.style.transform = "translateY(44px)";
        }
        io?.observe(el);
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
      io?.disconnect();
    };
  }, [staggerMs]);
}
