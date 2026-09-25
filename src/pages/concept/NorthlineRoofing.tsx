import { useEffect } from "react";
// MEDIA INTEGRATION: consumes the SAME shared slot CinematicExperience.tsx's
// RoofingConcept reads (MEDIA_SLOTS.northlineRoofHero), rather than this
// page holding its own separate copy of the asset reference. This page
// previously had no media-slot wiring at all (it predates that
// architecture) -- this is the minimal wire-up, not a restructure.
import { MEDIA_SLOTS } from "@/components/cinematic/mediaSlots";

// ============================================================================
// NORTHLINE ROOFING — isolated production-design sandbox
// ============================================================================
// This is a fictional Revora design concept, not a real client. It is not
// linked from any Revora navigation and does not affect Revora's own
// homepage, pricing, or CTA routes.
//
// Route: /concept/northline (see src/App.tsx — one route line added there,
// nothing else in that file was touched).
//
// PURPOSE: prove the visual level of a custom $5K+ Signature website concept
// before it is later choreographed into src/components/cinematic/
// CinematicExperience.tsx as the "Roofing" reconstruction target.
// CinematicExperience.tsx itself is NOT modified by this file.
//
// IDENTITY: deliberately does not reuse Revora's navy/orange/Fraunces
// system. Palette and type are scoped entirely to this file (inline
// Tailwind arbitrary values + a locally-injected Google Fonts link + a
// scoped <style> block below), so nothing here can leak into Revora's
// global tailwind.config.ts / index.css tokens.
//
// ANIMATION-READY LAYERS: every meaningful visual piece carries a stable
// `data-layer` attribute so a future GSAP timeline can target it
// individually once this concept is choreographed into the cinematic
// experience's Roofing-to-Landscaping deconstruction. No such animation is
// implemented here — only a restrained on-mount reveal for reviewing the
// concept in isolation.
// ============================================================================

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Archivo:wght@400;500;600;700&display=swap";

function useNorthlineFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    link.setAttribute("data-northline-font", "true");
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
}

// Architectural accent lines — thin drafting-style strokes that draw on
// once on mount. Pure SVG/CSS, no dependency. `data-layer` marks the group
// so a future timeline can retarget/redraw these during a deconstruction.
function AccentLines() {
  return (
    <svg
      data-layer="architectural-accent-lines"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <line
        x1="0" y1="18" x2="100" y2="18"
        stroke="#c98a4b" strokeWidth="0.08" opacity="0.35"
        className="northline-accent-line"
        style={{ animationDelay: "1.1s" }}
      />
      <line
        x1="62" y1="0" x2="62" y2="100"
        stroke="#c98a4b" strokeWidth="0.08" opacity="0.25"
        className="northline-accent-line"
        style={{ animationDelay: "1.3s" }}
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// MEDIA PLANE — the future image/video slot.
//
// Intended final asset (not present yet, no stock/AI imagery substituted):
//   - Aspect: roughly 4:5 to 3:4 portrait-leaning crop within this panel's
//     bounds (panel itself is ~58% viewport width x full viewport height on
//     desktop, so the asset should be shot/cropped tall).
//   - Subject: a single architectural roofline or exterior-envelope detail
//     shot at dusk/golden hour, eye-level or slight low angle, one clear
//     subject with generous negative space around it (do not fill frame
//     edge-to-edge with detail — the composition below reserves open sky
//     area in the upper two-thirds and grounds the subject in the lower
//     third).
//   - Light/dark balance: dark-to-warm gradient top-to-bottom (dusk sky
//     easing into warm stone/copper ground tone), matching the placeholder
//     gradient below so swapping in a real photo/video does not require
//     re-tuning the surrounding composition.
//   - Crop: the panel's left edge uses an angled (roofline-pitch-inspired)
//     clip, so the final asset should tolerate a diagonal crop on its left
//     ~15% without losing its subject.
//   - Video option: if a short establishing clip is used instead of a
//     still, keep camera movement minimal (a slow push or static frame) —
//     this panel is a backdrop, not the focal motion of the hero.
// ----------------------------------------------------------------------------
function MediaPlane() {
  const realSrc = MEDIA_SLOTS.northlineRoofHero.desktopSrc;

  return (
    <div
      data-layer="hero-media-plane"
      className="northline-reveal-media absolute inset-y-0 right-0 h-full w-[62%] max-lg:w-full max-lg:relative max-lg:inset-auto max-lg:h-[46vh] max-lg:mt-10"
      style={{
        clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      {realSrc ? (
        <>
          {/* MEDIA INTEGRATION: the real Northline roof still, sourced from
              the shared MEDIA_SLOTS.northlineRoofHero slot. Chimney/roof
              detail sits right-of-center in the source -- biased further
              right than the wide-container position in mediaSlots.ts,
              since this panel is a tall portrait crop of the same
              landscape source and needs a stronger horizontal bias to keep
              the subject in frame. */}
          <img
            src={realSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "70% 55%" }}
          />
          {/* A light scrim keeps the AccentLines' warm highlight readable
              against the real photo without hiding it. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
        </>
      ) : (
        <>
          {/* Base sky-to-ground gradient -- the dark/light balance the future asset should match. */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #100d0a 0%, #241d16 30%, #55432f 66%, #8f7a5f 100%)",
            }}
          />

          {/* Abstract overlapping roof-pitch planes — communicates roofline geometry and subject placement without a real photo. */}
          <div
            className="absolute left-[8%] right-[-10%] bottom-[18%] h-[38%] opacity-90"
            style={{
              background: "linear-gradient(135deg, #2a2119 0%, #3a2c1f 100%)",
              clipPath: "polygon(0% 100%, 38% 0%, 100% 28%, 100% 100%)",
            }}
          />
          <div
            className="absolute left-[22%] right-[-4%] bottom-[14%] h-[26%] opacity-80"
            style={{
              background: "linear-gradient(135deg, #b3672d 0%, #8a4f24 100%)",
              clipPath: "polygon(0% 100%, 46% 8%, 100% 0%, 100% 100%)",
              opacity: 0.22,
            }}
          />

          {/* Drafting-grid texture — reinforces "architecture studio," not decoration. */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #f3efe6 1px, transparent 1px), linear-gradient(to bottom, #f3efe6 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Reserved open negative-space zone (upper two-thirds stays clear per the crop note above) — no element intentionally placed here. */}

          <span className="absolute bottom-6 right-6 font-['Archivo'] text-[10px] uppercase tracking-[0.25em] text-[#f3efe6]/40">
            Image / Video, Pending
          </span>
        </>
      )}

      <AccentLines />
    </div>
  );
}

export default function NorthlineRoofing() {
  useNorthlineFonts();

  return (
    <div
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#171410] text-[#f3efe6]"
      style={{ fontFamily: "'Archivo', sans-serif" }}
    >
      {/* Scoped keyframes — local to this page only, never touches tailwind.config.ts or index.css. */}
      <style>{`
        @keyframes northline-fade-up {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .northline-reveal { animation: northline-fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .northline-reveal-media { animation: northline-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }
        @keyframes northline-line-draw {
          0% { stroke-dashoffset: 1; opacity: 0; }
          15% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .northline-accent-line {
          stroke-dasharray: 1;
          pathLength: 1;
          animation: northline-line-draw 1.4s ease-out both;
        }
      `}</style>

      <div className="relative z-10 mx-auto flex h-[100svh] max-w-none flex-col px-8 py-6 lg:px-14 lg:py-8">
        {/* NAV — restrained, spans the frame */}
        <nav
          data-layer="nav"
          className="northline-reveal flex items-center justify-between border-b border-[#f3efe6]/10 pb-5"
          style={{ animationDelay: "0.05s" }}
        >
          <span
            className="text-[13px] font-medium uppercase tracking-[0.3em] text-[#f3efe6]/80"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Northline
          </span>
          <div className="hidden items-center gap-10 text-[12px] uppercase tracking-[0.2em] text-[#f3efe6]/50 md:flex">
            <span>Work</span>
            <span>Approach</span>
            <span>Contact</span>
          </div>
          <span className="rounded-none border border-[#c98a4b]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#c98a4b]">
            Revora Design Concept
          </span>
        </nav>

        {/* MAIN COMPOSITION */}
        <div className="relative flex flex-1 items-center">
          <MediaPlane />

          <div className="relative z-10 w-full max-w-[640px] max-lg:max-w-full">
            <p
              data-layer="brand"
              className="northline-reveal mb-8 text-[13px] uppercase tracking-[0.35em] text-[#c98a4b]"
              style={{ animationDelay: "0.2s" }}
            >
              Northline Roofing
            </p>

            <h1 className="mb-8 leading-[0.95]">
              <span
                data-layer="headline-line-1"
                className="northline-reveal block text-[15vw] text-[#f3efe6] sm:text-[6.5vw] lg:text-[5.2vw]"
                style={{ fontFamily: "'Libre Caslon Display', serif", animationDelay: "0.32s" }}
              >
                Built Above
              </span>
              <span
                data-layer="headline-line-2"
                className="northline-reveal block text-[15vw] text-[#f3efe6] sm:text-[6.5vw] lg:text-[5.2vw]"
                style={{ fontFamily: "'Libre Caslon Display', serif", animationDelay: "0.46s" }}
              >
                The Standard.
              </span>
            </h1>

            <p
              data-layer="supporting-copy"
              className="northline-reveal mb-10 max-w-[420px] text-[15px] leading-relaxed text-[#f3efe6]/65"
              style={{ animationDelay: "0.6s" }}
            >
              Premium roofing and exterior protection built around craftsmanship, durability, and
              the details that define the finished home.
            </p>

            <div className="northline-reveal flex flex-wrap items-center gap-8" style={{ animationDelay: "0.74s" }}>
              <button
                type="button"
                data-layer="cta-primary"
                className="border border-[#f3efe6] px-7 py-3.5 text-[12px] uppercase tracking-[0.2em] text-[#f3efe6] transition-colors hover:bg-[#f3efe6] hover:text-[#171410]"
              >
                Get a Roofing Estimate
              </button>
              <button
                type="button"
                data-layer="cta-secondary"
                className="group text-[12px] uppercase tracking-[0.2em] text-[#f3efe6]/60 transition-colors hover:text-[#c98a4b]"
              >
                Explore Our Work
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* LOWER METADATA STRIP — abstract service-category labels, not claims/stats. */}
        <div
          data-layer="lower-metadata"
          className="northline-reveal mt-6 flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-[#f3efe6]/10 pt-5 text-[11px] uppercase tracking-[0.2em] text-[#f3efe6]/35"
          style={{ animationDelay: "0.9s" }}
        >
          <span>Steep-Slope Roofing</span>
          <span>Low-Slope &amp; Flat Roofing</span>
          <span>Exterior Envelope</span>
          <span className="ml-auto normal-case tracking-normal text-[#f3efe6]/25">
            Fictional design concept, not a real Revora client.
          </span>
        </div>
      </div>
    </div>
  );
}
