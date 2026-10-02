import { useRef } from "react";
import { BookCall, SeeWhatWedBuild } from "./Cta";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// The commercial payoff to the transformation: ONE website offer, shown as
// an editorial price composition (no tiers, no cards, no invented scope).

export default function Offer({ onPrimary }: { onPrimary: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-of-in]", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", stagger: 0.08 })
      .from("[data-of-price]", { opacity: 0, y: 28, duration: 1.0, ease: "power3.out" }, 0.15)
      .from("[data-of-join]", { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, 0.55)
      .from("[data-of-care]", { opacity: 0, x: -16, duration: 0.8, ease: "power3.out" }, 0.75);
  });

  return (
    <section ref={root} id="offer" className="relative py-24 md:py-32" style={{ background: C.ink }}>
      <div className={`${CONTAINER} grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20`}>
        <div className="max-w-[500px]">
          <p data-of-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>The website</p>
          <h2 data-of-in className="mt-5 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1.03] tracking-[-0.03em]" style={{ color: C.text }}>
            One website. One straightforward price.
          </h2>
          <p data-of-in className="mt-6 text-[18px] leading-[1.6]" style={{ color: C.muted }}>
            A serious website for a serious business, without a bloated agency package. You see the price before you ever talk to us.
          </p>
          <div data-of-in className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookCall />
            <SeeWhatWedBuild onClick={onPrimary} />
          </div>
        </div>

        {/* the price composition: typography and rhythm, not containers */}
        <div className="lg:border-l" style={{ borderColor: C.line }}>
          <div data-of-price>
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] lg:pl-10" style={{ color: C.faint }}>Website build</p>
            <div className="mt-3 flex items-baseline gap-4 lg:pl-10">
              <span className="font-display text-[clamp(5.2rem,13vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.05em]" style={{ color: C.text }}>$997</span>
              <span className="text-[16px]" style={{ color: C.muted }}>one time</span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-5 lg:mt-12">
            <span data-of-join className="h-px w-16 origin-left lg:w-24" style={{ background: C.orange }} />
            <span className="text-[13px] font-semibold" style={{ color: C.orange }}>+</span>
          </div>

          <div data-of-care className="mt-8 lg:pl-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>Website Care</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-[clamp(2.6rem,5vw,3.8rem)] font-medium leading-none tracking-[-0.03em]" style={{ color: C.text }}>$99</span>
              <span className="text-[16px]" style={{ color: C.muted }}>per month</span>
            </div>
            <p className="mt-8 flex items-center gap-3 text-[17px] font-medium" style={{ color: C.text }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.orange }} />
              No lock-in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
