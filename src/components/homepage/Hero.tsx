import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { BookCall, SeeWhatWedBuild } from "./Cta";
import { scrollToFilm } from "./scrollTo";
import { C, CONTAINER, OFFER } from "./tokens";
import heroMonitor from "@/assets/web/hero-monitor-northline-transparent.webp";

// Phase 6B: the hero visual is now a single Higgsfield-rendered monitor
// photo (baked-in three-quarter perspective, orange rim lighting) instead
// of the live-rendered AfterSite/BrowserFrame mockup. AfterSite and
// BrowserFrame are untouched in MockSites.tsx and still used elsewhere
// (WebsiteTransformation's reduced-motion fallback, the live GSAP
// cinematic) -- rollback here is just reverting this file's own diff, not
// anything that risks those components.
//
// Phase 6B refinement: swapped to the owner's refined re-render (cleaner
// bezel/stand edges) -- same 1536x1024 size. The original
// hero-monitor-northline.jpg/.png is kept on disk, untouched, for
// rollback; only this import line changed to point at the new file.
//
// Phase 6B transparent: swapped again to a background-removed version of
// the same refined render. Verified by decoding the PNG's raw alpha
// channel directly (not just checking hasAlpha): outer border/corners are
// alpha=0, monitor body is alpha~253 (effectively opaque). Served as WebP
// (not JPEG) since JPEG can't carry alpha -- 140KB, actually smaller than
// the previous flattened JPEG (236KB). The monitor now sits directly on
// REVORA's navy hero background with no masking needed; the right-edge
// mask below is removed accordingly.

gsap.registerPlugin(ScrollTrigger);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero({ onPrimary }: { onPrimary: () => void }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      // Phase 6B: all rotateX/rotateY removed -- the hero visual is now a
      // flat photo with its own baked-in three-quarter perspective, so a
      // CSS 3D rotation on top of it would compound into a visibly warped
      // double-perspective, not "more depth." Kept: the same fade+rise
      // entrance and the same gentle upward drift on scroll-out, just
      // without any rotation component.
      //
      // Phase 6B release cleanup: the initial-render experiment that
      // removed this entrance entirely is reverted -- it was tested
      // specifically to see if it resolved the transient refresh band; it
      // didn't, and there's no separate evidence this entrance was ever
      // broken, so removing it had no independent justification once that
      // experiment's own goal wasn't met. Restored to its prior timing.
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

      {/* Phase 6B: grid ratio rebalanced 1.02fr/1fr -> 0.95fr/1.05fr and
          items-center -> lg:items-start (desktop only). The text column's
          own max-w-[620px] cap means it was already rendering well under
          that cap at full container width (~566px of ~620px) -- a modest
          rebalance shifts real width to the preview without approaching
          that cap closely enough to risk the hand-set 3-line headline
          wrapping differently than intended. items-start (vs. center)
          aligns both columns from the same top edge instead of centering
          the shorter preview within the taller text column's own height,
          which was the main source of the "unused whitespace" above/below
          it -- a plain Grid alignment keyword, not an offset, so it can't
          introduce overlap or clipping. Mobile keeps its own items-center
          base and single-column stacking untouched either way.

          Phase 6B: lg:min-h-0 added. Root cause of the hero->Diagnosis
          whitespace, verified by reading both sections' own padding (not
          guessed): Hero's own bottom padding (pb-20, unchanged at every
          breakpoint) plus Diagnosis's own top padding (pt-28/md:pt-40,
          untouched, reasonable on its own) already total 192-240px at the
          boundary -- min-h-[100svh] on top of that forces this section to
          always be at least full-viewport-tall regardless of how tall its
          actual content is, so on any desktop viewport taller than the
          content's natural height, the leftover becomes extra blank space
          that (now that the grid is lg:items-start, not centered) collects
          at the bottom of the section, right before Diagnosis. Removing
          the floor at lg: makes the section's height fully content-driven
          at desktop; min-h-[100svh] stays for mobile, which wasn't the
          reported problem and where stacked content already runs closer
          to full height anyway. Diagnosis.tsx itself needed no changes --
          the cause was entirely Hero's own min-height. */}
      {/* Phase 6B correction: the single lg:grid-cols-[0.85fr_1.15fr] ratio
          was only checked against the wrap-safety math at FULL container
          width (1240px) -- live-tested in Chrome at the lg: breakpoint's
          own floor (1024px, the narrowest width that ratio actually
          applies at), it measurably failed: text column rendered at
          384px, while the headline's own lines need ~395px and the CTA
          row needs ~441px (measured via a hidden nowrap clone, not
          guessed) to each stay on one line -- confirmed by screenshot, the
          headline wrapped to 5 lines and both CTA labels wrapped inside
          their buttons at exactly 1024px. Fix: a tiered ratio.
          lg:grid-cols-[1.1fr_0.9fr] holds through the 1024-1279px range,
          giving the text column ~497px at 1024px (497 > 441 CTA
          requirement, ~56px of real margin) -- then xl:grid-cols-[0.85fr_1.15fr]
          takes over at 1280px+, where the text column is already ~476px
          (>441px, ~35px margin) even at that breakpoint's own floor, so
          the more preview-weighted ratio only activates where it's
          actually safe. Verified at 1024px, 1180px, and 1780px viewports
          after this fix -- three clean lines, no CTA wrap, at every width
          tested. */}
      <div className={`${CONTAINER} relative grid min-h-[100svh] lg:min-h-0 items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-10 lg:pt-28`}>
        <div className="max-w-[620px]">
          <p data-hero-in className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>
            {/* deliberate two-line composition (not viewport wrapping) */}
            <span className="block whitespace-nowrap">Websites + lead generation</span>
            <span className="mt-[5px] block whitespace-nowrap">for local service businesses</span>
          </p>
          <h1 data-hero-in className="mt-6 font-display text-[clamp(2.9rem,6.4vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.035em] lg:leading-[1.01]" style={{ color: C.text }}>
            {/* Phase 6B final layout correction: clamp() max lowered from
                5.9rem to 5.4rem. Root cause, found via live bisection, not
                guessed: the text column's pixel width is PERMANENTLY fixed
                at 476px for every viewport >=1280px, because CONTAINER
                itself hits its own max-w-[1240px] cap there and never
                grows again -- but this clamp's vw-driven font size kept
                growing past that same point, reaching its old 5.9rem
                ceiling at exactly 1475px viewport and staying there
                forever on any wider screen (including ultrawide
                monitors). That's not a transient glitch at one width --
                every desktop >=~1420px was permanently 5 lines instead of
                3. Bisected the actual safe ceiling directly against the
                live 476px column (not computed): font-size wraps at 90px,
                clean through 89.5px and every value tested down to 85px.
                5.4rem (86.4px) leaves ~3px of margin below that measured
                threshold. It only takes effect once the vw-driven value
                would exceed it (~1350px+) -- the already-verified-safe
                1024-1280px range is untouched, since 6.4vw stays below
                5.4rem for all of it.

                explicit lines so line 3 can take an OPTICAL offset: the p/y
                descenders of "company they" crowd it at the shared line-height */}
            <span className="block">Look like the</span>
            <span className="block">company they</span>
            <span className="block mt-[8px] lg:mt-[9px]">should <span style={{ color: C.orange }}>choose.</span></span>
          </h1>
          {/* Phase 6B correction, Step 5: measured the actual hero->Diagnosis
              boundary via getBoundingClientRect() in Chrome -- the gap
              between the two sections is exactly 0px; Diagnosis's own
              160px top padding was already there, untouched, and is not
              excessive on its own. The visual impression of "excessive
              whitespace" is not a section-boundary bug at all -- it's a
              consequence of the headline's own approved height (486-510px
              measured, ~53% of the text column's 955px total) next to a
              shorter image, which this task doesn't authorize changing.
              The only legitimately adjustable, evidence-backed lever left
              is this column's own internal margins (not a "gap fix", just
              tightening): mt-7/mt-10/mt-10/mt-8 trimmed by 4-8px each
              below, recovering ~24px total. This is modest by design --
              it does not and cannot fully resolve the visual impression,
              since the headline itself remains the dominant, untouched
              factor. */}
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

        {/* width/height attributes (the image's real intrinsic size) let
            the browser reserve the correct space before the file loads, so
            h-auto never causes a layout shift when it arrives; no explicit
            loading attribute, matching this codebase's existing pattern
            for other above-the-fold hero images (calder-hero.jpg,
            northline-roof-hero.jpg in MockSites.tsx both omit it too) --
            eager is the browser default, which is what an LCP-candidate
            image above the fold should use.

            Phase 6B refinement: lg:mt-16 (headline-top alignment) replaced
            with lg:self-center. Measured cause of whitespace still
            remaining after lg:min-h-0: even with the floor removed, the
            text column's own content (eyebrow+h1+paragraph+CTAs+offer
            strip+film link) is still taller than this image at any
            wrap-safe grid ratio, so with items-start the row's own height
            is set by the text column and the shorter image, pinned to the
            row's top, leaves its own unused space below it before the
            section's pb-20 -- self-center on just this one grid item
            splits that leftover space above/below instead of dropping it
            all beneath the image, without touching the text column's own
            top-alignment or the section's padding. */}
        <div className="relative lg:pl-4 lg:self-center">
          <div data-hero-frame>
            {/* Phase 6B transparent: the right-edge-only mask-image this
                wrapper used to carry is gone. That mask existed only to
                fake a soft edge against an opaque JPEG with a baked-in
                background; this WebP has real alpha (verified by decoding
                actual pixel values, not just the hasAlpha flag), so the
                monitor's own silhouette -- screen, bezel, stand, orange
                rim light -- sits directly against the section's navy
                background with no CSS blending needed on any edge.

                Phase 6B shadow repair: the wrapper's own box-shadow is
                gone. box-shadow draws around an element's rectangular box,
                not its alpha -- with the old opaque JPEG that rectangle
                was invisible except right at the real edge (read as an
                intentional lift-off-the-page shadow), but once ~43% of
                that same rectangle became genuinely transparent (measured
                via full-image alpha heatmap, not guessed), the shadow
                painted directly through the empty space as a visible dark
                rectangular patch, worst at the bottom (60px y-offset) and
                still clearly visible on the left (140px blur). filter:
                drop-shadow() on the img instead reads the image's own
                alpha matte and casts a shadow that hugs the monitor+stand
                silhouette itself, so it naturally disappears everywhere
                the image is already transparent. Values are deliberately
                subtler than the old box-shadow's (24px blur vs 140px,
                0.35 opacity vs 0.6) since a drop-shadow this tight no
                longer needs to fake coverage across the whole rectangle. */}
            <img
              src={heroMonitor}
              alt="Northline Roofing website displayed on a monitor"
              width={1536}
              height={1024}
              // Phase 6B release cleanup: fetchPriority="high" and
              // loading="eager" are kept -- independently correct,
              // low-risk hints for an above-the-fold LCP-candidate image,
              // regardless of the (separate, unresolved) refresh-band
              // investigation that first introduced them. decoding="sync"
              // is reverted back to this codebase's established "async"
              // convention: it was explicitly experimental, didn't
              // resolve the band it was tested against, and has a real,
              // acknowledged cost (blocks main-thread decode) with no
              // demonstrated benefit to offset it.
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="block h-auto w-full"
              style={{ filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.35))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
