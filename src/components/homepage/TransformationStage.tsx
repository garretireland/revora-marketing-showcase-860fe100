import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AfterSite, AfterSitePhone, BeforeSite, BrowserFrame } from "./MockSites";
import { C, CONTAINER } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

// STAGE for the future website-transformation cinematic (the page's one
// scroll-pinned website interaction). Phase 1 = composition + a static
// before/after representation only; the rebuild animation is not built.
// [data-stage] is where the pinned sequence will mount.

export default function TransformationStage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-tx-in]", {
        opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="websites" className="relative overflow-hidden pb-28 pt-20 md:pb-40 md:pt-[88px]" style={{ background: C.navy }}>
      <div className={CONTAINER}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[680px]">
            <p data-tx-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>Websites</p>
            <h2 data-tx-in className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-medium leading-[1.02] tracking-[-0.03em]" style={{ color: C.text }}>
              What we'd do to a typical contractor website.
            </h2>
          </div>
          <p data-tx-in className="max-w-[340px] text-[17px] leading-[1.6]" style={{ color: C.muted }}>
            Same business. Same services. A completely different first impression.
          </p>
        </div>
      </div>

      {/* the stage: wider than the text column so the rebuild has room */}
      <div data-stage className="mx-auto mt-16 w-full max-w-[1440px] px-6 md:mt-24 md:px-10">
        <div data-tx-in className="relative grid items-center gap-10 lg:grid-cols-[0.82fr_auto_1.18fr] lg:gap-8">
          {/* BEFORE */}
          <figure className="relative">
            <figcaption className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.faint }}>
              <span className="h-px w-6" style={{ background: C.faint }} /> Before
            </figcaption>
            <div style={{ filter: "saturate(0.9)", opacity: 0.92 }}>
              <BrowserFrame label="northlineroofing.com / index.html" tone="light">
                <BeforeSite />
              </BrowserFrame>
            </div>
          </figure>

          {/* the transformation axis (orange = transformation) */}
          <div className="flex items-center justify-center gap-3 lg:flex-col lg:gap-4">
            <span className="h-px w-16 lg:h-24 lg:w-px" style={{ background: `linear-gradient(90deg, transparent, ${C.orange})` }} />
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] lg:[writing-mode:vertical-rl]" style={{ color: C.orange }}>Rebuilt by Revora</span>
            <span className="h-px w-16 lg:h-24 lg:w-px" style={{ background: `linear-gradient(90deg, ${C.orange}, transparent)` }} />
          </div>

          {/* AFTER + mobile reveal */}
          <figure className="relative">
            <figcaption className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.text }}>
              <span className="h-px w-6" style={{ background: C.orange }} /> After
            </figcaption>
            <BrowserFrame label="northline roofing — design concept">
              <AfterSite />
            </BrowserFrame>
            <div
              className="absolute -bottom-10 right-[-2%] hidden w-[22%] min-w-[120px] overflow-hidden rounded-[22px] p-[5px] sm:block"
              style={{ background: "#05080c", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12)" }}
            >
              <div className="overflow-hidden rounded-[17px]" style={{ aspectRatio: "9 / 19.5" }}>
                <AfterSitePhone />
              </div>
            </div>
          </figure>
        </div>

        <p className="mt-16 text-center text-[12px]" style={{ color: C.faint }}>
          Fictional business, shown as a design concept. The scroll-driven rebuild arrives in the next phase.
        </p>
      </div>
    </section>
  );
}
