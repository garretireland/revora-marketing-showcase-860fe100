import { useRef } from "react";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// Phase 8C: premium editorial Founder section, built around Garret's real
// photo and first-person story. Previously a short, image-optional trust
// beat (text only, with an unused `image?` slot "for later"); now the
// photo is a required, load-bearing part of the layout, not an accessory.
// Deliberately kept sophisticated and grounded -- no glow/smoke/metric
// treatment like the approved architectural hero, by explicit design
// contrast: that section sells the premium WORK, this one sells the real
// person behind it.
export default function Operator({ image }: { image: string }) {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-op-photo]", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out" })
      .from("[data-op-in]", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.15);
  });

  return (
    <section ref={root} id="operator" className="relative py-24 md:py-32" style={{ background: C.navy }}>
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16`}>
        {/* Large portrait, not a thumbnail -- the whole point of this
            rewrite. 4:5 editorial crop (the source photo is a tight 1:1
            square; 4:5 reads more like an intentional portrait frame than
            a cropped square, without distorting it -- object-position
            tuned toward the top since the subject's face sits in the
            image's upper two-thirds). Understated warm accent (a single
            1px inset ring in the brand orange at low opacity) instead of
            any glow/light effect, matching the "sophisticated, grounded"
            direction -- a frame, not a special effect. */}
        <div data-op-photo className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:max-w-none">
          <div
            className="relative overflow-hidden rounded-[10px]"
            style={{ boxShadow: "0 40px 100px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)" }}
          >
            <img
              src={image}
              alt="Garret Ireland, Founder of Revora Marketing"
              width={1100}
              height={1375}
              loading="lazy"
              decoding="async"
              className="block aspect-[4/5] w-full object-cover"
              style={{ objectPosition: "50% 18%" }}
            />
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 0 1px rgba(255,136,56,0.18)` }} />
          </div>
        </div>

        <div className="lg:pt-2">
          <p data-op-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>Meet the founder</p>
          <h2 data-op-in className="mt-5 font-display text-[clamp(2.1rem,4vw,3.3rem)] font-medium leading-[1.04] tracking-[-0.03em]" style={{ color: C.text }}>
            We know what happens after the lead comes in.
          </h2>
          <p data-op-in className="mt-3 text-[16px] font-semibold" style={{ color: C.orange }}>
            Built by a business owner. For business owners.
          </p>

          <div data-op-in className="mt-8 max-w-[560px] space-y-5 text-[17px] leading-[1.7]" style={{ color: C.muted }}>
            <p>I'm Garret Ireland, founder of Revora Marketing and owner of Pristine Property Solutions, a local home services business.</p>
            <p>I've been the person finding customers, knocking doors, quoting jobs, managing schedules, and delivering the work.</p>
            <p>I know how much effort goes into winning a customer, and how important it is to make the right first impression before that customer ever picks up the phone.</p>
            <p>That's why I built Revora: to help local service businesses look as professional online as they are in person, and create better opportunities to grow.</p>
          </div>

          <p data-op-in className="mt-8 max-w-[540px] border-l pl-5 font-display text-[clamp(1.3rem,2vw,1.6rem)] font-medium leading-[1.35] tracking-[-0.01em]" style={{ borderColor: C.orange, color: C.text }}>
            That's why we care about the opportunity behind the lead, not just the lead itself.
          </p>

          <div data-op-in className="mt-8 border-t pt-6" style={{ borderColor: C.line }}>
            <p className="font-semibold" style={{ color: C.text }}>Garret Ireland</p>
            <p className="mt-1 text-[14px]" style={{ color: C.faint }}>Founder, Revora Marketing</p>
            <p className="text-[14px]" style={{ color: C.faint }}>Owner, Pristine Property Solutions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
