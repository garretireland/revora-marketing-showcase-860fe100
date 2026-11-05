import { useRef } from "react";
import { C, CONTAINER } from "./tokens";
import { useEnter } from "./useEnter";
import signatureNorthline from "@/assets/web/signature-studio-northline.jpg";
import signatureCalder from "@/assets/web/signature-studio-calder.jpg";
import signatureAshgrove from "@/assets/web/signature-studio-ashgrove.jpg";

// Editorial recap after the live Northline cinematic and the interactive
// Calder/Ashgrove showroom: premium charcoal-studio desktop+phone
// composites of the same three concepts, presented as polished finished
// work rather than explained again. Deliberately placed AFTER the Industry
// Showroom (not between Northline and it, as first proposed) so visitors
// never see the same concept twice in a row -- interactive proof first,
// then presentation. All three source photos share the same 1672x941
// aspect ratio, so one aspect-ratio value covers every slot without ever
// stretching any of them.
const RATIO = "1672/941";

const PIECES = [
  { src: signatureNorthline, label: "Northline Roofing", alt: "Northline Roofing website shown on desktop and mobile", flagship: true },
  { src: signatureCalder, label: "Calder Concrete", alt: "Calder Concrete website shown on desktop and mobile", flagship: false },
  { src: signatureAshgrove, label: "Ashgrove Outdoor Living", alt: "Ashgrove Outdoor Living website shown on desktop and mobile", flagship: false },
] as const;

export default function SignatureStudio() {
  const root = useRef<HTMLElement>(null);
  useEnter(root, (tl) => {
    tl.from("[data-ss-in]", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", stagger: 0.08 })
      .from("[data-ss-flagship]", { opacity: 0, y: 28, duration: 0.9, ease: "power3.out" }, 0.15)
      .from("[data-ss-pair]", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.3);
  });

  return (
    // Phase 6A: mobile-only py reduced from py-20 (80px) to py-14 (56px).
    // This section now sits directly between IndustryShowcase (py-20
    // bottom, no responsive variant) and Offer (py-24 bottom/top) -- on
    // mobile those two alone already stack to 160-176px of padding at each
    // boundary before this section's own spacing is even added. Desktop
    // (md:py-24) is untouched; IndustryShowcase's and Offer's own padding
    // are untouched too, since this is the one new section whose addition
    // created the compounding, not either of its established neighbors.
    <section ref={root} className="relative py-14 md:py-24" style={{ background: C.ink }}>
      <div className={CONTAINER}>
        <div className="mx-auto max-w-[640px] text-center">
          <h2 data-ss-in className="font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]" style={{ color: C.text }}>
            Presentation matters.
          </h2>
          <p data-ss-in className="mt-4 text-[16px] leading-[1.6]" style={{ color: C.muted }}>
            Your business should look as sharp online as the work behind it.
          </p>
        </div>

        <div className="mt-12 md:mt-14">
          {/* Northline: the wider flagship visual, full width on its own row. */}
          <div data-ss-flagship>
            <div className="overflow-hidden rounded-[14px]" style={{ boxShadow: "0 40px 100px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)" }}>
              <img src={PIECES[0].src} alt={PIECES[0].alt} loading="lazy" decoding="async" className="block h-full w-full object-cover" style={{ aspectRatio: RATIO }} />
            </div>
            <p className="mt-3 text-center text-[13px] font-medium" style={{ color: C.muted }}>{PIECES[0].label}</p>
          </div>

          {/* Calder + Ashgrove: balanced supporting pair, stacked on mobile. */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-8">
            {PIECES.slice(1).map((p) => (
              <div key={p.alt} data-ss-pair>
                <div className="overflow-hidden rounded-[14px]" style={{ boxShadow: "0 30px 80px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)" }}>
                  <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="block h-full w-full object-cover" style={{ aspectRatio: RATIO }} />
                </div>
                <p className="mt-3 text-center text-[13px] font-medium" style={{ color: C.muted }}>{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
