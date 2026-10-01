import { Check, X } from "lucide-react";
import { AD, CONTACT_FIELDS, FORM_TITLE, QUESTIONS } from "./content";
import { AdImage, NorthlineMark, Tap } from "./primitives";

// Instant-Form-inspired sheet. Steps are stacked absolutely and swapped
// by the timeline ([data-step], [data-opt], [data-radio], [data-prog],
// [data-fieldval], [data-press="submit"]).

const BLUE = "#0866ff";

export default function LeadForm() {
  return (
    <div data-lj="sheet" className="absolute inset-0 flex flex-col overflow-hidden rounded-t-2xl bg-white" style={{ fontSize: 15 }}>
      <div className="relative h-[104px] shrink-0">
        <AdImage className="absolute inset-0 h-full w-full" position="center 40%" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent" />
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"><X size={20} color="#050505" /></span>
        <div className="absolute -bottom-7 left-6 rounded-full bg-white p-1"><NorthlineMark size={60} /></div>
      </div>

      <div className="px-6 pt-10">
        <div className="text-[14px] font-semibold text-[#65676b]">{AD.name}</div>
        <h3 className="mt-1 text-[26px] font-bold leading-tight text-[#050505]">{FORM_TITLE}</h3>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[#e4e6eb]">
              <div data-prog={i} className="h-full origin-left rounded-full" style={{ background: BLUE }} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        {QUESTIONS.map((step, i) => (
          <div key={i} data-step={i} className="absolute inset-x-0 top-0 px-6 pt-7">
            <div data-in className="mb-4 text-[19px] font-semibold text-[#050505]">{step.q}</div>
            <div className="space-y-3">
              {step.options.map((opt, j) => (
                <div
                  key={opt}
                  data-in
                  data-opt={`${i}-${j}`}
                  data-press={`opt-${i}-${j}`}
                  className="relative flex h-[58px] items-center justify-between rounded-xl border-[1.5px] px-5 text-[16px] text-[#050505]"
                  style={{ borderColor: "#ced0d4", background: "#ffffff" }}
                >
                  {opt}
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#8a8d91]" data-ring={`${i}-${j}`}>
                    <span data-radio={`${i}-${j}`} className="block h-[12px] w-[12px] rounded-full" style={{ background: BLUE }} />
                  </span>
                  {j === step.pick && <Tap id={`opt-${i}`} />}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div data-step={3} className="absolute inset-x-0 top-0 px-6 pt-7">
          <div data-in className="text-[19px] font-semibold text-[#050505]">Contact information</div>
          <div data-in className="mb-4 mt-1 text-[14px] text-[#65676b]">Northline Roofing will use this to prepare your estimate.</div>
          <div className="space-y-3">
            {CONTACT_FIELDS.map((f, i) => (
              <div key={f.label} data-in>
                <div className="mb-1.5 text-[13px] font-semibold text-[#65676b]">{f.label}</div>
                <div data-field={i} className="flex h-[48px] items-center justify-between rounded-xl border-[1.5px] border-[#ced0d4] px-4 text-[16px] text-[#050505]">
                  <span data-fieldval={i}>{f.value}</span>
                  <span data-fieldok={i}><Check size={18} color={BLUE} strokeWidth={2.6} /></span>
                </div>
              </div>
            ))}
          </div>
          <p data-in className="mt-3 text-[12px] leading-snug text-[#65676b]">
            By submitting, you agree to send your info to Northline Roofing, who agrees to use it according to their privacy policy.
          </p>
          <div data-in>
          <div data-press="submit" className="relative mt-3 flex h-[52px] items-center justify-center rounded-xl text-[16px] font-semibold tracking-[0.02em] text-white" style={{ background: BLUE }}>
            <span data-lj="submit-label">GET MY FREE ESTIMATE</span>
            <span data-lj="submit-done" className="absolute inset-0 flex items-center justify-center gap-2 opacity-0"><Check size={20} strokeWidth={2.8} /> Submitted</span>
            <Tap id="submit" />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
