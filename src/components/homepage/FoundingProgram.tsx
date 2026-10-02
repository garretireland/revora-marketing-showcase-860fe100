import { useRef } from "react";
import { BookCall } from "./Cta";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";

// Founding Client Program (locked economics). Leads with the cohort, not
// the discount. Two clearly separated numbers: what Revora is paid vs the
// client's own Meta budget. The post-founding rate is agreed in writing at
// signup and deliberately NOT published here; internal budget flexibility
// is never shown.

const ASSURANCES = ["No setup fee", "Month-to-month", "Your own ad account", "No ad-spend markup"];

function Amount({ tag, value, unit, label, note, accent }: { tag: string; value: string; unit: string; label: string; note: string; accent?: boolean }) {
  return (
    <div data-fp-amount>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent ? C.orange : C.faint }}>{tag}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-[clamp(3.4rem,7vw,5.6rem)] font-medium leading-[0.9] tracking-[-0.045em]" style={{ color: C.text }}>{value}</span>
        <span className="text-[17px]" style={{ color: C.muted }}>{unit}</span>
      </div>
      <p className="mt-4 text-[16px] font-semibold" style={{ color: C.text }}>{label}</p>
      <p className="mt-1.5 max-w-[280px] text-[15px] leading-[1.55]" style={{ color: C.muted }}>{note}</p>
    </div>
  );
}

export default function FoundingProgram() {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-fp-head]", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08 })
      .from("[data-fp-amount]", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.2 }, 0.3)
      .from("[data-fp-plus]", { opacity: 0, scale: 0.6, duration: 0.5, ease: "power2.out" }, 0.55)
      .from("[data-fp-rest]", { opacity: 0, y: 12, duration: 0.7, ease: "power2.out", stagger: 0.1 }, 0.8);
  });

  return (
    <section
      ref={root}
      id="founding"
      className="relative pb-24 pt-20 md:pb-32 md:pt-24"
      style={{ background: `radial-gradient(1100px 520px at 12% 0%, rgba(255,136,56,0.05), transparent 60%), ${C.ink}` }}
    >
      <div className={CONTAINER}>
        <div className="max-w-[820px]">
          <p data-fp-head className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>Founding Client Program</p>
          <h2 data-fp-head className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-medium leading-[1.03] tracking-[-0.03em]" style={{ color: C.text }}>
            We're taking on our first 3 founding lead-generation clients.
          </h2>
          <p data-fp-head className="mt-6 max-w-[640px] text-[18px] leading-[1.6]" style={{ color: C.muted }}>
            We're building Revora's first lead-generation case studies with a small group of local service businesses, and working closely with each one on real campaigns. Founding clients receive preferred early-client pricing for their first 90 days.
          </p>
        </div>

        {/* the economics: two separate numbers, never one combined figure */}
        <div className="mt-16 grid items-start gap-10 border-t pt-12 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-12" style={{ borderColor: C.line }}>
          <Amount
            accent
            tag="Paid to Revora"
            value="$750"
            unit="/mo"
            label="Revora management"
            note="Founding rate for your first 90 days."
          />
          <div data-fp-plus className="flex items-center md:h-full md:pt-14">
            <span className="font-display text-[34px] font-medium" style={{ color: C.faint }}>+</span>
          </div>
          <Amount
            tag="Paid to Meta"
            value="$1,500"
            unit="/mo"
            label="Recommended ad spend"
            note="Paid directly to Meta from your own ad account. We don't mark it up."
          />
        </div>

        <p data-fp-rest className="mt-10 max-w-[680px] text-[16px] leading-[1.6]" style={{ color: C.muted }}>
          <span style={{ color: C.text }}>No surprises after day 90.</span> Your management rate after the founding period is agreed upfront, in writing, before we start.
        </p>

        <ul data-fp-rest className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {ASSURANCES.map((a) => (
            <li key={a} className="flex items-center gap-2.5 text-[15px] font-medium" style={{ color: C.text }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.orange }} /> {a}
            </li>
          ))}
        </ul>
        <p data-fp-rest className="mt-4 text-[15px]" style={{ color: C.faint }}>
          No long-term contract. If it isn't the right fit, you're not locked in.
        </p>

        {/* the conversion moment */}
        <div data-fp-rest className="mt-16 flex flex-col items-start gap-6 border-t pt-10 md:flex-row md:items-center md:justify-between" style={{ borderColor: C.line }}>
          <div className="max-w-[560px]">
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-tight tracking-[-0.02em]" style={{ color: C.text }}>
              Start with a call.
            </p>
            <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: C.muted }}>
              We'll look at your business, your market and the work you want more of. Founding partnerships are subject to fit: the numbers need to make sense for both of us.
            </p>
          </div>
          <BookCall />
        </div>
      </div>
    </section>
  );
}
