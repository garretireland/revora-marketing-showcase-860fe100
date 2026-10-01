import { ACCENT, ANSWERS, CRITERIA, LEAD, REVORA_BG } from "./content";

// Revora world. The rows start life as the homeowner's submitted answers
// (light, form-styled chips floating over the receding form), carry over
// as the background turns to Revora, then reorder/condense into the
// validated criteria under a "Qualified Lead" title. The held final
// frame ([data-lj="lead-object"]) is the handoff into the later
// "lead leaves the house" cinematic.

const META_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

export default function QualifiedLead() {
  return (
    <div data-lj="revora" className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center font-sans">
      <div data-lj="revora-bg" className="absolute inset-0" style={{ background: REVORA_BG }} />
      <div
        data-lj="glow"
        className="absolute left-1/2 top-1/2 h-[820px] w-[820px] rounded-full"
        style={{ marginLeft: -410, marginTop: -410, background: `radial-gradient(circle, ${ACCENT}1c 0%, ${ACCENT}08 36%, transparent 66%)` }}
      />

      <div data-lj="lead-object" className="relative w-[600px]">
        <div
          data-lj="plate"
          className="absolute -inset-x-14 -inset-y-12 rounded-[32px]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: `0 60px 160px rgba(0,0,0,0.7), 0 0 110px ${ACCENT}0f`,
          }}
        >
          <div data-lj="edge" className="absolute inset-x-12 top-0 h-px origin-left" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />
        </div>

        <div className="relative">
          <div data-lj="head" className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-white/50">
            <span data-lj="dot" className="h-2 w-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
            Northline Roofing · New opportunity
          </div>
          <div className="mt-4 overflow-hidden pb-2">
            <div data-lj="title" className="font-display text-[84px] font-light leading-[1] tracking-[-0.025em] text-white">Qualified Lead</div>
          </div>
          <div data-lj="rule" className="mt-3 h-[2px] w-28 origin-left" style={{ background: ACCENT }} />
          <div data-lj="head" className="mb-6 mt-5 text-[17px] text-white/60">{LEAD.name} · Full roof replacement</div>

          {CRITERIA.map((c, i) => (
            <div key={c} data-row={i} className="relative py-[15px]">
              <div
                data-rowbg={i}
                className="absolute -inset-x-5 inset-y-0 rounded-2xl"
                style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 14px 40px rgba(0,0,0,0.22)" }}
              />
              {i < 3 && <div data-rowline className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]" />}
              <div className="relative flex items-center justify-between">
                <div className="relative">
                  <div data-rowlabel={i} className="text-[15px] font-medium uppercase leading-[22px] tracking-[0.14em] text-white/90">{c}</div>
                  <div data-rowchip={i} className="absolute left-0 top-0 whitespace-nowrap text-[18px] font-semibold leading-[22px]" style={{ color: "#050505", fontFamily: META_FONT }}>
                    {ANSWERS[i]}
                  </div>
                  {i === 3 && <div data-rowsub className="mt-1.5 text-[14px]" style={{ color: "#65676b" }}>{LEAD.phone} · {LEAD.email}</div>}
                </div>
                <span data-rowring={i} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: `${ACCENT}66` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path data-check={i} d="M4.5 12.5 9.5 17.5 19.5 7" pathLength={1} stroke={ACCENT} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div data-lj="head" className="absolute -bottom-[96px] inset-x-0 text-center text-[12px] font-medium uppercase tracking-[0.3em] text-white/30">
          Qualified by Revora
        </div>
      </div>
    </div>
  );
}
