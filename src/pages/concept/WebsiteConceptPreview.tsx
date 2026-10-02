import { Link } from "react-router-dom";
import { C } from "@/components/homepage/tokens";
import { useConceptFonts } from "@/components/concepts/shared";
import { AshgroveBrowser, AshgrovePhoneFrame } from "@/components/concepts/Ashgrove";
import { CalderBrowser, CalderPhoneFrame } from "@/components/concepts/Calder";

// Review route for the finished (static) website concepts. Not linked from
// the site. Desktop page + phone page, each in its brand-matched frame.
const CONCEPTS = {
  ashgrove: { name: "Ashgrove Outdoor Living", trade: "Landscape design & build", note: "Photography-led. The backyard sells itself.", Browser: AshgroveBrowser, Phone: AshgrovePhoneFrame, other: "calder" },
  calder: { name: "Calder Concrete", trade: "Residential concrete", note: "Structured and exact, like the work.", Browser: CalderBrowser, Phone: CalderPhoneFrame, other: "ashgrove" },
} as const;

export default function WebsiteConceptPreview({ concept }: { concept: keyof typeof CONCEPTS }) {
  useConceptFonts();
  const c = CONCEPTS[concept];
  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: C.navy, color: C.text }}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>Static design checkpoint · {c.trade}</p>
            <h1 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-tight">{c.name}</h1>
            <p className="mt-2 text-[15px]" style={{ color: C.muted }}>{c.note} <span style={{ color: C.faint }}>· Design concept by Revora</span></p>
          </div>
          <Link to={`/concept/${c.other}`} className="text-[13px] underline underline-offset-4" style={{ color: C.muted }}>View {CONCEPTS[c.other].name} →</Link>
        </div>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_300px]">
          <div><p className="mb-3 text-[11px] uppercase tracking-[0.25em]" style={{ color: C.faint }}>Desktop</p><c.Browser /></div>
          <div className="mx-auto w-full max-w-[300px]"><p className="mb-3 text-[11px] uppercase tracking-[0.25em]" style={{ color: C.faint }}>Mobile</p><c.Phone /></div>
        </div>
      </div>
    </div>
  );
}
