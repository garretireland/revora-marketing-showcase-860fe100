import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { C } from "@/components/homepage/tokens";
import { BrowserFrame, Scaled } from "@/components/homepage/MockSites";
import { Canvas } from "@/components/website-transformation/RebuildCanvas";
import { buildTimeline, T, H } from "@/components/website-transformation/rebuildTimeline";

// Mobile drag control for the Northline element-by-element rebuild. This is
// NOT a before/after image-reveal slider -- it renders the SAME <Canvas/>
// and runs the SAME buildTimeline() GSAP timeline the desktop sequence
// uses (both imported directly, not re-implemented), just driven a
// different way:
//   Desktop: scroll position -> ScrollTrigger's scrub -> timeline progress.
//   Here:    drag position   -> tl.progress(fraction) directly.
// buildTimeline() never creates a ScrollTrigger itself (that only happens
// in WebsiteTransformation.tsx's own effect, untouched) -- it just returns
// a plain paused GSAP timeline, which is exactly what makes this possible
// without maintaining a second, independent choreography. Reversible for
// free: GSAP timelines can jump to any progress value in either direction.
//
// The drag surface is a dedicated horizontal track below the stage (same
// pattern already proven in AcquisitionFilm.tsx's seek bar: a small,
// clearly-bounded hit area with touch-action: pan-y and a dx/dy threshold
// before a touch is treated as a horizontal drag), not the stage itself --
// so there's no risk of the large canvas ever intercepting a vertical
// scroll gesture.

const CLAMP = (n: number) => Math.min(100, Math.max(0, n));

// Calibration (V3 feedback): a plain 0-100% -> tl.progress(0-1) mapping
// wastes its final ~28% of travel on desktop-only beats this slider never
// renders -- T.hold (4.96) to T.mobile (5.85) is a pure static hold with
// zero visual change by design, and T.mobile to T.end (6.85) is only a
// camera nudge toward a responsive-proof phone mockup this compact view
// doesn't render (so that tween is already a harmless no-op here). Bounding
// the slider's full 0-100% range to [0, T.hold] instead means every part of
// the drag produces visible change, without touching buildTimeline(), any
// PIECES choreography, or the desktop ScrollTrigger mapping at all -- this
// is purely a remap of what fraction of the SAME timeline the slider's own
// 0-100% spans.
const MOBILE_RANGE_END = T.hold; // 4.96 timeline units: fully rebuilt, still holding

export default function NorthlineCompareSlider() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0); // 0 = original website, 100 = completed redesign
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Build the real timeline once, on this component's own stage -- same
  // function, same PIECES, same blueprint styling as desktop. Starts
  // paused at progress 0 (the dated original), never auto-plays: it only
  // ever moves in direct response to a drag or key press below.
  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const ctx = gsap.context(() => {
      tlRef.current = buildTimeline(stageRef.current!);
      tlRef.current.progress(0);
    }, stageRef);
    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  const applyPct = (next: number) => {
    const clamped = CLAMP(next);
    setPct(clamped);
    const tl = tlRef.current;
    if (!tl) return;
    // Map the slider's own 0-100% onto [0, MOBILE_RANGE_END] of the
    // timeline, then convert that into the 0-1 fraction GSAP's progress()
    // expects of the timeline's REAL total duration (tl.duration(), not a
    // re-hardcoded T.end, so this never drifts out of sync with the actual
    // timeline buildTimeline() returns).
    tl.progress((clamped / 100) * (MOBILE_RANGE_END / tl.duration()));
  };

  const scrub = useRef<{ id: number; x0: number; y0: number; mode: "pending" | "drag" } | null>(null);
  const pctAt = (x: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return CLAMP(((x - r.left) / r.width) * 100);
  };

  const beginDrag = (e: React.PointerEvent) => {
    trackRef.current?.setPointerCapture(e.pointerId);
    scrub.current!.mode = "drag";
    setDragging(true);
    setInteracted(true);
  };
  const endDrag = () => {
    const id = scrub.current?.id;
    if (id !== undefined) {
      try { trackRef.current?.releasePointerCapture(id); } catch { /* already released */ }
    }
    setDragging(false);
    scrub.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation();
    scrub.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, mode: "pending" };
    if (e.pointerType === "mouse") {
      beginDrag(e);
      applyPct(pctAt(e.clientX));
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = scrub.current;
    if (!s || s.id !== e.pointerId) return;
    if (s.mode === "pending") {
      const dx = Math.abs(e.clientX - s.x0), dy = Math.abs(e.clientY - s.y0);
      if (dx > 6 && dx > dy) {
        beginDrag(e);
        e.preventDefault(); // confirmed horizontal: stop native pan-y from also competing for this gesture
      } else {
        // Require a clearer, more vertical-dominant move before giving up
        // on the drag. The old dy>10 (regardless of dx) cancelled on the
        // very first sample for any touch with even a slightly diagonal
        // start -- exactly what a finger tends to do immediately after a
        // vertical scroll, when some residual vertical motion is still
        // present even though the user is now trying to drag horizontally.
        if (dy > 24 && dy > dx * 1.5) scrub.current = null; // clearly a scroll: let the page handle it
        return;
      }
    } else {
      e.preventDefault(); // already dragging: keep native vertical pan from taking back over mid-gesture
    }
    applyPct(pctAt(e.clientX));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = scrub.current;
    if (!s || s.id !== e.pointerId) return;
    if (s.mode === "pending") {
      setInteracted(true);
      applyPct(pctAt(e.clientX));
      scrub.current = null;
      return;
    }
    applyPct(pctAt(e.clientX));
    endDrag();
  };
  const onPointerCancel = () => {
    if (scrub.current?.mode === "drag") endDrag();
    else scrub.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -10, PageUp: 10 };
    let next: number | null = null;
    if (e.key in step) next = pct + step[e.key];
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    setInteracted(true);
    applyPct(next);
  };

  // "Original website" (prior wording) could read as a real client's actual
  // prior site; "Original concept" states plainly that this is REVORA's own
  // illustrative before-state, pairing naturally with "Completed redesign".
  const stateLabel = pct <= 2 ? "Original concept" : pct >= 98 ? "Completed redesign" : "Rebuilding";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.faint }}>
          Northline Roofing
        </p>
        <p className="text-[11px] font-medium" style={{ color: C.muted }}>{stateLabel}</p>
      </div>

      {/* The stage: the SAME Canvas/BrowserFrame/Scaled structure the
          desktop sequence uses, display-only -- no pointer handlers here,
          so it can never capture a scroll gesture. */}
      <div className="relative w-full overflow-hidden rounded-[10px]" style={{ boxShadow: "0 40px 100px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)" }}>
        <div ref={stageRef} style={{ perspective: "1400px" }}>
          <div data-wt-cam style={{ transformOrigin: "50% 60%", willChange: "transform" }}>
            <BrowserFrame label="northlineroofing.com">
              <Scaled height={H}>
                <Canvas />
              </Scaled>
            </BrowserFrame>
          </div>
        </div>
      </div>

      {/* The control: a dedicated horizontal track, same touch-safety
          pattern as AcquisitionFilm.tsx's seek bar. BEFORE labels the left
          end, AFTER the right end -- the track's own axis is the
          before/after axis, not a split in the canvas above. */}
      <div className="mt-5 flex items-center gap-3">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.faint }}>Before</span>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Scrub the Northline Roofing rebuild from original to redesigned"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(pct)}% -- ${stateLabel.toLowerCase()}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onKeyDown={onKeyDown}
          className="relative h-11 flex-1 cursor-ew-resize select-none outline-none [touch-action:pan-y] focus-visible:[&_[data-handle]]:shadow-[0_0_0_3px_rgba(255,136,56,0.55)]"
        >
          {/* hit-area track line -- inset by the handle's own radius (16px,
              matching h-8 w-8 below) on each side, so the fill bar and
              handle travel entirely within the track's own box and never
              overhang into the Before/After labels at either end. The
              track div itself (the pointer/keyboard target) stays full
              width -- only the visual fill/handle are inset. */}
          <div className="absolute left-4 right-4 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: C.orange }} />
          </div>
          {/* thumb -- position matches the same 16px inset so it never
              extends past the track's own left/right edge */}
          <div
            data-handle
            className={`pointer-events-none absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform ${dragging ? "scale-110" : ""}`}
            style={{ left: `calc(16px + (100% - 32px) * ${pct / 100})`, background: "#f4f1ec", boxShadow: "0 10px 24px -6px rgba(0,0,0,0.6)" }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 3L1.5 8L5 13" stroke="#0a1018" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 3L14.5 8L11 13" stroke="#0a1018" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* "Drag to transform" hint -- present until the first interaction */}
          {!interacted && (
            <div
              className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-medium"
              style={{ background: "rgba(7,11,17,0.82)", color: "#f4f1ec", animation: reduceMotion ? "none" : "ncsHint 1.8s ease-in-out infinite" }}
            >
              Drag to transform &rarr;
            </div>
          )}
        </div>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.orange }}>After</span>
      </div>

      {!reduceMotion && (
        <style>{`@keyframes ncsHint { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-3px); } }`}</style>
      )}
    </div>
  );
}
