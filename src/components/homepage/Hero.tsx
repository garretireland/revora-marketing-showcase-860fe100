import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { BookCall, SeeWhatWedBuild } from "./Cta";
import { scrollToId } from "./scrollTo";
import { AfterSite, BrowserFrame } from "./MockSites";
import { C, CONTAINER, OFFER } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero({ onPrimary }: { onPrimary: () => void }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      // resting depth: the site sits slightly turned toward the copy
      gsap.set("[data-hero-frame]", { rotateY: -7, rotateX: 2, transformOrigin: "60% 50%" });
      // refined entrance
      gsap.from("[data-hero-in]", { opacity: 0, y: 22, duration: 1.0, ease: "power3.out", stagger: 0.08, delay: 0.1 });
      gsap.from("[data-hero-frame]", { opacity: 0, y: 40, rotateX: 8, duration: 1.3, ease: "power3.out", delay: 0.3 });
      // restrained depth: the site settles flatter and drifts as you leave the hero
      gsap.to("[data-hero-frame]", {
        rotateY: 0, rotateX: 0, y: -40, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden" style={{ background: C.navy }}>
      {/* quiet light: a warm haze behind the site, nothing decorative */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 520px at 78% 42%, rgba(255,136,56,0.07), transparent 65%), linear-gradient(180deg, rgba(7,11,17,0) 70%, #070b11 100%)" }} />

      <div className={`${CONTAINER} relative grid min-h-[100svh] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pt-28`}>
        <div className="max-w-[620px]">
          <p data-hero-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>
            {/* deliberate two-line composition (not viewport wrapping) */}
            <span className="block whitespace-nowrap">Websites + lead generation</span>
            <span className="mt-[5px] block whitespace-nowrap">for local service businesses</span>
          </p>
          <h1 data-hero-in className="mt-6 font-display text-[clamp(2.9rem,6.4vw,5.9rem)] font-medium leading-[0.96] tracking-[-0.035em] lg:leading-[1.01]" style={{ color: C.text }}>
            {/* explicit lines so line 3 can take an OPTICAL offset: the p/y
                descenders of "company they" crowd it at the shared line-height */}
            <span className="block">Look like the</span>
            <span className="block">company they</span>
            <span className="block mt-[8px] lg:mt-[9px]">should <span style={{ color: C.orange }}>choose.</span></span>
          </h1>
          <p data-hero-in className="mt-7 max-w-[520px] text-[18px] leading-[1.6] md:text-[19px]" style={{ color: C.muted }}>
            Revora builds premium websites for local service businesses. And when you're ready for more opportunities, we build the system that brings them to you.
          </p>

          <div data-hero-in className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookCall />
            <SeeWhatWedBuild onClick={onPrimary} />
          </div>

          {/* transparent offer, stated plainly */}
          <dl data-hero-in className="mt-10 flex flex-wrap items-baseline gap-x-7 gap-y-2 border-t pt-6 text-[14px]" style={{ borderColor: C.line, color: C.faint }}>
            {OFFER.map((o) => (
              <div key={o.value} className="flex items-baseline gap-2">
                <dt className="font-semibold" style={{ color: C.text }}>{o.value}</dt>
                {o.label && <dd>{o.label}</dd>}
              </div>
            ))}
          </dl>

          {/* early door to the acquisition film (full film lives further down) */}
          <a data-hero-in href="#acquisition-film" onClick={(e) => { e.preventDefault(); scrollToId("acquisition-film-player"); }} className="group mt-8 inline-flex items-center gap-3.5 text-[14px]" style={{ color: C.muted }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full transition-colors group-hover:bg-white/5" style={{ boxShadow: `inset 0 0 0 1px ${C.orange}` }}>
              <Play size={13} fill={C.orange} color={C.orange} className="ml-0.5" />
            </span>
            <span className="transition-colors group-hover:text-white">See how Revora turns a homeowner into a qualified lead</span>
            <span style={{ color: C.faint }}>· 58 sec</span>
          </a>
        </div>

        {/* the product: a premium site, not a dashboard */}
        <div className="relative lg:pl-4" style={{ perspective: "1600px" }}>
          <div data-hero-frame>
            <BrowserFrame label="northline roofing — design concept">
              <AfterSite />
            </BrowserFrame>
          </div>
          <p className="mt-4 text-right text-[12px]" style={{ color: C.faint }}>Design concept by Revora</p>
        </div>
      </div>
    </section>
  );
}
