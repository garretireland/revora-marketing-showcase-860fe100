import { useRef } from "react";
import { BookCall } from "./Cta";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// The close: completes the Find / Choose story with one decision.

export default function FinalClose() {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-fc-a]", { opacity: 0, y: 18, duration: 0.9, ease: "power3.out" })
      .from("[data-fc-b]", { opacity: 0, y: 18, duration: 0.9, ease: "power3.out" }, 0.25)
      .from("[data-fc-rule]", { scaleX: 0, duration: 1.0, ease: "power2.inOut" }, 0.5)
      .from("[data-fc-rest]", { opacity: 0, y: 12, duration: 0.7, ease: "power2.out", stagger: 0.1 }, 0.7);
  }, "top 75%");

  return (
    <section
      id="book"
      className="relative overflow-hidden py-28 md:py-40"
      ref={root}
      style={{ background: `radial-gradient(1100px 560px at 50% 120%, rgba(255,136,56,0.08), transparent 62%), ${C.navy}` }}
    >
      <div className={CONTAINER}>
        <h2 className="max-w-[1000px] font-display text-[clamp(2.4rem,5.6vw,5rem)] font-medium leading-[1.02] tracking-[-0.035em]">
          <span data-fc-a className="block" style={{ color: "rgba(244,241,236,0.45)" }}>You've seen what makes them choose you.</span>
          <span data-fc-b className="mt-2 block" style={{ color: C.text }}>
            Now let's make sure they <span style={{ color: C.orange }}>find</span> you.
          </span>
        </h2>
        <span data-fc-rule className="mt-12 block h-px w-24 origin-left md:mt-14" style={{ background: C.orange }} />
        <div className="mt-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <p data-fc-rest className="max-w-[560px] text-[18px] leading-[1.6]" style={{ color: C.muted }}>
            Book a call and we'll talk through your business, what you're trying to grow, and whether Revora actually makes sense for it.
          </p>
          <div data-fc-rest>
            <BookCall className="px-9 py-5 text-[16px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
