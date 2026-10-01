import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FeedChrome, FeedList } from "./SocialFeed";
import LeadForm from "./LeadForm";
import QualifiedLead from "./QualifiedLead";
import { ACCENT, APPBAR_H, COL_W, QUESTIONS, STAGE_H, STAGE_W, STATUS_H, WORLD_SCALE } from "./content";

// ISOLATED PROTOTYPE -- digital lead journey (feed -> ad -> form ->
// qualified lead). Picks up where the physical Higgsfield push-in into
// the homeowner's phone ends, so the frame IS the phone display (no
// device mockup). Authored on a fixed 1600x900 stage scaled to fit; the
// phone UI itself renders at WORLD_SCALE with edge-to-edge cards so it
// fills the frame. One deterministic GSAP timeline (~16s autoplay); GSAP
// only touches transform/opacity/filter/colour/clip. Remount to replay.
// Not wired into CinematicExperience yet.

const BLUE = "#0866ff";
const FEED_PAD = APPBAR_H + 10; // feed starts below the (hideable) tab bar
const FEED_VIEW_H = STAGE_H / WORLD_SCALE - STATUS_H;
const SHEET_TOP = 40;
const PUSH = 1.36; // camera push toward Get Quote while the ad is read
const CHIP_TOP = 300; // where the submitted answers float, stage px
const CHIP_GAP = 80;

// Offset of el within ancestor, in layout px (immune to the stage scale).
function offsetIn(el: HTMLElement, ancestor: HTMLElement) {
  let t = 0, l = 0, n: HTMLElement | null = el;
  while (n && n !== ancestor) { t += n.offsetTop; l += n.offsetLeft; n = n.offsetParent as HTMLElement | null; }
  return { t, l };
}

export default function LeadJourney() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const one = (s: string) => root.querySelector<HTMLElement>(s)!;
      const list = one('[data-lj="feed-list"]');
      const ad = one('[data-lj="ad"]');
      const quote = one('[data-press="quote"]');

      // Settle the ad (header -> Get Quote row) optically centred.
      const adTop = offsetIn(ad, list).t;
      const q0 = offsetIn(quote, list);
      const adCore = q0.t + quote.offsetHeight + 12 - adTop;
      const settleY = (FEED_VIEW_H - adCore) / 2 - FEED_PAD - adTop;
      // Push-in anchored on the Get Quote button (world origin = top centre).
      const wx = (STAGE_W - COL_W) / 2 + q0.l + quote.offsetWidth / 2;
      const wy = STATUS_H + FEED_PAD + settleY + q0.t + quote.offsetHeight / 2;
      const dS = PUSH - WORLD_SCALE;

      // Submitted answers start as separated chips over the form, already
      // in final row order so the condense is monotonic (no crossing).
      const lead = one('[data-lj="lead-object"]');
      const rows = q("[data-row]") as HTMLElement[];
      const chipY = (i: number) => CHIP_TOP + i * CHIP_GAP - (lead.offsetTop + rows[i].offsetTop);

      // ---- initial state
      gsap.set(q('[data-lj="world"]'), { transformOrigin: "50% 0%", scale: WORLD_SCALE + 0.09, filter: "blur(8px)" });
      gsap.set(q('[data-lj="sheet-wrap"]'), { transformOrigin: "50% 0%", scale: WORLD_SCALE, y: STAGE_H });
      gsap.set(q('[data-lj="backdrop"]'), { opacity: 0 });
      gsap.set(q('[data-step]:not([data-step="0"]) [data-in]'), { opacity: 0, y: 14 });
      gsap.set(q("[data-radio]"), { scale: 0 });
      gsap.set(q("[data-prog]"), { scaleX: 0 });
      gsap.set(q("[data-fieldval]"), { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(q("[data-fieldok]"), { opacity: 0 });
      gsap.set(q('[data-lj="revora-bg"], [data-lj="glow"], [data-lj="plate"], [data-rowlabel], [data-rowline], [data-rowring]'), { opacity: 0 });
      gsap.set(q('[data-lj="plate"]'), { scale: 0.95 });
      gsap.set(q('[data-lj="glow"]'), { scale: 0.8 });
      gsap.set(q('[data-lj="edge"], [data-lj="rule"]'), { scaleX: 0 });
      gsap.set(q('[data-lj="head"]'), { opacity: 0, y: 12 });
      gsap.set(q('[data-lj="title"]'), { yPercent: 105, filter: "blur(6px)" });
      gsap.set(q("[data-rowlabel]"), { y: 8 });
      gsap.set(rows, { opacity: 0, y: (i: number) => chipY(i) + 16 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      const tap = (id: string, press: string, at: number) => {
        const t = q(`[data-tap="${id}"]`);
        tl.fromTo(t, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.14 }, at)
          .to(t, { opacity: 0, scale: 1.45, duration: 0.42, ease: "power1.out" }, at + 0.18)
          .to(q(`[data-press="${press}"]`), { scale: 0.975, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, at);
      };
      const select = (i: number, at: number) => {
        const j = QUESTIONS[i].pick;
        tap(`opt-${i}`, `opt-${i}-${j}`, at);
        tl.to(q(`[data-opt="${i}-${j}"]`), { borderColor: BLUE, backgroundColor: "#ebf3ff", duration: 0.22 }, at + 0.08)
          .to(q(`[data-ring="${i}-${j}"]`), { borderColor: BLUE, duration: 0.22 }, at + 0.08)
          .to(q(`[data-radio="${i}-${j}"]`), { scale: 1, duration: 0.25 }, at + 0.1);
      };
      // Unpicked options fall away first, the choice lingers a beat, then
      // the next question builds in line by line.
      const advance = (i: number, at: number) => {
        const j = QUESTIONS[i].pick;
        tl.to(q(`[data-step="${i}"] [data-opt]:not([data-opt="${i}-${j}"])`), { opacity: 0, duration: 0.25, ease: "power1.out" }, at)
          .to(q(`[data-step="${i}"]`), { opacity: 0, x: -28, duration: 0.35, ease: "power2.in" }, at + 0.2)
          .to(q(`[data-prog="${i + 1}"]`), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, at + 0.2)
          .to(q(`[data-step="${i + 1}"] [data-in]`), { opacity: 1, y: 0, duration: 0.42, stagger: 0.05 }, at + 0.42);
      };

      // ---- 1. arrive inside the phone, casual scroll to the ad
      tl.to(q('[data-lj="world"]'), { scale: WORLD_SCALE, filter: "blur(0px)", duration: 0.9 }, 0)
        .to(list, { y: settleY * 0.42, duration: 1.0, ease: "power3.out" }, 0.8)
        .to(q('[data-lj="appbar"]'), { y: -APPBAR_H, duration: 0.35, ease: "power2.inOut" }, 0.85)
        .to(list, { y: settleY, duration: 1.5, ease: "power3.out" }, 2.0);

      // ---- 2. read the ad; slow camera push toward Get Quote, tap
      tl.to(q('[data-lj="world"]'), { scale: PUSH, x: -dS * (wx - STAGE_W / 2), y: -dS * wy, duration: 1.4, ease: "power2.inOut" }, 3.8);
      tap("quote", "quote", 5.0);

      // ---- 3. form sheet + qualification
      tl.to(q('[data-lj="backdrop"]'), { opacity: 1, duration: 0.4 }, 5.3)
        .to(q('[data-lj="sheet-wrap"]'), { y: 0, duration: 0.65, ease: "power3.out" }, 5.35)
        .to(q('[data-prog="0"]'), { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 5.8);
      select(0, 6.45);
      advance(0, 6.9);
      select(1, 7.8);
      advance(1, 8.25);
      select(2, 9.05);
      advance(2, 9.45);

      // contact details captured (profile prefill style)
      tl.to(q("[data-fieldval]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.42, ease: "power2.inOut", stagger: 0.26 }, 10.05)
        .to(q("[data-fieldok]"), { opacity: 1, duration: 0.25, stagger: 0.26 }, 10.4)
        .to(q("[data-field]"), { borderColor: "#b9cdf5", duration: 0.25, stagger: 0.26 }, 10.4);

      // ---- 4. submit, acknowledged
      tap("submit", "submit", 11.15);
      tl.to(q('[data-lj="submit-label"]'), { opacity: 0, duration: 0.18 }, 11.3)
        .to(q('[data-lj="submit-done"]'), { opacity: 1, duration: 0.22 }, 11.38);

      // ---- 5. the answers lift out of the form; the Meta world recedes
      tl.to(q('[data-lj="sheet-wrap"]'), { scale: WORLD_SCALE * 0.965, filter: "blur(7px)", opacity: 0.4, duration: 0.8, ease: "power2.inOut" }, 11.8)
        .to(q('[data-lj="backdrop"]'), { backgroundColor: "rgba(0,0,0,0.7)", duration: 0.8, ease: "power2.inOut" }, 11.8)
        .to(q('[data-lj="world"]'), { filter: "blur(8px)", duration: 0.8, ease: "power2.inOut" }, 11.8)
        .to(rows, { opacity: 1, y: (i: number) => chipY(i), duration: 0.55, stagger: { each: 0.09, from: "start" } }, 11.95);

      // ... and are carried into Revora's world. Glow + plate come up with
      // the background so the scene never drops to near-black.
      tl.to(q('[data-lj="revora-bg"]'), { opacity: 1, duration: 1.0, ease: "power2.inOut" }, 12.6)
        .to(q('[data-lj="glow"]'), { opacity: 1, scale: 1, duration: 1.8 }, 12.7)
        .to(q('[data-lj="sheet-wrap"]'), { opacity: 0, duration: 0.6 }, 12.6)
        .to(q("[data-rowbg]"), { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.14)", boxShadow: "0 14px 40px rgba(0,0,0,0)", duration: 0.8, ease: "power2.inOut" }, 12.7)
        .to(q("[data-rowchip]"), { color: "rgba(255,255,255,0.92)", duration: 0.8, ease: "power2.inOut" }, 12.7)
        .to(q("[data-rowsub]"), { color: "rgba(255,255,255,0.45)", duration: 0.8 }, 12.7);

      // 1) cards travel to their final rows, still showing the answers
      tl.to(rows, { y: 0, duration: 0.85, ease: "power3.inOut" }, 13.2)
        .to(q('[data-lj="plate"]'), { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }, 13.6)
        .to(q("[data-rowbg]"), { opacity: 0, duration: 0.5 }, 13.85);

      // 2) then, top to bottom, each answer hands over to its criterion:
      //    old text clears first, new label + check follow (no overlap)
      [0, 1, 2, 3].forEach((i) => {
        const at = 14.0 + i * 0.18;
        tl.to(q(`[data-rowchip="${i}"]`), { opacity: 0, y: -6, duration: 0.18, ease: "power1.in" }, at)
          .to(q(`[data-rowlabel="${i}"]`), { opacity: 1, y: 0, duration: 0.32 }, at + 0.17)
          .to(q(`[data-rowring="${i}"]`), { opacity: 1, duration: 0.25 }, at + 0.17)
          .to(q(`[data-check="${i}"]`), { strokeDashoffset: 0, duration: 0.32, ease: "power2.inOut" }, at + 0.24);
        if (i < 3) tl.to(q("[data-rowline]")[i], { opacity: 1, duration: 0.4 }, at + 0.2);
      });

      // ... resolving into the payoff title
      tl.to(q('[data-lj="head"]'), { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 14.45)
        .to(q('[data-lj="title"]'), { yPercent: 0, filter: "blur(0px)", duration: 1.05, ease: "power3.out" }, 14.55)
        .to(q('[data-lj="rule"]'), { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 15.05)
        .to(q('[data-lj="edge"]'), { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 15.05)
        .to(q('[data-rowring]'), { backgroundColor: `${ACCENT}14`, duration: 0.6 }, 15.2);

      tl.eventCallback("onComplete", () => {
        gsap.to(q('[data-lj="dot"]'), { opacity: 0.35, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) tl.progress(1);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "16 / 9" }}>
      <div
        ref={stageRef}
        className="absolute left-0 top-0 origin-top-left overflow-hidden"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          visibility: scale ? "visible" : "hidden",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div data-lj="world" className="absolute inset-0 bg-[#f0f2f5]">
          <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: STATUS_H }}>
            <div style={{ paddingTop: FEED_PAD }}><FeedList /></div>
          </div>
          <FeedChrome />
        </div>
        {/* soft lens falloff: reads as a lit screen, not a flat page */}
        <div className="pointer-events-none absolute inset-0 z-[24]" style={{ background: "radial-gradient(ellipse 75% 85% at 50% 50%, transparent 55%, rgba(20,24,32,0.14) 100%)" }} />

        <div data-lj="backdrop" className="absolute inset-0 z-[25]" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />
        <div data-lj="sheet-wrap" className="absolute z-30" style={{ top: SHEET_TOP, height: (STAGE_H - SHEET_TOP) / WORLD_SCALE, width: COL_W, left: (STAGE_W - COL_W) / 2 }}>
          <LeadForm />
        </div>

        <QualifiedLead />
      </div>
    </div>
  );
}
