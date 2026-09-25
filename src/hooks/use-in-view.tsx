import { useEffect, useRef, useState } from "react";

// Cold-call-ready V2 polish: shared scroll-reveal primitive for Services'
// card stagger and Roadmap's per-step highlight. Respects
// prefers-reduced-motion by resolving to "already in view" immediately,
// so nothing ever depends on an animation for content to appear.
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.3 },
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
