// Shared, lightweight building blocks for the TABLET (768-1279px) and
// PHONE (<768px) tellings of the Revora story. DesktopCinematic does NOT
// use this file and is intentionally left untouched; the copy below is a
// verbatim mirror of the approved desktop wording (temporary duplication,
// accepted to keep the tuned desktop build risk-free).
//
// Motion here is CSS transform/opacity only, driven by IntersectionObserver
// (useInView). Under prefers-reduced-motion useInView resolves "in view"
// immediately and the global CSS rule in index.css zeroes transitions, so
// every element simply renders in its final state.
import { useInView } from "@/hooks/use-in-view";
import { MEDIA_SLOTS } from "./mediaSlots";

export const CALENDLY = "https://calendly.com/garret-revoramarketingagency/30min";

export const STORY = {
  eyebrow: "Revora Marketing",
  headline: "Turn Your Website Into a Growth Asset.",
  sub: "A professional website that makes your business look as good as your work. When it's the right fit, we can also build a customer-acquisition system to bring in more of the jobs you actually want.",
  ctaOffer: "See the Website Offer",
  ctaCall: "Book a 15-Minute Discovery Call",
  heroStats: [
    ["$997", "Website, One-Time"],
    ["$99/mo", "Website Care"],
    ["No Lock-In", "Straightforward"],
  ] as const,
  craftA: "Your work already looks professional.",
  craftB: "Your website should too.",
  conceptNote: "Design concepts, not real client work",
  roofingBody: "A bold, structured identity built for a business that works with hard lines and hard materials.",
  landscapingBody: "A softer, more organic identity, shaped around outdoor living rather than hard structure.",
  websiteTitle: "Professional Websites",
  websiteBody: "Built to make your business look as good online as the work you do in person.",
  foundation: "A better website is the foundation.",
  foundationSub: "But looking good online isn't the whole growth system.",
  marketA: "The right offer.",
  marketB: "In front of the right people.",
  marketNote: "Targeted homeowner attention in your service area. Not a promise that everyone shown is already searching.",
  homeowner: "A homeowner, going about their evening.",
  qualifyBody:
    "Interested homeowners are captured and pre-qualified. Obvious poor fits, wrong service, outside the area, are filtered out before they take your time.",
  followBody: "Turn homeowner interest into real sales conversations.",
  systemLabel: "Customer Acquisition System",
  systemTerms: "Investment set after discovery. No setup fee. Month-to-month.",
  signoff: "Real business. Digital presence. Customer acquisition.",
};

export const IMG = {
  establishing: MEDIA_SLOTS.revoraEstablishing,
  roof: MEDIA_SLOTS.northlineRoofHero,
  aerial: MEDIA_SLOTS.aerialServiceArea,
  homeowner: MEDIA_SLOTS.homeownerInterior,
};

type Dir = "up" | "left" | "right" | "fade";
const HIDDEN: Record<Dir, string> = {
  up: "opacity-0 translate-y-8",
  left: "opacity-0 -translate-x-8",
  right: "opacity-0 translate-x-8",
  fade: "opacity-0",
};

export function Reveal({
  children,
  className = "",
  dir = "up",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  dir?: Dir;
  delay?: number;
  as?: "div" | "p" | "h2" | "h3" | "section";
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${inView ? "opacity-100 translate-x-0 translate-y-0" : HIDDEN[dir]}`}
    >
      {children}
    </Tag>
  );
}

// The orange connective thread: a single line that draws itself once its
// section scrolls into view. Vertical or horizontal, never decorative noise.
export function Thread({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  return (
    <div ref={ref} aria-hidden="true" className={`${className} ${vertical ? "w-px" : "h-px"} overflow-hidden`}>
      <div
        className={`h-full w-full bg-accent transition-transform duration-[1400ms] ease-out ${vertical ? "origin-top" : "origin-left"} ${
          inView ? "scale-100" : vertical ? "scale-y-0" : "scale-x-0"
        }`}
      />
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] ${className}`}>
      <span className="h-px w-8 bg-accent" />
      {children}
    </p>
  );
}

export function Photo({ slot, className = "", eager = false, position }: { slot: (typeof IMG)[keyof typeof IMG]; className?: string; eager?: boolean; position?: string }) {
  return (
    <img
      src={slot.mobileSrc ?? slot.desktopSrc}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: position ?? slot.objectPosition ?? "center" }}
    />
  );
}

// ---- Concept website frames (code, not screenshots) ----------------------
function BrowserBar({ dark = true }: { dark?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-2 ${dark ? "bg-black/40" : "bg-muted"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
    </div>
  );
}

export function RoofingFrame({ tall = false }: { tall?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#171410] shadow-elegant">
      <BrowserBar />
      <div className={`relative ${tall ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
        <div className="absolute inset-0">
          <Photo slot={IMG.roof} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171410] via-[#171410]/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 bg-black/20 px-5 py-3">
          <div className="h-3 w-20 rounded bg-[#c98a4b]/80" />
          <div className="flex gap-3">
            <div className="h-1.5 w-7 rounded bg-white/25" />
            <div className="h-1.5 w-10 rounded bg-[#c98a4b]" />
          </div>
        </div>
        <div className={`absolute left-5 ${tall ? "bottom-6 right-5" : "bottom-6 w-[55%]"} space-y-3`}>
          <p className="font-display text-2xl md:text-3xl font-bold leading-tight text-white">
            Roofing, <span className="text-[#c98a4b]">design concept</span>
          </p>
          <p className="text-xs text-white/65">{STORY.roofingBody}</p>
          <span className="inline-block rounded bg-[#c98a4b] px-4 py-2 text-xs font-semibold text-black">Get an Estimate</span>
        </div>
      </div>
    </div>
  );
}

export function LandscapingFrame({ tall = false }: { tall?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#183327] shadow-elegant">
      <BrowserBar />
      <div className={`relative ${tall ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
        <div
          className={`absolute bg-gradient-to-br from-[#2c4a38] to-[#0f1e15] ${
            tall ? "inset-x-0 top-0 h-[55%] rounded-b-[70px]" : "inset-y-0 left-0 w-[52%] rounded-r-[80px]"
          }`}
        />
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/15 px-5 py-1.5">
          <div className="h-1.5 w-14 rounded bg-[#d9c27a]/80" />
        </div>
        <div className={`absolute ${tall ? "bottom-6 left-5 right-5" : "right-5 top-1/2 -translate-y-1/2 w-[42%] text-right"} space-y-3`}>
          <p className="font-display text-2xl md:text-3xl font-light leading-tight text-white">
            Landscaping, <span className="text-[#d9c27a]">design concept</span>
          </p>
          <p className="text-xs text-white/65">{STORY.landscapingBody}</p>
          <span className="inline-block text-xs font-semibold text-[#d9c27a] underline underline-offset-4">View Our Work</span>
        </div>
      </div>
    </div>
  );
}

// Abstract Revora-built site, same visual language as desktop's
// WebsiteRevealPanel: light surface, nav, headline, pricing, media block.
export function SiteFrame() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-card shadow-elegant">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="h-3 w-16 rounded bg-primary/70" />
        <div className="flex gap-3">
          <div className="h-1.5 w-7 rounded bg-muted" />
          <div className="h-1.5 w-7 rounded bg-muted" />
          <div className="h-1.5 w-10 rounded bg-accent" />
        </div>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr]">
        <div className="space-y-3 p-5">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Design concept</p>
          <p className="font-display text-xl font-semibold leading-tight text-primary">{STORY.websiteTitle}</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{STORY.websiteBody}</p>
          <div className="flex gap-5 pt-1">
            <div>
              <p className="text-lg font-bold text-primary">$997</p>
              <p className="text-[10px] text-muted-foreground">Website Build</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">$99/mo</p>
              <p className="text-[10px] text-muted-foreground">Website Care</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[160px] bg-gradient-to-br from-muted to-border">
          <div className="absolute left-4 top-4 h-px w-12 bg-accent/60" />
          <div className="absolute left-4 top-4 h-12 w-px bg-accent/60" />
        </div>
      </div>
    </div>
  );
}

// ---- Aerial market: many neutral signals narrow to one orange one ---------
const NODES = [
  [6, 14], [18, 9], [32, 17], [47, 8], [63, 13], [80, 10], [92, 20], [10, 30],
  [24, 37], [38, 32], [55, 28], [70, 34], [86, 40], [94, 52], [74, 57], [58, 62],
  [42, 54], [27, 60], [12, 52], [8, 74], [22, 82], [38, 86], [54, 83], [68, 90],
] as const;
const TARGET = 14;

export function MarketMap({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.45 });
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <Photo slot={IMG.aerial} />
      <div className="absolute inset-0 bg-primary/55" />
      {NODES.map(([x, y], i) => {
        const target = i === TARGET;
        const size = 6 + (y / 100) * 8;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute rounded-full transition-all duration-700 ease-out ${target && inView ? "bg-accent" : "bg-primary-foreground"}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: target && inView ? size + 6 : size,
              height: target && inView ? size + 6 : size,
              opacity: target ? 1 : inView ? 0.12 : 0.4 + (y / 100) * 0.4,
              transitionDelay: inView ? `${target ? 1100 : 300 + (i % 8) * 90}ms` : "0ms",
              boxShadow: target && inView ? "0 0 0 8px hsl(var(--accent) / 0.25)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

// ---- Inquiry card (abstract, no fake names/data) --------------------------
export function InquiryCard({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60">New inquiry</p>
      <div className="space-y-3 rounded-xl border border-primary-foreground/15 bg-primary/80 p-5 backdrop-blur-md">
        <div className="h-2 w-3/4 rounded bg-primary-foreground/20" />
        <div className="h-2 w-1/2 rounded bg-primary-foreground/20" />
        <div className="h-7 w-full rounded bg-accent/85" />
      </div>
    </div>
  );
}

// ---- Capture -> Qualify -> Focus, vertical rail ---------------------------
export function QualifyRail() {
  const steps = [
    { word: "Capture.", note: "New inquiry" },
    { word: "Qualify.", note: null, rejects: ["Wrong service", "Outside the area"] },
    { word: "Focus.", note: "Qualified opportunity", accent: true },
  ];
  return (
    <div className="relative pl-8">
      <Thread vertical className="absolute left-[5px] top-2 bottom-2" />
      <div className="space-y-12">
        {steps.map((s, i) => (
          <Reveal key={s.word} delay={i * 180} className="relative">
            <span
              className={`absolute -left-8 top-3 h-3 w-3 rounded-full border-2 ${
                s.accent ? "border-accent bg-accent shadow-[0_0_0_6px_hsl(var(--accent)/0.2)]" : "border-accent bg-primary"
              }`}
            />
            <p className={`font-display text-4xl md:text-5xl font-light ${s.accent ? "text-accent" : "text-primary-foreground"}`}>{s.word}</p>
            {s.note && <p className={`mt-1 text-[11px] uppercase tracking-[0.25em] ${s.accent ? "text-accent/80" : "text-primary-foreground/50"}`}>{s.note}</p>}
            {s.rejects && (
              <div className="mt-3 flex flex-wrap gap-2">
                {s.rejects.map((r) => (
                  <span key={r} className="rounded-full border border-primary-foreground/15 px-3 py-1 text-[11px] text-primary-foreground/40 line-through decoration-primary-foreground/30">
                    {r}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
