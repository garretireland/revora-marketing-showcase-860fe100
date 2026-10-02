import { ConceptImage, Fit, type Slot } from "./shared";

// CALDER CONCRETE -- fictional premium residential concrete company
// (design concept by Revora). Architectural: a visible 12-column logic,
// hairline rules, square edges, an expanded uppercase grotesk, a spec-sheet
// service index and one restrained rust accent. Typography leads; imagery
// is cropped into hard rectangles like poured slabs.

const CAL = { paper: "#F2F0EB", grey: "#A7A49E", charcoal: "#1C1C1B", rust: "#B5562F", rule: "rgba(28,28,27,0.16)" };
const WIDE: React.CSSProperties = { fontFamily: '"Archivo", Inter, sans-serif', fontStretch: "125%", textTransform: "uppercase" };
const MID: React.CSSProperties = { fontFamily: '"Archivo", Inter, sans-serif', fontStretch: "112%", textTransform: "uppercase" };
const SANS = '"Archivo", Inter, sans-serif';

const CAL_SLOTS = {
  hero: { id: "calder-hero", label: "exposed-aggregate patio", tone: "linear-gradient(175deg,#cfcac1,#a9a39a 45%,#7d7870 75%,#5b5852)" },
  driveway: { id: "calder-driveway", label: "driveway", tone: "linear-gradient(170deg,#bdb8af,#8f8a82 60%,#6d6962)" },
  walkway: { id: "calder-walkway", label: "walkway + sawn joints", tone: "linear-gradient(160deg,#d8d3ca,#aaa59c 55%,#85817a)" },
  decorative: { id: "calder-decorative", label: "stamped slate detail", tone: "linear-gradient(165deg,#8d8379,#b2a698 50%,#6c645b)" },
} satisfies Record<string, Slot>;

const SERVICES = [
  ["01", "Driveways", "Broom · exposed aggregate"],
  ["02", "Patios", "Poured · sealed"],
  ["03", "Walkways", "Sawn joints · steps"],
  ["04", "Decorative", "Stamped · coloured"],
] as const;
const WORK = [
  { slot: CAL_SLOTS.driveway, a: "Driveway", b: "Broom finish" },
  { slot: CAL_SLOTS.walkway, a: "Walkway", b: "Sawn joints" },
  { slot: CAL_SLOTS.decorative, a: "Decorative", b: "Stamped slate" },
];

function Mark({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3" style={{ color: CAL.charcoal }}>
      <span className="block" style={{ width: size * 0.5, height: size * 0.5, background: CAL.rust }} />
      <span style={{ ...WIDE, fontSize: size, fontWeight: 700, letterSpacing: "0.06em" }}>Calder</span>
      <span style={{ ...MID, fontSize: size * 0.48, letterSpacing: "0.3em", color: CAL.grey }}>Concrete</span>
    </div>
  );
}

function Tag({ a, b }: { a: string; b: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1.5 text-[9px]" style={{ ...MID, background: CAL.paper, color: CAL.charcoal, letterSpacing: "0.2em" }}>
      {a} <span style={{ color: CAL.grey }}>/ {b}</span>
    </span>
  );
}

function Index({ rowH, size }: { rowH: number; size: number }) {
  return (
    <div style={{ borderBottom: `1px solid ${CAL.rule}` }}>
      {SERVICES.map(([n, name, spec]) => (
        <div key={n} className="flex items-center" style={{ height: rowH, borderTop: `1px solid ${CAL.rule}` }}>
          <span className="w-10 tabular-nums" style={{ fontFamily: SANS, fontSize: size - 2, color: CAL.grey }}>{n}</span>
          <span className="flex-1" style={{ ...MID, fontSize: size, fontWeight: 600, letterSpacing: "0.14em", color: CAL.charcoal }}>{name}</span>
          <span style={{ fontFamily: SANS, fontSize: size - 2, color: CAL.grey }}>{spec}</span>
        </div>
      ))}
    </div>
  );
}

// 1280 x 800 desktop page (12 cols: 48 margins, 24 gutters)
export function CalderDesktop() {
  return (
    <div className="relative h-[800px] w-[1280px] overflow-hidden" style={{ background: CAL.paper, fontFamily: SANS }}>
      <header className="absolute inset-x-0 top-0 flex h-[64px] items-center justify-between px-12" style={{ borderBottom: `1px solid ${CAL.rule}` }}>
        <Mark />
        <div className="flex gap-10 text-[11px]" style={{ ...MID, letterSpacing: "0.22em", color: "rgba(28,28,27,0.7)" }}>
          {SERVICES.map(([, s]) => <span key={s}>{s}</span>)}
        </div>
        <span className="px-4 py-2 text-[10.5px]" style={{ ...MID, letterSpacing: "0.2em", color: CAL.charcoal, boxShadow: `inset 0 0 0 1px ${CAL.charcoal}` }}>Request a quote</span>
      </header>

      {/* left: statement + spec index (cols 1-7) */}
      <div className="absolute left-12 top-[100px] w-[640px]">
        <div className="flex items-center gap-4 text-[10px]" style={{ ...MID, letterSpacing: "0.3em", color: CAL.rust }}>
          Residential concrete <span className="h-px flex-1" style={{ background: CAL.rule }} />
        </div>
        <h1 className="mt-6 text-[56px] leading-[0.98]" style={{ ...WIDE, fontWeight: 700, letterSpacing: "-0.005em", color: CAL.charcoal }}>
          Built level.<br />Built to last.
        </h1>
        <p className="mt-6 max-w-[430px] text-[15px] leading-[1.55]" style={{ color: "rgba(28,28,27,0.68)" }}>
          Driveways, patios and walkways, formed, poured and finished to exact grade.
        </p>
        <div className="mt-7 w-[560px]"><Index rowH={36} size={12} /></div>
        <div className="mt-7 flex items-center gap-7">
          <span className="px-6 py-3.5 text-[11px]" style={{ ...MID, fontWeight: 600, letterSpacing: "0.2em", background: CAL.charcoal, color: CAL.paper }}>Request a quote</span>
          <span className="text-[11px]" style={{ ...MID, letterSpacing: "0.2em", color: CAL.charcoal }}>View work →</span>
        </div>
      </div>

      {/* right: the slab (cols 8-12) with measured rules */}
      <div className="absolute left-[724px] top-[96px] h-[456px] w-[508px]">
        {/* crop keeps the driveway as the subject: joints run into the frame,
            entry + garage above (the house is context, not the subject) */}
        <ConceptImage slot={CAL_SLOTS.hero} position="66% 50%" />
        <div className="absolute bottom-4 left-4"><Tag a="Driveway" b="Exposed aggregate" /></div>
      </div>
      <div className="absolute left-[724px] top-[84px] h-px w-[508px]" style={{ background: CAL.rule }}>
        <i className="absolute -top-[3px] left-0 h-[7px] w-px" style={{ background: CAL.grey }} /><i className="absolute -top-[3px] right-0 h-[7px] w-px" style={{ background: CAL.grey }} />
      </div>
      <div className="absolute left-[1248px] top-[96px] h-[456px] w-px" style={{ background: CAL.rule }}>
        <i className="absolute -left-[3px] top-0 h-px w-[7px]" style={{ background: CAL.grey }} /><i className="absolute -left-[3px] bottom-0 h-px w-[7px]" style={{ background: CAL.grey }} />
      </div>

      {/* project strip */}
      <div className="absolute left-12 right-12 top-[584px] flex items-center justify-between pt-3 text-[10px]" style={{ ...MID, letterSpacing: "0.3em", borderTop: `1px solid ${CAL.charcoal}` }}>
        <span style={{ color: CAL.charcoal }}>Selected work</span><span className="tabular-nums" style={{ color: CAL.grey }}>01 — 03</span>
      </div>
      <div className="absolute left-12 right-12 top-[620px] grid grid-cols-3 gap-6">
        {WORK.map((w) => (
          <div key={w.a}>
            <div className="h-[132px] overflow-hidden"><ConceptImage slot={w.slot} /></div>
            <div className="mt-2.5 flex justify-between text-[10px]" style={{ ...MID, letterSpacing: "0.2em" }}>
              <span style={{ color: CAL.charcoal, fontWeight: 600 }}>{w.a}</span><span style={{ color: CAL.grey }}>{w.b}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 390 x 844 phone page
export function CalderPhone() {
  return (
    <div className="relative h-[844px] w-[390px] overflow-hidden" style={{ background: CAL.paper, fontFamily: SANS }}>
      <header className="absolute inset-x-0 top-[44px] flex h-[56px] items-center justify-between px-6" style={{ borderBottom: `1px solid ${CAL.rule}` }}>
        <Mark size={16} />
        <span className="flex flex-col gap-[5px]"><i className="block h-[1.5px] w-5" style={{ background: CAL.charcoal }} /><i className="block h-[1.5px] w-5" style={{ background: CAL.charcoal }} /></span>
      </header>
      <div className="absolute left-6 right-6 top-[122px]">
        <div className="flex items-center gap-3 text-[9px]" style={{ ...MID, letterSpacing: "0.3em", color: CAL.rust }}>
          Residential concrete <span className="h-px flex-1" style={{ background: CAL.rule }} />
        </div>
        <h1 className="mt-4 text-[31px] leading-[1]" style={{ ...WIDE, fontWeight: 700, color: CAL.charcoal }}>Built level.<br />Built to last.</h1>
      </div>
      <div className="absolute left-6 right-6 top-[236px] h-[280px]">
        <ConceptImage slot={CAL_SLOTS.hero} position="68% 50%" />
        <div className="absolute bottom-3 left-3"><Tag a="Driveway" b="Exposed aggregate" /></div>
      </div>
      <div className="absolute left-6 right-6 top-[540px]"><Index rowH={38} size={11} /></div>
      <span className="absolute left-6 right-6 top-[714px] flex justify-center py-4 text-[11px]" style={{ ...MID, fontWeight: 600, letterSpacing: "0.2em", background: CAL.charcoal, color: CAL.paper }}>Request a quote</span>
      <div className="absolute left-6 right-6 top-[790px] flex justify-between pt-3 text-[9px]" style={{ ...MID, letterSpacing: "0.3em", borderTop: `1px solid ${CAL.charcoal}` }}>
        <span style={{ color: CAL.charcoal }}>Selected work</span><span style={{ color: CAL.grey }}>01 — 03</span>
      </div>
    </div>
  );
}

// Brand-matched device frames: square, exact, minimal.
export function CalderBrowser() {
  return (
    <div style={{ background: CAL.paper, boxShadow: `0 40px 90px -30px rgba(0,0,0,0.6), 0 0 0 1px ${CAL.charcoal}` }}>
      <div className="flex h-[30px] items-center justify-between px-3.5" style={{ borderBottom: `1px solid ${CAL.rule}` }}>
        <span className="font-mono text-[10px]" style={{ color: CAL.grey }}>calderconcrete.com</span>
        <span className="flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="block h-[7px] w-[7px]" style={{ boxShadow: `inset 0 0 0 1px ${CAL.grey}` }} />)}</span>
      </div>
      <Fit w={1280} h={800}><CalderDesktop /></Fit>
    </div>
  );
}
export function CalderPhoneFrame() {
  return (
    <div className="rounded-[30px] p-[7px]" style={{ background: CAL.charcoal, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)" }}>
      <div className="overflow-hidden rounded-[24px]"><Fit w={390} h={844}><CalderPhone /></Fit></div>
    </div>
  );
}
