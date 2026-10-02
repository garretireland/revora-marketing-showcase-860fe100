import { useLayoutEffect, useRef, useState } from "react";
import { NorthlineMark } from "@/components/lead-journey/primitives";
import roofHero from "@/assets/web/northline-roof-hero.jpg";
import roofTile from "@/assets/web/northline-roof-hero-800.jpg";
import craftTile from "@/assets/web/craftsmanship-800.jpg";

// Static website mocks for the homepage (fictional business, Northline
// Roofing). AfterSite = the premium Revora-built version; BeforeSite = the
// believable dated version. Both are authored at a fixed design size and
// scaled to fit, so type stays crisp at any size. These are the stage
// content the later transformation cinematic will rebuild between.

const DW = 1280;

// Fixed-size design canvas scaled to its container width.
export function Scaled({ height, children, className = "" }: { height: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setS(el.clientWidth / DW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${DW} / ${height}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: DW, height, transform: `scale(${s})`, visibility: s ? "visible" : "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// Browser chrome around a site.
export function BrowserFrame({ label, children, tone = "dark" }: { label: string; children: React.ReactNode; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <div className="overflow-hidden rounded-[10px]" style={{ background: dark ? "#121a25" : "#d9d9d9", boxShadow: "0 40px 100px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#b9b9b9"}` }}>
        {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full" style={{ background: dark ? "rgba(255,255,255,0.16)" : "#9a9a9a" }} />)}
        <span className="ml-3 truncate rounded px-2.5 py-0.5 text-[10px]" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#efefef", color: dark ? "rgba(255,255,255,0.4)" : "#555" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

const COPPER = "#c98a4b";
const CHAR = "#14110e";

export function AfterSite() {
  return (
    <Scaled height={800}>
      <div className="relative h-full w-full font-sans" style={{ background: CHAR, color: "#f3eee7" }}>
        <img src={roofHero} alt="" className="absolute inset-0 h-[560px] w-full object-cover" style={{ objectPosition: "62% 40%" }} />
        <div className="absolute inset-x-0 top-0 h-[560px]" style={{ background: "linear-gradient(90deg, rgba(20,17,14,0.92) 0%, rgba(20,17,14,0.55) 45%, rgba(20,17,14,0.1) 100%), linear-gradient(0deg, #14110e 0%, rgba(20,17,14,0) 35%)" }} />
        <div className="relative flex items-center justify-between px-16 py-7">
          <div className="flex items-center gap-3 text-[15px] font-semibold uppercase tracking-[0.28em]"><NorthlineMark size={34} /> Northline</div>
          <div className="flex items-center gap-10 text-[14px] text-white/75">
            <span>Roofing</span><span>Repairs</span><span>Our work</span><span>About</span>
            <span className="rounded-full px-5 py-2.5 text-[14px] font-semibold" style={{ background: COPPER, color: CHAR }}>Free estimate</span>
          </div>
        </div>
        <div className="relative px-16 pt-16">
          <div className="text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: COPPER }}>Roof replacement · Repair</div>
          <div className="mt-5 max-w-[620px] font-display text-[68px] font-medium leading-[1.0] tracking-[-0.02em]">Roofing done right, the first time.</div>
          <div className="mt-6 max-w-[480px] text-[18px] leading-relaxed text-white/70">Clean installs, honest quotes and a crew that treats your home like their own.</div>
          <div className="mt-9 flex gap-4">
            <span className="rounded-full px-7 py-4 text-[16px] font-semibold" style={{ background: COPPER, color: CHAR }}>Get a free estimate</span>
            <span className="rounded-full border border-white/25 px-7 py-4 text-[16px]">See our work</span>
          </div>
        </div>
        <div className="absolute inset-x-16 bottom-10 grid grid-cols-3 gap-6">
          {[["Full replacement", roofTile, "70% 30%"], ["Repairs & leaks", craftTile, "50% 50%"], ["Inspections", roofTile, "30% 60%"]].map(([t, src, pos]) => (
            <div key={t} className="overflow-hidden rounded-lg" style={{ background: "#1d1915" }}>
              <img src={src} alt="" className="h-[96px] w-full object-cover" style={{ objectPosition: pos }} />
              <div className="px-4 py-3 text-[15px] font-medium">{t}</div>
            </div>
          ))}
        </div>
      </div>
    </Scaled>
  );
}

// Mobile view of the same site, for the phone reveal.
export function AfterSitePhone() {
  return (
    <div className="relative h-full w-full overflow-hidden font-sans" style={{ background: CHAR, color: "#f3eee7" }}>
      <img src={roofHero} alt="" className="absolute inset-x-0 top-0 h-[58%] w-full object-cover" style={{ objectPosition: "66% 40%" }} />
      <div className="absolute inset-x-0 top-0 h-[58%]" style={{ background: "linear-gradient(0deg, #14110e 0%, rgba(20,17,14,0.35) 60%, rgba(20,17,14,0.6) 100%)" }} />
      <div className="relative flex items-center justify-between px-[7%] pt-[9%] text-[8px] font-semibold uppercase tracking-[0.22em]">
        <span className="flex items-center gap-1.5"><NorthlineMark size={14} /> Northline</span>
        <span className="flex flex-col gap-[3px]"><i className="block h-px w-3 bg-white/80" /><i className="block h-px w-3 bg-white/80" /></span>
      </div>
      <div className="absolute inset-x-[7%] top-[44%]">
        <div className="font-display text-[19px] font-medium leading-[1.05]">Roofing done right, the first time.</div>
        <div className="mt-3 rounded-full py-2 text-center text-[9px] font-semibold" style={{ background: COPPER, color: CHAR }}>Get a free estimate</div>
      </div>
    </div>
  );
}

// Believable dated version of the same business.
export function BeforeSite() {
  return (
    <Scaled height={800}>
      <div className="h-full w-full" style={{ background: "#e9e6dc", color: "#222", fontFamily: '"Times New Roman", Times, serif' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ background: "linear-gradient(#2d5fb3, #1a3f80)", borderBottom: "4px solid #f2c200" }}>
          <div className="text-[38px] font-bold italic text-white" style={{ textShadow: "2px 2px 0 #0d2350" }}>NORTHLINE ROOFING</div>
          <div className="text-right text-[18px] font-bold text-[#ffe14d]">CALL TODAY!<br /><span className="text-white">(519) 555-0199</span></div>
        </div>
        <div className="py-1.5 text-center text-[16px] font-bold text-[#c40000]" style={{ background: "#fff7c2" }}>*** FREE ESTIMATES *** SERVING THE AREA SINCE FOREVER *** CALL NOW ***</div>
        <div className="flex gap-5 p-5">
          <div className="w-[210px] shrink-0 border-2 border-[#8a8a8a] bg-white p-3 text-[17px] leading-[1.9]">
            {["Home", "About Us", "Services", "Roofing", "Siding", "Gutters", "Photo Gallery", "Contact Us"].map((l) => <div key={l} className="text-[#1a0dab] underline">{l}</div>)}
          </div>
          <div className="flex-1">
            <div className="text-[30px] font-bold text-[#1a3f80]">Welcome to Our Website!!</div>
            <div className="mt-3 flex gap-4">
              <img src={roofHero} alt="" className="h-[190px] w-[300px] border-[3px] border-[#777] object-cover" style={{ objectPosition: "60% 40%", filter: "saturate(0.6) contrast(0.85) blur(0.6px)" }} />
              <div className="text-[18px] leading-[1.45]">We are a family owned roofing company. We do roofing, repairs, siding and gutters. We have lots of experience and do quality work at affordable prices. Please call us for all your roofing needs or send us an email using the form on the contact page. Thank you for visiting!</div>
            </div>
            <div className="mt-5 text-[18px] leading-[1.45]"><b>Our Services:</b> Shingles - Flat Roofs - Repairs - Siding - Gutters - Soffit &amp; Fascia - Skylights - Insurance Claims - and More!!</div>
            <div className="mt-6 inline-block border border-[#888] bg-white px-3 py-1 text-[14px]">Visitors: <b>004812</b></div>
            <div className="mt-2 text-[13px] text-[#666]">Site last updated: March 2014 · Best viewed in Internet Explorer</div>
          </div>
        </div>
      </div>
    </Scaled>
  );
}
