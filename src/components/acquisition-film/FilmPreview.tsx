import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Pause, Play, RotateCcw } from "lucide-react";
import LeadJourney from "@/components/lead-journey/LeadJourney";
import ContractorLead from "@/components/contractor-lead/ContractorLead";
import { AccentContext } from "@/components/lead-journey/content";
import SearchScene from "@/components/acquisition-scroll/SearchScene";
import { makeScrubber, setScrubMode } from "@/components/acquisition-scroll/scrub";
import { NAVY, ORANGE } from "@/components/acquisition-scroll/beats";
import {
  CONTRACTOR_SCREEN_ASPECT, CONTRACTOR_SCREEN_TRACK, FILM_AT, FILM_BEATS, FILM_CONTRACTOR_PACE, FILM_DUR, FILM_FOOTAGE, FILM_JOURNEY_PACE, FILM_SEARCH_PACE,
  FILM_TOTAL, HOMEOWNER_SCREEN_ASPECT, HOMEOWNER_SCREEN_TRACK, type FilmFootage, type FilmFootageId,
} from "./film";
import { FULL, lerpQuad, quadMatrix3d, type Quad4 } from "./perspective";

// CLOCK-DRIVEN FILM PREVIEW of the acquisition source project. Same scene
// components and footage as /concept/acquisition-scroll, but one master
// timeline built in FILM SECONDS (film.ts) and played on GSAP's real-time
// clock instead of being scrubbed by scroll. Footage runs in the scrubber's
// "play" mode (native playback at the timeline's rate, drift-corrected).
// Picture only. This is the source a later frame-accurate render will use.

const CLEAN = "blur(0px) brightness(1)";
// one consistent filter format so GSAP interpolates every component
const F = (b: number, br = 1, c = 1, s = 1) => `blur(${b}px) brightness(${br}) contrast(${c}) saturate(${s})`;
type Look = { b: number; br: number; c: number; s: number };
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
const ease2in = (x: number) => x * x;
const ease2out = (x: number) => 1 - (1 - x) * (1 - x);

const fmt = (t: number) => `${t.toFixed(1)}s`;

// RENDER MODE (?render=1): picture only, full viewport, footage in pure
// seek mode, and a window.__film API that sets the master to an exact time
// and resolves once every video has finished seeking and painted -- so an
// external capture can step the timeline frame by frame (frame-accurate).
const RENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("render") === "1";

function Film() {
  const frameRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<gsap.core.Timeline | null>(null);
  const tls = useRef<{ search?: gsap.core.Timeline; journey?: gsap.core.Timeline; contractor?: gsap.core.Timeline }>({});
  const vids = useRef<Partial<Record<FilmFootageId, HTMLVideoElement | null>>>({});
  const barRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const beatRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const { search, journey, contractor } = tls.current;
    if (!frame || !search || !journey || !contractor || FILM_FOOTAGE.some((f) => !vids.current[f.id])) return;

    if (!RENDER) setScrubMode("play");
    const scrubbers = FILM_FOOTAGE.map((f) => ({ id: f.id, s: makeScrubber(vids.current[f.id]!, f.from, f.to) }));
    const seekers = Object.fromEntries(scrubbers.map(({ id, s }) => [id, s.seek])) as Record<FilmFootageId, (p: number) => void>;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(frame);
      const L = (id: string) => q(`[data-layer="${id}"]`);
      const V = (id: FilmFootageId) => vids.current[id]!;
      const at = FILM_AT;

      gsap.set(q("[data-layer]"), { autoAlpha: 0 });
      gsap.set(L("search"), { autoAlpha: 1 });

      const onUpdate = () => {
        const t = master.time();
        if (barRef.current) barRef.current.style.transform = `scaleX(${t / FILM_TOTAL})`;
        if (timeRef.current) timeRef.current.textContent = `${fmt(t)} / ${fmt(FILM_TOTAL)}`;
        const beat = [...FILM_BEATS].reverse().find((b) => t >= FILM_AT[b.id]);
        if (beatRef.current && beat) beatRef.current.textContent = beat.label;
      };
      const master = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate, onComplete: () => setPlaying(false) });
      master.to({}, { duration: FILM_TOTAL }, 0);

      const pace = (tl: gsap.core.Timeline, segs: [number, number][], start: number) => {
        let t = start;
        segs.forEach(([time, dur]) => { master.to(tl, { time, duration: dur }, t); t += dur; });
      };
      // Scrub a clip across its beat (uniform or paced). `lead` starts it
      // that many seconds early from its in-point, so an incoming clip is
      // already moving through a dissolve (never a frozen frame fading in).
      const scrub = (id: FilmFootageId, lead = 0) => {
        const f: FilmFootage = FILM_FOOTAGE.find((x) => x.id === id)!;
        const proxy = { p: 0 };
        const onUpdate = () => seekers[id](proxy.p);
        const segs = f.pace ?? [[f.to, FILM_DUR[id]]];
        let t = at[id] - lead;
        segs.forEach(([clipT, dur], i) => {
          const d = i === 0 ? dur + lead : dur;
          master.to(proxy, { p: (clipT - f.from) / (f.to - f.from), duration: d, onUpdate }, t);
          t += d;
        });
      };
      // short dissolve; pair with scrub(id, fade) so the incoming moves
      const crossIn = (id: FilmFootageId, prev: string, fade: number) => {
        master.to(L(id), { autoAlpha: 1, duration: fade, ease: "power1.inOut" }, at[id] - fade)
          .set(L(prev), { autoAlpha: 0 }, at[id] + 0.05);
      };
      // matched hard cut on the beat boundary
      const cutTo = (id: FilmFootageId, prev: string) => {
        master.set(L(id), { autoAlpha: 1 }, at[id]).set(L(prev), { autoAlpha: 0 }, at[id]);
      };
      // SEAM POLISH helpers (all scrubbed, short, only around the seam).
      // Forward camera moves -> blur that builds INTO the cut on the outgoing
      // shot and resolves OUT of it on the (already moving) incoming shot,
      // strength scaled to the move's speed, plus a tiny continued push.
      // Exposure/colour steps -> the incoming shot starts matched to the
      // outgoing one (measured luma/contrast/saturation) and eases to native.
      const blurInto = (el: Element, at: number, px: number, dur: number) =>
        master.fromTo(el, { filter: F(0) }, { filter: F(px), duration: dur, ease: "power2.in", immediateRender: false }, at - dur);
      const resolveFrom = (el: Element, start: number, look: Look, dur: number, push = 1) => {
        master.fromTo(el, { filter: F(look.b, look.br, look.c, look.s) }, { filter: F(0), duration: dur, ease: "power2.out", immediateRender: false }, start);
        if (push !== 1) master.fromTo(el, { scale: push }, { scale: 1, duration: dur, ease: "power2.out", immediateRender: false }, start);
      };

      // CAMERA ENTERS THE PHONE. Over the clip's final `segDur` (matching the
      // tracked source span) the footage pushes in digitally on the display
      // (with a little bloom and, at the fastest part, optical blur) while the
      // coded UI is perspective-mapped (homography -> matrix3d) onto the
      // TRACKED display quad -- position, scale, rotation, keystone -- and
      // masked to it. The UI starts matched to the physical screen's look
      // (soft, its brightness/contrast) and blends in over ~0.25s inside the
      // display; then, as the display fills the frame, the mapping
      // flattens/straightens to full frame while the UI sharpens to native.
      type Track = { t: number; q: Quad4 }[];
      const enterScreen = (o: {
        video: HTMLVideoElement; layer: HTMLElement; track: Track; aspect: number; Z: number;
        segDur: number; end: number; resetAt: number; ui: Look; bloom: number; footBlur: number;
      }) => {
        const { video, layer, track, Z, segDur, end, ui } = o;
        const t0 = end - segDur;
        const qEnd = track[track.length - 1].q;
        const O: [number, number] = [qEnd.reduce((s, p) => s + p[0], 0) / 4, qEnd.reduce((s, p) => s + p[1], 0) / 4];
        const quadAt = (srcT: number): Quad4 => {
          let i = 0;
          while (i < track.length - 2 && srcT > track[i + 1].t) i++;
          const a = track[i], b = track[i + 1];
          return lerpQuad(a.q, b.q, Math.min(1, Math.max(0, (srcT - a.t) / (b.t - a.t))));
        };
        const zoom = (q: Quad4, z: number): Quad4 => q.map(([x, y]) => [O[0] + (x - O[0]) * z, O[1] + (y - O[1]) * z]) as Quad4;
        const strip = (): Quad4 => {
          const sw = (o.aspect * layer.clientHeight) / Math.max(1, layer.clientWidth);
          return [[0.5 - sw / 2, 0], [0.5 + sw / 2, 0], [0.5 + sw / 2, 1], [0.5 - sw / 2, 1]];
        };
        const apply = (src: Quad4, dst: Quad4, look: Look) => {
          const w = layer.clientWidth, h = layer.clientHeight;
          if (!w || !h) return;
          const px = (q: Quad4): Quad4 => q.map(([x, y]) => [x * w, y * h]) as Quad4;
          layer.style.transformOrigin = "0 0";
          layer.style.transform = quadMatrix3d(px(src), px(dst));
          layer.style.clipPath = `polygon(${src.map(([x, y]) => `${(x * 100).toFixed(3)}% ${(y * 100).toFixed(3)}%`).join(", ")})`;
          layer.style.filter = F(look.b, look.br, look.c, look.s);
        };

        gsap.set(video, { transformOrigin: `${O[0] * 100}% ${O[1] * 100}%` });
        master.set(video, { scale: 1 }, o.resetAt);
        // phase 1: UI lives inside the tracked physical display
        const p1 = { t: 0 };
        master.to(p1, {
          t: 1,
          duration: segDur,
          onUpdate: () => {
            const e = ease2in(p1.t);
            gsap.set(video, { scale: 1 + (Z - 1) * e, filter: F(o.footBlur * e * e, 1 + o.bloom * e) });
            apply(strip(), zoom(quadAt(track[0].t + (track[track.length - 1].t - track[0].t) * p1.t), 1 + (Z - 1) * e), {
              b: ui.b * (1 - 0.3 * p1.t), br: ui.br, c: ui.c, s: ui.s,
            });
          },
        }, t0);
        master.to(layer, { autoAlpha: 1, duration: 0.25, ease: "sine.inOut" }, t0 + 0.04);
        // phase 2: flatten + straighten to full frame, sharpen to native
        const p2 = { u: 0 };
        master.to(p2, {
          u: 1,
          duration: 0.3,
          onUpdate: () => {
            const u = ease2out(p2.u);
            apply(lerpQuad(strip(), FULL, u), lerpQuad(zoom(qEnd, Z), FULL, u), {
              b: ui.b * 0.7 * (1 - u), br: lerpN(ui.br, 1, u), c: lerpN(ui.c, 1, u), s: lerpN(ui.s, 1, u),
            });
          },
        }, end);
      };

      // 1. search (Z -> bridge -> Prequel, locked seams) + approach, with
      //    label speed ramps (FILM_SEARCH_PACE spans search + approach)
      pace(search, FILM_SEARCH_PACE, at.search);

      // 2. approach -> HARD CUT -> through the glass (velocity carried by
      //    the window clip's pace) -> 0.3s dissolve on the near-static room
      //    (office already moving) -> 0.25s moving dissolve -> phone orbit/push
      cutTo("window", "search");
      scrub("window");
      crossIn("office", "window", 0.3);
      scrub("office", 0.3);
      crossIn("phone", "office", 0.25);
      scrub("phone", 0.25);

      // seam polish (search layer videos in DOM order: Prequel, bridge, Z)
      const [sPrequel, sBridge, sZ] = Array.from(L("search")[0].querySelectorAll("video"));
      // Z -> bridge (fast forward-down dive, ~78ms locked overlap): light
      // motion blur through the overlap; bridge matched to Z's contrast/exposure
      const zb = at.search + 3.5;
      blurInto(sZ, zb + 0.04, 2.5, 0.14);
      resolveFrom(sBridge, zb - 0.04, { b: 2.5, br: 1.04, c: 1.15, s: 1 }, 0.3);
      // approach -> window (8x -> 6x attack, hard cut): strong blur peaks on
      // the cut, the window shot carries a slight forward push out of it
      blurInto(sPrequel, at.window, 5, 0.08);
      resolveFrom(V("window"), at.window, { b: 5, br: 1, c: 1, s: 1.11 }, 0.18, 1.05);
      // window -> office (near-static, 0.3s dissolve): exposure only
      resolveFrom(V("office"), at.office - 0.3, { b: 0, br: 0.9, c: 1, s: 1.05 }, 0.6);
      // office -> phone (1.0x, 0.25s moving dissolve): exposure/saturation only
      resolveFrom(V("phone"), at.phone - 0.25, { b: 0, br: 0.9, c: 1.02, s: 1.09 }, 0.6);

      // 3. CAMERA ENTERS THE HOMEOWNER'S PHONE (tracked over source 7.0-8.6s)
      {
        const seg = FILM_FOOTAGE.find((f) => f.id === "phone")!.pace!;
        enterScreen({
          video: V("phone"), layer: L("journey")[0] as HTMLElement, track: HOMEOWNER_SCREEN_TRACK as Track,
          aspect: HOMEOWNER_SCREEN_ASPECT, Z: 2.0, segDur: seg[seg.length - 1][1], end: at.journey, resetAt: at.phone - 0.3,
          // the physical display is soft, bright and a little flat
          ui: { b: 2.2, br: 1.06, c: 0.86, s: 0.85 }, bloom: 0.12, footBlur: 1.5,
        });
      }
      master.set(L("phone"), { autoAlpha: 0 }, at.journey + 0.3);
      pace(journey, FILM_JOURNEY_PACE, at.journey);

      // 4. launch (authored 1.6s shape, scaled)
      const jq = gsap.utils.selector(L("journey")[0]);
      const obj = jq('[data-lj="lead-object"]');
      const t5 = at.launch;
      const k = FILM_DUR.launch / 1.6;
      master.set(L("aerial"), { autoAlpha: 1 }, t5)
        .to(jq('[data-lj="glow"]'), { opacity: 0.35, duration: 0.5 * k, ease: "power2.inOut" }, t5)
        .to(jq('[data-lj="head"]').slice(-1), { opacity: 0, duration: 0.35 * k }, t5)
        .to(obj, { scale: 1.035, duration: 0.18 * k, ease: "power2.out" }, t5)
        .to(obj, { scale: 0.86, duration: 0.4 * k, ease: "power2.inOut" }, t5 + 0.18 * k)
        .to(jq('[data-lj="rule"], [data-lj="edge"]'), { scaleX: 0.2, transformOrigin: "50% 50%", duration: 0.45 * k, ease: "power2.inOut" }, t5 + 0.1 * k)
        .to(obj, { scale: 9, filter: "blur(14px)", duration: 0.75 * k, ease: "power4.in" }, t5 + 0.58 * k)
        .to(L("journey"), { autoAlpha: 0, duration: 0.45 * k, ease: "power2.in" }, t5 + 0.88 * k)
        .fromTo(V("aerial"), { scale: 1.18, filter: "blur(8px)" }, { scale: 1, filter: CLEAN, duration: 0.9 * k, ease: "power3.out", immediateRender: false }, t5 + 0.9 * k);

      // 5. delivery: aerial -> DIRECT CUT (connector was generated from the
      //    aerial's last frame) -> connector -> 0.2s dissolve, both moving ->
      //    Northline
      scrub("aerial");
      cutTo("connector", "aerial");
      scrub("connector");
      crossIn("northline", "connector", 0.2);
      scrub("northline", 0.2);
      // aerial -> connector (2x street rip, direct cut): velocity blur peaks on
      // the cut; connector resolves with a small forward push + matched look
      master.fromTo(V("aerial"), { filter: CLEAN }, { filter: "blur(3px) brightness(1)", duration: 0.08, ease: "power2.in", immediateRender: false }, at.connector - 0.08);
      resolveFrom(V("connector"), at.connector, { b: 3, br: 0.955, c: 0.87, s: 1 }, 0.18, 1.03);
      // connector -> Northline (decelerating, 0.2s moving dissolve; framing +
      // colour differ in source): a whisper of blur across the dissolve and
      // Northline starts matched to the connector's exposure/saturation
      blurInto(V("connector"), at.northline, 1.2, 0.2);
      resolveFrom(V("northline"), at.northline - 0.2, { b: 1.2, br: 1.09, c: 1, s: 1.07 }, 0.5);

      // 6. CAMERA ENTERS THE CONTRACTOR'S PHONE (tracked over source 9.28-10.0s)
      enterScreen({
        video: V("northline"), layer: L("contractor")[0] as HTMLElement, track: CONTRACTOR_SCREEN_TRACK as Track,
        aspect: CONTRACTOR_SCREEN_ASPECT, Z: 1.6, segDur: 0.6, end: at.contractor, resetAt: at.northline - 0.3,
        // physical screen is a bright white app; the lock-screen UI is dark:
        // start the UI lifted/flat/soft so luminance interpolates, not flips
        ui: { b: 3, br: 2.4, c: 0.55, s: 0.6 }, bloom: 0.22, footBlur: 2,
      });
      master.set(L("northline"), { autoAlpha: 0 }, at.contractor + 0.3);
      pace(contractor, FILM_CONTRACTOR_PACE, at.contractor);

      FILM_FOOTAGE.forEach((f) => seekers[f.id](0));
      masterRef.current = master;
      if (RENDER) {
        const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
        const vids = Array.from(frame.querySelectorAll("video"));
        (window as unknown as { __film: unknown }).__film = {
          duration: FILM_TOTAL,
          ready: () => vids.every((v) => v.readyState >= 3),
          seek: async (t: number) => {
            master.time(t);
            let stable = 0;
            for (let i = 0; i < 400 && stable < 2; i++) {
              await raf();
              stable = vids.every((v) => !v.seeking && v.readyState >= 2) ? stable + 1 : 0;
            }
            await raf();
            await raf();
          },
        };
      }
      onUpdate();
    }, frame);

    // enable Play once every video in the film can play through
    const all = Array.from(frame.querySelectorAll("video"));
    const poll = window.setInterval(() => {
      if (all.every((v) => v.readyState >= 3)) { setReady(true); window.clearInterval(poll); }
    }, 250);

    return () => {
      window.clearInterval(poll);
      ctx.revert();
      scrubbers.forEach(({ s }) => s.dispose());
      setScrubMode("seek");
      masterRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const m = masterRef.current;
    if (!m || !ready) return;
    if (m.progress() >= 1) m.restart();
    else if (m.paused()) m.play();
    else m.pause();
    setPlaying(!m.paused());
  }, [ready]);

  const replay = useCallback(() => {
    const m = masterRef.current;
    if (!m || !ready) return;
    m.restart();
    setPlaying(true);
  }, [ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); toggle(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const onMissing = (src: string) => setMissing((m) => (m.includes(src) ? m : [...m, src]));
  const FRAME_W = "min(100%, calc((100svh - 120px) * 16 / 9))";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={frameRef}
        className={RENDER ? "fixed left-0 top-0 overflow-hidden" : "relative w-full overflow-hidden rounded-lg"}
        style={RENDER ? { width: "100vw", height: "100vh", background: NAVY } : { maxWidth: FRAME_W, aspectRatio: "16 / 9", background: NAVY }}
      >
        <div data-layer="search" className="absolute inset-0 z-[1]"><SearchScene film onTimeline={(tl) => (tls.current.search = tl)} onMissing={onMissing} /></div>
        {FILM_FOOTAGE.map((f, i) => (
          <video
            key={f.id}
            data-layer={f.id}
            ref={(el) => { vids.current[f.id] = el; }}
            src={f.src}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onError={() => onMissing(f.src)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: 2 + i }}
          />
        ))}
        <div data-layer="journey" className="absolute inset-0 z-[20]"><LeadJourney onTimeline={(tl) => (tls.current.journey = tl)} /></div>
        <div data-layer="contractor" className="absolute inset-0 z-[21]"><ContractorLead onTimeline={(tl) => (tls.current.contractor = tl)} /></div>
        {missing.length > 0 && (
          <div className="absolute left-4 top-4 z-40 rounded bg-black/80 px-4 py-3 font-mono text-xs text-[#ffb4a8]">
            Missing footage: {missing.map((m) => `public${m}`).join(", ")}
          </div>
        )}
      </div>

      {/* QA controls (outside the picture) */}
      <div className="w-full space-y-3" style={{ maxWidth: FRAME_W, display: RENDER ? "none" : undefined }}>
        <div className="h-[3px] w-full overflow-hidden rounded bg-white/10">
          <div ref={barRef} className="h-full w-full origin-left" style={{ background: ORANGE, transform: "scaleX(0)" }} />
        </div>
        <div className="flex items-center justify-between gap-4 text-xs text-white/55">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              disabled={!ready}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#0a1018] disabled:opacity-40"
              style={{ background: ORANGE }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />} {ready ? (playing ? "Pause" : "Play") : "Loading footage…"}
            </button>
            <button
              type="button"
              onClick={replay}
              disabled={!ready}
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/50 disabled:opacity-40"
            >
              <RotateCcw size={14} /> Replay
            </button>
          </div>
          <span ref={beatRef} className="hidden truncate uppercase tracking-[0.14em] md:block" />
          <span ref={timeRef} className="font-mono tabular-nums" />
        </div>
      </div>
    </div>
  );
}

export default function FilmPreview() {
  return (
    <AccentContext.Provider value={ORANGE}>
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-6 font-sans text-white" style={{ background: "#050505" }}>
        <Film />
      </main>
    </AccentContext.Provider>
  );
}
