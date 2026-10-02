import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { C, CONTAINER } from "./tokens";
import { scrollToId } from "./scrollTo";
import { useEnter } from "./useEnter";

// Chapter change: website (CHOOSE) -> acquisition (FIND). Calls back to the
// diagnosis: there CHOOSE was orange; here the emphasis moves to FIND. The
// orange line leaves the container and runs out to the frame edge, as if
// heading out into the market. Sets up the acquisition film (next phase).

export default function Pivot() {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-pv-a]", { opacity: 0, y: 20, duration: 0.9, ease: "power3.out" })
      .from("[data-pv-b]", { opacity: 0, x: -36, duration: 1.0, ease: "power3.out" }, 0.35)
      .from("[data-pv-line]", { scaleX: 0, duration: 1.3, ease: "power2.inOut" }, 0.55)
      .from("[data-pv-foot]", { opacity: 0, y: 12, duration: 0.7, ease: "power2.out" }, 1.1);
  }, "top 70%");

  return (
    <section
      ref={root}
      id="lead-generation"
      className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-40"
      style={{ background: `radial-gradient(1200px 500px at 85% 110%, rgba(255,136,56,0.06), transparent 60%), ${C.ink}` }}
    >
      <div className={CONTAINER}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>Lead generation</p>
        <h2 className="mt-8 font-display text-[clamp(2.6rem,6.6vw,6.2rem)] font-medium leading-[1.0] tracking-[-0.035em]">
          <span data-pv-a className="block" style={{ color: "rgba(244,241,236,0.42)" }}>A great website makes them choose you.</span>
          <span data-pv-b className="mt-3 block" style={{ color: C.text }}>
            Lead generation makes sure they <span style={{ color: C.orange }}>find</span> you.
          </span>
        </h2>
      </div>

      {/* outward line: from the copy's edge to the frame edge */}
      <div className="mt-14 md:mt-20">
        <span data-pv-line className="block h-px origin-left" style={{ marginLeft: "max(24px, calc((100vw - 1240px) / 2 + 40px))", background: `linear-gradient(90deg, ${C.orange}, rgba(255,136,56,0.35) 60%, rgba(255,136,56,0))` }} />
      </div>

      <div className={`${CONTAINER} mt-8`}>
        <a data-pv-foot href="#acquisition-film" onClick={(e) => { e.preventDefault(); scrollToId("acquisition-film-player"); }} className="group inline-flex items-center gap-3 text-[15px]" style={{ color: C.muted }}>
          <span className="transition-colors group-hover:text-white">Watch one qualified lead get found, start to finish</span>
          <span style={{ color: C.faint }}>· 58 sec</span>
          <ArrowDown size={15} style={{ color: C.orange }} className="transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
