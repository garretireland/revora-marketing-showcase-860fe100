import { useRef } from "react";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// The bridge from "that looked cool" to "I understand what Revora does":
// three stages on the same orange line the page has been using. Clear on
// who does what -- Revora builds and runs the system, the business answers,
// quotes and closes.

const STAGES = [
  {
    k: "Find",
    title: "The right homeowner",
    body: "We start with the work you want more of, build an offer around it, and put it in front of the right homeowners on Facebook and Instagram.",
  },
  {
    k: "Qualify",
    title: "The right opportunity",
    body: "Interested homeowners raise their hand. A short qualification step captures what they need and filters out the poor fits.",
  },
  {
    k: "Deliver",
    title: "The right moment",
    body: "Qualified opportunities reach you quickly, with follow-up in place so you can move while their interest is fresh.",
  },
];

export default function LeadGenSystem() {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-ls-head]", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08 })
      .from("[data-ls-line]", { scaleX: 0, duration: 1.2, ease: "power2.inOut" }, 0.25)
      .from("[data-ls-stage]", { opacity: 0, y: 18, duration: 0.7, ease: "power3.out", stagger: 0.25 }, 0.35)
      .from("[data-ls-foot]", { opacity: 0, duration: 0.7 }, 1.1);
  });

  return (
    <section ref={root} id="the-system" className="relative pb-16 pt-24 md:pb-20 md:pt-32" style={{ background: C.navy }}>
      <div className={CONTAINER}>
        <div className="max-w-[720px]">
          <p data-ls-head className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>What you just watched</p>
          <h2 data-ls-head className="mt-5 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1.03] tracking-[-0.03em]" style={{ color: C.text }}>
            The system behind the film.
          </h2>
          <p data-ls-head className="mt-6 max-w-[640px] text-[18px] leading-[1.6]" style={{ color: C.muted }}>
            Revora builds and runs the system that gets your offer in front of the right homeowners, qualifies the ones who raise their hand, and gets the right opportunities to you. You do what you already do best: answer, quote and close.
          </p>
        </div>

        <div className="relative mt-16 md:mt-20">
          <span data-ls-line className="absolute left-0 right-0 top-[38px] hidden h-px origin-left md:block" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.orange} 75%, rgba(255,136,56,0.15))` }} />
          <ol className="grid gap-14 md:grid-cols-3 md:gap-10">
            {STAGES.map((s, i) => (
              <li key={s.k} data-ls-stage className="relative">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[clamp(2.6rem,4vw,3.4rem)] font-medium leading-none tracking-[-0.03em]" style={{ color: i === 0 ? C.orange : C.text }}>{s.k}</span>
                  {i < STAGES.length - 1 && <span className="text-[20px] md:hidden" style={{ color: C.faint }}>↓</span>}
                </div>
                <h3 className="mt-9 text-[12px] font-semibold uppercase tracking-[0.26em]" style={{ color: C.faint }}>{s.title}</h3>
                <p className="mt-3 max-w-[330px] text-[16px] leading-[1.6]" style={{ color: C.muted }}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p data-ls-foot className="mt-16 max-w-[640px] border-l pl-5 text-[16px] leading-[1.6] md:mt-20" style={{ borderColor: C.orange, color: C.muted }}>
          <span style={{ color: C.text }}>Then it's your move.</span> We bring you the opportunity; you answer, quote and win the job. The strongest partnerships are the ones that work new opportunities fast.
        </p>
      </div>
    </section>
  );
}
