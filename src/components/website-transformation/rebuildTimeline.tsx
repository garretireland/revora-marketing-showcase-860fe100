import gsap from "gsap";
import { NorthlineMark } from "@/components/lead-journey/primitives";
import { C } from "@/components/homepage/tokens";
import roofHero from "@/assets/web/northline-roof-hero.jpg";
import roofInstall from "@/assets/web/northline-roof-installation.jpg";
import roofRepair from "@/assets/web/northline-roof-repair.jpg";
import roofInspect from "@/assets/web/northline-roof-inspection.jpg";

// The Northline rebuild's data + timeline-building logic, split out of
// WebsiteTransformation.tsx so that file exports components only (Canvas,
// the default WebsiteTransformation) -- mixing those with plain
// constants/functions in one file breaks React Fast Refresh's ability to
// hot-reload granularly (eslint-plugin-react-refresh's own suggested fix
// for this is exactly "use a new file to share constants or functions
// between components"). No values or logic changed in this move.
//
// This is the ONE shared animation core. Desktop (WebsiteTransformation.tsx)
// drives buildTimeline()'s output via ScrollTrigger's scrub. The mobile
// slider (NorthlineCompareSlider.tsx) drives the exact same kind of
// timeline directly via tl.progress(fraction) from drag position --
// buildTimeline() never creates a ScrollTrigger itself, so both are free
// to drive it however they like.

export const W = 1280;
export const H = 800;
const COPPER = "#c98a4b";
export const CHAR = "#14110e";
export const OLD_BG = "#e9e6dc";
const TIMES = '"Times New Roman", Times, serif';

// timeline beats (timeline units, mapped to scroll/drag progress)
// (QA #2: establishment shortened most; the sweep keeps its length and so
// gains share; a real hold on the finished site; quick phone proof)
export const T = { enter: 0, lineIn: 0.4, sweepStart: 0.65, sweepEnd: 4.25, settle: 4.3, hold: 4.96, mobile: 5.85, end: 6.85 };
const atX = (x: number) => T.sweepStart + (T.sweepEnd - T.sweepStart) * Math.min(1, Math.max(0, x / W));

type Rect = { x: number; y: number; w: number; h: number };
type Piece = { id: string; from: Rect; to: Rect | null; z?: number; old?: React.ReactNode; neu?: React.ReactNode };

const LINKS_OLD = ["Home", "Roofing", "Repairs", "Photo Gallery", "About Us", "Siding & Gutters", "Testimonials", "Contact Us"];
const LINKS_NEW: Record<number, { label: string; x: number; w: number }> = {
  1: { label: "Roofing", x: 760, w: 70 }, 2: { label: "Repairs", x: 846, w: 70 },
  3: { label: "Our work", x: 932, w: 84 }, 4: { label: "About", x: 1032, w: 56 },
};
// Phase 5: each service card now shows its own distinct photo (previously
// "Full replacement" and "Inspections" both reused northline-roof-hero-800
// with only a different crop, and "Repairs & leaks" used an unrelated
// generic craftsmanship stock photo). Positions chosen to keep the actual
// worker/action visible within each card's 368x96 design-px crop.
const SERVICES = [
  { old: "Shingles & Flat Roofs", title: "Full replacement", img: roofInstall, pos: "75% 55%" },
  { old: "Repairs & Leaks", title: "Repairs & leaks", img: roofRepair, pos: "40% 60%" },
  { old: "Inspections & Gutters", title: "Inspections", img: roofInspect, pos: "35% 20%" },
];

export const PIECES: Piece[] = [
  {
    id: "header", from: { x: 0, y: 0, w: W, h: 88 }, to: { x: 0, y: 0, w: W, h: 88 }, z: 5,
    old: (
      <div className="flex h-full items-center justify-between px-6" style={{ background: "linear-gradient(#2d5fb3, #1a3f80)", borderBottom: "4px solid #f2c200", fontFamily: TIMES }}>
        <div className="text-[36px] font-bold italic text-white" style={{ textShadow: "2px 2px 0 #0d2350" }}>NORTHLINE ROOFING</div>
      </div>
    ),
    neu: <div className="flex h-full items-center gap-3 px-16 text-[15px] font-semibold uppercase tracking-[0.28em] text-[#f3eee7]"><NorthlineMark size={34} /> Northline</div>,
  },
  {
    id: "marquee", from: { x: 0, y: 92, w: W, h: 30 }, to: null, z: 4,
    old: <div className="flex h-full items-center justify-center text-[15px] font-bold text-[#c40000]" style={{ background: "#fff7c2", fontFamily: TIMES }}>*** FREE ESTIMATES *** SERVING THE AREA SINCE 1998 *** CALL TODAY ***</div>,
  },
  { id: "navbox", from: { x: 20, y: 140, w: 210, h: 292 }, to: null, z: 3, old: <div className="h-full w-full border-2 border-[#8a8a8a] bg-white" /> },
  ...LINKS_OLD.map((label, i): Piece => {
    const n = LINKS_NEW[i];
    return {
      id: `link-${i}`, from: { x: 34, y: 150 + i * 34, w: 180, h: 28 }, to: n ? { x: n.x, y: 30, w: n.w, h: 28 } : null, z: 6,
      old: <div className="text-[17px] text-[#1a0dab] underline" style={{ fontFamily: TIMES }}>{label}</div>,
      neu: n && <div className="whitespace-nowrap text-[14px] text-white/75">{n.label}</div>,
    };
  }),
  {
    id: "photo", from: { x: 250, y: 190, w: 300, h: 190 }, to: { x: 0, y: 0, w: W, h: 560 }, z: 1,
    old: <img src={roofHero} alt="" className="h-full w-full border-[3px] border-[#777] object-cover" style={{ objectPosition: "60% 40%", filter: "saturate(0.6) contrast(0.85) blur(0.6px)" }} />,
    neu: (
      <div className="relative h-full w-full">
        <img src={roofHero} alt="" className="h-full w-full object-cover" style={{ objectPosition: "62% 40%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(20,17,14,0.92) 0%, rgba(20,17,14,0.55) 45%, rgba(20,17,14,0.1) 100%), linear-gradient(0deg, #14110e 0%, rgba(20,17,14,0) 35%)" }} />
      </div>
    ),
  },
  {
    id: "heading", from: { x: 250, y: 140, w: 700, h: 42 }, to: { x: 64, y: 166, w: 640, h: 150 }, z: 6,
    old: <div className="text-[30px] font-bold text-[#1a3f80]" style={{ fontFamily: TIMES }}>Welcome to Northline Roofing</div>,
    neu: <div className="font-display text-[68px] font-medium leading-[1.0] tracking-[-0.02em] text-[#f3eee7]">Roofing done right, the first time.</div>,
  },
  {
    id: "para", from: { x: 566, y: 190, w: 690, h: 160 }, to: { x: 64, y: 338, w: 480, h: 60 }, z: 6,
    old: <div className="text-[18px] leading-[1.45] text-[#222]" style={{ fontFamily: TIMES }}>We are a family owned roofing company. We do roofing, repairs, siding and gutters. We have lots of experience and do quality work at affordable prices. Please call us for all your roofing needs or send us an email using the form on the contact page.</div>,
    neu: <div className="text-[18px] leading-relaxed text-white/70">Clean installs, honest quotes and a crew that treats your home like their own.</div>,
  },
  {
    id: "cta", from: { x: 1046, y: 16, w: 220, h: 56 }, to: { x: 64, y: 432, w: 236, h: 56 }, z: 7,
    old: <div className="text-right text-[18px] font-bold leading-tight text-[#ffe14d]" style={{ fontFamily: TIMES }}>CALL TODAY!<br /><span className="text-white">(519) 555-0199</span></div>,
    neu: <div className="flex h-full items-center justify-center rounded-full text-[16px] font-semibold" style={{ background: COPPER, color: CHAR }}>Get a free estimate</div>,
  },
  ...SERVICES.map((s, i): Piece => ({
    id: `svc-${i}`, from: { x: 250 + i * 250, y: 400, w: 240, h: 26 }, to: { x: 64 + i * 392, y: 616, w: 368, h: 144 }, z: 6,
    old: <div className="text-[18px] text-[#222]" style={{ fontFamily: TIMES }}>{i === 0 && <b>Services: </b>}{s.old}{i < 2 ? " -" : ""}</div>,
    neu: (
      <div className="h-full overflow-hidden rounded-lg" style={{ background: "#1d1915" }}>
        <img src={s.img} alt="" className="h-[96px] w-full object-cover" style={{ objectPosition: s.pos }} />
        <div className="px-4 py-3 text-[15px] font-medium text-[#f3eee7]">{s.title}</div>
      </div>
    ),
  })),
  {
    id: "counter", from: { x: 250, y: 452, w: 520, h: 54 }, to: null, z: 6,
    old: (
      <div style={{ fontFamily: TIMES }}>
        <div className="inline-block border border-[#888] bg-white px-3 py-1 text-[14px]">Visitors: <b>004812</b></div>
        <div className="mt-1 text-[13px] text-[#666]">Site last updated: March 2014</div>
      </div>
    ),
  },
];

// new-only pieces that assemble in the settle
export const EXTRAS = (
  <>
    <div data-wt-extra className="absolute text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ left: 64, top: 134, color: COPPER, zIndex: 6 }}>Roof replacement · Repair</div>
    <div data-wt-extra className="absolute flex items-center justify-center rounded-full border border-white/25 text-[16px] text-[#f3eee7]" style={{ left: 316, top: 432, width: 176, height: 56, zIndex: 6 }}>See our work</div>
    <div data-wt-extra className="absolute flex items-center rounded-full px-5 text-[14px] font-semibold" style={{ left: 1110, top: 26, height: 40, background: COPPER, color: CHAR, zIndex: 6 }}>Free estimate</div>
  </>
);

export const rect = (r: Rect) => ({ left: r.x, top: r.y, width: r.w, height: r.h });

// Primitive = design blueprint, not a debug box: a faint 1px orange
// hairline, crisp 10px corner ticks, and a whisper of fill.
const TICK = `linear-gradient(${C.orange}, ${C.orange})`;
export const BLUEPRINT: React.CSSProperties = {
  boxShadow: "inset 0 0 0 1px rgba(255,136,56,0.32)",
  backgroundColor: "rgba(255,136,56,0.035)",
  backgroundImage: Array(8).fill(TICK).join(", "),
  backgroundSize: "10px 1px, 1px 10px, 10px 1px, 1px 10px, 10px 1px, 1px 10px, 10px 1px, 1px 10px",
  backgroundPosition: "left top, left top, right top, right top, left bottom, left bottom, right bottom, right bottom",
  backgroundRepeat: "no-repeat",
};

// End-state geometry. Only the desktop values remain here now that the
// mobile experience is drag-driven (NorthlineCompareSlider.tsx) rather than
// a scroll-scrubbed touch layout with its own camera/phone framing.
type Geo = { camEnd: gsap.TweenVars; phoneFrom: gsap.TweenVars };
const DESKTOP_GEO: Geo = { camEnd: { xPercent: -9, scale: 0.94 }, phoneFrom: { opacity: 0, y: 140, rotate: 7 } };

export function buildTimeline(root: HTMLElement, geo: Geo = DESKTOP_GEO) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  tl.to({}, { duration: T.end }, 0);

  gsap.set(q("[data-wt-newbg]"), { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(q("[data-wt-extra]"), { opacity: 0, y: 10 });
  gsap.set(q("[data-wt-phone]"), geo.phoneFrom);

  // Discoverability cues (Phase 1, Task B) -- purely additive overlay
  // elements, keyed to the EXISTING T.* beats below. No existing tween,
  // duration, or T value is touched; these just observe the same timeline.
  // Desktop renders these; the mobile slider doesn't render these specific
  // elements (it has its own "Drag to transform" hint instead), so these
  // four .set()/.to() calls simply no-op there -- harmless either way.
  gsap.set(q("[data-wt-hint-scroll]"), { opacity: 0 });
  gsap.set(q("[data-wt-label-before]"), { opacity: 0 });
  gsap.set(q("[data-wt-label-after]"), { opacity: 0 });
  gsap.set(q("[data-wt-hint-down]"), { opacity: 0 });

  // camera: the browser enters slightly turned, settles; small push during
  // the rebuild; settles flat; then shifts for the phone
  const cam = q("[data-wt-cam]");
  tl.fromTo(cam, { rotateY: 9, rotateX: 4, scale: 0.94 }, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.7, ease: "power3.out" }, T.enter)
    .to(cam, { scale: 1.025, duration: T.sweepEnd - T.sweepStart, ease: "sine.inOut" }, T.sweepStart)
    .to(cam, { scale: 1, duration: 0.8, ease: "power2.out" }, T.settle)
    .to(cam, { ...geo.camEnd, duration: 0.8, ease: "power3.inOut" }, T.mobile);

  // the line arrives, then sweeps; the new ground follows it
  const line = q("[data-wt-line]");
  tl.to(line, { opacity: 1, duration: 0.25, ease: "power1.out" }, T.lineIn)
    .to(line, { x: W, duration: T.sweepEnd - T.sweepStart, ease: "none" }, T.sweepStart)
    .to(q("[data-wt-newbg]"), { scaleX: 1, duration: T.sweepEnd - T.sweepStart, ease: "none" }, T.sweepStart)
    .to(line, { opacity: 0, duration: 0.3 }, T.sweepEnd - 0.1);

  // each component: line reaches it -> bare primitive -> waits until the
  // line reaches its destination -> moves/resizes onto the new grid and
  // fills with the new design (or drops away if it has no place)
  PIECES.forEach((p) => {
    const el = q(`[data-wt-piece="${p.id}"]`);
    const old = q(`[data-wt-piece="${p.id}"] [data-wt-old]`);
    const neu = q(`[data-wt-piece="${p.id}"] [data-wt-new]`);
    const frame = q(`[data-wt-piece="${p.id}"] [data-wt-frame]`);
    // the line reaches a component at its centre ...
    const hit = atX(p.from.x + p.from.w / 2);
    tl.to(frame, { opacity: 0.85, duration: 0.15, ease: "power1.out" }, hit)
      .to(old, { opacity: 0.25, duration: 0.15 }, hit);
    if (!p.to) {
      tl.to(el, { opacity: 0, y: 14, scale: 0.97, duration: 0.35, ease: "power2.in" }, hit + 0.15);
      return;
    }
    // ... and it rebuilds once the line has also reached its new home
    const move = Math.max(hit + 0.2, atX(p.to.x + p.to.w / 2));
    const dur = p.id === "photo" ? 0.9 : 0.6;
    tl.to(el, { left: p.to.x, top: p.to.y, width: p.to.w, height: p.to.h, duration: dur, ease: "power3.inOut" }, move)
      .to(old, { opacity: 0, duration: 0.2 }, move)
      .to(neu, { opacity: 1, duration: 0.35, ease: "power1.out" }, move + dur * 0.45)
      .to(frame, { opacity: 0, duration: 0.22, ease: "power1.in" }, move + dur * 0.5);
  });

  // settle: last new-only pieces assemble, everything locks
  tl.to(q("[data-wt-extra]"), { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, T.settle);

  // responsive proof: phone rises into place beside the desktop
  tl.to(q("[data-wt-phone]"), { opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: "power3.out" }, T.mobile + 0.1);

  // Discoverability cues (Phase 1/2B refinement): "scroll to transform" +
  // BEFORE read during the dated-site window, AFTER + a downward
  // continuation indicator once the new design has settled. All keyed to
  // existing beats -- nothing here shifts T.end or any other beat, so the
  // pinned scroll length and core rebuild choreography are unchanged.
  //
  // Root cause of the original cue being easy to miss: it only became
  // opacity:1 at timeline position 0.3 and was already fading out by 0.5 --
  // a ~0.2-unit fully-visible window, ~0.5-unit window counting the fade
  // ramps. Against the full T.end=6.85 timeline mapped onto SCROLL
  // ("+=118%" of viewport height), that's roughly 7% of the pinned scroll
  // distance (~77px of ~1062px at a 900px viewport) -- easy for a single
  // normal scroll gesture, especially combined with scrub:0.6's smoothing
  // lag, to pass through without ever painting a visible frame.
  //
  // Fix: appear essentially immediately (starts fading in at T.enter
  // itself, not 0.3 units in), and stay fully visible roughly 9x longer --
  // through HINT_HOLD_UNTIL, comfortably into the sweep so a visitor who
  // starts scrolling sees the hint AND the line actually moving at the
  // same time, reinforcing that scrolling is what's doing it.
  const HINT_HOLD_UNTIL = 1.8; // ~26% of the pinned scroll distance, vs. ~3% before
  tl.to(q("[data-wt-hint-scroll]"), { opacity: 1, duration: 0.3 }, T.enter)
    .to(q("[data-wt-label-before]"), { opacity: 1, duration: 0.3 }, T.enter)
    .to(q("[data-wt-hint-scroll]"), { opacity: 0, duration: 0.4 }, HINT_HOLD_UNTIL)
    .to(q("[data-wt-label-before]"), { opacity: 0, duration: 0.4 }, HINT_HOLD_UNTIL)
    .to(q("[data-wt-label-after]"), { opacity: 1, duration: 0.4 }, T.settle + 0.2)
    .to(q("[data-wt-hint-down]"), { opacity: 1, duration: 0.4 }, T.hold);
  return tl;
}
