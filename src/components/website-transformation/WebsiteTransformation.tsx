import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NorthlineMark } from "@/components/lead-journey/primitives";
import { AfterSite, AfterSitePhone, BeforeSite, BrowserFrame, Scaled } from "@/components/homepage/MockSites";
import { C } from "@/components/homepage/tokens";
import roofHero from "@/assets/web/northline-roof-hero.jpg";
import roofTile from "@/assets/web/northline-roof-hero-800.jpg";
import craftTile from "@/assets/web/craftsmanship-800.jpg";

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
// Below 1024px the SAME canvas + timeline runs in a touch layout: a native
// CSS sticky stage (no JS pin, so no iOS pin jump/jitter) scrubbed over a
// short svh-based track, with phone-specific camera/phone geometry.

const W = 1280, H = 800;
const COPPER = "#c98a4b";
const CHAR = "#14110e";
const OLD_BG = "#e9e6dc";
const TIMES = '"Times New Roman", Times, serif';
const SCROLL = "+=118%"; // pinned scroll length
const TOUCH_TRACK = "220svh"; // touch: 100svh sticky frame + 120svh of scrub

// timeline beats (timeline units, mapped to scroll progress)
// (QA #2: establishment shortened most; the sweep keeps its length and so
// gains share; a real hold on the finished site; quick phone proof)
const T = { enter: 0, lineIn: 0.4, sweepStart: 0.65, sweepEnd: 4.25, settle: 4.3, hold: 4.96, mobile: 5.85, end: 6.85 };
const atX = (x: number) => T.sweepStart + (T.sweepEnd - T.sweepStart) * Math.min(1, Math.max(0, x / W));

type Rect = { x: number; y: number; w: number; h: number };
type Piece = { id: string; from: Rect; to: Rect | null; z?: number; old?: React.ReactNode; neu?: React.ReactNode };

const LINKS_OLD = ["Home", "Roofing", "Repairs", "Photo Gallery", "About Us", "Siding & Gutters", "Testimonials", "Contact Us"];
const LINKS_NEW: Record<number, { label: string; x: number; w: number }> = {
  1: { label: "Roofing", x: 760, w: 70 }, 2: { label: "Repairs", x: 846, w: 70 },
  3: { label: "Our work", x: 932, w: 84 }, 4: { label: "About", x: 1032, w: 56 },
};
const SERVICES = [
  { old: "Shingles & Flat Roofs", title: "Full replacement", img: roofTile, pos: "70% 30%" },
  { old: "Repairs & Leaks", title: "Repairs & leaks", img: craftTile, pos: "50% 50%" },
  { old: "Inspections & Gutters", title: "Inspections", img: roofTile, pos: "30% 60%" },
];

const PIECES: Piece[] = [
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
const EXTRAS = (
  <>
    <div data-wt-extra className="absolute text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ left: 64, top: 134, color: COPPER, zIndex: 6 }}>Roof replacement · Repair</div>
    <div data-wt-extra className="absolute flex items-center justify-center rounded-full border border-white/25 text-[16px] text-[#f3eee7]" style={{ left: 316, top: 432, width: 176, height: 56, zIndex: 6 }}>See our work</div>
    <div data-wt-extra className="absolute flex items-center rounded-full px-5 text-[14px] font-semibold" style={{ left: 1110, top: 26, height: 40, background: COPPER, color: CHAR, zIndex: 6 }}>Free estimate</div>
  </>
);

const rect = (r: Rect) => ({ left: r.x, top: r.y, width: r.w, height: r.h });

// Primitive = design blueprint, not a debug box: a faint 1px orange
// hairline, crisp 10px corner ticks, and a whisper of fill.
const TICK = `linear-gradient(${C.orange}, ${C.orange})`;
const BLUEPRINT: React.CSSProperties = {
  boxShadow: "inset 0 0 0 1px rgba(255,136,56,0.32)",
  backgroundColor: "rgba(255,136,56,0.035)",
  backgroundImage: Array(8).fill(TICK).join(", "),
  backgroundSize: "10px 1px, 1px 10px, 10px 1px, 1px 10px, 10px 1px, 1px 10px, 10px 1px, 1px 10px",
  backgroundPosition: "left top, left top, right top, right top, left bottom, left bottom, right bottom, right bottom",
  backgroundRepeat: "no-repeat",
};

function Canvas() {
  return (
    <div data-wt-canvas className="relative h-full w-full overflow-hidden font-sans" style={{ background: OLD_BG }}>
      {/* the new ground, revealed behind the line */}
      <div data-wt-newbg className="absolute inset-0 origin-left" style={{ background: CHAR, willChange: "transform" }} />
      {PIECES.map((p) => (
        <div key={p.id} data-wt-piece={p.id} className="absolute overflow-hidden" style={{ ...rect(p.from), zIndex: p.z ?? 2 }}>
          <div data-wt-old className="absolute inset-0">{p.old}</div>
          {p.neu && <div data-wt-new className="absolute inset-0 opacity-0">{p.neu}</div>}
          <div data-wt-frame className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0" style={BLUEPRINT} />
        </div>
      ))}
      {EXTRAS}
      {/* the Revora rebuild line */}
      <div data-wt-line className="absolute top-0 h-full w-[3px] opacity-0" style={{ left: 0, zIndex: 20, background: C.orange, boxShadow: `0 0 18px 2px ${C.orange}66`, willChange: "transform, opacity" }} />
    </div>
  );
}

// End-state geometry that differs by layout. Desktop values are the
// approved ones; touch keeps the phone inside the frame (no overflow).
type Geo = { camEnd: gsap.TweenVars; phoneFrom: gsap.TweenVars };
const DESKTOP_GEO: Geo = { camEnd: { xPercent: -9, scale: 0.94 }, phoneFrom: { opacity: 0, y: 140, rotate: 7 } };
const TOUCH_GEO: Geo = { camEnd: { xPercent: -7, yPercent: -5, scale: 0.94 }, phoneFrom: { opacity: 0, y: 90, rotate: 7 } };

function buildTimeline(root: HTMLElement, geo: Geo = DESKTOP_GEO) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  tl.to({}, { duration: T.end }, 0);

  gsap.set(q("[data-wt-newbg]"), { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(q("[data-wt-extra]"), { opacity: 0, y: 10 });
  gsap.set(q("[data-wt-phone]"), geo.phoneFrom);

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
  return tl;
}

function Static() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <figure>
        <figcaption className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.faint }}>Before</figcaption>
        <BrowserFrame label="northlineroofing.com / index.html" tone="light"><BeforeSite /></BrowserFrame>
      </figure>
      <figure className="relative">
        <figcaption className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.orange }}>After · rebuilt by Revora</figcaption>
        <BrowserFrame label="northline roofing — design concept"><AfterSite /></BrowserFrame>
        <div className="absolute -bottom-8 right-2 w-[24%] min-w-[96px] overflow-hidden rounded-[18px] p-[4px]" style={{ background: "#05080c", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}>
          <div className="overflow-hidden rounded-[14px]" style={{ aspectRatio: "9 / 19.5" }}><AfterSitePhone /></div>
        </div>
      </figure>
    </div>
  );
}

// The phone mock is authored for the desktop phone (~210px wide); on touch
// layouts render it at that design size and scale it down, so its type
// keeps the same proportions instead of overflowing a smaller phone.
const PHONE_DW = 210;
function ScaledPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setS(el.clientWidth / PHONE_DW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative overflow-hidden rounded-[14px] sm:rounded-[19px]" style={{ aspectRatio: "9 / 19.5" }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHONE_DW, height: (PHONE_DW * 19.5) / 9, transform: `scale(${s})`, visibility: s ? "visible" : "hidden" }}>
        <AfterSitePhone />
      </div>
    </div>
  );
}

// Optional homepage context (the concept route renders without these).
type Props = { id?: string; sub?: string; note?: string };

export default function WebsiteTransformation({ id, sub, note }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [mode] = useState<"pinned" | "touch" | "static">(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "static"
      : window.matchMedia("(min-width: 1024px)").matches ? "pinned" : "touch",
  );

  useLayoutEffect(() => {
    if (mode === "static" || !sectionRef.current || !stageRef.current) return;
    const ctx = gsap.context(() => {
      if (mode === "pinned") {
        const tl = buildTimeline(stageRef.current!);
        ScrollTrigger.create({ trigger: sectionRef.current, start: "top top", end: SCROLL, pin: true, scrub: 0.6, animation: tl });
      } else {
        // the sticky frame does the holding; scrub across the track's stuck range
        const tl = buildTimeline(stageRef.current!, TOUCH_GEO);
        ScrollTrigger.create({ trigger: trackRef.current, start: "top top", end: "bottom bottom", scrub: 0.5, animation: tl });
      }
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
    // heading scrolls in normally; the stage alone holds (sticky) beneath
    // the 72px nav. Phone sized/placed inside the frame. Mobile-only paint
    // savings: no blur filter on the old photo; canvas layout/paint contained.
    return (
      <section ref={sectionRef} id={id} className="relative pt-20" style={{ background: C.navy }}>
        <div className="px-2">{heading}</div>
        <div ref={trackRef} className="relative -mt-[22svh]" style={{ height: TOUCH_TRACK }}>
          <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-4 pb-[6svh] pt-[72px]">
            <div
              ref={stageRef}
              className="relative w-full [&_[data-wt-canvas]]:[contain:layout_paint] [&_[data-wt-piece=photo]_[data-wt-old]_img]:![filter:saturate(0.6)_contrast(0.85)]"
              style={{ maxWidth: "min(720px, calc((100svh - 260px) * 1.6))", perspective: "1400px" }}
            >
              <div data-wt-cam style={{ transformOrigin: "50% 60%", willChange: "transform" }}>
                <BrowserFrame label="northlineroofing.com">
                  <Scaled height={H}><Canvas /></Scaled>
                </BrowserFrame>
              </div>
              <div data-wt-phone className="absolute bottom-[-22%] right-[2%] w-[30%] overflow-hidden rounded-[18px] p-[4px] sm:w-[24%] sm:rounded-[24px] sm:p-[5px]" style={{ background: "#05080c", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.12)", zIndex: 5, willChange: "transform, opacity" }}>
                <ScaledPhone />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
      </div>
    </section>
  );
}
