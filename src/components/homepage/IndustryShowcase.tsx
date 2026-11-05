import { useEffect, useRef, useState } from "react";
import { C, CONTAINER } from "./tokens";
import { useConceptFonts, Fit, ConceptImageLoadingProvider } from "@/components/concepts/shared";
import { CalderDesktop, CalderPhone } from "@/components/concepts/Calder";
import { AshgroveDesktop, AshgrovePhone } from "@/components/concepts/Ashgrove";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

// Compact proof-of-range strip directly under the Northline cinematic
// transformation: "we don't just do roofing." Presented as a small
// configurator -- one shared device stage/frame, the showcased website
// swaps underneath it, and clicking either device opens a larger preview
// in a dialog. Reuses the existing FLAT Calder/Ashgrove page content
// (CalderDesktop/CalderPhone, AshgroveDesktop/AshgrovePhone -- no device
// chrome of their own) inside ONE new shared browser/phone frame built
// here, rather than nesting their own CalderBrowser/AshgroveBrowser chrome
// (which would double up browser bars/bezels), and inside the project's
// existing Radix-based Dialog (@/components/ui/dialog, already used by
// PreviewDialog.tsx) for the expanded preview -- focus trap, Escape,
// backdrop-close, focus restoration and body-scroll lock all come from
// Radix for free, nothing reimplemented here. Calder.tsx, Ashgrove.tsx and
// Northline are never modified.
//
// Calder's crop (design y<=572, before its unfinished "Selected work"
// grid -- 3 of 4 photos are still missing, see ConceptImage's placeholder
// fallback in shared.tsx) is preserved via Fit's own aspect-ratio
// clipping, in both the compact stage AND the expanded preview.

type Industry = "concrete" | "landscaping";
type DeviceMode = "desktop" | "mobile";

const TABS: { id: Industry; label: string }[] = [
  { id: "concrete", label: "Concrete" },
  { id: "landscaping", label: "Landscaping" },
];

const GRAPHITE = "#15191F";

// ---------------------------------------------------------------- chrome

// onOpen present -> renders as a real <button> (click or Enter/Space opens
// the expanded preview). Omitted -> a plain, non-interactive div (used
// inside the preview dialog itself, where re-opening doesn't apply).
function BrowserChrome({ url, children, compact, sweep, onOpen, label }: { url: string; children: React.ReactNode; compact?: boolean; sweep?: boolean; onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void; label?: string }) {
  const Tag = onOpen ? "button" : "div";
  return (
    <Tag
      {...(onOpen ? { type: "button", onClick: onOpen, "aria-label": label } : {})}
      className={`relative block w-full overflow-hidden rounded-[14px] text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.07),0_60px_120px_-36px_rgba(0,0,0,0.7),0_24px_48px_-24px_rgba(0,0,0,0.55)] ${onOpen ? "cursor-pointer transition-[transform,outline-color] duration-150 hover:scale-[1.008] hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-[rgba(255,255,255,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" : ""}`}
      style={{ background: GRAPHITE, ...(onOpen ? ({ "--tw-ring-color": "#FF8838", "--tw-ring-offset-color": C.navy } as React.CSSProperties) : {}) }}
    >
      <div className="flex h-[36px] items-center gap-2.5 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="flex gap-1.5" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} className="block h-[7px] w-[7px] rounded-full" style={{ background: "rgba(255,255,255,0.16)" }} />)}</span>
        {!compact && (
          <span className="ml-1.5 truncate rounded px-2.5 py-0.5 text-[10px]" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{url}</span>
        )}
      </div>
      {children}
      {sweep && (
        <div aria-hidden="true" className="ind-sweep pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.1) 50%, transparent 58%)" }} />
      )}
    </Tag>
  );
}

function PhoneChrome({ children, onOpen, label }: { children: React.ReactNode; onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void; label?: string }) {
  const Tag = onOpen ? "button" : "div";
  return (
    <Tag
      {...(onOpen ? { type: "button", onClick: onOpen, "aria-label": label } : {})}
      className={`block w-full rounded-[34px] p-[7px] text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.08),0_44px_90px_-26px_rgba(0,0,0,0.75)] ${onOpen ? "cursor-pointer transition-[transform,outline-color] duration-150 hover:scale-[1.012] hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-[rgba(255,255,255,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" : ""}`}
      style={{ background: GRAPHITE, ...(onOpen ? ({ "--tw-ring-color": "#FF8838", "--tw-ring-offset-color": C.navy } as React.CSSProperties) : {}) }}
    >
      <div className="overflow-hidden rounded-[28px]">{children}</div>
    </Tag>
  );
}

// Calder: compact stage crops at design y=572 (before "Selected work") --
// unchanged, still the approved homepage composition. The expanded preview
// dialog crops at CALDER_EXPANDED_CROP instead, just past the "Selected
// work" grid's own true bottom edge (measured directly off the rendered
// DOM: the grid's content ends at design y=777, not the grid's nominal
// top-[620px]+132px image height alone -- the caption row below each photo
// adds a further ~25px), so the three now-integrated photos are fully
// visible with a small clean margin, without dragging in the ~23px of bare
// canvas between y=777 and CalderDesktop's own full 800px height. Ashgrove
// is untouched either way -- it already renders full height (800/844),
// nothing to hide, no shared code path with these two functions.
// expanded also gates CalderDesktop's own showSelectedWork prop: the
// compact stage's crop only ever hid the gallery visually (Fit always
// mounts its full child), so the three gallery images were downloading on
// every homepage load regardless of the crop height. Passing
// showSelectedWork={expanded} stops the compact stage from mounting those
// <img> elements at all, while the expanded preview (which actually shows
// them) is unaffected.
const CALDER_COMPACT_CROP = 572;
const CALDER_EXPANDED_CROP = 784;
function CalderBrowserContent({ expanded = false }: { expanded?: boolean } = {}) {
  return <Fit w={1280} h={expanded ? CALDER_EXPANDED_CROP : CALDER_COMPACT_CROP}><CalderDesktop showSelectedWork={expanded} /></Fit>;
}
function CalderPhoneContent() { return <Fit w={390} h={780}><CalderPhone /></Fit>; }
function AshgroveBrowserContent() { return <Fit w={1280} h={800}><AshgroveDesktop /></Fit>; }
function AshgrovePhoneContent() { return <Fit w={390} h={844}><AshgrovePhone /></Fit>; }

// Fixed-scale rendering for the pannable desktop preview (see root-cause
// note on DesktopPreviewArea below): no ResizeObserver, no measured
// state -- just a static CSS transform at a scale we already know (the
// pannable target width divided by the design width), so there is
// nothing that can fail to fire or race the dialog's own mount/animation.
function FixedScale({ w, h, scale, children }: { w: number; h: number; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ width: w * scale, height: h * scale, overflow: "hidden" }}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}
function CalderBrowserContentFixed({ scale, expanded = false }: { scale: number; expanded?: boolean }) {
  return <FixedScale w={1280} h={expanded ? CALDER_EXPANDED_CROP : CALDER_COMPACT_CROP} scale={scale}><CalderDesktop showSelectedWork={expanded} /></FixedScale>;
}
function AshgroveBrowserContentFixed({ scale }: { scale: number }) { return <FixedScale w={1280} h={800} scale={scale}><AshgroveDesktop /></FixedScale>; }

// ---------------------------------------------------------------- switcher

function Switcher({ active, onChange }: { active: Industry; onChange: (i: Industry) => void }) {
  const idx = TABS.findIndex((t) => t.id === active);
  return (
    <div role="tablist" aria-label="Industry showcase" className="relative inline-flex items-center gap-1 rounded-full p-1" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }}>
      <span
        aria-hidden="true"
        className="absolute inset-y-1 rounded-full transition-transform duration-[320ms]"
        style={{ left: 4, width: `calc(50% - 4px)`, background: "rgba(255,255,255,0.08)", transform: `translateX(${idx * 100}%)`, transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
      />
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`industry-tab-${t.id}`}
            aria-selected={isActive}
            aria-controls={`industry-panel-${t.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              let next: Industry | null = null;
              if (e.key === "ArrowLeft") next = TABS[(idx + TABS.length - 1) % TABS.length].id;
              else if (e.key === "ArrowRight") next = TABS[(idx + 1) % TABS.length].id;
              else if (e.key === "Home") next = TABS[0].id;
              else if (e.key === "End") next = TABS[TABS.length - 1].id;
              if (!next) return;
              e.preventDefault();
              onChange(next);
              document.getElementById(`industry-tab-${next}`)?.focus();
            }}
            className="relative z-[1] flex min-h-[44px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[13px] font-medium outline-none transition-colors focus-visible:shadow-[0_0_0_2px_#FF8838]"
            style={{ fontFamily: "Inter, system-ui, sans-serif", color: isActive ? C.text : C.muted }}
          >
            {/* Phase 4A: the dot's layout slot is now always present (only
                its opacity toggles), not conditionally mounted -- mounting
                it only when active made the centered flex content wider
                for the active tab than the inactive one (dot + gap-2 =
                14px), which measurably decentered the active tab's own
                label text 7px off its button's true center. Reserving the
                same space either way keeps a given tab's text position
                constant whether it's active or not. */}
            <span aria-hidden="true" className="block h-[6px] w-[6px] shrink-0 rounded-full transition-opacity" style={{ background: C.orange, opacity: isActive ? 1 : 0 }} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- stage

type Phase = "static" | "entering" | "exiting";

const GLOW: Record<Industry, string> = {
  concrete: "radial-gradient(52% 60% at 50% 42%, rgba(181,86,47,0.22) 0%, rgba(181,86,47,0.08) 45%, rgba(181,86,47,0) 75%)",
  landscaping: [
    "radial-gradient(46% 55% at 42% 38%, rgba(244,196,120,0.22) 0%, rgba(244,196,120,0) 70%)",
    "radial-gradient(40% 50% at 68% 55%, rgba(90,140,170,0.12) 0%, rgba(90,140,170,0) 72%)",
  ].join(", "),
};

const NAMES: Record<Industry, string> = { concrete: "Calder Concrete", landscaping: "Ashgrove Outdoor Living" };
const URLS: Record<Industry, string> = { concrete: "calderconcrete.com", landscaping: "ashgroveoutdoor.com" };

type OpenPreviewFn = (industry: Industry, mode: DeviceMode, trigger: HTMLElement) => void;

function DeviceGroup({ industry, phase, desktopW, phoneRight, onOpenPreview }: { industry: Industry; phase: Phase; desktopW: string; phoneRight: string; onOpenPreview: OpenPreviewFn }) {
  const isConcrete = industry === "concrete";
  const browser = isConcrete ? <CalderBrowserContent /> : <AshgroveBrowserContent />;
  const phone = isConcrete ? <CalderPhoneContent /> : <AshgrovePhoneContent />;
  const animClass = phase === "exiting" ? "ind-exit" : "";
  return (
    <div className={`relative mx-auto ${animClass}`} style={{ width: desktopW }}>
      <div className={phase === "entering" ? "ind-enter-browser" : undefined}>
        <BrowserChrome url={URLS[industry]} sweep={phase === "entering"} onOpen={(e) => onOpenPreview(industry, "desktop", e.currentTarget)} label={`Open ${NAMES[industry]} desktop preview`}>{browser}</BrowserChrome>
      </div>
      <div className={`absolute ${phase === "entering" ? "ind-enter-phone" : ""}`} style={{ bottom: -22, right: phoneRight, width: "clamp(150px, 17vw, 220px)", zIndex: 2 }}>
        <PhoneChrome onOpen={(e) => onOpenPreview(industry, "mobile", e.currentTarget)} label={`Open ${NAMES[industry]} mobile preview`}>{phone}</PhoneChrome>
      </div>
    </div>
  );
}

// Mobile (<640px): phone primary/foreground, browser small/secondary
// behind it -- same content components, different arrangement and scale.
function MobileDeviceGroup({ industry, phase, onOpenPreview }: { industry: Industry; phase: Phase; onOpenPreview: OpenPreviewFn }) {
  const isConcrete = industry === "concrete";
  const browser = isConcrete ? <CalderBrowserContent /> : <AshgroveBrowserContent />;
  const phone = isConcrete ? <CalderPhoneContent /> : <AshgrovePhoneContent />;
  // Staggered, not stacked: the browser sits top-left at full opacity and a
  // meaningfully larger size than before (it needs to read as a real,
  // independently tappable preview, not a dim sliver behind the phone).
  // The phone still anchors bottom-right and stays visually primary (it's
  // larger, in front, z-2), but the two are offset enough that only the
  // phone's corner clips the browser's corner -- at the 390px target this
  // leaves roughly 80% of the browser's width and ~85% of its area
  // unobstructed (verified by computed layout, not just eyeballed).
  return (
    <div className={`relative mx-auto ${phase === "exiting" ? "ind-exit-mobile" : ""}`} style={{ width: "clamp(225px, 76vw, 290px)", height: "clamp(300px, 80vw, 340px)" }}>
      <div className={`absolute left-0 top-0 ${phase === "entering" ? "ind-enter-browser-mobile" : ""}`} style={{ width: "clamp(150px, 46vw, 185px)", zIndex: 1 }}>
        <BrowserChrome url="" compact onOpen={(e) => onOpenPreview(industry, "desktop", e.currentTarget)} label={`Open ${NAMES[industry]} desktop preview`}>{browser}</BrowserChrome>
      </div>
      <div className={`absolute bottom-0 right-0 ${phase === "entering" ? "ind-enter-phone-mobile" : ""}`} style={{ width: "clamp(125px, 38vw, 155px)", zIndex: 2 }}>
        <PhoneChrome onOpen={(e) => onOpenPreview(industry, "mobile", e.currentTarget)} label={`Open ${NAMES[industry]} mobile preview`}>{phone}</PhoneChrome>
      </div>
    </div>
  );
}

function Panel({ panelId, labelledBy, active, industry, phase, onOpenPreview }: { panelId: string; labelledBy: string; active: boolean; industry: Industry; phase: Phase; onOpenPreview: OpenPreviewFn }) {
  const desktopW = industry === "concrete" ? "clamp(480px, 72vw, 940px)" : "clamp(440px, 66vw, 860px)";
  // Baseline visibility: active panels are visible; an exiting panel stays
  // visible for its own fade-out window (handled by ind-exit on its inner
  // DeviceGroup); every other inactive panel is fully hidden -- without
  // this, panels that have finished a transition (phase settles to
  // "static") would lose their animation class and fall back to the
  // browser's default opacity:1, re-appearing stacked on top of the
  // active one.
  const visible = active || phase === "exiting";
  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={labelledBy}
      aria-hidden={!active}
      {...(!active ? { inert: "" as unknown as boolean } : {})}
      className="absolute inset-0"
      style={{ opacity: visible ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-[380ms]" style={{ background: GLOW[industry], opacity: phase === "exiting" ? 0 : 1 }} />
      <div className="relative hidden h-full w-full items-center justify-center sm:flex">
        <DeviceGroup industry={industry} phase={phase} desktopW={desktopW} phoneRight="-15%" onOpenPreview={onOpenPreview} />
      </div>
      <div className="relative flex h-full w-full items-center justify-center sm:hidden">
        <MobileDeviceGroup industry={industry} phase={phase} onOpenPreview={onOpenPreview} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- expanded preview

// Below this available width, scaling the full 1280px design down to fit
// makes it illegibly small -- pan a larger, readable render instead.
const PANNABLE_TARGET_W = 720;

// A horizontally-scrollable surface showing the desktop design at a fixed,
// readable width wider than its container. Native overflow-x scrolling
// (no library, no custom gesture handling) -- vertical swipes outside it
// still scroll the page/modal normally since only this element's own
// x-axis overflow is scrollable. Keyboard-scrollable via its own
// tabIndex + native arrow-key handling browsers give a focused scroll
// container; no custom key handling needed, and nothing here can trap
// Tab (it's a plain scrollable region, not a focus trap).
function PannableDesktop({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollLeft > 12 && !scrolled) setScrolled(true);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        tabIndex={0}
        role="region"
        aria-label="Desktop design preview, scroll horizontally to see the full width"
        className="outline-none overflow-x-auto overflow-y-hidden focus-visible:shadow-[0_0_0_2px_#FF8838]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ width: PANNABLE_TARGET_W }}>{children}</div>
      </div>
      {!atEnd && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 transition-opacity duration-300" style={{ background: `linear-gradient(to right, transparent, ${C.raised})` }} />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-medium transition-opacity duration-300"
        style={{ background: "rgba(7,11,17,0.82)", color: "#f4f1ec", opacity: scrolled ? 0 : 1 }}
      >
        Swipe to explore →
      </div>
    </div>
  );
}

// Switches between the fit-to-width desktop presentation (large screens)
// and the pannable, fixed-readable-width one (narrow screens) via a pure
// CSS media query -- no ResizeObserver, no measured React state, nothing
// that depends on JS running after layout. Both branches are always
// mounted; only `display` toggles, so nothing here can remount, flash, or
// re-render in response to the dialog's own open animation or any other
// transient layout change. Same pattern DeviceGroup/MobileDeviceGroup
// already use (hidden sm:flex / sm:hidden) elsewhere in this file.
//
// WHY THIS CHANGED (see delivery notes for the full writeup): the prior
// version decided pannable-vs-not via a ResizeObserver on this element,
// conditionally mounting one of two different component trees depending
// on the measured width. Direct testing in this session's Chrome showed
// that single decision does NOT oscillate during Radix's own zoom-in-95
// entrance animation -- CSS `transform: scale()` doesn't affect
// `clientWidth` at all, since transforms are a post-layout, compositing-
// only effect. So the specific "animation causes repeated firings"
// mechanism is disproven, not just unconfirmed. What's still true and
// documented, independent of that: WebKit/iOS Safari has a history of
// ResizeObserver reliability issues for elements inside a freshly
// mounted overflow:auto ancestor. Rather than keep a mechanism that
// could not be fully verified safe on the one platform the owner is
// testing on, this removes it entirely -- the breakpoint decision is now
// made once, by the browser's native matchMedia engine, the same way
// every other responsive split in this component already works.
//
// 840px breakpoint: the viewport width where this preview's own content
// area (94vw capped at 1040px, minus the dialog's own padding) crosses
// the 720px pannable target -- not a round number, derived from the
// modal's actual sizing.
function DesktopPreviewArea({ industry }: { industry: Industry }) {
  const isConcrete = industry === "concrete";
  const scale = PANNABLE_TARGET_W / 1280;
  return (
    <div className="w-full min-w-0" style={{ maxWidth: 940 }}>
      <div className="dp-large">
        <BrowserChrome url={URLS[industry]}>{isConcrete ? <CalderBrowserContent expanded /> : <AshgroveBrowserContent />}</BrowserChrome>
      </div>
      <div className="dp-pan">
        <PannableDesktop>
          <BrowserChrome url={URLS[industry]}>
            {isConcrete ? <CalderBrowserContentFixed scale={scale} expanded /> : <AshgroveBrowserContentFixed scale={scale} />}
          </BrowserChrome>
        </PannableDesktop>
      </div>
    </div>
  );
}

const DEVICE_MODES: readonly DeviceMode[] = ["desktop", "mobile"];

function PreviewModal({ open, onOpenChange, industry, mode, onModeChange }: { open: boolean; onOpenChange: (o: boolean) => void; industry: Industry; mode: DeviceMode; onModeChange: (m: DeviceMode) => void }) {
  const isConcrete = industry === "concrete";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* grid-cols-[minmax(0,1fr)]: DialogContent is display:grid (from
          ui/dialog.tsx) with an implicit auto-sized single column, whose
          default min size is its content's min-content width. The
          pannable preview's fixed 720px-wide canvas was bubbling that
          min-content width all the way up through this column, forcing
          the whole dialog (title, Desktop/Mobile controls, everything)
          wider than its own w-[94vw] max-w-[1040px] constraint instead of
          staying put while only the inner overflow-x:auto region
          scrolled. Pinning the column to minmax(0,1fr) lets it shrink to
          0 and defer to the explicit width, which is the actual fix --
          verified by hand before this change (temporarily applying the
          same declaration confirmed only the preview itself scrolls,
          title/controls stay fixed). Scoped to this Dialog usage only,
          not the shared ui/dialog.tsx primitive. */}
      <DialogContent className="grid-cols-[minmax(0,1fr)] max-h-[90svh] w-[94vw] max-w-[1040px] overflow-y-auto border p-6 sm:p-8" style={{ background: C.raised, borderColor: C.line, color: C.text }}>
        <div className="flex flex-wrap items-center justify-between gap-4 pr-8">
          <div>
            <DialogTitle className="font-display text-[22px] font-medium leading-tight sm:text-[26px]" style={{ color: C.text }}>{NAMES[industry]}</DialogTitle>
            {/* Phase 4A: no visible "design concept" caption here, by
                owner decision -- disclosure is handled once, prominently,
                in the showroom section heading below the "Same standard.
                Different trade." title, so this expanded preview can stay
                visually clean. Radix still gets the aria-describedby it
                wants for the dialog's accessible name. */}
            <DialogDescription className="sr-only">{NAMES[industry]} website preview, {mode} view.</DialogDescription>
          </div>
          <div role="tablist" aria-label="Preview device" className="inline-flex items-center gap-1 rounded-full p-1" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }}>
            {DEVICE_MODES.map((m) => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  id={`industry-preview-tab-${m}`}
                  aria-selected={isActive}
                  aria-controls="industry-preview-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onModeChange(m)}
                  onKeyDown={(e) => {
                    const idx = DEVICE_MODES.indexOf(mode);
                    let next: DeviceMode | null = null;
                    if (e.key === "ArrowLeft") next = DEVICE_MODES[(idx + DEVICE_MODES.length - 1) % DEVICE_MODES.length];
                    else if (e.key === "ArrowRight") next = DEVICE_MODES[(idx + 1) % DEVICE_MODES.length];
                    else if (e.key === "Home") next = DEVICE_MODES[0];
                    else if (e.key === "End") next = DEVICE_MODES[DEVICE_MODES.length - 1];
                    if (!next) return;
                    e.preventDefault();
                    onModeChange(next);
                    document.getElementById(`industry-preview-tab-${next}`)?.focus();
                  }}
                  className="flex min-h-[40px] items-center rounded-full px-4 text-[13px] font-medium capitalize outline-none transition-colors focus-visible:shadow-[0_0_0_2px_#FF8838]"
                  style={{ background: isActive ? "rgba(255,255,255,0.08)" : "transparent", color: isActive ? C.text : C.muted }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel" id="industry-preview-panel" aria-labelledby={`industry-preview-tab-${mode}`} className="mt-8 flex min-w-0 items-center justify-center py-2">
          {mode === "desktop" ? (
            <DesktopPreviewArea industry={industry} />
          ) : (
            <div style={{ width: "min(84vw, 300px)" }}>
              <PhoneChrome>{isConcrete ? <CalderPhoneContent /> : <AshgrovePhoneContent />}</PhoneChrome>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------- root

const ANIM_CSS = `
@keyframes ind-fadeOutGroup { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.96); } }
@keyframes ind-fadeOutGroupMobile { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.98); } }
@keyframes ind-fadeInBrowser { 0% { opacity: 0; transform: translateY(18px) scale(0.93); } 60% { opacity: 1; } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes ind-fadeInPhone { 0% { opacity: 0; transform: translate(12px, 28px) scale(0.96); } 55% { opacity: 1; } 100% { opacity: 1; transform: translate(0, 0) scale(1); } }
@keyframes ind-fadeInSmall { 0% { opacity: 0; transform: translateY(8px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes ind-sweep { 0% { opacity: 0; transform: translateX(-60%); } 18% { opacity: 1; } 55% { opacity: 0.6; } 100% { opacity: 0; transform: translateX(60%); } }
@keyframes ind-rmIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ind-rmOut { from { opacity: 1; } to { opacity: 0; } }

/* outgoing: 0-220ms, ease-in */
.ind-exit { animation: ind-fadeOutGroup 220ms ease-in forwards; }
.ind-exit-mobile { animation: ind-fadeOutGroupMobile 180ms ease-in forwards; }
/* incoming browser: 160-570ms (410ms, 160ms delay) */
.ind-enter-browser { animation: ind-fadeInBrowser 410ms cubic-bezier(.16,1,.3,1) 160ms both; }
/* restrained directional light sweep across the browser as it settles */
.ind-sweep { animation: ind-sweep 460ms ease-out 180ms both; }
/* incoming phone: 270-680ms (410ms, 270ms delay) -- "slightly afterward" */
.ind-enter-phone { animation: ind-fadeInPhone 410ms cubic-bezier(.16,1,.3,1) 270ms both; }
.ind-enter-browser-mobile { animation: ind-fadeInSmall 260ms cubic-bezier(.16,1,.3,1) 80ms both; }
.ind-enter-phone-mobile { animation: ind-fadeInSmall 260ms cubic-bezier(.16,1,.3,1) 150ms both; }

@media (prefers-reduced-motion: reduce) {
  .ind-exit, .ind-exit-mobile { animation: ind-rmOut 120ms ease-out forwards !important; }
  .ind-enter-browser, .ind-enter-phone, .ind-enter-browser-mobile, .ind-enter-phone-mobile { animation: ind-rmIn 150ms ease-out both !important; }
  .ind-sweep { animation: none !important; display: none !important; }
}

/* Expanded-preview Desktop mode: pure CSS breakpoint, no JS measurement.
   See DesktopPreviewArea for why. */
.dp-pan { display: block; }
.dp-large { display: none; }
@media (min-width: 840px) {
  .dp-pan { display: none; }
  .dp-large { display: block; }
}
`;

export default function IndustryShowcase() {
  useConceptFonts();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Industry>("concrete");
  const [exiting, setExiting] = useState<Industry | null>(null);
  const [ashgroveWarmed, setAshgroveWarmed] = useState(false);
  const clearTimer = useRef<number>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndustry, setPreviewIndustry] = useState<Industry>("concrete");
  const [previewMode, setPreviewMode] = useState<DeviceMode>("desktop");
  // Radix's Dialog only auto-restores focus to a literal <DialogTrigger>;
  // these buttons are plain, so focus is restored manually to whichever
  // device mockup was actually clicked.
  const previewTrigger = useRef<HTMLElement | null>(null);

  // Warm Ashgrove's images ahead of the first click once the section
  // approaches the viewport, so the first switch to Landscaping doesn't
  // show blank/partially-decoded imagery.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setAshgroveWarmed(true); io.disconnect(); } },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onChange = (next: Industry) => {
    if (next === active) return;
    window.clearTimeout(clearTimer.current);
    setExiting(active);
    setActive(next);
    clearTimer.current = window.setTimeout(() => setExiting(null), 700);
  };
  useEffect(() => () => window.clearTimeout(clearTimer.current), []);

  const openPreview: OpenPreviewFn = (industry, mode, trigger) => {
    previewTrigger.current = trigger;
    setPreviewIndustry(industry);
    setPreviewMode(mode);
    setPreviewOpen(true);
  };
  const handlePreviewOpenChange = (o: boolean) => {
    setPreviewOpen(o);
    if (!o) {
      const trigger = previewTrigger.current;
      // Radix removes DialogContent from the DOM as part of closing;
      // defer the refocus one tick so it lands after that unmount.
      setTimeout(() => trigger?.focus(), 0);
    }
  };

  const showLandscaping = active === "landscaping" || exiting === "landscaping" || ashgroveWarmed;

  return (
    <ConceptImageLoadingProvider value="lazy">
    <section ref={sectionRef} className="relative py-20" style={{ background: C.navy }}>
      <style>{ANIM_CSS}</style>
      <div className={CONTAINER}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-[clamp(1.625rem,3.4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.03em]" style={{ color: C.text }}>
              Same standard. Different trade.
            </h2>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: C.faint }}>REVORA design concepts</p>
          </div>
          <Switcher active={active} onChange={onChange} />
        </div>

        <div className="relative mx-auto mt-12" style={{ height: "clamp(420px, 46vw, 650px)", maxWidth: 1020 }}>
          {/* shared floor + contact shadow -- static, not re-animated per tab */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[6%]" style={{ height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] bottom-[4%]" style={{ height: "18%", background: "radial-gradient(50% 100% at 50% 100%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)" }} />

          <Panel panelId="industry-panel-concrete" labelledBy="industry-tab-concrete" active={active === "concrete"} industry="concrete" phase={exiting === "concrete" ? "exiting" : active === "concrete" ? "entering" : "static"} onOpenPreview={openPreview} />
          {showLandscaping && (
            <Panel panelId="industry-panel-landscaping" labelledBy="industry-tab-landscaping" active={active === "landscaping"} industry="landscaping" phase={exiting === "landscaping" ? "exiting" : active === "landscaping" ? "entering" : "static"} onOpenPreview={openPreview} />
          )}
        </div>

        {/* Persistent, not hover-only -- the mockups themselves only hint
            at being clickable via a restrained hover/focus treatment, so
            this caption carries the actual discoverability. Same text for
            both industries, swapped by breakpoint via CSS only (no JS). */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          <Maximize2 size={12} aria-hidden="true" color={C.orange} />
          <span className="sm:hidden" style={{ color: "rgba(244,241,236,0.68)" }}>Tap to explore</span>
          <span className="hidden sm:inline" style={{ color: "rgba(244,241,236,0.68)" }}>Click to explore</span>
        </p>

        {/* Mobile-only closing statement, approved to use the negative
            space below the device composition. Desktop/tablet: hidden. */}
        <div className="mx-auto mt-6 max-w-[320px] text-center sm:hidden">
          <h3 className="font-display text-[20px] font-medium leading-tight" style={{ color: C.text }}>
            Built around your business.
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.muted, fontFamily: "Inter, system-ui, sans-serif" }}>
            Different trades. Different customers. A website designed for the people you want to reach.
          </p>
        </div>
      </div>

      <PreviewModal open={previewOpen} onOpenChange={handlePreviewOpenChange} industry={previewIndustry} mode={previewMode} onModeChange={setPreviewMode} />
    </section>
    </ConceptImageLoadingProvider>
  );
}
