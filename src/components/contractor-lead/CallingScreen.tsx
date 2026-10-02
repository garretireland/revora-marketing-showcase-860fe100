import { PhoneOff } from "lucide-react";
import { LEAD, REVORA_BG, useAccent } from "@/components/lead-journey/content";

// Minimal outgoing-call state. HANDOFF: [data-contractor-handoff="calling"]
// is the stable final frame where the live-action cinematic takes over
// (homeowner's phone rings in the office).
export default function CallingScreen() {
  const ACCENT = useAccent();
  return (
    <div data-contractor-handoff="calling" className="absolute inset-0 z-40 flex flex-col items-center justify-center font-sans" style={{ background: REVORA_BG }}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full" style={{ marginLeft: -380, marginTop: -430, background: `radial-gradient(circle, ${ACCENT}14 0%, ${ACCENT}05 38%, transparent 66%)` }} />

      <div data-cl-call-in className="relative mb-9 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-white/45">
        <span className="h-2 w-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
        Qualified lead · Full roof replacement
      </div>

      <div data-cl-call-in className="relative flex h-[150px] w-[150px] items-center justify-center">
        <span data-cl="ring" className="absolute inset-0 rounded-full border" style={{ borderColor: `${ACCENT}80` }} />
        <span data-cl="ring" className="absolute inset-0 rounded-full border" style={{ borderColor: `${ACCENT}80` }} />
        <span className="flex h-full w-full items-center justify-center rounded-full border font-display text-[54px] font-light text-white" style={{ borderColor: `${ACCENT}55`, background: "rgba(255,255,255,0.04)" }}>
          DM
        </span>
      </div>

      <div data-cl-call-in className="relative mt-9 font-display text-[76px] font-light leading-none tracking-[-0.02em] text-white">{LEAD.name}</div>
      <div data-cl-call-in className="relative mt-5 text-[24px] text-white/65">
        <span data-cl="calling-label">Calling…</span>
      </div>
      <div data-cl-call-in className="relative mt-2 text-[16px] text-white/35">{LEAD.phone} · Northline Roofing</div>

      <div data-cl-call-in className="absolute bottom-[70px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#e5484d]">
        <PhoneOff size={28} color="#fff" strokeWidth={2.2} />
      </div>
    </div>
  );
}
