import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AfterSite, AfterSitePhone, BeforeSite, BrowserFrame, Scaled } from "@/components/homepage/MockSites";
import { C } from "@/components/homepage/tokens";
import { Canvas } from "./RebuildCanvas";
import { buildTimeline, H } from "./rebuildTimeline";
import NorthlineCompareSlider from "@/components/concepts/NorthlineCompareSlider";

gsap.registerPlugin(ScrollTrigger);

// WEBSITE TRANSFORMATION -- isolated prototype.
// ONE IDEA: the Revora rebuild line. An orange line sweeps through the
// dated site. Every component it reaches drops to a bare layout primitive
// (an orange hairline frame), then physically moves/resizes onto the
// modern grid and fills with the new design. The ground behind the line
// is the new site; pieces whose new home is still ahead of the line wait
// as primitives until the line reaches it. Then the site settles, holds,
// and the phone proves it's responsive. One pinned stage, one paused
// master timeline scrubbed by ScrollTrigger (reverses naturally).
//
// Below 1024px (Phase 2): the SAME transformation runs via
// NorthlineCompareSlider.tsx instead -- drag-driven, not scroll-scrubbed.
// No sticky track, no ScrollTrigger pin on mobile at all; see that file
// for why that's a legitimate reuse of this exact choreography rather than
// a second, independently maintained one. The PIECES/buildTimeline/Canvas
// engine itself lives in ./rebuildTimeline.tsx and ./RebuildCanvas.tsx now
// (not in this file), purely so this file can export components only --
// see those files' own headers for why.

// Overall pacing (owner feedback, calibrated across a few rounds):
// stretching the pinned scroll distance is the direct way to slow the
// whole transformation down without touching the choreography itself.
// A gentle-start easing was tried in between (reshaping WHERE within the
// pin a given scroll amount landed) but was later removed by request in
// favor of a uniform, linear scroll-to-animation pace throughout -- see
// the ScrollTrigger config below (plain animation: tl binding, no custom
// progress mapping).
const SCROLL = "+=204%"; // pinned scroll length (was "+=118%", then "+=177%")

function Static() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <figure>
        <figcaption className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.faint }}>Before</figcaption>
        <BrowserFrame label="northlineroofing.com / index.html" tone="light"><BeforeSite /></BrowserFrame>
      </figure>
      <figure className="relative">
        <figcaption className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.orange }}>After · rebuilt by Revora</figcaption>
        <BrowserFrame label="northlineroofing.com"><AfterSite /></BrowserFrame>
        <div className="absolute -bottom-8 right-2 w-[24%] min-w-[96px] overflow-hidden rounded-[18px] p-[4px]" style={{ background: "#05080c", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}>
          <div className="overflow-hidden rounded-[14px]" style={{ aspectRatio: "9 / 19.5" }}><AfterSitePhone /></div>
        </div>
      </figure>
    </div>
  );
}

// Optional homepage context (the concept route renders without these).
type Props = { id?: string; sub?: string; note?: string };

export default function WebsiteTransformation({ id, sub, note }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mode] = useState<"pinned" | "touch" | "static">(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "static"
      : window.matchMedia("(min-width: 1024px)").matches ? "pinned" : "touch",
  );

  // Only the desktop "pinned" mode still needs ScrollTrigger at all. Touch
  // mode is now handled entirely inside NorthlineCompareSlider.tsx (its own
  // timeline, its own drag-driven progress) -- nothing to wire up here for
  // it, which is also why TOUCH_TRACK/TOUCH_GEO no longer exist anywhere.
  useLayoutEffect(() => {
    if (mode !== "pinned" || !sectionRef.current || !stageRef.current) return;
    const ctx = gsap.context(() => {
      const tl = buildTimeline(stageRef.current!);
      // Uniform, linear scroll-to-animation mapping (owner feedback: no
      // gentle-start ramp -- consistent speed from the very beginning to
      // the very end). ScrollTrigger's own scrub+animation binding does
      // exactly this: timeline progress tracks scroll progress through the
      // pin 1:1 at every point, with scrub(0.6) only smoothing it in time
      // (no additional spatial easing or lag layered on top).
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: SCROLL,
        pin: true,
        scrub: 0.6,
        animation: tl,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [mode]);

  const heading = (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-10 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>Websites</p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.03em]" style={{ color: C.text }}>
          Same business. Completely different first impression.
        </h2>
      </div>
      {(sub || note) && (
        <div className="max-w-[360px] lg:pb-1.5 lg:text-right">
          {sub && <p className="text-[15px] leading-[1.55]" style={{ color: C.muted }}>{sub}</p>}
          {note && <p className="mt-1.5 text-[11px]" style={{ color: C.faint }}>{note}</p>}
        </div>
      )}
    </div>
  );

  if (mode === "static") {
    return (
      <section id={id} className="px-6 py-20" style={{ background: C.navy }}>
        <div className="-mx-4 mb-10">{heading}</div>
        <Static />
      </section>
    );
  }

  if (mode === "touch") {
    // Natural document-flow height -- no sticky track, no pin, no scroll
    // trapping. NorthlineCompareSlider renders its own stage, drag track,
    // Before/After labels, "Drag to transform" hint, and fictional-concept
    // disclosure; nothing further is needed here.
    return (
      <section id={id} className="relative px-6 py-20" style={{ background: C.navy }}>
        <div className="-mx-4 mb-10">{heading}</div>
        <NorthlineCompareSlider />
      </section>
    );
  }

  // Discoverability cues (Phase 1, refined Phase 2B) -- siblings of
  // data-wt-cam inside stageRef, so they sit on the full stage area but
  // outside the camera's own 3D transform/perspective and outside the
  // simulated browser's own PIECES geometry entirely. Desktop-only now
  // that touch mode no longer shares this DOM shape with it.
  //
  // "Scroll to transform" is now visually heavier (larger text, an orange
  // hairline ring matching the rebuild line's own color, a bouncing
  // chevron) and holds for a much longer window (see buildTimeline()'s
  // HINT_HOLD_UNTIL) -- the actual fix for it being easy to miss was the
  // timing, this is the visual reinforcement on top of that. The bounce is
  // a continuous CSS animation, independent of scroll position; safe to
  // run unconditionally here since this whole branch (pinned/desktop) is
  // only ever reached outside prefers-reduced-motion (that case renders
  // Static() instead, never this).
  const chevronBounce = (
    <span aria-hidden="true" className="inline-flex" style={{ animation: "wtChevronBounce 1.4s ease-in-out infinite" }}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  const cues = (
    <>
      <div data-wt-label-before className="pointer-events-none absolute left-3 top-3 z-10 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ background: "rgba(7,11,17,0.75)", color: "#f4f1ec" }}>
        Before
      </div>
      <div data-wt-label-after className="pointer-events-none absolute right-3 top-3 z-10 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ background: "rgba(7,11,17,0.75)", color: C.orange }}>
        After
      </div>
      <div
        data-wt-hint-scroll
        className="pointer-events-none absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-semibold"
        style={{ background: "rgba(7,11,17,0.88)", color: C.text, boxShadow: `inset 0 0 0 1px ${C.orange}66, 0 14px 32px -12px rgba(0,0,0,0.65)` }}
      >
        Scroll to transform
        <span style={{ color: C.orange }}>{chevronBounce}</span>
      </div>
      <div
        data-wt-hint-down
        className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-medium"
        style={{ background: "rgba(7,11,17,0.78)", color: C.faint }}
      >
        Keep scrolling {chevronBounce}
      </div>
      <style>{`@keyframes wtChevronBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }`}</style>
    </>
  );

  // browser size: fit the viewport height under the heading
  const browserW = "min(1120px, calc((100vh - 230px) * 1.6), 86vw)";
  return (
    <section ref={sectionRef} id={id} className="relative flex h-screen flex-col justify-center gap-8 overflow-hidden" style={{ background: C.navy }}>
      {heading}
      <div ref={stageRef} className="relative mx-auto" style={{ width: browserW, perspective: "1800px" }}>
        <div data-wt-cam style={{ transformOrigin: "50% 60%", willChange: "transform" }}>
          <BrowserFrame label="northlineroofing.com">
            <Scaled height={H}><Canvas /></Scaled>
          </BrowserFrame>
        </div>
        <div data-wt-phone className="absolute bottom-[-6%] right-[-4%] w-[19%] overflow-hidden rounded-[24px] p-[5px]" style={{ background: "#05080c", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.12)", zIndex: 5, willChange: "transform, opacity" }}>
          <div className="overflow-hidden rounded-[19px]" style={{ aspectRatio: "9 / 19.5" }}><AfterSitePhone /></div>
        </div>
        {cues}
      </div>
    </section>
  );
}
