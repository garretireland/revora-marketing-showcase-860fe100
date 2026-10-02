import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeadJourney from "@/components/lead-journey/LeadJourney";
import ContractorLead from "@/components/contractor-lead/ContractorLead";
import { AccentContext } from "@/components/lead-journey/content";
import SearchScene from "./SearchScene";
import { makeScrubber } from "./scrub";
import { BEATS, BEAT_AT, BEAT_DUR, CONTRACTOR_PACE, FOOTAGE, JOURNEY_PACE, NAVY, ORANGE, SCROLL_VH, SEARCH_PACE, TOTAL, type Footage, type FootageId } from "./beats";

// ENGINE PROTOTYPE -- pinned, scroll-controlled acquisition cinematic.
// One section pins; one paused master timeline (in story seconds, see
// beats.ts) is scrubbed by ScrollTrigger, so nothing advances until the
// visitor scrolls through, and scrolling back reverses it. Scenes are
// layers: code scenes (SearchScene, LeadJourney, ContractorLead) hand
// their paused timelines to the master; footage is scrubbed by seeking
// video.currentTime from a proxy tween (videos never play()).

gsap.registerPlugin(ScrollTrigger);

const SMEAR = "blur(8px) brightness(1.25)";
const SOFT_SMEAR = "blur(5px) brightness(1.1)";
const CLEAN = "blur(0px) brightness(1)";

// 16:9 box that covers the viewport (crops edges rather than letterbox).
function Cover({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "max(100vw, calc(100vh * 16 / 9))", aspectRatio: "16 / 9" }}>
      {children}
    </div>
  );
}

function Engine() {
  const sectionRef = useRef<HTMLElement>(null);
  const tls = useRef<{ search?: gsap.core.Timeline; journey?: gsap.core.Timeline; contractor?: gsap.core.Timeline }>({});
  const vids = useRef<Partial<Record<FootageId, HTMLVideoElement | null>>>({});
  const barRef = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState<string[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const { search, journey, contractor } = tls.current;
    if (!section || !search || !journey || !contractor || FOOTAGE.some((f) => !vids.current[f.id])) return;

    const scrubbers = FOOTAGE.map((f) => ({ id: f.id, s: makeScrubber(vids.current[f.id]!, f.from, f.to) }));
    const seekers = Object.fromEntries(scrubbers.map(({ id, s }) => [id, s.seek])) as Record<FootageId, (p: number) => void>;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const L = (id: string) => q(`[data-layer="${id}"]`);
      const V = (id: FootageId) => vids.current[id]!;
      const at = BEAT_AT;
      // Drive a paused scene timeline's playhead through uneven segments.
      const pace = (tl: gsap.core.Timeline, segs: [number, number][], start: number) => {
        let t = start;
        segs.forEach(([time, dur]) => { master.to(tl, { time, duration: dur }, t); t += dur; });
      };

      gsap.set(q("[data-layer]"), { autoAlpha: 0 });
      gsap.set(L("search"), { autoAlpha: 1 });

      const master = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      master.to({}, { duration: TOTAL }, 0); // fixes the master's length

      // Scrub a clip across its beat (optionally starting `lead` early so it
      // is already moving under an incoming transition).
      const scrub = (id: FootageId, lead = 0) => {
        const proxy = { p: 0 };
        const f: Footage = FOOTAGE.find((x) => x.id === id)!;
        const onUpdate = () => seekers[id](proxy.p);
        if (!f.pace || !f.to) {
          master.to(proxy, { p: 1, duration: BEAT_DUR[id] + lead, onUpdate }, at[id] - lead);
          return;
        }
        let t = at[id];
        f.pace.forEach(([clipT, dur]) => {
          master.to(proxy, { p: (clipT - f.from) / (f.to! - f.from), duration: dur, onUpdate }, t);
          t += dur;
        });
      };
      const crossIn = (id: string, prev: string, fade: number) => {
        master.to(L(id), { autoAlpha: 1, duration: fade, ease: "power1.inOut" }, at[id as FootageId] - fade)
          .set(L(prev), { autoAlpha: 0 }, at[id as FootageId] + 0.05);
      };

      // 1. search footage + code overlays, paced unevenly (SEARCH_PACE) by
      // tweening the paused search timeline's playhead.
      pace(search, SEARCH_PACE, at.search);

      // (the approach is the tail of SearchScene's Prequel clip -- same
      // video, no seam; SEARCH_PACE spans the search + approach beats)

      // 2. window -> through the glass -> office -> homeowner -> phone:
      // matched clip boundaries, joined with very short dissolves
      crossIn("window", "search", 0.11);
      scrub("window");
      crossIn("office", "window", 0.13);
      scrub("office");
      crossIn("phone", "office", 0.13);
      scrub("phone");
      // keep pushing as the coded phone screen takes over
      master.to(V("phone"), { scale: 1.14, filter: "brightness(1.18)", duration: 0.6, ease: "power2.in" }, at.journey - 0.6);

      // 3. homeowner's phone: LeadJourney, scroll-controlled (its own
      // blur/scale settle reads as the camera arriving in the screen)
      master.to(L("journey"), { autoAlpha: 1, duration: 0.35, ease: "power1.inOut" }, at.journey - 0.3)
        .set(L("phone"), { autoAlpha: 0 }, at.journey + 0.2);
      pace(journey, JOURNEY_PACE, at.journey);

      // 4. launch (LeadDelivery's look): a small charge, compress, then
      // accelerate out into the world as the journey layer drops away
      const jq = gsap.utils.selector(L("journey")[0]);
      const obj = jq('[data-lj="lead-object"]');
      const t5 = at.launch;
      const k = BEAT_DUR.launch / 1.6; // launch authored for 1.6s; same shape, scaled
      master.set(L("aerial"), { autoAlpha: 1 }, t5)
        .to(jq('[data-lj="glow"]'), { opacity: 0.35, duration: 0.5 * k, ease: "power2.inOut" }, t5)
        .to(jq('[data-lj="head"]').slice(-1), { opacity: 0, duration: 0.35 * k }, t5)
        .to(obj, { scale: 1.035, duration: 0.18 * k, ease: "power2.out" }, t5)
        .to(obj, { scale: 0.86, duration: 0.4 * k, ease: "power2.inOut" }, t5 + 0.18 * k)
        .to(jq('[data-lj="rule"], [data-lj="edge"]'), { scaleX: 0.2, transformOrigin: "50% 50%", duration: 0.45 * k, ease: "power2.inOut" }, t5 + 0.1 * k)
        .to(obj, { scale: 9, filter: "blur(14px)", duration: 0.75 * k, ease: "power4.in" }, t5 + 0.58 * k)
        .to(L("journey"), { autoAlpha: 0, duration: 0.45 * k, ease: "power2.in" }, t5 + 0.88 * k)
        .fromTo(V("aerial"), { scale: 1.18, filter: "blur(8px)" }, { scale: 1, filter: CLEAN, duration: 0.9 * k, ease: "power3.out", immediateRender: false }, t5 + 0.9 * k);

      // 5. one continuous flight: aerial -> connector -> Northline
      scrub("aerial");
      master.to(V("aerial"), { filter: SOFT_SMEAR, duration: 0.18, ease: "power2.in" }, at.connector - 0.18);
      crossIn("connector", "aerial", 0.18);
      master.fromTo(V("connector"), { filter: SOFT_SMEAR }, { filter: CLEAN, duration: 0.27, ease: "power2.out", immediateRender: false }, at.connector - 0.09);
      scrub("connector");
      // connector 3.6s and Northline 1.0s are the same near-static wide shot
      crossIn("northline", "connector", 0.21);
      scrub("northline");
      master.to(V("northline"), { scale: 1.08, filter: "brightness(1.2)", duration: 0.36, ease: "power2.in" }, at.contractor - 0.36);

      // 6. contractor's phone: ContractorLead, scroll-controlled
      master.to(L("contractor"), { autoAlpha: 1, duration: 0.3, ease: "power1.inOut" }, at.contractor - 0.27);
      pace(contractor, CONTRACTOR_PACE, at.contractor);

      FOOTAGE.forEach((f) => seekers[f.id](0));

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${(SCROLL_VH / 100) * window.innerHeight}`,
        pin: true,
        scrub: 0.6,
        animation: master,
        onUpdate: (self) => {
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });
    }, section);

    return () => {
      ctx.revert();
      scrubbers.forEach(({ s }) => s.dispose());
    };
  }, []);

  const onVideoError = (src: string) => setMissing((m) => (m.includes(src) ? m : [...m, src]));

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ background: NAVY }}>
      <div data-layer="search" className="absolute inset-0 z-[1] overflow-hidden"><Cover><SearchScene onTimeline={(tl) => (tls.current.search = tl)} onMissing={onVideoError} /></Cover></div>
      {FOOTAGE.map((f, i) => (
        <video
          key={f.id}
          data-layer={f.id}
          ref={(el) => { vids.current[f.id] = el; }}
          src={f.src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onError={() => onVideoError(f.src)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 2 + i }}
        />
      ))}
      <div data-layer="journey" className="absolute inset-0 z-[20] overflow-hidden"><Cover><LeadJourney onTimeline={(tl) => (tls.current.journey = tl)} /></Cover></div>
      <div data-layer="contractor" className="absolute inset-0 z-[21] overflow-hidden"><Cover><ContractorLead onTimeline={(tl) => (tls.current.contractor = tl)} /></Cover></div>

      {/* thin scroll-progress line (prototype beat labels removed) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
        <div className="h-[2px] w-full bg-white/10"><div ref={barRef} className="h-full w-full origin-left" style={{ background: ORANGE, transform: "scaleX(0)" }} /></div>
      </div>
      {missing.length > 0 && (
        <div className="absolute left-5 top-5 z-40 rounded bg-black/80 px-4 py-3 font-mono text-xs text-[#ffb4a8]">
          Missing footage: {missing.map((m) => `public${m}`).join(", ")}
        </div>
      )}
    </section>
  );
}

function Storyboard() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: ORANGE }}>Desktop prototype</div>
      <h1 className="mt-4 font-display text-4xl font-light leading-tight">The scroll cinematic is desktop-only for now.</h1>
      <p className="mt-4 text-white/60">Open on a screen at least 1024px wide with motion enabled. Storyboard:</p>
      <ol className="mt-8 space-y-3">
        {BEATS.map((b, i) => (
          <li key={b.id} className="flex gap-4 border-b border-white/10 pb-3 text-[15px] text-white/80">
            <span className="w-5 font-display text-white/40">{i + 1}</span>{b.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AcquisitionScroll() {
  const [desktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  return (
    <AccentContext.Provider value={ORANGE}>
      <div className="min-h-screen font-sans text-white" style={{ background: NAVY }}>
        {desktop ? (
          <>
            <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
              <div className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: ORANGE }}>Engine prototype · scroll-controlled</div>
              <h1 className="mt-5 font-display text-5xl font-light">Acquisition cinematic</h1>
              <p className="mt-6 text-white/50">Scroll to begin ↓</p>
            </section>
            <Engine />
            <section className="flex h-screen items-center justify-center text-white/40">End of prototype · scroll up to reverse</section>
          </>
        ) : (
          <Storyboard />
        )}
      </div>
    </AccentContext.Provider>
  );
}
