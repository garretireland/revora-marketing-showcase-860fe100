import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { BookCall } from "./Cta";
import { C, CONTAINER } from "./tokens";
import { onSectionClick } from "./scrollTo";

gsap.registerPlugin(ScrollTrigger);

// Editorial FIND vs CHOOSE split: the job is won twice. Left = getting
// found (lead generation), right = getting chosen (website). A thin
// spine joins them; "not sure" bridges underneath. Motion is semantic:
// FIND resolves first, then CHOOSE, then the spine draws between them.

function Side({ word, n, question, body, verdict, href, cta, accent }: {
  word: string; n: string; question: string; body: string; verdict: string; href: string; cta: string; accent?: boolean;
}) {
  return (
    <div data-dx-side className="py-10 md:py-0">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[12px]" style={{ color: C.faint }}>{n}</span>
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>{question}</span>
      </div>
      <div data-dx-word className="mt-5 font-display text-[clamp(4.2rem,11vw,9.5rem)] font-medium leading-[0.85] tracking-[-0.045em]" style={{ color: accent ? C.orange : C.text }}>
        {word}
      </div>
      <p className="mt-7 max-w-[420px] text-[17px] leading-[1.6]" style={{ color: C.muted }}>{body}</p>
      <p className="mt-5 text-[16px] font-medium" style={{ color: C.text }}>{verdict}</p>
      <a href={`/${href}`} onClick={(e) => onSectionClick(e, href.slice(1))} className="group mt-6 inline-flex items-center gap-2 text-[14px] font-medium" style={{ color: accent ? C.orange : C.text }}>
        {cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export default function Diagnosis() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      tl.from("[data-dx-head]", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08 })
        .from("[data-dx-side]", { opacity: 0, y: 26, duration: 0.9, ease: "power3.out", stagger: 0.22 }, 0.25)
        .from("[data-dx-spine]", { scaleY: 0, duration: 0.9, ease: "power2.inOut" }, 0.6)
        .from("[data-dx-bridge]", { opacity: 0, y: 14, duration: 0.7, ease: "power2.out" }, 1.0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="diagnosis" className="relative pb-20 pt-28 md:pb-[104px] md:pt-40" style={{ background: C.ink }}>
      <div className={CONTAINER}>
        <div className="max-w-[760px]">
          <h2 data-dx-head className="font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-medium leading-[1.02] tracking-[-0.03em]" style={{ color: C.text }}>
            You have to win every job twice.
          </h2>
          <p data-dx-head className="mt-6 max-w-[560px] text-[18px] leading-[1.6]" style={{ color: C.muted }}>
            First the homeowner has to find you. Then they have to choose you. Most businesses are losing work at one of those two moments.
          </p>
        </div>

        <div className="relative mt-20 grid md:mt-28 md:grid-cols-2 md:gap-0">
          <div className="md:pr-14 lg:pr-20">
            <Side
              n="01" word="Find" question="Not getting found?"
              body="The phone isn't ringing enough, work comes in waves, or almost everything you get is a referral."
              verdict="That's a lead-generation problem."
              href="#lead-generation" cta="How we find the opportunity"
            />
          </div>
          <div data-dx-spine className="absolute bottom-0 left-1/2 top-0 hidden w-px origin-top md:block" style={{ background: `linear-gradient(180deg, transparent, ${C.line} 15%, ${C.line} 85%, transparent)` }} />
          <div className="border-t md:border-t-0 md:pl-14 lg:pl-20" style={{ borderColor: C.line }}>
            <Side
              n="02" word="Choose" question="Found, but not chosen?" accent
              body="People look you up, but what they see doesn't give them a reason to choose you."
              verdict="That's a website problem."
              href="#websites" cta="See what we'd change"
            />
          </div>
        </div>

        <div data-dx-bridge className="mt-20 flex flex-col items-start gap-4 border-t pt-10 md:mt-28 md:flex-row md:items-center md:justify-between" style={{ borderColor: C.line }}>
          <p className="text-[17px]" style={{ color: C.muted }}>
            <span style={{ color: C.text }}>Not sure which one it is?</span> That's the first thing we figure out together.
          </p>
          <BookCall variant="outline" />
        </div>
      </div>
    </section>
  );
}
