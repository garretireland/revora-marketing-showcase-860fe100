import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Shared plumbing for the website-concept mockups (Ashgrove, Calder).
// Each concept is authored at a fixed design size and scaled to fit, so
// typography stays exact at any display size (same principle as the
// Northline mocks, independent implementation).

// Concept photography lives in src/assets/web/concepts/. Masters may be
// PNG (<slot>.png, never shipped); the page serves the optimised web copy
// (<slot>.jpg / .webp), picked up automatically by slot id. Until a web copy
// exists, an art-directed placeholder (tone + label) holds the exact crop.
const FILES = import.meta.glob("/src/assets/web/concepts/*.{jpg,jpeg,webp}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const urlFor = (slot: string) => Object.entries(FILES).find(([p]) => p.split("/").pop()!.replace(/\.\w+$/, "") === slot)?.[1];

export type Slot = { id: string; label: string; tone: string };

export function ConceptImage({ slot, className = "", style, position = "50% 50%" }: { slot: Slot; className?: string; style?: React.CSSProperties; position?: string }) {
  const src = urlFor(slot.id);
  if (src) return <img src={src} alt="" decoding="async" className={`block h-full w-full object-cover ${className}`} style={{ objectPosition: position, ...style }} />;
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: slot.tone, ...style }}>
      <span className="absolute right-2 top-2 rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]" style={{ background: "rgba(0,0,0,0.35)", color: "rgba(255,255,255,0.8)" }}>
        AI image · {slot.label}
      </span>
    </div>
  );
}

// Fixed design canvas (w x h) scaled to its container's width.
export function Fit({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setS(el.clientWidth / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${w} / ${h}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, transform: `scale(${s})`, visibility: s ? "visible" : "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// Concept typefaces load only where the concepts render (not site-wide).
const FONT_HREF = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Archivo:wdth,wght@62..125,300..800&display=swap";
export function useConceptFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_HREF;
    document.head.appendChild(l);
  }, []);
}
