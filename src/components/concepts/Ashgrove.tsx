import { ConceptImage, Fit, type Slot } from "./shared";

// ASHGROVE OUTDOOR LIVING -- fictional premium landscape design/build
// company (design concept by Revora). Photography-led and centred: the
// image IS the hero, type sits quietly inside it, and the page breathes on
// cream. Deliberately unlike Northline (dark, left-aligned, conversion-
// stacked) and Calder (gridded, asymmetric, typographic).

const ASH = { cream: "#F3EEE4", charcoal: "#23241F", sage: "#6E7A5E", stone: "#B9A88E", creamText: "#F7F3EA" };
const SERIF = '"Cormorant Garamond", "Cormorant", Georgia, serif';
const SANS = "Inter, system-ui, sans-serif";

const ASH_SLOTS = {
  hero: { id: "ashgrove-hero", label: "twilight pool + terrace", tone: "linear-gradient(180deg,#1b2231 0%,#343a4a 30%,#6d5842 58%,#2c5a62 76%,#1a2729 100%)" },
  kitchen: { id: "ashgrove-kitchen", label: "outdoor kitchen", tone: "linear-gradient(160deg,#3a3229,#8a6a48 55%,#2c2620)" },
  terrace: { id: "ashgrove-terrace", label: "stone terrace + fire", tone: "linear-gradient(170deg,#8f8473,#c4b79f 50%,#655c4e)" },
  garden: { id: "ashgrove-garden", label: "garden design", tone: "linear-gradient(165deg,#47553f,#7d8a66 50%,#2f3a2b)" },
} satisfies Record<string, Slot>;

// Legibility over the real photo: a top shade for the nav, a soft wide
// shade behind the headline, a light floor. No flat dark overlay.
const HERO_VEIL_DESKTOP = [
  "radial-gradient(44% 44% at 50% 64%, rgba(10,13,17,0.46) 0%, rgba(10,13,17,0.2) 55%, rgba(10,13,17,0) 78%)",
  "linear-gradient(180deg, rgba(12,14,18,0.62) 0%, rgba(12,14,18,0.18) 22%, rgba(12,14,18,0) 34%)",
  "linear-gradient(0deg, rgba(12,14,18,0.32) 0%, rgba(12,14,18,0) 22%)",
].join(", ");
const HERO_VEIL_PHONE = [
  "radial-gradient(70% 30% at 50% 74%, rgba(10,13,17,0.5) 0%, rgba(10,13,17,0.2) 60%, rgba(10,13,17,0) 85%)",
  "linear-gradient(180deg, rgba(12,14,18,0.58) 0%, rgba(12,14,18,0) 24%)",
  "linear-gradient(0deg, rgba(12,14,18,0.42) 0%, rgba(12,14,18,0) 26%)",
].join(", ");
const TEXT_SHADOW = "0 1px 2px rgba(0,0,0,0.25), 0 4px 28px rgba(0,0,0,0.38)";

// Per-tile crops (object-position). Desktop tiles are wide (~2.5:1), phone
// tiles near-square (~1.25:1), so each image is framed for its subject.
const PROJECTS = [
  // golden hour: counter + five stools, grill, timber ceiling edge
  { slot: ASH_SLOTS.kitchen, title: "Outdoor kitchen", tag: "Outdoor living", desk: "50% 66%", phone: "38% 60%" },
  // dusk: fire table + sectional, lit steps leading in
  { slot: ASH_SLOTS.terrace, title: "Stone terrace", tag: "Hardscaping", desk: "50% 58%", phone: "52% 62%" },
  // warm golden hour: limestone steppers through hydrangeas + grasses
  { slot: ASH_SLOTS.garden, title: "Garden design", tag: "Landscape design", desk: "50% 60%", phone: "62% 60%" },
];

function Wordmark({ size = 28, sub = 9 }: { size?: number; sub?: number }) {
  return (
    <div className="leading-none" style={{ color: ASH.creamText }}>
      <div style={{ fontFamily: SERIF, fontSize: size, fontWeight: 500, letterSpacing: "0.01em" }}>Ashgrove</div>
      <div className="mt-1" style={{ fontFamily: SANS, fontSize: sub, letterSpacing: "0.38em", opacity: 0.78 }}>OUTDOOR LIVING</div>
    </div>
  );
}

function Pillars({ size }: { size: number }) {
  return (
    <div className="flex items-center justify-center gap-5" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: size, color: ASH.charcoal }}>
      {["Design", "Build", "Care"].map((w, i) => (
        <span key={w} className="flex items-center gap-5">
          {i > 0 && <span className="block h-[5px] w-[5px] rounded-full" style={{ background: ASH.sage }} />}
          {w}
        </span>
      ))}
    </div>
  );
}

// 1280 x 800 desktop page
export function AshgroveDesktop() {
  return (
    <div className="relative h-[800px] w-[1280px] overflow-hidden" style={{ background: ASH.cream, fontFamily: SANS }}>
      {/* hero: the photograph carries the page */}
      <div className="absolute inset-x-0 top-0 h-[500px]">
        {/* crop low: the headline sits over the dark pool water, with the
            cabana + house above it (the photo's busiest, brightest band) */}
        <ConceptImage slot={ASH_SLOTS.hero} position="50% 100%" />
        <div className="absolute inset-0" style={{ background: HERO_VEIL_DESKTOP }} />
      </div>
      <nav className="absolute inset-x-0 top-0 flex h-[84px] items-center justify-between px-14">
        <Wordmark />
        <div className="flex gap-9 text-[13px]" style={{ color: "rgba(247,243,234,0.9)", textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}>
          {["Projects", "Services", "Process", "Studio"].map((l) => <span key={l}>{l}</span>)}
        </div>
        <span className="pb-0.5 text-[13px]" style={{ color: ASH.creamText, borderBottom: "1px solid rgba(247,243,234,0.6)" }}>Plan your project</span>
      </nav>
      <div className="absolute inset-x-0 top-[232px] text-center" style={{ color: ASH.creamText, textShadow: TEXT_SHADOW }}>
        <div className="text-[10px] uppercase tracking-[0.42em]" style={{ opacity: 0.92 }}>Landscape design &amp; build</div>
        <h1 className="mt-4 text-[78px] leading-[0.98]" style={{ fontFamily: SERIF, fontWeight: 300, letterSpacing: "-0.01em" }}>
          Outdoor spaces,<br /><span style={{ fontStyle: "italic" }}>made for living.</span>
        </h1>
        <span className="mt-6 inline-block rounded-full px-7 py-3 text-[13px] font-medium" style={{ background: ASH.creamText, color: ASH.charcoal, textShadow: "none", boxShadow: "0 8px 24px -10px rgba(0,0,0,0.5)" }}>Plan your project</span>
      </div>

      {/* the practice, then the work */}
      <div className="absolute inset-x-0 top-[528px]"><Pillars size={21} /></div>
      <div className="absolute left-14 right-14 top-[586px] grid grid-cols-3 gap-6">
        {PROJECTS.map((p) => (
          <div key={p.title}>
            <div className="h-[150px] overflow-hidden rounded-[2px]"><ConceptImage slot={p.slot} position={p.desk} /></div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[20px]" style={{ fontFamily: SERIF, color: ASH.charcoal }}>{p.title}</span>
              <span className="text-[9px] uppercase tracking-[0.26em]" style={{ color: ASH.sage }}>{p.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 390 x 844 phone page
export function AshgrovePhone() {
  return (
    <div className="relative h-[844px] w-[390px] overflow-hidden" style={{ background: ASH.cream, fontFamily: SANS }}>
      <div className="absolute inset-x-0 top-0 h-[560px]">
        {/* portrait crop: cabana edge, lit trees, house corner; pool below */}
        <ConceptImage slot={ASH_SLOTS.hero} position="58% 50%" />
        <div className="absolute inset-0" style={{ background: HERO_VEIL_PHONE }} />
      </div>
      <div className="absolute inset-x-0 top-[58px] flex items-start justify-between px-6">
        <Wordmark size={24} sub={7.5} />
        <span className="mt-1.5 flex flex-col gap-[6px]"><i className="block h-px w-6" style={{ background: ASH.creamText }} /><i className="block h-px w-4 self-end" style={{ background: ASH.creamText }} /></span>
      </div>
      <div className="absolute inset-x-0 top-[354px] px-6 text-center" style={{ color: ASH.creamText, textShadow: TEXT_SHADOW }}>
        <div className="text-[9px] uppercase tracking-[0.4em]" style={{ opacity: 0.92 }}>Landscape design &amp; build</div>
        <h1 className="mt-4 text-[44px] leading-[0.98]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
          Outdoor spaces,<br /><span style={{ fontStyle: "italic" }}>made for living.</span>
        </h1>
        <span className="mt-5 inline-block rounded-full px-6 py-3 text-[13px] font-medium" style={{ background: ASH.creamText, color: ASH.charcoal, textShadow: "none", boxShadow: "0 8px 24px -10px rgba(0,0,0,0.5)" }}>Plan your project</span>
      </div>
      <div className="absolute inset-x-0 top-[586px]"><Pillars size={18} /></div>
      <div className="absolute left-6 right-6 top-[630px] grid grid-cols-2 gap-3">
        {PROJECTS.slice(0, 2).map((p) => (
          <div key={p.title}>
            <div className="h-[132px] overflow-hidden rounded-[2px]"><ConceptImage slot={p.slot} position={p.phone} /></div>
            <div className="mt-2.5 text-[17px] leading-tight" style={{ fontFamily: SERIF, color: ASH.charcoal }}>{p.title}</div>
            <div className="mt-1 text-[8px] uppercase tracking-[0.24em]" style={{ color: ASH.sage }}>{p.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Brand-matched device frames: soft, warm, rounded.
export function AshgroveBrowser() {
  return (
    <div className="overflow-hidden rounded-[14px]" style={{ background: "#EAE3D6", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}>
      <div className="relative flex h-[34px] items-center px-4">
        <span className="flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="block h-[9px] w-[9px] rounded-full" style={{ background: "#D6CCBA" }} />)}</span>
        <span className="absolute left-1/2 -translate-x-1/2 rounded-full px-4 py-0.5 text-[10px]" style={{ background: "#F3EEE4", color: "#8a8170" }}>ashgroveoutdoor.com</span>
      </div>
      <Fit w={1280} h={800}><AshgroveDesktop /></Fit>
    </div>
  );
}
export function AshgrovePhoneFrame() {
  return (
    <div className="rounded-[40px] p-[9px]" style={{ background: "#EFE8DB", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
      <div className="overflow-hidden rounded-[32px]"><Fit w={390} h={844}><AshgrovePhone /></Fit></div>
    </div>
  );
}
