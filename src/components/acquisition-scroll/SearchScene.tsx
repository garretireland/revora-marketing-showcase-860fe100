import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BRIDGE, CANVASS, ORANGE, PREQUEL, SCENE_BRIDGE_AT, SCENE_PREQUEL_AT } from "./beats";
import { makeScrubber } from "./scrub";

// Opening, two system modes joined by real footage:
//   Z CANVASSING (broad service-area search; no house markers)
//   -> direct cut -> BRIDGE (dive through the canopy) -> direct cut ->
//   PREQUEL (individual candidate analysis: reject, reject, RIGHT FIT),
//   which runs on into the established approach (spliced in the source).
// All three clips are scrubbed; the intelligence layer is code. Authored
// in "scene seconds" (see beats.ts): Z 0-3.5, bridge 3.5-5.5, Prequel 5.5+.
// Marker keyframes are positions measured on the Prequel's frames, given
// in Prequel seconds (P + n below). Controlled-only: the paused timeline
// is handed to the scroll engine, which paces it via SEARCH_PACE.

const W = 1600, H = 900;
const P = SCENE_PREQUEL_AT; // scene time where the Prequel starts
const CANVASS_LEN = CANVASS.to - CANVASS.from;

// MOTION-HIDDEN SEAMS (revert: set all to 0 -> hard cuts). Scene seconds
// either side of each cut, derived from story time via SEARCH_PACE rates
// (Z 0.972, bridge 1.25, Prequel 0.916 scene-s per story-s):
//   Z -> bridge      ~70ms story: 0.035 story before / after the cut
//   bridge -> Prequel ~100ms story: 0.05 story before / after the cut
// During each window both clips keep scrubbing forward and the upper clip
// fades out over the lower one (no dip to black/white). Driven only by the
// scroll-scrubbed timeline, so reverse is the exact inverse.
const SEAM_ZB = { before: 0.034, after: 0.0438 };
const SEAM_BP = { before: 0.0625, after: 0.0458 };

type Track = [t: number, x: number, y: number][];
const TRACKS: Track[] = [
  [[0.0, 880, 315], [0.4, 992, 315], [0.8, 1040, 630]], // candidate #1
  [[1.5, 912, 270], [2.0, 896, 297], [2.4, 832, 495]], // candidate #2
  [[3.3, 768, 315], [4.45, 768, 322]], // the right house
];
const FIT = 2;

// FILM (V2) tracks: ONE physical anchor per house, hand-measured on the
// Prequel frames every ~0.1s (stage px; Prequel seconds), so the marker
// follows the same point as the camera moves instead of sliding across the
// property. #1: front gable roof apex. #2: left ridge vent. Right house:
// front gable apex (near-static).
const FILM_TRACKS: Track[] = [
  [[0.0, 885, 320], [0.1, 888, 326], [0.2, 894, 338], [0.3, 902, 351], [0.4, 908, 368], [0.5, 924, 395], [0.6, 933, 412], [0.7, 946, 441], [0.8, 963, 475], [0.85, 977, 498], [0.9, 986, 518], [0.95, 995, 534]],
  [[1.5, 867, 280], [1.6, 871, 282], [1.7, 875, 290], [1.8, 878, 298], [1.9, 886, 305], [2.0, 892, 322], [2.1, 897, 331], [2.2, 901, 345], [2.3, 909, 361], [2.4, 922, 385], [2.5, 938, 417], [2.6, 946, 437]],
  [[3.3, 764, 299], [3.6, 761, 309], [3.9, 763, 313], [4.2, 763, 311], [4.5, 760, 308], [4.8, 761, 305], [4.95, 759, 305]],
];
// FILM label timing (Prequel seconds): marker + CHECKING together, verdict,
// verdict held until the house leaves (rejections) / into the commit (fit)
const FILM_TIMING = [
  { on: 0.08, verdict: 0.42, off: 0.86 },
  { on: 1.5, verdict: 2.0, off: 2.56 },
  { on: 3.3, verdict: 3.6, off: 4.72 },
];

// V2 film marker: larger, readable pills (28px on the 1600 stage) sitting
// above-right of the anchor (flipped left if they'd leave the frame), so
// they sit over roof/sky rather than the facade.
function FilmMarker({ i, flip }: { i: number; flip: boolean }) {
  const pill = "absolute bottom-0 whitespace-nowrap rounded-full px-5 py-2 text-[28px] font-semibold uppercase leading-none tracking-[0.14em]";
  const side = flip ? "right-0" : "left-0";
  return (
    <div data-mk={i} className="absolute left-0 top-0">
      <span data-mk-ring={i} className="absolute rounded-full border-2 border-white/90" style={{ width: 80, height: 80, left: -40, top: -40 }} />
      <span data-mk-lock={i} className="absolute rounded-full border-[2.5px]" style={{ width: 112, height: 112, left: -56, top: -56, borderColor: ORANGE, boxShadow: `0 0 30px ${ORANGE}77` }} />
      <span data-mk-dot={i} className="absolute rounded-full bg-white" style={{ width: 14, height: 14, left: -7, top: -7, boxShadow: "0 0 0 5px rgba(255,255,255,0.22), 0 2px 10px rgba(0,0,0,0.55)" }} />
      <div className="absolute h-[48px] w-0" style={flip ? { right: 46, bottom: 30 } : { left: 46, bottom: 30 }}>
        <span data-mk-check={i} className={`${pill} ${side} bg-black/60 text-white/90 backdrop-blur-sm`} style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.35)" }}>Checking fit</span>
        <span data-mk-no={i} className={`${pill} ${side} bg-black/60 text-white/75 backdrop-blur-sm`} style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.35)" }}>✕ Not a fit</span>
        <span data-mk-yes={i} className={`${pill} ${side} text-[#0a1018]`} style={{ background: ORANGE, boxShadow: `0 8px 28px ${ORANGE}55` }}>Right fit</span>
      </div>
    </div>
  );
}

function Marker({ i }: { i: number }) {
  return (
    <div data-mk={i} className="absolute left-0 top-0">
      <span data-mk-ring={i} className="absolute rounded-full border-[1.5px] border-white/85" style={{ width: 64, height: 64, left: -32, top: -32 }} />
      <span data-mk-lock={i} className="absolute rounded-full border-2" style={{ width: 92, height: 92, left: -46, top: -46, borderColor: ORANGE, boxShadow: `0 0 26px ${ORANGE}66` }} />
      <span data-mk-dot={i} className="absolute rounded-full bg-white" style={{ width: 12, height: 12, left: -6, top: -6, boxShadow: "0 0 0 4px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.5)" }} />
      <div className="absolute whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ left: 44, top: -12 }}>
        <span data-mk-check={i} className="absolute left-0 top-0 rounded-full bg-black/55 px-3 py-1 text-white/85 backdrop-blur-sm">Checking fit</span>
        <span data-mk-no={i} className="absolute left-0 top-0 rounded-full bg-black/55 px-3 py-1 text-white/65 backdrop-blur-sm">✕ Not a fit</span>
        <span data-mk-yes={i} className="absolute left-0 top-0 rounded-full px-3 py-1 text-[#0a1018]" style={{ background: ORANGE }}>Right fit</span>
      </div>
    </div>
  );
}

// `film`: the V2 film treatment (stabilised tracks, larger retimed labels,
// no baked captions -- the homepage's live story layer carries that).
// Without it the scroll prototype renders exactly as before.
export default function SearchScene({ onTimeline, onMissing, film = false }: { onTimeline: (tl: gsap.core.Timeline) => void; onMissing: (src: string) => void; film?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvassRef = useRef<HTMLVideoElement>(null);
  const bridgeRef = useRef<HTMLVideoElement>(null);
  const prequelRef = useRef<HTMLVideoElement>(null);
  const controlRef = useRef(onTimeline);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = stageRef.current;
    const cv = canvassRef.current;
    const bv = bridgeRef.current;
    const pv = prequelRef.current;
    if (!root || !cv || !bv || !pv) return;
    // Z runs SEAM_ZB.after past its OUT; the bridge starts SEAM_ZB.before
    // ahead of its IN and spans to the Prequel window's end (its source
    // ends at 5.0s, so it is mapped ~2% slower rather than overrun).
    const zEnd = CANVASS.to + SEAM_ZB.after;
    const bStartScene = SCENE_BRIDGE_AT - SEAM_ZB.before;
    const bEndScene = SCENE_PREQUEL_AT + SEAM_BP.after;
    const sc = makeScrubber(cv, CANVASS.from, zEnd);
    const sb = makeScrubber(bv, BRIDGE.from - SEAM_ZB.before, BRIDGE.to);
    const sp = makeScrubber(pv, 0, null);
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const m = (part: string, i: number) => q(`[data-mk${part}="${i}"]`);

      gsap.set(q("[data-mk], [data-mk-ring], [data-mk-lock], [data-mk-check], [data-mk-no], [data-mk-yes]"), { opacity: 0 });
      gsap.set(q("[data-mk-ring]"), { scale: 0.5 });
      gsap.set(q("[data-mk-lock]"), { scale: 1.8 });
      gsap.set(q("[data-mk-dot]"), { scale: 0 });
      if (!film) gsap.set(q("[data-ss-cap]"), { opacity: 0, y: 8 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      tl.to({}, { duration: P + PREQUEL.len }, 0); // scene length

      // footage scrubs
      const pc = { p: 0 }, pb = { p: 0 }, pp = { p: 0 };
      tl.to(pc, { p: 1, duration: CANVASS_LEN + SEAM_ZB.after, ease: "none", onUpdate: () => sc.seek(pc.p) }, 0)
        .to(pb, { p: 1, duration: bEndScene - bStartScene, ease: "none", onUpdate: () => sb.seek(pb.p) }, bStartScene)
        .to(pp, { p: 1, duration: PREQUEL.len, ease: "none", onUpdate: () => sp.seek(pp.p) }, P);

      // Z CANVASSING copy (no markers on this footage)
      const cap = (id: string, inAt: number, outAt: number, outDur = 0.15) => {
        tl.to(q(`[data-ss-cap="${id}"]`), { opacity: 1, y: 0, duration: 0.15 }, inAt)
          .to(q(`[data-ss-cap="${id}"]`), { opacity: 0, y: -6, duration: outDur, ease: "power1.in" }, outAt);
      };
      if (!film) {
        cap("searching", 0.05, 2.2);
        cap("found", 2.45, SCENE_BRIDGE_AT - 0.12, 0.1);
      }
      // over the canopy dive; cleared before the Prequel cut, well ahead of
      // candidate #1's "Checking fit" (P + 0.24)
      if (!film) cap("analyzing", SCENE_BRIDGE_AT - 0.05, P - 0.25, 0.12);

      // motion-hidden seams: upper clip fades out over the moving lower one
      tl.fromTo(cv, { opacity: 1 }, { opacity: 0, duration: SEAM_ZB.before + SEAM_ZB.after, ease: "none", immediateRender: false }, SCENE_BRIDGE_AT - SEAM_ZB.before)
        .fromTo(bv, { opacity: 1 }, { opacity: 0, duration: SEAM_BP.before + SEAM_BP.after, ease: "none", immediateRender: false }, P - SEAM_BP.before);


      // markers ride their house (Prequel seconds -> scene seconds)
      (film ? FILM_TRACKS : TRACKS).forEach((track, i) => {
        gsap.set(m("", i), { x: track[0][1], y: track[0][2] });
        track.slice(1).forEach(([t, x, y], k) => {
          tl.to(m("", i), { x, y, duration: t - track[k][0], ease: "none" }, P + track[k][0]);
        });
      });
      const check = (i: number, appear: number, ring: number) => {
        tl.to(m("", i), { opacity: 1, duration: 0.08 }, P + appear)
          .to(m("-dot", i), { scale: 1, duration: 0.12 }, P + appear)
          .to(m("-ring", i), { opacity: 1, scale: 1, duration: 0.2 }, P + ring)
          .to(m("-check", i), { opacity: 1, duration: 0.1 }, P + ring + 0.04);
      };
      const reject = (i: number, at: number, clearBy: number) => {
        tl.to(m("-check", i), { opacity: 0, duration: 0.06 }, P + at)
          .to(m("-no", i), { opacity: 1, duration: 0.1 }, P + at + 0.04)
          .to(m("-dot", i), { backgroundColor: "#6b7280", duration: 0.1 }, P + at + 0.03)
          .to(m("-ring", i), { opacity: 0, scale: 0.6, duration: 0.15 }, P + at + 0.06)
          .to(m("", i), { opacity: 0, duration: 0.15, ease: "power1.in" }, P + clearBy - 0.15);
      };

      if (film) {
        // V2: marker, ring and CHECKING arrive together (no build-up), the
        // verdict lands as soon as the pass supports it and holds until the
        // house leaves frame; RIGHT FIT holds longest, with the orange lock.
        const arrive = (k: number, at: number) => {
          tl.to(m("", k), { opacity: 1, duration: 0.06 }, P + at)
            .to(m("-dot", k), { scale: 1, duration: 0.06 }, P + at)
            .to(m("-ring", k), { opacity: 1, scale: 1, duration: 0.12 }, P + at)
            .to(m("-check", k), { opacity: 1, duration: 0.06 }, P + at);
        };
        FILM_TIMING.forEach(({ on, verdict, off }, k) => {
          arrive(k, on);
          tl.to(m("-check", k), { opacity: 0, duration: 0.05 }, P + verdict);
          if (k === FIT) {
            tl.to(m("-yes", k), { opacity: 1, duration: 0.08 }, P + verdict + 0.01)
              .to(m("-dot", k), { backgroundColor: ORANGE, duration: 0.08 }, P + verdict + 0.01)
              .to(m("-ring", k), { opacity: 0, duration: 0.08 }, P + verdict + 0.02)
              .to(m("-lock", k), { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" }, P + verdict + 0.02)
              .to(m("", k), { opacity: 0, duration: 0.08, ease: "power1.in" }, P + off);
          } else {
            tl.to(m("-no", k), { opacity: 1, duration: 0.06 }, P + verdict + 0.01)
              .to(m("-dot", k), { backgroundColor: "#6b7280", duration: 0.08 }, P + verdict + 0.01)
              .to(m("-ring", k), { opacity: 0, scale: 0.6, duration: 0.12 }, P + verdict + 0.02)
              .to(m("", k), { opacity: 0, duration: 0.06, ease: "power1.in" }, P + off);
          }
        });
      } else {
        // candidate #1: dot at 0.08 (after "Analyzing fit…" starts clearing),
        // checking 0.24-0.52, ✕ 0.52, clear by 0.82
        check(0, 0.08, 0.2);
        reject(0, 0.52, 0.82);
        // candidate #2: checking 1.6-2.0, ✕ 2.1, clear by 2.5
        check(1, 1.5, 1.6);
        reject(1, 2.1, 2.5);
        // right house: checking 3.35, RIGHT FIT + lock 3.8, hold to 4.3,
        // everything gone by 4.45 -> the footage commits on its own
        check(FIT, 3.3, 3.35);
        tl.to(m("-check", FIT), { opacity: 0, duration: 0.06 }, P + 3.8)
          .to(m("-yes", FIT), { opacity: 1, duration: 0.1 }, P + 3.82)
          .to(m("-dot", FIT), { backgroundColor: ORANGE, duration: 0.1 }, P + 3.82)
          .to(m("-ring", FIT), { opacity: 0, duration: 0.1 }, P + 3.85)
          .to(m("-lock", FIT), { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" }, P + 3.85)
          .to(q('[data-ss-cap="fit"]'), { opacity: 1, y: 0, duration: 0.12 }, P + 3.82)
          .to([m("", FIT), q('[data-ss-cap="fit"]')], { opacity: 0, duration: 0.15, ease: "power1.in" }, P + 4.3);
      }

      sc.seek(0);
      sb.seek(0);
      sp.seek(0);
      controlRef.current(tl);
    }, root);
    return () => {
      ctx.revert();
      sc.dispose();
      sb.dispose();
      sp.dispose();
    };
  }, [film]);

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden bg-[#0a1018]" style={{ aspectRatio: "16 / 9" }}>
      <div
        ref={stageRef}
        className="absolute left-0 top-0 origin-top-left overflow-hidden font-sans"
        style={{ width: W, height: H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {/* stacked: Prequel under, bridge, Z canvass on top (cut away in turn) */}
        <video ref={prequelRef} src={PREQUEL.src} muted playsInline preload="auto" disablePictureInPicture onError={() => onMissing(PREQUEL.src)} className="absolute inset-0 h-full w-full object-cover" />
        <video ref={bridgeRef} src={BRIDGE.src} muted playsInline preload="auto" disablePictureInPicture onError={() => onMissing(BRIDGE.src)} className="absolute inset-0 h-full w-full object-cover" />
        <video ref={canvassRef} src={CANVASS.src} muted playsInline preload="auto" disablePictureInPicture onError={() => onMissing(CANVASS.src)} className="absolute inset-0 h-full w-full object-cover" />
        {film
          ? FILM_TRACKS.map((t, i) => <FilmMarker key={i} i={i} flip={Math.max(...t.map(([, x]) => x)) + 46 + 360 > W - 40} />)
          : TRACKS.map((_, i) => <Marker key={i} i={i} />)}

        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(10,16,24,0.55) 100%)" }} />

        {!film && <>
        <div data-ss-cap="searching" className="absolute left-16 top-16 max-w-xl">
          <div className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: ORANGE }}>Customer acquisition</div>
          <div className="mt-3 font-display text-[52px] font-light leading-[1.05] text-white">Searching your service area…</div>
        </div>
        {[["found", "Candidates found", "rgba(255,255,255,0.85)"], ["analyzing", "Analyzing fit…", ORANGE], ["fit", "Right fit found", ORANGE]].map(([id, text, dot]) => (
          <div key={id} data-ss-cap={id} className="absolute bottom-16 left-16 text-[14px] font-semibold uppercase tracking-[0.24em] text-white/90">
            <span className="mr-3 inline-block h-2 w-2 rounded-full align-middle" style={{ background: dot }} />
            {text}
          </div>
        ))}
        </>}
      </div>
    </div>
  );
}
