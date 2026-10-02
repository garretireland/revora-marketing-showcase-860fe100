import { useRef } from "react";
import { BookCall } from "./Cta";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// How it works: four safe, high-level steps on one orange line (the same
// line that rebuilt the site above now guides the process). No timelines,
// revision counts or deliverables -- those aren't finalised.

const STEPS = [
  { n: "01", title: "Show us your business", body: "We learn what you do, where you work, and how you show up online today." },
  { n: "02", title: "See the direction", body: "We shape how your business should present itself online and show you where we're taking it." },
  { n: "03", title: "We build it", body: "That direction becomes your actual website. We handle the build." },
  { n: "04", title: "Go live", body: "Your new website launches, and Website Care keeps the relationship going from there." },
];

export default function Process({ onPrimary }: { onPrimary: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-pr-head]", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08 })
      .from("[data-pr-line]", { scaleX: 0, duration: 1.4, ease: "power2.inOut" }, 0.2)
      .from("[data-pr-dot]", { scale: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.3 }, 0.35)
      .from("[data-pr-step]", { opacity: 0, y: 16, duration: 0.7, ease: "power3.out", stagger: 0.3 }, 0.4);
  });

  return (
    <section ref={root} id="how-it-works" className="relative py-24 md:py-32" style={{ background: C.navy }}>
      <div className={CONTAINER}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-pr-head className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>How it works</p>
            <h2 data-pr-head className="mt-5 max-w-[620px] font-display text-[clamp(2rem,3.8vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.03em]" style={{ color: C.text }}>
              Easy to start. We handle the build.
            </h2>
          </div>
        </div>

        <ol className="relative mt-16 grid gap-12 md:mt-20 md:grid-cols-4 md:gap-8">
          {/* the guiding line (horizontal on desktop, vertical when stacked) */}
          <span data-pr-line className="absolute left-0 right-0 top-[5px] hidden h-px origin-left md:block" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.orange} 70%, rgba(255,136,56,0.15))` }} />
          <span data-pr-line className="absolute bottom-2 left-[5px] top-2 w-px origin-top md:hidden" style={{ background: `linear-gradient(180deg, ${C.orange}, rgba(255,136,56,0.15))` }} />
          {STEPS.map((s) => (
            <li key={s.n} className="relative pl-8 md:pl-0 md:pt-10">
              <span data-pr-dot className="absolute left-0 top-0 h-[11px] w-[11px] rounded-full" style={{ background: C.ink, boxShadow: `inset 0 0 0 2px ${C.orange}` }} />
              <div data-pr-step>
                <div className="font-display text-[44px] font-medium leading-none tracking-[-0.03em]" style={{ color: "rgba(244,241,236,0.16)" }}>{s.n}</div>
                <h3 className="mt-4 text-[18px] font-semibold" style={{ color: C.text }}>{s.title}</h3>
                <p className="mt-2.5 max-w-[260px] text-[15px] leading-[1.6]" style={{ color: C.muted }}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div data-pr-cta className="mt-16 flex flex-col items-start gap-4 border-t pt-10 sm:flex-row sm:items-center md:mt-20" style={{ borderColor: C.line }}>
          <BookCall />
          <button type="button" onClick={onPrimary} className="text-[15px] font-medium underline decoration-white/25 underline-offset-[6px] transition-colors hover:decoration-white/70" style={{ color: C.muted }}>
            or see what we'd build for you
          </button>
        </div>
      </div>
    </section>
  );
}
