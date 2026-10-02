import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import QualifiedLead from "@/components/lead-journey/QualifiedLead";
import { ACCENT, STAGE_H, STAGE_W } from "@/components/lead-journey/content";
import ContractorLead from "@/components/contractor-lead/ContractorLead";
import { CLIPS, HANDOFF, HOLD, WHIP_IN, WHIP_OUT } from "./clips";

// ISOLATED PROTOTYPE -- back half of the lead cinematic, for judging seams:
// accepted Qualified Lead frame -> launch -> physical aerial clip(s) ->
// whip cut -> Northline arrival -> into the contractor's phone -> the
// accepted contractor-lead sequence. Both frozen prototypes are reused
// read-only: QualifiedLead is posed in its final state with the same
// values lead-journey's timeline ends on; ContractorLead plays its own
// approved timeline from the moment it mounts.

const SMEAR = "blur(8px) brightness(1.25)";
const CLEAN = "blur(0px) brightness(1)";

export default function LeadDelivery() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contractorRef = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const rafRef = useRef(0);
  const current = useRef(0);
  const started = useRef(false);

  const [scale, setScale] = useState(0);
  const [ready, setReady] = useState<boolean[]>(() => CLIPS.map(() => false));
  const [missing, setMissing] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [contractor, setContractor] = useState(false);
  const markReady = (i: number) => setReady((r) => (r[i] ? r : r.map((x, j) => (j === i ? true : x))));
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pose QualifiedLead exactly as /concept/lead-journey leaves it.
  useLayoutEffect(() => {
    const root = frameRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stageRef.current);
      gsap.set(q("[data-rowbg], [data-rowchip]"), { opacity: 0 });
      gsap.set(q("[data-rowsub]"), { color: "rgba(255,255,255,0.45)" });
      gsap.set(q("[data-rowring]"), { backgroundColor: `${ACCENT}14` });
      gsap.set(q("[data-check]"), { strokeDashoffset: 0 });
      gsap.to(q('[data-lj="dot"]'), { opacity: 0.35, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      // Clips stack earliest-on-top; each waits on its first frame beneath.
      vids.current.forEach((v, i) => v && gsap.set(v, { zIndex: CLIPS.length - i }));
    }, root);
    ctxRef.current = ctx;
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, []);

  const playClip = useCallback((i: number) => {
    const v = vids.current[i];
    if (!v) return;
    current.current = i;
    const { out } = CLIPS[i];
    const next = vids.current[i + 1];
    v.play().then(() => setBlocked(false)).catch(() => setBlocked(true));

    let fired = false;
    const tick = () => {
      const left = v.duration - v.currentTime;
      if (!fired && v.duration && out === "whip" && left <= WHIP_OUT) {
        fired = true;
        if (!reduce) ctxRef.current?.add(() => gsap.to(v, { scale: 1.1, filter: SMEAR, duration: WHIP_OUT, ease: "power2.in" }));
      }
      if (!fired && v.duration && out === "digital" && left <= HANDOFF) {
        fired = true;
        ctxRef.current?.add(() => gsap.to(v, { scale: 1.08, filter: "brightness(1.2)", duration: HANDOFF, ease: "power2.in" }));
        setContractor(true);
      }
      if (!v.ended) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (out === "digital" || !next) return; // last frame holds under the digital layer
      gsap.set(v, { autoAlpha: 0 });
      if (out === "whip" && !reduce) {
        ctxRef.current?.add(() => gsap.fromTo(next, { scale: 1.1, filter: SMEAR }, { scale: 1, filter: CLEAN, duration: WHIP_IN, ease: "power2.out" }));
      }
      playClip(i + 1);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [reduce]);

  // Launch once every clip can play through.
  const allReady = ready.every(Boolean);
  useEffect(() => {
    if (!allReady || started.current || !ctxRef.current) return;
    started.current = true;
    ctxRef.current.add(() => {
      const q = gsap.utils.selector(stageRef.current);
      const obj = q('[data-lj="lead-object"]');
      const v0 = vids.current[0];
      const tl = gsap.timeline({ delay: HOLD });

      // surroundings recede; the lead becomes the single focus
      tl.to(q('[data-lj="glow"]'), { opacity: 0.35, duration: 0.6, ease: "power2.inOut" }, 0)
        .to(q('[data-lj="head"]').slice(-1), { opacity: 0, duration: 0.4 }, 0)
        // compress inward; lime rule + edge converge on centre
        .to(obj, { scale: 0.86, duration: 0.55, ease: "power2.inOut" }, 0.1)
        .to(q('[data-lj="rule"], [data-lj="edge"]'), { scaleX: 0.2, transformOrigin: "50% 50%", duration: 0.55, ease: "power2.inOut" }, 0.1)
        // forward momentum, accelerating hard into the footage
        .call(() => playClip(0), [], 0.62)
        .to(obj, { scale: 9, filter: "blur(14px)", duration: 0.75, ease: "power4.in" }, 0.65)
        .to(q('[data-lj="revora-bg"], [data-lj="glow"]'), { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.95)
        .fromTo(v0, { scale: 1.18, filter: "blur(8px)" }, { scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, 1.0)
        .to(obj, { opacity: 0, duration: 0.25, ease: "power1.in" }, 1.15)
        .set(stageRef.current, { autoAlpha: 0 });

      if (reduce) tl.progress(1);
    });
  }, [allReady, playClip, reduce]);

  useLayoutEffect(() => {
    if (!contractor || !contractorRef.current) return;
    const t = gsap.fromTo(contractorRef.current, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.4, ease: "power1.inOut" });
    return () => { t.kill(); };
  }, [contractor, reduce]);

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden bg-[#0a0b0c]" style={{ aspectRatio: "16 / 9" }}>
      {CLIPS.map((c, i) => (
        <video
          key={c.src}
          ref={(el) => (vids.current[i] = el)}
          src={c.src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          // A clip with a start offset is seeked there first and only counts
          // as ready once that frame is decoded, so the launch reveals it.
          onLoadedMetadata={(e) => { if (c.start) e.currentTarget.currentTime = c.start; }}
          onSeeked={(e) => { if (e.currentTarget.readyState >= 3) markReady(i); }}
          onCanPlayThrough={(e) => { if (!c.start || e.currentTarget.currentTime >= c.start - 0.05) markReady(i); }}
          onError={() => setMissing((m) => (m.includes(c.src) ? m : [...m, c.src]))}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}

      <div
        ref={stageRef}
        className="absolute left-0 top-0 z-20 origin-top-left overflow-hidden"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        <QualifiedLead />
      </div>

      {contractor && (
        <div ref={contractorRef} className="absolute inset-0 z-30 opacity-0">
          <ContractorLead />
        </div>
      )}

      {missing.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-black/80 px-6 py-4 font-mono text-[13px] leading-relaxed text-[#ffb4a8]">
          Missing physical footage:
          {missing.map((m) => <div key={m}>public{m}</div>)}
        </div>
      )}
      {blocked && missing.length === 0 && (
        <button
          type="button"
          onClick={() => playClip(current.current)}
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 px-6 py-3 text-sm text-white"
        >
          Autoplay blocked · Click to play
        </button>
      )}
    </div>
  );
}
