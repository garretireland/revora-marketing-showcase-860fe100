import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CALENDLY } from "@/components/cinematic/storyParts";
import { ACCENT } from "@/components/lead-journey/content";
import revoraLogo from "@/assets/revora-logo.png";
import establishing from "@/assets/revora-establishing.png";

// New Revora homepage sections (dark + restrained lime, Fraunces/Inter).
// Websites first; customer acquisition as the next layer.

const OFFER = [
  ["$997", "Professional website", "One-time build"],
  ["$99/mo", "Website Care", "Monthly"],
  ["No lock-in", "Straightforward terms", "Cancel anytime"],
] as const;

// The supplied logo art is navy/orange on transparent with wide padding:
// crop to the wordmark and render it white for the dark page.
function Logo({ height = 34 }: { height?: number }) {
  const w = height / 0.22;
  return (
    <span className="relative block overflow-hidden" style={{ height, width: w * 0.72 }} aria-label="Revora Marketing">
      <img src={revoraLogo} alt="Revora Marketing" className="absolute max-w-none" style={{ width: w, left: -w * 0.155, top: -w * 0.395, filter: "brightness(0) invert(1)" }} />
    </span>
  );
}

function CallButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={CALENDLY}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-[#0a0b0c] transition-transform hover:-translate-y-0.5 ${className}`}
      style={{ background: ACCENT }}
    >
      Book a 15-Minute Call <ArrowRight size={16} />
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.28em] md:text-xs" style={{ color: ACCENT }}>{children}</p>;
}

export function HomeNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-30 px-6 py-6 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-8 text-sm text-white/70">
          <a href="#websites" className="hidden hover:text-white md:block">Websites</a>
          <a href="#acquisition" className="hidden hover:text-white md:block">Customer Acquisition</a>
          <Link to="/about" className="hidden hover:text-white md:block">About</Link>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/25 px-4 py-2 text-white hover:border-white/60">
            Book a call
          </a>
        </div>
      </div>
    </nav>
  );
}

export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#0a0b0c] px-6 pb-12 pt-32 md:px-12 md:pb-20">
      <img src={establishing} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ objectPosition: "72% 50%" }} />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(90deg, #0a0b0c 0%, rgba(10,11,12,0.88) 38%, rgba(10,11,12,0.35) 72%, rgba(10,11,12,0.55) 100%), linear-gradient(0deg, #0a0b0c 0%, rgba(10,11,12,0) 50%)" }}
      />
      <div className="mx-auto w-full max-w-7xl">
        <Eyebrow>Websites + customer acquisition for local service businesses</Eyebrow>
        <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,7vw,6.25rem)] font-light leading-[0.98] tracking-[-0.025em] text-white">
          Your work looks professional.
          <br />
          <span className="text-white/55">Your website should too.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
          Revora builds premium websites for local service businesses, then helps the right companies turn them into customer-acquisition systems that generate real opportunities.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <a href="#websites" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-[#0a0b0c]" style={{ background: ACCENT }}>
            See What We Build <ArrowRight size={16} />
          </a>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-[15px] font-medium text-white hover:border-white/60">
            Book a 15-Minute Call
          </a>
        </div>
        <dl className="mt-14 grid max-w-3xl grid-cols-3 divide-x divide-white/12 border-t border-white/12 pt-5">
          {OFFER.map(([v, l]) => (
            <div key={v} className="px-3 first:pl-0 md:px-6">
              <dt className="font-display text-xl text-white md:text-2xl">{v}</dt>
              <dd className="mt-1 text-[11px] text-white/50 md:text-sm">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// Live, scaled view of a real Revora-built design concept page.
function SitePreview() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setS(el.clientWidth / 1440));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#141518] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-1 text-[11px] text-white/40">northline-roofing · design concept</span>
        </div>
        <div ref={boxRef} className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          {s > 0 && (
            <iframe
              src="/concept/northline"
              title="Northline Roofing website design concept"
              loading="lazy"
              className="absolute left-0 top-0 origin-top-left border-0"
              style={{ width: 1440, height: 900, transform: `scale(${s})` }}
            />
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-white/40">Live design concept built by Revora. Scroll inside the frame. Not client work.</figcaption>
    </figure>
  );
}

export function WebsitesSection() {
  return (
    <section id="websites" className="bg-[#0a0b0c] px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div>
          <Eyebrow>Websites</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4.5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.02em] text-white">
            Built to make you the obvious choice.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/65">
            A professional website that makes your business look as good online as the work you do in person.
          </p>
          <div className="mt-9 divide-y divide-white/10 border-y border-white/10">
            {OFFER.map(([v, l, d]) => (
              <div key={v} className="flex items-baseline justify-between gap-6 py-4">
                <span className="font-display text-2xl text-white">{v}</span>
                <span className="text-right">
                  <span className="block text-[15px] text-white/85">{l}</span>
                  <span className="block text-xs text-white/45">{d}</span>
                </span>
              </div>
            ))}
          </div>
          <CallButton className="mt-9" />
        </div>
        <SitePreview />
      </div>
    </section>
  );
}

export function PivotSection() {
  return (
    <section className="bg-[#0a0b0c] px-6 py-28 text-center md:py-40">
      <div className="mx-auto mb-12 h-20 w-px" style={{ background: `linear-gradient(180deg, transparent, ${ACCENT})` }} />
      <h2 className="mx-auto max-w-5xl font-display text-[clamp(2.2rem,5.5vw,4.75rem)] font-light leading-[1.04] tracking-[-0.02em] text-white">
        A professional website is the start.
        <br />
        <span style={{ color: ACCENT }}>Not the finish.</span>
      </h2>
      <p className="mx-auto mt-10 max-w-3xl text-xl leading-relaxed text-white/65 md:text-2xl">
        We don't just send clicks. We build systems that find real opportunities.
      </p>
    </section>
  );
}

export function AcquisitionIntro() {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <Eyebrow>Customer acquisition</Eyebrow>
      <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
        From a scroll, to a qualified lead, to a phone call.
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-white/60">
        The right offer in front of the right homeowners. A short form that filters for real intent. Qualified opportunities delivered straight to you, ready to call.
      </p>
    </div>
  );
}

export function FinalCta() {
  return (
    <section className="bg-[#0a0b0c] px-6 pb-10 pt-28 md:px-12 md:pt-40">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-white">
          Look professional.
          <br />
          Get found.
          <br />
          <span style={{ color: ACCENT }}>Win more work.</span>
        </h2>
        <CallButton className="mt-12" />
      </div>
      <footer className="mx-auto mt-28 flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
        <Logo height={24} />
        <div className="flex gap-6">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <span>© {new Date().getFullYear()} Revora Marketing</span>
        </div>
      </footer>
    </section>
  );
}
