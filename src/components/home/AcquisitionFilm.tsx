import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import LeadJourney from "@/components/lead-journey/LeadJourney";
import LeadDelivery from "@/components/lead-delivery/LeadDelivery";
import { CLIPS } from "@/components/lead-delivery/clips";
import { ACCENT, CRITERIA, LEAD } from "@/components/lead-journey/content";

// Homepage wrapper for the acquisition film: LeadJourney (ad -> form ->
// qualified lead) hands over to LeadDelivery, which opens on the identical
// Qualified Lead frame. Starts when scrolled into view; the delivery
// footage only starts loading once the film is playing. Below 768px the
// 16:9 film would be unreadable, so a static summary is shown instead.

type Phase = "idle" | "journey" | "delivery";

export default function AcquisitionFilm() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !wide || phase !== "idle") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPhase("journey"); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, [wide, phase]);

  if (!wide) return <FilmFallback />;

  return (
    <div>
      <div ref={boxRef} className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b0c] shadow-[0_40px_120px_rgba(0,0,0,0.6)]" style={{ aspectRatio: "16 / 9" }}>
        {phase !== "idle" && (
          <div key={`j${run}`} className="absolute inset-0">
            <LeadJourney onComplete={() => setPhase("delivery")} />
          </div>
        )}
        {/* Delivery sits on top of the journey's identical final frame. */}
        {phase === "delivery" && (
          <div key={`d${run}`} className="absolute inset-0">
            <LeadDelivery />
          </div>
        )}
        {/* Warm the delivery footage while the journey plays. */}
        {phase === "journey" && CLIPS.map((c) => <video key={c.src} src={c.src} preload="auto" muted playsInline hidden />)}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-xs text-white/40">
        <span>Illustrative sequence. Northline Roofing and Daniel Mercer are fictional.</span>
        <button
          type="button"
          onClick={() => { setRun((r) => r + 1); setPhase("journey"); }}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <RotateCcw size={13} /> Replay
        </button>
      </div>
    </div>
  );
}

function FilmFallback() {
  const steps = ["A targeted ad reaches the right homeowner", "They request a quote and answer a few questions", "Revora qualifies the opportunity", "The contractor gets it and calls"];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-[15px] text-white/75">
            <span className="w-5 shrink-0 font-display text-white/40">{i + 1}</span>{s}
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-xl border border-white/10 bg-[#0a0b0c] p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: ACCENT }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} /> Qualified lead
        </div>
        <div className="mt-2 font-display text-3xl font-light text-white">{LEAD.name}</div>
        <ul className="mt-4 space-y-2">
          {CRITERIA.map((c) => (
            <li key={c} className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white/85">
              {c}<span style={{ color: ACCENT }}>✓</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-white/40">Watch the full film on a larger screen. Illustrative; names are fictional.</p>
    </div>
  );
}
