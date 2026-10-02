import { Phone } from "lucide-react";
import { LEAD, useAccent } from "@/components/lead-journey/content";

// The three faces of the single travelling lead shell (see
// ContractorLead.tsx): the arrived lead object, the compressed
// notification, and the expanded actionable lead. Each face is laid out
// at its own target size; the timeline morphs the shell and crossfades.

const DETAIL_ROWS = ["Full roof replacement", "Within 30 days", "Homeowner", "Contact details captured"];

export function RevoraIcon({ size = 52 }: { size?: number }) {
  const ACCENT = useAccent();
  return (
    <span className="relative flex shrink-0 items-center justify-center rounded-[14px] bg-[#0a0b0c]" style={{ width: size, height: size, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}>
      <span className="absolute rounded-full border" style={{ width: size * 0.46, height: size * 0.46, borderColor: `${ACCENT}80` }} />
      <span className="rounded-full" style={{ width: size * 0.16, height: size * 0.16, background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
      <span data-cl="pulse" className="absolute inset-0 rounded-[14px] border-2 opacity-0" style={{ borderColor: ACCENT }} />
    </span>
  );
}

function Check({ i }: { i: number }) {
  const ACCENT = useAccent();
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}14` }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path data-cl-check={i} d="M4.5 12.5 9.5 17.5 19.5 7" pathLength={1} stroke={ACCENT} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" />
      </svg>
    </span>
  );
}

// Echo of the homeowner sequence's final frame, arriving.
export function ObjectFace() {
  const ACCENT = useAccent();
  return (
    <div data-cl="face-object" className="absolute left-0 top-0 w-[640px] px-12 pt-11">
      <div className="absolute inset-x-12 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
        <span className="h-2 w-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
        Northline Roofing · New opportunity
      </div>
      <div className="mt-4 font-display text-[66px] font-light leading-none tracking-[-0.025em] text-white">Qualified Lead</div>
      <div className="mt-4 h-[2px] w-24" style={{ background: ACCENT }} />
      <div className="mt-5 text-[16px] text-white/60">{LEAD.name} · Full roof replacement</div>
    </div>
  );
}

export function NotificationFace() {
  const ACCENT = useAccent();
  return (
    <div data-cl="face-notif" className="absolute left-0 top-0 flex w-[760px] items-center gap-5 px-6 py-[22px]">
      <RevoraIcon />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-[14px] font-semibold uppercase tracking-[0.16em] text-white/50">
          <span>Revora</span>
          <span className="normal-case tracking-normal text-white/40">now</span>
        </div>
        <div className="mt-1 text-[22px] font-semibold text-white">
          <span style={{ color: ACCENT }}>New qualified lead</span> · {LEAD.name}
        </div>
        <div className="mt-0.5 text-[17px] text-white/60">Full roof replacement · Within 30 days</div>
      </div>
    </div>
  );
}

export function DetailFace() {
  const ACCENT = useAccent();
  return (
    <div data-cl="face-detail" className="absolute left-0 top-0 w-[760px] px-11 pt-10">
      <div data-cl-in className="flex items-center gap-4">
        <RevoraIcon size={44} />
        <div className="flex-1 text-[14px] font-semibold uppercase tracking-[0.18em] text-white/55">Revora</div>
        <div className="text-[15px] text-white/40">Northline Roofing · just now</div>
      </div>

      <div data-cl-in className="mt-9 flex items-center gap-3 text-[14px] font-semibold uppercase tracking-[0.26em]" style={{ color: ACCENT }}>
        <span className="h-2 w-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
        New qualified lead
      </div>
      <div data-cl-in className="mt-3 font-display text-[64px] font-light leading-none tracking-[-0.02em] text-white">{LEAD.name}</div>

      <div className="mt-7">
        {DETAIL_ROWS.map((r, i) => (
          <div key={r} data-cl-in className="flex items-center justify-between border-b border-white/[0.08] py-[13px]">
            <span className="text-[16px] font-medium uppercase tracking-[0.14em] text-white/90">{r}</span>
            <Check i={i} />
          </div>
        ))}
      </div>

      <div data-cl-in className="mt-6 flex items-end justify-between">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/40">Phone</div>
          <div className="mt-1.5 text-[30px] font-medium tracking-[0.01em] text-white">{LEAD.phone}</div>
        </div>
        <div className="pb-1 text-[15px] text-white/40">{LEAD.email}</div>
      </div>

      <div data-cl-in className="mt-7">
        <div data-cl="call" className="relative flex h-[76px] items-center justify-center gap-3 overflow-hidden rounded-[20px] text-[19px] font-bold uppercase tracking-[0.16em]" style={{ background: ACCENT, color: "#0a0b0c", boxShadow: `0 18px 50px ${ACCENT}26` }}>
          <Phone size={22} strokeWidth={2.4} fill="#0a0b0c" />
          Call lead
          <span data-cl="tap" aria-hidden className="pointer-events-none absolute rounded-full opacity-0" style={{ width: 84, height: 84, left: "calc(50% - 42px)", top: "calc(50% - 42px)", background: "rgba(0,0,0,0.22)" }} />
        </div>
      </div>

      <div data-cl-in className="mt-5 text-center text-[12px] font-medium uppercase tracking-[0.3em] text-white/30">Qualified by Revora</div>
    </div>
  );
}
