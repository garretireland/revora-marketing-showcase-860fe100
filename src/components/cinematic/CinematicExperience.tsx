import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { MEDIA_SLOTS, type MediaSlot } from "./mediaSlots";

// PROTOTYPE V3: cinematography / spatial-composition pass.
//
// Architecture unchanged from V1/V2: GSAP + ScrollTrigger, ONE centralized
// pinned/scrubbed timeline, animation via direct style mutation outside
// React's render cycle, a static/simplified mobile fallback, and a
// prefers-reduced-motion fallback. No second animation library added.
//
// Positioning discipline used throughout this file to avoid GSAP/CSS
// transform conflicts: every element is placed with a STATIC left/top/
// right/bottom (Tailwind or inline style, set once, never touched by
// GSAP). GSAP only ever animates x/y/scale/rotate/opacity/width/height/
// borderRadius/strokeDashoffset. No element mixes a static Tailwind
// translate class with a GSAP transform tween.
//
// V3 does not change the story (see V1/V2 comments for the full beat
// sheet) -- it rebuilds HOW each beat is composed: full-viewport,
// asymmetric, layered foreground/midground/background framing in place
// of V2's centered cards/diagrams. The aerial market (Scene 6) is the
// most substantially rebuilt scene, per direction.
//
// Every visual remains an intentional, honest placeholder: no real
// client work, no real screenshots, no stock/AI imagery, no realistic
// human rendering. Both industry concepts stay explicitly labelled
// DESIGN CONCEPT. Nothing in the lead-flow/qualification scenes uses
// fake names, fake data, or implies automated scoring Revora doesn't
// sell. The aerial/narrowing sequence represents targeted relevant-
// audience attention, never search intent or surveillance.

const SCENE = {
  s1: [0, 10],
  s2: [10, 25],
  s4: [25, 39],
  s5: [39, 46],
  s6: [46, 64],
  s7: [64, 86],
  s9: [86, 93],
  s10: [93, 100],
} as const;

const TOTAL_SCROLL_VH = 13;

// BUG FIX: the site's real Header is `fixed`/z-50 and persists ABOVE this
// entire pinned cinematic stage (it is not scene-scoped, it's a page-level
// element), so any scene content anchored near the top of the viewport can
// render underneath it and get clipped. Header.tsx: `py-4` (16px top +
// 16px bottom) plus its `h-24` (96px) logo = 128px real height. Every
// top-anchored piece of scene text/UI below uses this constant (plus its
// own margin) instead of a guessed magic number.
const NAVBAR_SAFE_PX = 128;

// BUG FIX: the ambitious spatial composition (percentage-width columns
// down to ~32-46%, large display typography, several fixed-pixel absolute
// elements like the Scene 7 ad card) does not hold up at narrower
// desktop/tablet widths -- it visibly breaks (cramped/overlapping text,
// awkward wrapping) anywhere from roughly 900 up through 1200-1300px,
// while the previous 1024px threshold still activated the full desktop
// choreography across most of that broken range. Raised to 1280px so
// every width the desktop composition can't actually accommodate falls
// through to the safer, plain responsive MobileFallback composition
// instead of a half-broken desktop layout.
function useIsDesktopMotion() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1280px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mqDesktop.matches && !mqMotion.matches);
    update();
    mqDesktop.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
    };
  }, []);
  return enabled;
}

// ---- Scene 6, aerial market -------------------------------------------
// 24 audience/home signals distributed across the FULL frame (corners,
// edges, distant background, near foreground), not clustered center.
// `y` doubles as a depth cue: larger y (lower on screen) reads as nearer
// foreground and is rendered slightly bigger/brighter.
const CROWD_NODES = [
  { x: 6, y: 12 }, { x: 18, y: 8 }, { x: 32, y: 15 }, { x: 47, y: 6 },
  { x: 63, y: 11 }, { x: 80, y: 9 }, { x: 92, y: 18 }, { x: 10, y: 28 },
  { x: 24, y: 35 }, { x: 38, y: 30 }, { x: 55, y: 26 }, { x: 70, y: 32 },
  { x: 86, y: 38 }, { x: 95, y: 50 }, { x: 74, y: 55 }, { x: 58, y: 60 },
  { x: 42, y: 52 }, { x: 27, y: 58 }, { x: 12, y: 50 }, { x: 8, y: 72 },
  { x: 22, y: 80 }, { x: 38, y: 86 }, { x: 54, y: 82 }, { x: 68, y: 90 },
];
const TARGET_INDEX = 14;
const TARGET_NODE = CROWD_NODES[TARGET_INDEX];
// Narrowing happens in three progressive waves rather than one, so it
// reads as the camera moving through the market and reconsidering
// different areas, not a single static fade. Never "these people are
// searching right now" -- pure relevance narrowing.
const WAVE1_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const WAVE2_INDICES = [12, 13, 15, 16, 17, 18, 19, 20];
const WAVE3_INDICES = [21, 22, 23];

function Node({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  // BUG FIX: the original 0.2-0.55 opacity / 5-14px range read as an
  // essentially empty map with one orange dot -- "many signals" needs to
  // actually register as many before any narrowing begins. Raised to a
  // clearly visible baseline; still neutral/light, never orange, per
  // instruction ("do not make 24 glowing orange dots").
  const size = 7 + (y / 100) * 11;
  const baseOpacity = 0.38 + (y / 100) * 0.42;
  return (
    <div
      data-node
      className={`absolute rounded-full ${active ? "bg-accent" : "bg-primary-foreground"}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        opacity: active ? 1 : baseOpacity,
      }}
    />
  );
}

// Five separable "layers" of a concept website used for the reconstruction
// in Scene 4: nav, media block, headline, subcopy, CTA, in that fixed DOM
// order (their VISUAL placement differs per concept via absolute
// positioning, decoupled from this exit-vector order).
const LAYER_EXIT = [
  { x: -260, y: -80, rotate: -14, scale: 0.7 }, // nav strip
  { x: 320, y: 40, rotate: 10, scale: 0.8 }, // media block
  { x: -300, y: 90, rotate: -8, scale: 0.85 }, // headline
  { x: 280, y: 160, rotate: 7, scale: 0.85 }, // subcopy
  { x: 0, y: 260, rotate: 0, scale: 0.5 }, // CTA
];

// Renders a media slot's real asset once one is configured (see
// mediaSlots.ts), otherwise renders `placeholder` unchanged. Desktop-only
// by construction: it's only ever mounted inside DesktopCinematic's scene
// tree, so a future video source here can never reach mobile. A video slot
// is always given a poster and never autoplays without one, and always
// starts `preload="none"` so no bytes download until a real src exists.
function SceneMedia({ slot, placeholder }: { slot: MediaSlot; placeholder: React.ReactNode }) {
  const src = slot.desktopSrc;
  if (!src) return <>{placeholder}</>;
  if (slot.kind === "video") {
    return (
      <video
        className="h-full w-full object-cover"
        poster={slot.posterSrc}
        muted
        loop
        playsInline
        preload="none"
        autoPlay
      >
        <source src={src} />
      </video>
    );
  }
  return <img className="h-full w-full object-cover" src={src} alt="" />;
}

// DesktopCinematic's timeline bakes window.innerWidth/innerHeight into its
// tween VALUES once, at build time (ScrollTrigger.refresh() alone only
// recalculates scroll DISTANCE, not those baked pixel targets). A real
// desktop window resize -- without crossing the 1024px breakpoint that
// already remounts via useIsDesktopMotion -- would otherwise leave the
// porthole/offer/descent tweens animating toward stale coordinates. A
// debounced width bucket forced into `key` gives the cheapest correct fix:
// a clean remount re-runs the whole effect with fresh vw/vh, reusing the
// existing, already-correct ctx.revert()/ScrollTrigger cleanup as the
// unmount path, rather than hand-writing a second imperative rebuild path.
function useResizeBucket() {
  const [bucket, setBucket] = useState(() => Math.round(window.innerWidth / 100));
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setBucket(Math.round(window.innerWidth / 100)), 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return bucket;
}

export default function CinematicExperience() {
  const desktopMotion = useIsDesktopMotion();
  const resizeBucket = useResizeBucket();
  return desktopMotion ? <DesktopCinematic key={resizeBucket} /> : <MobileFallback />;
}

// Reads a point at a fraction along an SVG path -- used to move a small
// "opportunity" dot along the already-drawing connector lines in Scenes 9
// and 10, so the orange signal visibly travels rather than just having
// its line grow. Native SVG DOM API only, no new dependency.
function followPath(path: SVGPathElement | null, dot: SVGCircleElement | null, fraction: number) {
  if (!path || !dot) return;
  const len = path.getTotalLength();
  const pt = path.getPointAtLength(Math.max(0, Math.min(1, fraction)) * len);
  dot.setAttribute("cx", String(pt.x));
  dot.setAttribute("cy", String(pt.y));
}

function DesktopCinematic() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const path9Ref = useRef<SVGPathElement>(null);
  const dot9Ref = useRef<SVGCircleElement>(null);
  const path10Ref = useRef<SVGPathElement>(null);
  const dot10Ref = useRef<SVGCircleElement>(null);
  // Qualification scene (Scene 7) storytelling pass -- the connector is
  // split into two legs (card -> checkpoint, checkpoint -> terminus) so a
  // single travelling dot can visibly pause/hand off at the "Qualify."
  // decision point rather than gliding through it. Same followPath pattern
  // as dot9/dot10 above, one ref pair per leg.
  const path7aRef = useRef<SVGPathElement>(null);
  const dot7aRef = useRef<SVGCircleElement>(null);
  const path7bRef = useRef<SVGPathElement>(null);
  const dot7bRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const stage = stageRef.current;
    const wrapper = wrapperRef.current;
    if (!stage || !wrapper) return;

    const ctx = gsap.context(() => {
      const q = (sel: string) => stage.querySelectorAll(sel);
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Every scene is `position: absolute, inset: 0` and stacked in DOM
      // order -- an inactive scene sitting opacity:0 on top of the active
      // one would otherwise silently swallow clicks meant for whatever is
      // actually visible underneath it (e.g. Scene 1's CTAs, or the
      // Book-a-Call button in Scene 9). pointerEvents is set in lockstep
      // with opacity everywhere a scene fades in/out below, never on its
      // own, so only the genuinely visible scene is ever clickable.
      gsap.set(q('[data-scene]:not([data-scene="1"])'), { opacity: 0, pointerEvents: "none" });
      gsap.set(q('[data-scene="1"]'), { opacity: 1, pointerEvents: "auto" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=" + vh * TOTAL_SCROLL_VH,
          scrub: 0.6,
          pin: stage,
          anticipatePin: 1,
        },
      });

      const crossfade = (fromScene: string, toScene: string, at: number, dur = 1.6) => {
        // pointerEvents flips at the START of each fade (not the end) for
        // the outgoing scene, and at the START for the incoming one too --
        // GSAP applies a non-tweenable property like pointerEvents
        // immediately rather than interpolating it, so this hands off
        // clickability at the moment the crossfade begins, which is the
        // safer side to err on for a scrubbed (scroll-linked, not
        // autoplaying) timeline.
        tl.to(q(`[data-scene="${fromScene}"]`), { opacity: 0, pointerEvents: "none", duration: dur, ease: "none" }, at);
        tl.to(q(`[data-scene="${toScene}"]`), { opacity: 1, pointerEvents: "auto", duration: dur, ease: "none" }, at);
      };

      // ==== SCENE 1 -- REVORA, ACT-TITLE ======================================
      const s1 = SCENE.s1[0];
      const s1End = SCENE.s1[1];
      // BUG FIX: this tween previously only moved/scaled the hero, never
      // faded it -- it stayed at opacity 1 for the entire scene while the
      // act-title tagline (an absolute, centered overlay) faded in directly
      // on top of it, producing a sustained double-exposure of both text
      // systems. The hero must now actually leave before the tagline holds
      // the same central space: it fades fully out almost immediately,
      // the tagline cross-dissolves in as it clears, then holds alone for
      // a real cinematic beat before fading out ahead of the Scene 2
      // crossfade.
      tl.to(q('[data-s="1-hero"]'), { yPercent: -8, scale: 0.95, opacity: 0, duration: 1.6, ease: "none" }, s1 + 0.1);
      tl.to(q('[data-s="1-tagline"]'), { opacity: 1, scale: 1, duration: 1.4 }, s1 + 1.0);
      tl.to(q('[data-s="1-tagline"]'), { opacity: 0, duration: 1.2 }, s1End - 1.5);
      crossfade("1", "2", SCENE.s2[0]);

      // ==== SCENE 2 -- THE DIGITAL BUILD + THE FIRST DIVE ======================
      // The laptop/screen object now has real physical presence: it enters
      // from the right with a perspective tilt, approaches (grows, tilt
      // resolves) while supporting copy holds the opposite (left) third of
      // the frame, then the dive itself grows the SAME element until its
      // bezel crosses all four viewport edges and the destination website
      // (already mounted, real size, centered underneath) is fully visible.
      // No crossfade, no empty intermediary state.
      const s2 = SCENE.s2[0];
      const s2End = SCENE.s2[1];
      const approachStart = s2 + 1;
      const approachEnd = s2 + 6;
      const s2DiveStart = s2 + 7;

      gsap.set(q('[data-s="2-porthole"]'), {
        opacity: 0,
        width: 620,
        height: 390,
        borderRadius: 20,
        x: vw * 0.16,
        y: 10,
        rotateY: -24,
        rotateX: 4,
        scale: 0.82,
        transformPerspective: 1400,
      });
      gsap.set(q('[data-s="2-piece"]'), { opacity: 0, y: 14 });
      gsap.set(q('[data-s="2-reveal"]'), { opacity: 1 });
      gsap.set(q('[data-s="2-bezeldeco"]'), { opacity: 1 });
      gsap.set(q('[data-s="2-desk"]'), { opacity: 0 });

      tl.to(q('[data-s="2-intro-copy"]'), { opacity: 1, duration: 1.2 }, s2 + 0.3)
        .to(q('[data-s="2-intro-copy"]'), { opacity: 0, duration: 1 }, s2DiveStart - 1.5);
      tl.to(q('[data-s="2-desk"]'), { opacity: 1, duration: 1.2 }, s2 + 0.3)
        .to(q('[data-s="2-desk"]'), { opacity: 0, duration: 1 }, s2DiveStart - 0.5);
      tl.to(q('[data-s="2-porthole"]'), { opacity: 1, duration: 1.4 }, s2 + 0.4);
      // Approach: the object turns to face camera and grows as it nears.
      tl.to(
        q('[data-s="2-porthole"]'),
        { x: 0, y: 0, rotateY: 0, rotateX: 0, scale: 1.08, duration: approachEnd - approachStart, ease: "power1.inOut" },
        approachStart,
      );
      tl.to(q('[data-s="2-piece"]'), { opacity: 1, y: 0, duration: 1, stagger: 0.4 }, approachStart + 1.4);

      tl.to(
        q('[data-s="2-porthole"]'),
        { width: vw, height: vh, borderRadius: 0, x: 0, y: 0, scale: 1, duration: s2End - s2DiveStart, ease: "power1.in" },
        s2DiveStart,
      );
      tl.to(q('[data-s="2-bezeldeco"]'), { opacity: 0, duration: (s2End - s2DiveStart) * 0.5 }, s2DiveStart + (s2End - s2DiveStart) * 0.35);
      tl.to(q('[data-s="2-construction"]'), { opacity: 0, duration: 1.5, ease: "power1.in" }, s2DiveStart);

      crossfade("2", "4", SCENE.s4[0]);

      // ==== SCENE 4 -- WHAT REVORA CAN BUILD (full-frame reconstruction) =======
      const s4 = SCENE.s4[0];
      gsap.set(q('[data-s="4-concept-a"]'), { opacity: 1 });
      gsap.set(q('[data-s="4-concept-b"]'), { opacity: 0 });
      gsap.set(q('[data-s="4-piece-a"]'), { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });

      tl.to(
        q('[data-s="4-piece-a"]'),
        {
          opacity: 0,
          x: (i: number) => LAYER_EXIT[i % LAYER_EXIT.length].x,
          y: (i: number) => LAYER_EXIT[i % LAYER_EXIT.length].y,
          rotate: (i: number) => LAYER_EXIT[i % LAYER_EXIT.length].rotate,
          scale: (i: number) => LAYER_EXIT[i % LAYER_EXIT.length].scale,
          duration: 3.2,
          stagger: 0.28,
          ease: "power1.in",
        },
        s4 + 2,
      );
      tl.to(q('[data-s="4-concept-a"]'), { opacity: 0, duration: 1 }, s4 + 6.5);

      gsap.set(q('[data-s="4-piece-b"]'), {
        opacity: 0,
        x: (i: number) => -LAYER_EXIT[i % LAYER_EXIT.length].x,
        y: (i: number) => -LAYER_EXIT[i % LAYER_EXIT.length].y,
        rotate: (i: number) => -LAYER_EXIT[i % LAYER_EXIT.length].rotate,
        scale: (i: number) => LAYER_EXIT[i % LAYER_EXIT.length].scale,
      });
      tl.to(q('[data-s="4-concept-b"]'), { opacity: 1, duration: 0.5 }, s4 + 7.2);
      tl.to(q('[data-s="4-piece-b"]'), { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 3.2, stagger: 0.28, ease: "power1.out" }, s4 + 7.7);
      crossfade("4", "5", SCENE.s5[0]);

      // ==== SCENE 5 -- THE PIVOT ================================================
      // The offer originates from roughly where the Landscaping concept's
      // own CTA sits, detaches, and travels/grows across a real portion of
      // the viewport toward center before shrinking into the accent dot
      // that opens Scene 6 -- the camera follows one continuing object.
      const s5 = SCENE.s5[0];
      const offerStartLeft = vw * 0.7;
      const offerStartTop = vh * 0.68;
      // CONTINUITY FIX: the offer now travels to the EXACT screen position
      // Scene 6's signal dot occupies (TARGET_NODE's own coordinates),
      // instead of a generic screen-center point. That means the object
      // that shrinks into a dot here is, spatially, the SAME object that's
      // already sitting there the instant the crossfade into Scene 6
      // happens -- "the offer becomes the signal," not "a similar-looking
      // dot appears somewhere else."
      const offerDestLeft = vw * (TARGET_NODE.x / 100);
      const offerDestTop = vh * (TARGET_NODE.y / 100);
      gsap.set(q('[data-s="5-site"]'), { opacity: 1, scale: 1 });
      gsap.set(q('[data-s="5-offer"]'), { x: 0, y: 0, scale: 1, borderRadius: 12 });
      gsap.set(q('[data-s="5-field"]'), { opacity: 0, scale: 0.6 });
      // BUG FIX: the receding site used to fade all the way to opacity 0,
      // leaving a long stretch of flat, featureless navy (the bare stage
      // background) with only the CTA floating in it while it travelled --
      // "an empty screen with one button." It now settles at a low but
      // non-zero opacity instead: the Landscaping concept's shapes/colours
      // stay faintly visible as a receding backdrop for the whole journey,
      // so there is always intentional environmental context on screen,
      // not a blank page.
      tl.to(q('[data-s="5-site"]'), { opacity: 0.16, scale: 0.85, x: -40, duration: 2.6, ease: "power1.in" }, s5 + 1);
      // BUG FIX: the pivot copy used to stay fully visible (~s5+2.4 to
      // ~s5+4.5) at the exact moment/position the offer button below
      // arrived at screen-center and scaled up 1.35x (~s5+2.6 to s5+4.8) --
      // the two occupied the same space at the same time. The copy now
      // fully clears before the offer begins its move, so they are never
      // on screen together in the same place.
      tl.to(q('[data-s="5-copy"]'), { opacity: 1, duration: 0.8 }, s5 + 0.6).to(q('[data-s="5-copy"]'), { opacity: 0, duration: 0.8 }, s5 + 2.0);
      // A soft field of light grows in behind the offer as it detaches and
      // travels -- this is the "environmental/contextual composition"
      // during the transit itself (never just a bare button crossing blank
      // navy), and it doubles as a visual foreshadow of the market/signal
      // glow the offer is about to become in Scene 6.
      tl.to(q('[data-s="5-field"]'), { opacity: 1, scale: 1, duration: 2.4, ease: "power1.out" }, s5 + 2.6);
      tl.to(
        q('[data-s="5-offer"]'),
        { x: offerDestLeft - offerStartLeft, y: offerDestTop - offerStartTop, scale: 1.35, duration: 2.0, ease: "power1.out" },
        s5 + 3.0,
      );
      tl.to(
        q('[data-s="5-offer"]'),
        { scale: 0.05, borderRadius: 999, duration: 1.5, ease: "power1.inOut" },
        s5 + 5.3,
      );
      tl.to(q('[data-s="5-field"]'), { opacity: 0, duration: 1.2 }, s5 + 5.6);
      crossfade("5", "6", SCENE.s6[0]);

      // ==== SCENE 6 -- THE MARKET, NARROWING, DESCENT (full-viewport world) ====
      const s6 = SCENE.s6[0];
      const s6End = SCENE.s6[1];
      gsap.set(q('[data-s="6-mapwrap"]'), { transformOrigin: `${TARGET_NODE.x}% ${TARGET_NODE.y}%`, scale: 1, x: 0, y: 0, opacity: 1 });
      gsap.set(q('[data-s="6-node"]'), { opacity: 0 });
      gsap.set(q('[data-s="6-signal"]'), { opacity: 0, scale: 1 });
      gsap.set(q('[data-s="6-neighborhood"]'), { opacity: 0 });
      gsap.set(q('[data-s="6-street"]'), { opacity: 0 });
      gsap.set(q('[data-s="6-exterior"]'), { opacity: 0 });
      gsap.set(q('[data-s="6-copy"]'), { opacity: 0 });

      tl.to(q('[data-s="6-node"]'), { opacity: 1, duration: 1, stagger: 0.09 }, s6 + 0.3);
      // Subtle camera drift across the market while many signals are visible.
      tl.to(q('[data-s="6-mapwrap"]'), { x: -vw * 0.02, y: -vh * 0.015, scale: 1.04, duration: 5, ease: "sine.inOut" }, s6 + 1);
      tl.to(q('[data-s="6-copy"]'), { opacity: 1, duration: 1.2 }, s6 + 2).to(q('[data-s="6-copy"]'), { opacity: 0, duration: 1 }, s6 + 9);

      const wave1Selector = WAVE1_INDICES.map((i) => `[data-node-i="${i}"]`).join(",");
      const wave2Selector = WAVE2_INDICES.map((i) => `[data-node-i="${i}"]`).join(",");
      const wave3Selector = WAVE3_INDICES.map((i) => `[data-node-i="${i}"]`).join(",");
      // BUG FIX: each wave used to fade straight from its base state to
      // near-invisible in one flat tween -- against the old low baseline
      // opacity that read as barely-there candidates simply vanishing, not
      // "the market was searched, these were considered, then ruled out."
      // Each wave now gets a brief CONSIDER beat (a visible brighten +
      // slight scale-up) immediately before the REJECT fade, so the
      // reduction reads as three deliberate decisions -- many -> several
      // (24 -> 12) -> few (12 -> 4) -> one (4 -> 1) -- not a single dissolve.
      tl.to(q(wave1Selector), { opacity: 0.85, scale: 1.35, duration: 0.5, stagger: 0.04 }, s6 + 4.0);
      tl.to(q(wave1Selector), { opacity: 0.05, scale: 1, duration: 1.6, stagger: 0.08 }, s6 + 4.7);
      // Camera reframes toward the surviving cluster before the next wave.
      tl.to(q('[data-s="6-mapwrap"]'), { x: -vw * 0.06, y: -vh * 0.03, scale: 1.5, duration: 3, ease: "power1.inOut" }, s6 + 7);
      tl.to(q(wave2Selector), { opacity: 0.85, scale: 1.35, duration: 0.5, stagger: 0.06 }, s6 + 7.7);
      tl.to(q(wave2Selector), { opacity: 0.08, scale: 1, duration: 1.6, stagger: 0.1 }, s6 + 8.4);
      // Third, tighter reframe -- the camera commits toward the target's
      // immediate neighbourhood before the final wave.
      tl.to(q('[data-s="6-mapwrap"]'), { x: -vw * 0.09, y: -vh * 0.05, scale: 2.2, duration: 1.5, ease: "power1.inOut" }, s6 + 10);
      tl.to(q(wave3Selector), { opacity: 0.85, scale: 1.35, duration: 0.45, stagger: 0.08 }, s6 + 10.3);
      tl.to(q(wave3Selector), { opacity: 0.06, scale: 1, duration: 1.4, stagger: 0.1 }, s6 + 10.85);
      tl.to(q('[data-s="6-signal"]'), { opacity: 1, scale: 1.6, duration: 1.4, ease: "power1.out" }, s6 + 12);

      // Descent: three nested depth layers cross-scale in sequence so the
      // illusion reads as aerial -> neighbourhood -> street -> home rather
      // than one abrupt jump.
      const descendStart = s6 + 12.5;
      const dTotal = s6End - descendStart;
      tl.to(q('[data-s="6-mapwrap"]'), { scale: 6, x: -vw * 0.1, y: -vh * 0.06, duration: dTotal * 0.4, ease: "power1.in" }, descendStart);
      tl.to(q('[data-s="6-neighborhood"]'), { opacity: 1, duration: dTotal * 0.25 }, descendStart + dTotal * 0.12);
      tl.to(q('[data-s="6-mapwrap"]'), { opacity: 0, duration: dTotal * 0.2 }, descendStart + dTotal * 0.25);
      tl.to(
        q('[data-s="6-neighborhood"]'),
        { scale: 4.5, duration: dTotal * 0.35, ease: "power1.in" },
        descendStart + dTotal * 0.35,
      );
      tl.to(q('[data-s="6-street"]'), { opacity: 1, duration: dTotal * 0.22 }, descendStart + dTotal * 0.5);
      tl.to(q('[data-s="6-neighborhood"]'), { opacity: 0, duration: dTotal * 0.2 }, descendStart + dTotal * 0.6);
      tl.to(q('[data-s="6-street"]'), { scale: 3.2, duration: dTotal * 0.35, ease: "power1.in" }, descendStart + dTotal * 0.62);
      tl.to(q('[data-s="6-exterior"]'), { opacity: 1, duration: dTotal * 0.25 }, descendStart + dTotal * 0.75);
      tl.to(q('[data-s="6-street"]'), { opacity: 0, duration: dTotal * 0.2 }, descendStart + dTotal * 0.82);
      crossfade("6", "7", SCENE.s7[0]);

      // ==== SCENE 7 -- HOMEOWNER, ATTENTION, SECOND DIVE, QUALIFICATION ========
      // Recomposed as an over-the-shoulder shot: a large silhouette
      // occupies the left third/foreground (cropped by the viewport edge),
      // the room uses the full frame for depth (window, cabinetry, table
      // edge), and the device/ad sits in the right midground.
      const s7 = SCENE.s7[0];
      const s7End = SCENE.s7[1];
      gsap.set(q('[data-s="7-interior"]'), { opacity: 1 });
      gsap.set(q('[data-s="7-roomdetail"]'), { opacity: 1 });
      gsap.set(q('[data-s="7-caption"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-ad"]'), { opacity: 0, y: 16, scale: 0.85 });
      gsap.set(q('[data-s="7-glow"]'), { opacity: 0.4, scale: 1 });
      gsap.set(q('[data-s="7-attn-copy"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-porthole"]'), { opacity: 0, width: 200, height: 380, borderRadius: 30, x: 0, y: 0 });
      gsap.set(q('[data-s="7-path-bad"]'), { opacity: 1, strokeDashoffset: 1 });
      gsap.set(q('[data-s="7-path-good-1"]'), { strokeDashoffset: 1 });
      gsap.set(q('[data-s="7-path-good-2"]'), { strokeDashoffset: 1 });
      gsap.set(q('[data-s="7-dot-a"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-dot-b"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-checkpoint-mark"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-qual-mark"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-qual-ring"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-card"]'), { boxShadow: "0 0 0px 0px hsl(var(--accent) / 0)" });
      gsap.set(q('[data-s="7-label-capture"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-label-qualify"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-label-focus"]'), { opacity: 0 });
      gsap.set(q('[data-s="7-explain"]'), { opacity: 0 });

      tl.to(q('[data-s="7-caption"]'), { opacity: 1, duration: 1.2 }, s7 + 0.5).to(q('[data-s="7-caption"]'), { opacity: 0, duration: 1 }, s7 + 4);

      const adStart = s7 + 4.5;
      tl.to(q('[data-s="7-ad"]'), { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "power1.out" }, adStart);
      tl.to(q('[data-s="7-glow"]'), { opacity: 1, scale: 1.2, duration: 1.6 }, adStart);
      tl.to(q('[data-s="7-attn-copy"]'), { opacity: 1, duration: 1.2 }, adStart + 1.6).to(q('[data-s="7-attn-copy"]'), { opacity: 0, duration: 1 }, adStart + 4.2);
      // Other room detail recedes as the device becomes the focus.
      tl.to(q('[data-s="7-roomdetail"]'), { opacity: 0.25, scale: 1.03, duration: 2 }, adStart + 1.8);

      const diveStart = adStart + 5;
      const diveDur = 6.5;
      const doorX = vw * 0.63 - vw / 2;
      const doorY = vh * 0.48 - vh / 2;
      gsap.set(q('[data-s="7-porthole"]'), { x: doorX, y: doorY });
      tl.to(q('[data-s="7-porthole"]'), { opacity: 1, duration: 0.6 }, diveStart - 0.6);
      tl.to(q('[data-s="7-porthole"]'), { width: vw, height: vh, borderRadius: 0, x: 0, y: 0, duration: diveDur, ease: "power1.in" }, diveStart);

      // BUG FIX (2nd pass): full rebuild of the connector choreography, not
      // a coordinate nudge -- see the long comment on the SVG block in the
      // JSX below for the exact geometry and why the previous version's
      // diagonal ran through the (actually-centered) lead card. The card is
      // now the fixed starting object (LeadFlowPanel, lower-left); "Capture."
      // is tied to it directly; the path curves to a distinct "Qualify."
      // checkpoint; two short reject branches peel off there; the surviving
      // path continues to a resolved marker at "Focus."/"Qualified
      // opportunity". Only one "New inquiry" label exists now (inside
      // LeadFlowPanel) -- the duplicate overlay label is gone.
      // STORYTELLING PASS (3rd qualification pass) -- the geometry above is
      // locked and untouched (card/label/path coordinates are exactly the
      // 2nd pass's collision-free layout). This only adds motion/timing on
      // top of it: a real travelling signal, an unmistakable pause at the
      // "Qualify." checkpoint, reject branches that visibly draw-then-die
      // instead of sitting at a permanent faint opacity, and an arrival
      // pulse at the resolved terminus. One beat, one signal, one decision,
      // one survivor -- not three floating words plus a static line.
      const qualStart = diveStart + diveDur + 1;

      // Beat 1 -- ONE opening moment: the card pulses, "Capture." appears
      // tied to it, and the signal is born at the card's own corner, all at
      // the same instant.
      tl.to(q('[data-s="7-card"]'), { boxShadow: "0 0 44px 10px hsl(var(--accent) / 0.4)", duration: 0.5, ease: "power1.out" }, qualStart + 0.6);
      tl.to(q('[data-s="7-card"]'), { boxShadow: "0 0 0px 0px hsl(var(--accent) / 0)", duration: 0.6, ease: "power1.in" }, qualStart + 1.1);
      tl.to(q('[data-s="7-label-capture"]'), { opacity: 1, duration: 0.5 }, qualStart + 0.6);
      tl.to(q('[data-s="7-dot-a"]'), { opacity: 1, duration: 0.25 }, qualStart + 0.6);

      // Leg 1 -- signal travels from the card to the "Qualify." checkpoint.
      tl.to(q('[data-s="7-path-good-1"]'), { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, qualStart + 0.6);

      // Beat 2 -- arrival at the checkpoint: an unmistakable decision
      // moment, not a pass-through. The signal hands off to a resolved
      // checkpoint marker, "Qualify." registers, and only THEN do the
      // poor-fit branches peel away and die -- a visible rejection event,
      // not a permanently-present faint line.
      const checkpointArrive = qualStart + 1.5;
      tl.to(q('[data-s="7-dot-a"]'), { opacity: 0, duration: 0.15 }, checkpointArrive);
      tl.fromTo(
        q('[data-s="7-checkpoint-mark"]'),
        { opacity: 0, attr: { r: 0.8 } },
        { opacity: 1, attr: { r: 1.5 }, duration: 0.3, ease: "power1.out" },
        checkpointArrive,
      );
      tl.to(q('[data-s="7-checkpoint-mark"]'), { attr: { r: 1.1 }, duration: 0.4 }, checkpointArrive + 0.3);
      tl.to(q('[data-s="7-label-qualify"]'), { opacity: 1, duration: 0.5 }, checkpointArrive);
      tl.to(q('[data-s="7-path-bad"]'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.15, ease: "power1.out" }, checkpointArrive + 0.05);
      tl.to(q('[data-s="7-path-bad"]'), { opacity: 0, duration: 0.6 }, checkpointArrive + 0.6);

      // Leg 2 -- the ONE surviving signal continues from the checkpoint,
      // never doubling back through a reject branch, on to the terminus.
      const leg2Start = checkpointArrive + 0.2;
      tl.to(q('[data-s="7-dot-b"]'), { opacity: 1, duration: 0.2 }, leg2Start);
      tl.to(q('[data-s="7-path-good-2"]'), { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, leg2Start);

      // Beat 3 -- arrival at the resolved opportunity: the terminus itself
      // reacts (a brief pulse/glow), unmistakably marking this as the
      // selected outcome, not a dot that was always sitting there.
      const terminusArrive = leg2Start + 0.8;
      tl.to(q('[data-s="7-dot-b"]'), { opacity: 0, duration: 0.15 }, terminusArrive);
      tl.fromTo(
        q('[data-s="7-qual-ring"]'),
        { opacity: 0.55, attr: { r: 1.4 } },
        { opacity: 0, attr: { r: 4.5 }, duration: 0.7, ease: "power1.out" },
        terminusArrive,
      );
      tl.fromTo(
        q('[data-s="7-qual-mark"]'),
        { opacity: 0, attr: { r: 1 } },
        { opacity: 1, attr: { r: 1.9 }, duration: 0.35, ease: "power1.out" },
        terminusArrive,
      );
      tl.to(q('[data-s="7-qual-mark"]'), { attr: { r: 1.4 }, duration: 0.4 }, terminusArrive + 0.35);
      tl.to(q('[data-s="7-label-focus"]'), { opacity: 1, duration: 0.5 }, terminusArrive);
      tl.to(q('[data-s="7-explain"]'), { opacity: 1, duration: 0.5 }, terminusArrive + 0.1);

      // Hold the resolved state for a real beat before the scene-level
      // crossfade begins at SCENE.s9[0] (86) -- pushed from the prior
      // pass's `s7End - 2` to `s7End - 1` to give "Focus." room to
      // actually register now that arrival lands later in the sequence.
      tl.to(
        q('[data-s="7-label-capture"], [data-s="7-label-qualify"], [data-s="7-label-focus"], [data-s="7-explain"], [data-s="7-qual-mark"], [data-s="7-checkpoint-mark"]'),
        { opacity: 0, duration: 1 },
        s7End - 1,
      );
      crossfade("7", "9", SCENE.s9[0]);

      // ==== SCENE 9 -- FOLLOW-UP -> CONVERSATION ================================
      const s9 = SCENE.s9[0];
      gsap.set(q('[data-s="9-line"]'), { strokeDashoffset: 1 });
      gsap.set(q('[data-s="9-copy"]'), { opacity: 0 });
      gsap.set(q('[data-s="9-dot"]'), { opacity: 1 });
      // The travelling dot's position is driven by the gsap.ticker
      // listeners below (dot9Ticker/dot10Ticker), which read each path's
      // live strokeDashoffset every frame -- simpler and safer than wiring
      // an onUpdate through this tween.
      tl.to(q('[data-s="9-line"]'), { strokeDashoffset: 0, duration: 3, ease: "power1.inOut" }, s9 + 0.3);
      tl.to(q('[data-s="9-copy"]'), { opacity: 1, duration: 1.4 }, s9 + 3.2);
      crossfade("9", "10", SCENE.s10[0]);

      // ==== SCENE 10 -- CLOSE THE LOOP (with real breathing room) ==============
      const s10 = SCENE.s10[0];
      gsap.set(q('[data-s="10-mark"]'), { opacity: 0, scale: 0.9 });
      gsap.set(q('[data-s="10-line"]'), { strokeDashoffset: 1 });
      gsap.set(q('[data-s="10-dot"]'), { opacity: 1 });
      tl.to(q('[data-s="10-line"]'), { strokeDashoffset: 0, duration: 2.4, ease: "power1.inOut" }, s10 + 0.3);
      tl.to(q('[data-s="10-mark"]'), { opacity: 1, scale: 1, duration: 3, ease: "power1.out" }, s10 + 1.6);
    }, wrapper);

    // Direct onUpdate wiring for the two travelling dots (kept outside the
    // gsap.context tween chain above for clarity -- these read the two
    // path elements' current draw progress every scrub tick).
    const dot9Ticker = () => {
      const p = path9Ref.current;
      const d = dot9Ref.current;
      if (!p || !d) return;
      const dashoffset = parseFloat(getComputedStyle(p).strokeDashoffset || "0");
      followPath(p, d, 1 - dashoffset);
    };
    const dot10Ticker = () => {
      const p = path10Ref.current;
      const d = dot10Ref.current;
      if (!p || !d) return;
      const dashoffset = parseFloat(getComputedStyle(p).strokeDashoffset || "0");
      followPath(p, d, 1 - dashoffset);
    };
    const dot7aTicker = () => {
      const p = path7aRef.current;
      const d = dot7aRef.current;
      if (!p || !d) return;
      const dashoffset = parseFloat(getComputedStyle(p).strokeDashoffset || "0");
      followPath(p, d, 1 - dashoffset);
    };
    const dot7bTicker = () => {
      const p = path7bRef.current;
      const d = dot7bRef.current;
      if (!p || !d) return;
      const dashoffset = parseFloat(getComputedStyle(p).strokeDashoffset || "0");
      followPath(p, d, 1 - dashoffset);
    };
    gsap.ticker.add(dot9Ticker);
    gsap.ticker.add(dot10Ticker);
    gsap.ticker.add(dot7aTicker);
    gsap.ticker.add(dot7bTicker);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(dot9Ticker);
      gsap.ticker.remove(dot10Ticker);
      gsap.ticker.remove(dot7aTicker);
      gsap.ticker.remove(dot7bTicker);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={wrapperRef} id="services" className="relative">
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-primary">
        {/* SCENE 1 -- REVORA -------------------------------------------------- */}
        <Scene id="1">
          <div data-s="1-hero" className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-sm font-semibold tracking-[0.3em] text-accent uppercase">Revora Marketing</p>
              <h1 className="font-display text-5xl md:text-7xl font-semibold text-primary-foreground leading-tight tracking-tight">
                Turn Your Website Into a Growth Asset.
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-light leading-relaxed">
                A professional website that makes your business look as good as your work. When it's the right fit, we can also build a customer-acquisition system to bring in more of the jobs you actually want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <Button variant="hero" size="xl" className="group" asChild>
                  <a href="/#services">
                    See the Website Offer
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                  <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                    Book a 15-Minute Discovery Call
                  </a>
                </Button>
              </div>
              <div className="pt-6 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <Stat value="$997" label="Professional Website, One-Time" />
                <Stat value="$99/mo" label="Ongoing Website Care" />
                <Stat value="No Lock-In" label="Straightforward Terms" />
              </div>
            </div>
          </div>
          {/* Act title -- treated as a real cinematic beat, not transitional
              microcopy: large scale, appears almost immediately, holds. */}
          <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
            <p data-s="1-tagline" className="text-center font-display text-3xl md:text-5xl tracking-tight text-primary-foreground opacity-0" style={{ transform: "scale(0.94)" }}>
              We build for the businesses
              <br />
              that <span className="text-accent">build.</span>
            </p>
          </div>
        </Scene>

        {/* SCENE 2 -- THE DIGITAL BUILD + THE FIRST DIVE ---------------------- */}
        <Scene id="2">
          {/* Foreground desk edge -- a physical-object cue, not a UI element. */}
          <div data-s="2-desk" className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/50 to-transparent" />
          <p
            data-s="2-intro-copy"
            className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[34%] font-display text-2xl md:text-4xl text-primary-foreground opacity-0 z-10"
          >
            Your work already
            <br />
            looks professional.
            <br />
            <span className="text-accent">Your website should too.</span>
          </p>
          <div className="absolute right-[4%] top-1/2 -translate-y-1/2">
            <div
              data-s="2-porthole"
              className="relative overflow-hidden border border-white/15 bg-card shadow-elegant"
              style={{ borderRadius: 20 }}
            >
              <div data-s="2-bezeldeco" className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2">
                <div data-s="2-reveal" className="h-full w-full">
                  <WebsiteRevealPanel />
                </div>
              </div>
              <div data-s="2-construction" className="absolute inset-0 z-10 flex items-center justify-center bg-card">
                <div className="w-[420px] max-w-[80%] space-y-4">
                  <div data-s="2-piece" className="h-3 w-24 rounded bg-muted" />
                  <div data-s="2-piece" className="h-24 w-full rounded-lg bg-gradient-accent/20" />
                  <div data-s="2-piece" className="h-2.5 w-full rounded bg-muted" />
                  <div data-s="2-piece" className="h-2.5 w-3/4 rounded bg-muted" />
                  <div data-s="2-piece" className="h-8 w-32 rounded bg-accent" />
                </div>
              </div>
            </div>
          </div>
        </Scene>

        {/* SCENE 4 -- WHAT REVORA CAN BUILD (full-frame reconstruction) ------- */}
        <Scene id="4">
          {/* BUG FIX: was `top-8` (32px) -- well underneath the real 128px
              fixed Header. Given navbar-safe clearance. */}
          <p
            className="absolute left-0 right-0 text-center text-[10px] tracking-[0.3em] uppercase text-primary-foreground/50 z-20"
            style={{ top: NAVBAR_SAFE_PX + 20 }}
          >
            Design concepts, not real client work
          </p>
          <div data-s="4-concept-a" className="absolute inset-0">
            <RoofingConcept pieceAttr="4-piece-a" />
          </div>
          <div data-s="4-concept-b" className="absolute inset-0">
            <LandscapingConcept pieceAttr="4-piece-b" />
          </div>
        </Scene>

        {/* SCENE 5 -- THE PIVOT ----------------------------------------------- */}
        <Scene id="5">
          <div data-s="5-site" className="absolute inset-0">
            <LandscapingConcept pieceAttr="5-piece" isStatic />
          </div>
          {/* BUG FIX: fills the "empty navy with one floating button" gap
              -- a soft ambient field that grows in as the offer detaches
              and travels, so the transit always has intentional visual
              context, and previews the glow the offer becomes in Scene 6. */}
          <div
            data-s="5-field"
            className="pointer-events-none absolute h-[46vw] w-[46vw] rounded-full"
            style={{
              left: "70%",
              top: "68%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, hsl(var(--accent)/0.22) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute z-10"
            style={{ left: "70%", top: "68%", width: 280 }}
          >
            <div
              data-s="5-offer"
              className="rounded-lg bg-accent text-accent-foreground font-semibold px-8 py-4 text-center shadow-[0_0_50px_16px_hsl(var(--accent)/0.55)]"
            >
              Book a 15-Minute Discovery Call
            </div>
          </div>
          {/* Positioned in the upper band, not dead-center, since the offer
              below travels toward its destination -- keeping this copy off
              that point is a deliberate second margin of safety on top of
              the timing fix above.
              BUG FIX: was `top-[14%]`, a PERCENTAGE of viewport height --
              at common laptop viewport heights (800-900px) that resolves
              to ~112-126px, underneath the real 128px fixed Header, so it
              rendered partly clipped. A fixed pixel offset below the
              navbar is correct here instead of a percentage, since the
              Header's height doesn't scale with viewport height. */}
          <div className="absolute inset-x-0 flex items-center justify-center px-6 pointer-events-none" style={{ top: NAVBAR_SAFE_PX + 24 }}>
            <p data-s="5-copy" className="font-display text-2xl md:text-3xl text-primary-foreground max-w-xl text-center opacity-0">
              A better website is the foundation.
              <br />
              <span className="text-primary-foreground/70 text-lg md:text-xl">But looking good online isn't the whole growth system.</span>
            </p>
          </div>
        </Scene>

        {/* SCENE 6 -- THE MARKET, NARROWING, DESCENT --------------------------- */}
        <Scene id="6">
          <div data-s="6-mapwrap" className="absolute inset-0">
            {/* Media slot: MEDIA_SLOTS.aerialServiceArea -- see mediaSlots.ts.
                Sits behind the road-texture/node overlay below; those stay
                HTML/CSS/SVG even once a real aerial plate is wired in. */}
            <div className="absolute inset-0">
              <SceneMedia slot={MEDIA_SLOTS.aerialServiceArea} placeholder={null} />
            </div>
            <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
              <pattern id="roadsFar" width="90" height="90" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
                <path d="M0 45 H90 M45 0 V90" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#roadsFar)" />
            </svg>
            <svg className="absolute inset-0 h-full w-full opacity-[0.09]" aria-hidden="true">
              <pattern id="roadsNear" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
                <path d="M0 20 H40 M20 0 V40" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#roadsNear)" />
            </svg>
            {/* Scattered block/building shapes for city texture. */}
            {[
              [8, 20, 5, 4], [20, 42, 4, 6], [35, 12, 6, 4], [50, 34, 4, 5],
              [64, 18, 5, 4], [78, 46, 4, 6], [15, 66, 5, 4], [30, 76, 4, 5],
              [46, 62, 6, 4], [60, 72, 4, 5], [72, 60, 5, 4], [88, 30, 4, 6],
            ].map(([x, y, w, h], i) => (
              <div
                key={`blk-${i}`}
                className="absolute bg-primary-foreground/[0.05]"
                style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
              />
            ))}
            {CROWD_NODES.map((n, i) => (
              <div key={i} data-s="6-node" data-node-i={i} className="absolute">
                <Node x={n.x} y={n.y} />
              </div>
            ))}
            <div
              data-s="6-signal"
              className="absolute h-3 w-3 rounded-full bg-accent shadow-[0_0_24px_8px_hsl(var(--accent)/0.55)]"
              style={{ left: `${TARGET_NODE.x}%`, top: `${TARGET_NODE.y}%`, transform: "translate(-50%, -50%)" }}
            />
          </div>

          {/* Descent depth stack: neighbourhood, then street, then exterior. */}
          <div
            data-s="6-neighborhood"
            className="absolute inset-0 opacity-0"
            style={{
              background: "radial-gradient(circle at 60% 45%, #2f2417 0%, #1a1410 60%, #0e0b08 100%)",
            }}
          >
            {[
              [30, 30, 14, 3], [30, 40, 14, 3], [30, 50, 14, 3], [30, 60, 14, 3],
              [50, 30, 14, 3], [50, 40, 14, 3], [50, 50, 14, 3], [50, 60, 14, 3],
            ].map(([x, y, w, h], i) => (
              <div key={`nb-${i}`} className="absolute bg-white/[0.06]" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
            ))}
          </div>
          <div data-s="6-street" className="absolute inset-0 opacity-0 bg-gradient-to-b from-[#241c14] to-[#100c08]">
            <div className="absolute inset-x-0 top-1/2 h-[3%] -translate-y-1/2 bg-white/[0.08]" />
            {[18, 34, 50, 66, 82].map((x, i) => (
              <div
                key={`house-${i}`}
                className="absolute bottom-[46%] rounded-t-sm bg-[#3a2c1c]"
                style={{ left: `${x}%`, width: "10%", height: `${14 + (i % 3) * 4}%` }}
              />
            ))}
          </div>
          <div data-s="6-exterior" className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#2a1f14] to-[#120d09] opacity-0">
            <div className="h-52 w-64 rounded-2xl bg-[#3a2a1a] shadow-[0_0_80px_30px_rgba(0,0,0,0.45)]" />
          </div>

          <div className="absolute inset-y-0 left-0 flex w-[42%] items-center pl-10 pointer-events-none">
            <p data-s="6-copy" className="font-display text-2xl md:text-4xl text-primary-foreground opacity-0 text-left">
              The right offer.
              <br />
              <span className="text-accent">In front of the right people.</span>
              <span className="mt-4 block text-sm font-sans font-normal text-primary-foreground/60 max-w-sm">
                Targeted homeowner attention in your service area. Not a promise that everyone shown is already searching.
              </span>
            </p>
          </div>
        </Scene>

        {/* SCENE 7 -- HOMEOWNER, ATTENTION, SECOND DIVE, QUALIFICATION -------- */}
        <Scene id="7">
          {/* Media slot: MEDIA_SLOTS.homeownerInterior -- see mediaSlots.ts. */}
          <div data-s="7-interior" className="absolute inset-0">
            <SceneMedia
              slot={MEDIA_SLOTS.homeownerInterior}
              placeholder={<div className="absolute inset-0 bg-gradient-to-br from-[#3a2f22] via-[#241d16] to-[#14100b]" />}
            />
          </div>
          <div data-s="7-roomdetail" className="absolute inset-0">
            {/* Window, upper right -- background depth cue. */}
            <div className="absolute right-[8%] top-[8%] h-[30%] w-[16%] rounded-sm bg-gradient-to-b from-accent/15 to-transparent" />
            {/* Cabinetry, upper left -- background depth cue. */}
            <div className="absolute left-[4%] top-[6%] h-[22%] w-[10%] rounded-sm bg-black/20" />
            <div className="absolute left-[15%] top-[6%] h-[22%] w-[8%] rounded-sm bg-black/15" />
            {/* Table edge, lower foreground. */}
            <div className="absolute inset-x-0 bottom-[28%] h-[3%] bg-black/25" />
          </div>
          {/* Over-the-shoulder silhouette, left third/foreground, cropped by
              the viewport edge. Deliberately abstract, never a realistic
              figure. */}
          <div className="absolute bottom-0 left-[-4%] h-[68%] w-[26%] rounded-t-full bg-black/35" aria-hidden="true" />
          <div className="absolute bottom-[46%] left-[4%] h-20 w-20 rounded-full bg-black/35" aria-hidden="true" />
          {/* BUG FIX: same navbar-safe-area issue as Scene 5's pivot copy --
              was `top-[14%]`, now a fixed offset below the real Header. */}
          <p
            data-s="7-caption"
            className="absolute left-0 right-0 text-center text-sm md:text-base text-primary-foreground/70 px-6 opacity-0"
            style={{ top: NAVBAR_SAFE_PX + 24 }}
          >
            A homeowner, going about their evening.
          </p>

          {/* Device + ad, right midground, on the table. */}
          <div
            data-s="7-glow"
            className="absolute bottom-[32%] left-[58%] h-28 w-52 rounded-lg bg-accent/20 shadow-[0_0_60px_20px_hsl(var(--accent)/0.25)]"
          />
          <div data-s="7-ad" className="absolute bottom-[36%] left-[58%] w-56 rounded-md bg-card p-4 shadow-elegant opacity-0">
            <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">Sponsored</p>
            <div className="mt-2 h-14 w-full rounded bg-gradient-accent/25" />
            <div className="mt-2 h-1.5 w-3/4 rounded bg-muted" />
          </div>
          <p data-s="7-attn-copy" className="absolute top-[36%] left-0 right-0 text-center font-display text-2xl md:text-4xl text-primary-foreground opacity-0">
            Attention.
            <br />
            <span className="text-accent">Interest.</span>
          </p>

          {/* Second dive -- deliberately not identical to the first: a
              narrower, phone-shaped porthole, originating from the device's
              own position on the table rather than dead-center. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              data-s="7-porthole"
              className="relative overflow-hidden border border-white/15 bg-card shadow-elegant"
              style={{ borderRadius: 28 }}
            >
              <div className="absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2">
                <LeadFlowPanel />
              </div>
            </div>
          </div>

          {/* BUG FIX (2nd pass) -- full rebuild, not a re-nudge. The prior
              version's "good path" ran a single straight diagonal from
              (14,80) to (88,16) -- almost the full viewport -- while the
              LeadFlowPanel card it supposedly started beside was actually
              CENTERED by its own flex layout, sitting right at (~50,~50),
              which is exactly on that diagonal. That was the real source of
              "the line runs through the card": the label coordinates were
              checked, but the card's own on-screen position never was.
              Fixed at the source: the card is now anchored lower-left (see
              LeadFlowPanel above), and the connector is a short, curved,
              two-stage path (capture leg + branch), not a corner-to-corner
              diagonal, so it never dominates the frame.

              Coordinates (0-100 viewBox == % of viewport):
                card box:       x in [6,26],  y in [70,90]   (LeadFlowPanel)
                good path:      starts (30,68) just outside the card's
                                corner, bends through the checkpoint
                                (65,38), ends at the terminus (88,20)
                bad path 1:     (65,38) -> (26,30) -- short reject, upper-left
                bad path 2:     (65,38) -> (64,64) -- short reject, straight down
                paragraph box:  x in [68,96], y in [78,92]   (bottom-right)
              Every label below sits at least ~10 viewport units clear of
              both the card box and every path segment's own coordinate
              range at the matching x (worked out by hand against the paths'
              actual d= values, not eyeballed). Only ONE "New inquiry" label
              exists now -- it lives inside LeadFlowPanel itself; the
              duplicate bottom-left overlay label has been removed. */}
          <svg className="absolute inset-0 h-full w-full z-20" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {/* Reject branches -- now DRAW outward from the checkpoint and
                fully fade, rather than sitting permanently at low opacity.
                pathLength/strokeDasharray added so they animate the same
                way the good legs do. */}
            <path data-s="7-path-bad" d="M 65 38 L 26 30" stroke="hsl(var(--primary) / 0.4)" strokeWidth="0.3" fill="none" pathLength={1} strokeDasharray={1} />
            <path data-s="7-path-bad" d="M 65 38 L 64 64" stroke="hsl(var(--primary) / 0.4)" strokeWidth="0.3" fill="none" pathLength={1} strokeDasharray={1} />
            {/* Split into two legs (card -> checkpoint, checkpoint ->
                terminus) so a single travelling signal can visibly pause
                and hand off at "Qualify." instead of gliding straight
                through it. Same two on-curve endpoints as the prior pass's
                single path -- geometry is unchanged, only split. */}
            <path
              ref={path7aRef}
              data-s="7-path-good-1"
              d="M 30 68 C 40 50, 55 40, 65 38"
              stroke="hsl(var(--accent))"
              strokeWidth="0.35"
              fill="none"
              pathLength={1}
              strokeDasharray={1}
            />
            <path
              ref={path7bRef}
              data-s="7-path-good-2"
              d="M 65 38 C 75 36, 82 28, 88 20"
              stroke="hsl(var(--accent))"
              strokeWidth="0.35"
              fill="none"
              pathLength={1}
              strokeDasharray={1}
            />
            {/* Travelling signal -- a real followable dot, not just the
                abstract line-draw, using the same getPointAtLength pattern
                as Scenes 9/10's opportunity dots. One dot per leg, handed
                off at the checkpoint. */}
            <circle ref={dot7aRef} data-s="7-dot-a" r="0.9" fill="hsl(var(--accent))" />
            <circle ref={dot7bRef} data-s="7-dot-b" r="0.9" fill="hsl(var(--accent))" />
            {/* Checkpoint marker -- the unmistakable "Qualify." decision
                moment: pulses once as the signal arrives, then holds. */}
            <circle data-s="7-checkpoint-mark" cx="65" cy="38" r="1.1" fill="hsl(var(--primary-foreground))" opacity="0" />
            {/* Arrival ring -- a one-shot expanding pulse at the terminus
                the instant the signal lands, so "this is the selected
                opportunity" reads as an event, not a static dot. */}
            <circle data-s="7-qual-ring" cx="88" cy="20" r="1.4" fill="none" stroke="hsl(var(--accent))" strokeWidth="0.3" opacity="0" />
            {/* Resolved marker -- gives "Focus."/"Qualified opportunity" a
                real visual anchor at the path's terminus, not just a
                floating word. Pulses (grows then settles) on arrival. */}
            <circle data-s="7-qual-mark" cx="88" cy="20" r="1.4" fill="hsl(var(--accent))" opacity="0" />
          </svg>
          {/* Just above the card (card top is y=70; this sits at y=50, a
              clear 20-unit gap), reading as "this is what happens right
              after the inquiry arrives." Card's x-range is [6,26]; no path
              exists left of x=30 at all, so this is safe regardless. */}
          <p
            data-s="7-label-capture"
            className="absolute z-20 font-display text-lg md:text-2xl text-primary-foreground opacity-0"
            style={{ left: "8%", top: "50%" }}
          >
            Capture.
          </p>
          {/* Above and left of the checkpoint (65,38). At x=48: good path's
              first segment is at y~53, bad-path-1 is at y~35 -- this label
              sits at y=24, clear of both by 10+ units. */}
          <p
            data-s="7-label-qualify"
            className="absolute z-20 font-display text-lg md:text-2xl text-primary-foreground opacity-0"
            style={{ left: "48%", top: "24%" }}
          >
            Qualify.
          </p>
          {/* Below-left of the terminus dot (88,20), never above it, so it
              never enters the NAVBAR_SAFE_PX zone at the top of the frame. */}
          <div className="absolute z-20 text-right opacity-0" data-s="7-label-focus" style={{ right: "6%", top: "28%" }}>
            <p className="font-display text-2xl md:text-4xl text-accent">Focus.</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-accent/80">Qualified opportunity</p>
          </div>
          {/* Bottom-right corner -- both bad paths stay left of x=65, the
              good path's terminus is up at y=20, well clear. */}
          <div className="absolute z-20 w-[30%] text-right opacity-0" data-s="7-explain" style={{ right: "4%", bottom: "8%" }}>
            <p className="text-sm text-primary-foreground/70">
              Interested homeowners are captured and pre-qualified. Obvious poor fits, wrong service, outside the area, are filtered out before they take your time.
            </p>
          </div>
        </Scene>

        {/* SCENE 9 -- FOLLOW-UP -> CONVERSATION -------------------------------- */}
        <Scene id="9">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path
              ref={path9Ref}
              data-s="9-line"
              d="M 92 30 C 95 55, 60 78, 50 88"
              stroke="hsl(var(--accent))"
              strokeWidth="0.4"
              fill="none"
              pathLength={1}
              strokeDasharray={1}
            />
            <circle ref={dot9Ref} data-s="9-dot" r="1.3" fill="hsl(var(--accent))" />
          </svg>
          <div data-s="9-copy" className="relative z-10 text-center px-6 opacity-0">
            <p className="font-display text-2xl md:text-4xl text-primary-foreground mb-2">
              Follow up.
              <br />
              <span className="text-accent">Conversation.</span>
            </p>
            <p className="mt-4 text-sm text-primary-foreground/70 max-w-md mx-auto">
              Turn homeowner interest into real sales conversations.
            </p>
            <p className="mt-6 text-xs tracking-[0.3em] uppercase text-primary-foreground/50">Customer Acquisition System</p>
            <p className="mt-2 text-sm text-primary-foreground/60">
              Investment set after discovery. No setup fee. Month-to-month.
            </p>
            <div className="mt-6">
              <Button variant="hero" size="lg" asChild>
                <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                  Book a 15-Minute Discovery Call
                </a>
              </Button>
            </div>
          </div>
        </Scene>

        {/* SCENE 10 -- CLOSE THE LOOP ------------------------------------------- */}
        <Scene id="10">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path
              ref={path10Ref}
              data-s="10-line"
              d="M 50 4 C 82 10, 88 55, 50 62"
              stroke="hsl(var(--accent))"
              strokeWidth="0.4"
              fill="none"
              pathLength={1}
              strokeDasharray={1}
            />
            <circle ref={dot10Ref} data-s="10-dot" r="1.3" fill="hsl(var(--accent))" />
          </svg>
          <div data-s="10-mark" className="relative z-10 text-center px-6 opacity-0">
            <p className="font-display text-4xl md:text-6xl font-semibold text-primary-foreground mb-4">REVORA</p>
            <p className="text-primary-foreground/70 text-lg">
              Real business. Digital presence. Customer acquisition.
            </p>
          </div>
        </Scene>
      </div>
    </div>
  );
}

function Scene({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div data-scene={id} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}

function Stat({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className="space-y-1 text-center">
      <div className={`text-2xl md:text-3xl font-bold ${dark ? "text-primary" : "text-accent"}`}>{value}</div>
      <div className={`text-xs md:text-sm ${dark ? "text-muted-foreground" : "text-primary-foreground/80"}`}>{label}</div>
    </div>
  );
}

// Real-size destination content revealed by the first dive. Design concept,
// not a real client site or a real screenshot.
//
// BUG FIX: this used to be a single narrow column of text centered inside
// an otherwise empty full-viewport `bg-card` (pure white) panel -- once the
// dive completed and this filled the whole screen, the huge unused white
// margin around that one small block read as an unfinished blank page,
// not a designed surface. Kept intentionally light (this is "we're now
// inside a real website," a deliberate contrast to the dark cinematic
// world around it -- per instruction, not simply made dark to hide the
// problem) but restructured into the same asymmetric nav + content column
// + structured media-block layout already used for the Roofing/Landscaping
// concepts later in the sequence, so it reads as a real homepage layout
// from the moment it fills the viewport.
function WebsiteRevealPanel() {
  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-10 py-5">
        <div className="h-4 w-24 rounded bg-primary/70" />
        <div className="flex gap-4">
          <div className="h-2 w-10 rounded bg-muted" />
          <div className="h-2 w-10 rounded bg-muted" />
          <div className="h-2 w-14 rounded bg-accent" />
        </div>
      </div>
      <div className="relative flex flex-1 items-center">
        <div className="w-[46%] space-y-5 pl-16 pr-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Design concept</p>
          <h2 className="font-display text-3xl leading-tight text-primary font-semibold md:text-5xl">Professional Websites</h2>
          <p className="max-w-md text-muted-foreground">
            Built to make your business look as good online as the work you do in person.
          </p>
          <div className="flex gap-10 pt-2 text-primary">
            <Stat value="$997" label="Website Build" dark />
            <Stat value="$99/mo" label="Website Care" dark />
          </div>
        </div>
        {/* Structured media-block placeholder, not a blank fill -- future
            replacement point, same treatment already established for the
            Roofing concept's own media slot below. */}
        <div className="absolute bottom-0 right-0 top-0 w-[48%] bg-gradient-to-br from-muted to-border">
          <div className="absolute left-8 top-8 h-px w-20 bg-accent/50" />
          <div className="absolute left-8 top-8 h-20 w-px bg-accent/50" />
        </div>
      </div>
    </div>
  );
}

// Abstract lead-capture/qualification interface revealed by the second
// dive. Purely geometric, no fake names, no fake data, no dashboard.
//
// BUG FIX: this card used to be centered (items-center justify-center),
// which put it directly in the middle of the viewport -- exactly where the
// qualification scene's connector line was drawn straight through. Anchored
// to the lower-left instead so it is a fixed, known object the connector
// path can originate beside without ever crossing it. This is now the
// scene's ONE "New inquiry" label -- the separate overlay label that used
// to duplicate it has been removed entirely.
function LeadFlowPanel() {
  return (
    <div className="relative h-full w-full bg-primary">
      <div className="absolute left-[6%] bottom-[10%] w-full max-w-xs space-y-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/50">New inquiry</p>
        {/* STORYTELLING PASS -- data-s="7-card" is the pulse target that
            ties "Capture." to this exact card at the moment the signal is
            born, so the opening beat reads as one cohesive event. */}
        <div data-s="7-card" className="space-y-3 rounded-xl border border-white/10 bg-primary-foreground/5 p-6">
          <div className="h-2.5 w-3/4 rounded bg-white/15" />
          <div className="h-2.5 w-1/2 rounded bg-white/15" />
          <div className="h-8 w-full rounded bg-accent/80" />
        </div>
      </div>
    </div>
  );
}

// ---- Scene 4/5: two genuinely different full-frame design concepts -----
// Both are full-bleed (inset-0), each with five pieces in the fixed DOM
// order [nav, media, headline, subcopy, CTA] so LAYER_EXIT's mapping stays
// correct -- their VISUAL placement (left vs right, hard vs organic) is
// handled by absolute positioning per element, decoupled from that order.
// Both remain explicit design concepts, never implied real client work.

function RoofingConcept({ pieceAttr, isStatic = false }: { pieceAttr: string; isStatic?: boolean }) {
  const tag = isStatic ? undefined : pieceAttr;
  // Palette aligned to the real Northline Roofing production-design
  // concept (see /concept/northline: #171410 charcoal, #c98a4b copper
  // accent) rather than an arbitrary placeholder palette, so this scene
  // can later host Northline's actual media/copy without a re-theme.
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#171410]">
      {/* BUG FIX: this concept site's OWN fake nav used to sit at
          `top-0 h-16` (0-64px) -- entirely underneath the real 128px fixed
          Revora Header (which persists above every scene, it is not
          scene-scoped), so it rendered hidden. Shifted below the real
          navbar's safe area; the media block below shifts down to match so
          it still starts right under this concept's own nav. */}
      <div
        data-s={tag}
        className="absolute inset-x-0 h-16 flex items-center justify-between px-10 border-b border-white/10 bg-black/20"
        style={{ top: NAVBAR_SAFE_PX }}
      >
        <div className="h-4 w-28 rounded bg-[#c98a4b]/80" />
        <div className="flex gap-6">
          <div className="h-2 w-10 rounded bg-white/25" />
          <div className="h-2 w-10 rounded bg-white/25" />
          <div className="h-2 w-14 rounded bg-[#c98a4b]" />
        </div>
      </div>
      <div
        data-s={tag}
        className="absolute right-0 bottom-0 overflow-hidden rounded-l-lg bg-gradient-to-br from-[#3a3a3c] to-[#0f0f10]"
        style={{ width: "58%", top: NAVBAR_SAFE_PX + 64, transform: "translateX(3%)" }}
      >
        {/* Media slot: MEDIA_SLOTS.northlineRoofHero -- see mediaSlots.ts.
            Falls back to this gradient + accent-line placeholder until the
            real Northline still/video is wired in. */}
        <SceneMedia
          slot={MEDIA_SLOTS.northlineRoofHero}
          placeholder={
            <>
              <div className="absolute left-8 top-8 h-px w-24 bg-[#c98a4b]/60" />
              <div className="absolute left-8 top-8 h-24 w-px bg-[#c98a4b]/60" />
            </>
          }
        />
      </div>
      <h2 data-s={tag} className="absolute left-10 top-[30%] w-[36%] font-display text-3xl md:text-5xl font-bold leading-tight text-white">
        Roofing, <span className="text-[#c98a4b]">design concept</span>
      </h2>
      <p data-s={tag} className="absolute left-10 top-[55%] w-[32%] text-sm text-white/60">
        A bold, structured identity built for a business that works with hard lines and hard materials.
      </p>
      <div data-s={tag} className="absolute left-10 top-[68%] rounded bg-[#c98a4b] px-6 py-3 text-sm font-semibold text-black">
        Get an Estimate
      </div>
    </div>
  );
}

function LandscapingConcept({ pieceAttr, isStatic = false }: { pieceAttr: string; isStatic?: boolean }) {
  const tag = isStatic ? undefined : pieceAttr;
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#183327]">
      {/* BUG FIX: was `top-6` (24px) -- underneath the real fixed Header,
          same issue as RoofingConcept's nav above. */}
      <div
        data-s={tag}
        className="absolute left-1/2 -translate-x-1/2 rounded-full border border-white/15 px-6 py-2"
        style={{ top: NAVBAR_SAFE_PX }}
      >
        <div className="h-2 w-20 rounded bg-[#d9c27a]/80" />
      </div>
      <div
        data-s={tag}
        className="absolute left-0 top-0 bottom-0 rounded-r-[90px] bg-gradient-to-br from-[#2c4a38] to-[#0f1e15]"
        style={{ width: "55%", transform: "translateX(-3%)" }}
      />
      <h2 data-s={tag} className="absolute right-10 top-[28%] w-[38%] text-right font-display text-3xl md:text-5xl font-light leading-tight text-white">
        Landscaping, <span className="text-[#d9c27a]">design concept</span>
      </h2>
      <p data-s={tag} className="absolute right-10 top-[52%] w-[32%] text-right text-sm text-white/60">
        A softer, more organic identity, shaped around outdoor living rather than hard structure.
      </p>
      <div data-s={tag} className="absolute right-10 top-[65%] text-sm font-semibold text-[#d9c27a] underline underline-offset-4">
        View Our Work
      </div>
    </div>
  );
}

// Mobile gets its own INTENTIONAL, vertically-composed telling of the same
// story beats -- not the desktop pinned/scrubbed camera experience with
// GSAP switched off. Each section reveals itself once as it scrolls into
// view (via the existing useInView hook, already correct under
// prefers-reduced-motion: it resolves to "already in view" immediately, so
// nothing here ever depends on an animation for content to appear). No
// pinning, no pointer-events risk, no horizontal scroll surface, every CTA
// is a normal in-flow, always-clickable element throughout.
function MobileReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {children}
    </div>
  );
}

function MobileFallback() {
  return (
    <div id="services" className="overflow-x-hidden bg-primary">
      <section className="min-h-screen flex items-center pt-24 pb-16 px-6">
        <MobileReveal className="max-w-xl mx-auto text-center space-y-6">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">Revora Marketing</p>
          <h1 className="font-display text-4xl font-semibold text-primary-foreground leading-tight">
            Turn Your Website Into a Growth Asset.
          </h1>
          <p className="text-lg text-primary-foreground/90 font-light leading-relaxed">
            A professional website that makes your business look as good as your work. When it's the right fit, we can also build a customer-acquisition system to bring in more of the jobs you actually want.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="/#services">See the Website Offer</a>
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-transparent text-primary-foreground border-primary-foreground/30" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a 15-Minute Discovery Call
              </a>
            </Button>
          </div>
          <div className="pt-4 grid grid-cols-3 gap-4">
            <Stat value="$997" label="Website, One-Time" />
            <Stat value="$99/mo" label="Website Care" />
            <Stat value="No Lock-In" label="Straightforward" />
          </div>
        </MobileReveal>
      </section>

      <MobilePanel title="What Revora builds" body="A professional website that makes your business look as good online as the work you do in person, plus, when it's the right fit, a customer-acquisition system behind it." />
      <MobilePanel title="Examples of what's possible" body="Roofing, landscaping, concrete, HVAC and remodeling businesses can each get a distinct, premium digital identity. These are design concepts, not real client work." />
      <MobilePanel title="How customer acquisition works" body="Revora puts the right offer in front of relevant homeowners. Interested homeowners raise their hand. We capture and pre-qualify the response, filter out obvious poor fits, and follow up so you get to real sales conversations while interest is fresh." dark />
      <MobilePanel title="Customer Acquisition System" body="Investment is set after discovery. No setup fee. Month-to-month." cta />
    </div>
  );
}

function MobilePanel({ title, body, dark = false, cta = false }: { title: string; body: string; dark?: boolean; cta?: boolean }) {
  return (
    <section className={`py-16 px-6 ${dark ? "bg-primary" : "bg-card"}`}>
      <MobileReveal className="max-w-md mx-auto text-center space-y-4">
        <h2 className={`font-display text-2xl font-semibold ${dark ? "text-primary-foreground" : "text-primary"}`}>{title}</h2>
        <p className={dark ? "text-primary-foreground/80" : "text-muted-foreground"}>{body}</p>
        {cta && (
          <Button variant="hero" size="lg" className="w-full mt-2" asChild>
            <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
              Book a 15-Minute Discovery Call
            </a>
          </Button>
        )}
      </MobileReveal>
    </section>
  );
}
