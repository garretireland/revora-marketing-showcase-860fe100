import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { BookCall, SeeWhatWedBuild } from "./Cta";
import { scrollToFilm } from "./scrollTo";
import { C, CONTAINER, OFFER } from "./tokens";
import heroArchitectural from "@/assets/web/hero-candidate-a-architectural.jpg";
import heroArchitectural640 from "@/assets/web/hero-candidate-a-architectural-640.jpg";
import heroArchitectural960 from "@/assets/web/hero-candidate-a-architectural-960.jpg";
import heroArchitectural1350 from "@/assets/web/hero-candidate-a-architectural-1350.jpg";

// Phase 8 release: the hero visual is the approved "A -- Large"
// architectural scene (illuminated arch, monitor on a glowing stone
// platform, floating lead/performance metric cards), chosen after an
// explicit local A/B/Large comparison round (Phase 8A/8B) against both a
// "B -- Centered" candidate and the prior Phase 6B single-monitor
// treatment. That comparison machinery (variantImage/variantScale props,
// the dev-only /concept/hero-compare route) has been removed now that a
// decision is made -- this file goes back to rendering one, single, final
// hero image, same as before Phase 8A ever started.
//
// Rollback: the prior production hero (hero-monitor-northline-transparent
// .webp, a single-monitor photo with real alpha transparency) remains on
// disk, untouched, along with its own PNG masters -- rolling back is
// reverting this file's own diff, not recovering lost assets. The
// B-centered candidate JPEG also remains on disk, unused, for the same
// reason (explored, not chosen, not deleted).

gsap.registerPlugin(ScrollTrigger);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero({ onPrimary }: { onPrimary: () => void }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      // Phase 6B: all rotateX/rotateY removed -- the hero visual is a flat
      // photo with its own baked-in perspective, so a CSS 3D rotation on
      // top of it would compound into a visibly warped double-perspective.
      // Kept: the same fade+rise entrance and the same gentle upward drift
      // on scroll-out.
      gsap.from("[data-hero-in]", { opacity: 0, y: 22, duration: 1.0, ease: "power3.out", stagger: 0.08, delay: 0.1 });
      gsap.from("[data-hero-frame]", { opacity: 0, y: 40, duration: 1.3, ease: "power3.out", delay: 0.3 });
      gsap.to("[data-hero-frame]", {
        y: -40, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden" style={{ background: C.navy }}>
      {/* quiet light: a warm haze behind the site, nothing decorative */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 520px at 78% 42%, rgba(255,136,56,0.07), transparent 65%), linear-gradient(180deg, rgba(7,11,17,0) 70%, #070b11 100%)" }} />

      {/* Phase 6B: grid ratio tiered -- lg:grid-cols-[1.1fr_0.9fr] holds
          through the 1024-1279px range (live-bisected: text column stays
          >=~497px there, clear of the ~441px CTA-row wrap floor), then
          xl:grid-cols-[0.85fr_1.15fr] takes over at 1280px+ where the text
          column is still >=~476px even at that breakpoint's own floor.
          This ratio is the text column's actual safety floor -- Phase 8's
          larger hero image does NOT change it (see the image's own
          lg:absolute positioning below, which grows independently of this
          ratio specifically to avoid reopening the wrap bug this fixed). */}
      <div className={`${CONTAINER} relative grid min-h-[100svh] lg:min-h-0 items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-10 lg:pt-28`}>
        <div className="max-w-[620px]">
          <p data-hero-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>
            {/* deliberate two-line composition (not viewport wrapping) */}
            <span className="block whitespace-nowrap">Websites + lead generation</span>
            <span className="mt-[5px] block whitespace-nowrap">for local service businesses</span>
          </p>
          <h1 data-hero-in className="mt-6 font-display text-[clamp(2.9rem,6.4vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.035em] lg:leading-[1.01]" style={{ color: C.text }}>
            {/* Phase 6B: clamp() max is 5.4rem, live-bisected against the
                text column's own permanently-fixed 476px width at
                viewports >=1280px (CONTAINER caps at 1240px and never
                grows again) -- wraps at 90px, clean through 89.5px down to
                85px tested; 5.4rem (86.4px) leaves ~3px margin. Explicit
                line breaks so line 3 can take an optical offset: the p/y
                descenders of "company they" crowd it at the shared
                line-height otherwise. */}
            <span className="block">Look like the</span>
            <span className="block">company they</span>
            <span className="block mt-[8px] lg:mt-[9px]">should <span style={{ color: C.orange }}>choose.</span></span>
          </h1>
          <p data-hero-in className="mt-6 max-w-[520px] text-[18px] leading-[1.6] md:text-[19px]" style={{ color: C.muted }}>
            Revora builds premium websites for local service businesses. And when you're ready for more opportunities, we build the system that brings them to you.
          </p>

          <div data-hero-in className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookCall />
            <SeeWhatWedBuild onClick={onPrimary} />
          </div>

          {/* transparent offer, stated plainly */}
          <dl data-hero-in className="mt-8 flex flex-wrap items-baseline gap-x-7 gap-y-2 border-t pt-6 text-[14px]" style={{ borderColor: C.line, color: C.faint }}>
            {OFFER.map((o) => (
              <div key={o.value} className="flex items-baseline gap-2">
                <dt className="font-semibold" style={{ color: C.text }}>{o.value}</dt>
                {o.label && <dd>{o.label}</dd>}
              </div>
            ))}
          </dl>

          {/* early door to the acquisition film (full film lives further down) */}
          <a data-hero-in href="#acquisition-film" onClick={(e) => { e.preventDefault(); scrollToFilm(); }} className="group mt-6 inline-flex items-center gap-3.5 text-[14px]" style={{ color: C.muted }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full transition-colors group-hover:bg-white/5" style={{ boxShadow: `inset 0 0 0 1px ${C.orange}` }}>
              <Play size={13} fill={C.orange} color={C.orange} className="ml-0.5" />
            </span>
            <span className="transition-colors group-hover:text-white">See how Revora turns a homeowner into a qualified lead</span>
            <span style={{ color: C.faint }}>· 58 sec</span>
          </a>
        </div>

        {/* This wrapper is the position:relative containing block the
            image's own lg:absolute positioning resolves against (see
            below). */}
        <div className="relative lg:pl-4 lg:self-center">
          <div data-hero-frame>
            {/* Full scenic Higgsfield render, not a transparent cutout
                (confirmed by decoding raw pixel alpha, not just the
                hasAlpha flag: alpha=255/opaque at every corner). Its own
                near-black corners (rgb 3-27 range) are close to but not
                identical to C.navy/C.ink, so a soft mask-image edge fade
                blends the rectangle into the section background instead
                of a hard seam -- no drop-shadow needed, the scene already
                has its own baked-in platform glow/lighting.

                Phase 8 sizing: lg:absolute removes the image from grid
                flow entirely at lg:+, so it contributes nothing to the
                grid's own column-track sizing (an earlier attempt gave it
                an explicit width as a normal in-flow child instead, which
                grew the image column's own `fr` track and stole width
                from the text column -- a real regression, caught and
                fixed before this became the approved version).
                lg:left-0 anchors it to the column's own natural left
                edge, so it only grows further RIGHT, into the page's own
                unused margin space toward the viewport edge -- never left
                into the gap or the headline. The root <section>'s
                existing overflow-hidden clips it at the viewport edge, no
                scrollbar risk. Mobile (below lg:) stays simple, static,
                in-flow w-full. */}
            {/* Responsive delivery: src/srcSet stay the authoritative
                1800px file (unchanged, used as-is by any browser without
                srcset support); 640/960/1350w are smaller re-encodes of
                that same file for narrower viewports. sizes mirrors the
                className's own per-breakpoint widths exactly (900px at
                xl:, 850px at lg:, else the mobile/tablet w-full case) so
                the browser picks the right candidate for how this image
                is ACTUALLY rendered, not a generic 100vw guess. width/
                height stay 1800x1206 (the fallback src's own intrinsic
                size) -- aspect ratio is identical across every tier, so
                CLS reservation is unaffected regardless of which
                candidate loads. */}
            <img
              src={heroArchitectural}
              srcSet={`${heroArchitectural640} 640w, ${heroArchitectural960} 960w, ${heroArchitectural1350} 1350w, ${heroArchitectural} 1800w`}
              sizes="(min-width: 1280px) 900px, (min-width: 1024px) 850px, 100vw"
              alt="Architectural hero scene: a website displayed on a monitor atop a glowing stone platform, with floating lead and performance metric cards and orange light trails"
              width={1800}
              height={1206}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="block h-auto w-full lg:absolute lg:left-0 lg:top-1/2 lg:w-[850px] lg:max-w-none lg:-translate-y-1/2 xl:w-[900px]"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%), linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%), linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
