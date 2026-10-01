import { useState } from "react";
import { AD_IMAGE } from "./content";

// Simulated fingertip: a soft press disc, animated by the timeline via
// [data-tap]. Centred with static left/top so GSAP owns the transform.
export function Tap({ id }: { id: string }) {
  return (
    <span
      aria-hidden
      data-tap={id}
      className="pointer-events-none absolute rounded-full opacity-0"
      style={{ width: 64, height: 64, left: "calc(50% - 32px)", top: "calc(50% - 32px)", background: "rgba(20,30,50,0.16)" }}
    />
  );
}

export function NorthlineMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <circle cx="20" cy="20" r="20" fill="#1c2b3d" />
      <path d="M9 22.5 20 13l11 9.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 25.5 20 19.5l7 6" fill="none" stroke="#e0a458" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The supplied creative, or a clearly labelled placeholder if the file is
// not in public/ yet. Never a stand-in image.
export function AdImage({ className = "", position = "center" }: { className?: string; position?: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-[#d8dce2] text-center text-[#4b5563] ${className}`}>
        <span className="text-[15px] font-semibold">Northline Roofing ad creative</span>
        <span className="text-[12px]">public{AD_IMAGE}</span>
      </div>
    );
  }
  return (
    <img
      src={AD_IMAGE}
      alt="Northline Roofing crew replacing the roof on a suburban home"
      onError={() => setMissing(true)}
      draggable={false}
      className={`object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
