import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Run a one-time entrance timeline when `ref` scrolls into view. Skipped
// entirely under prefers-reduced-motion (content simply shows).
export function useEnter(ref: RefObject<HTMLElement>, build: (tl: gsap.core.Timeline) => void, start = "top 72%") {
  useLayoutEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start, once: true } });
      build(tl);
    }, ref);
    return () => ctx.revert();
    // build is static per section
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
