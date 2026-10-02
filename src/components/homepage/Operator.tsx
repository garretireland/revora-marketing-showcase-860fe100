import { useRef } from "react";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// Operator credibility: a short, calm trust beat. It speaks to understanding
// what happens AFTER a lead arrives (Garret also runs a local-service
// business) -- it does not claim to prove Revora's campaign results.
// `image` is an optional slot for an authentic operator photo later; the
// section is designed to stand on its own without one.

export default function Operator({ image }: { image?: string }) {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-op-in]", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.1 });
  });

  return (
    <section ref={root} id="operator" className="relative py-24 md:py-32" style={{ background: C.navy }}>
      <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20`}>
        <div>
          <p data-op-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>Built by an operator</p>
          <h2 data-op-in className="mt-5 font-display text-[clamp(2.1rem,4vw,3.3rem)] font-medium leading-[1.04] tracking-[-0.03em]" style={{ color: C.text }}>
            We know what happens after the lead comes in.
          </h2>
          {image && (
            <img data-op-in src={image} alt="Garret, Revora" className="mt-10 aspect-[4/5] w-full max-w-[320px] rounded-[6px] object-cover" />
          )}
        </div>
        <div className="lg:pt-12">
          <p data-op-in className="max-w-[560px] text-[18px] leading-[1.65]" style={{ color: C.muted }}>
            Revora is built by a local-service operator. Garret also runs Pristine Property Solutions, where the work doesn't end when a lead comes in. It becomes a phone call, a quote, a scheduled job and work that actually has to get delivered.
          </p>
          <p data-op-in className="mt-8 max-w-[540px] border-l pl-5 font-display text-[clamp(1.3rem,2vw,1.6rem)] font-medium leading-[1.35] tracking-[-0.01em]" style={{ borderColor: C.orange, color: C.text }}>
            That's why we care about the opportunity behind the lead, not just the lead itself.
          </p>
        </div>
      </div>
    </section>
  );
}
