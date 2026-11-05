import { C } from "@/components/homepage/tokens";
import NorthlineCompareSlider from "@/components/concepts/NorthlineCompareSlider";

// Review route for the mobile drag-driven rebuild prototype (V3). Not
// linked from the site. Renders the SAME transformation timeline the
// desktop sequence uses (see NorthlineCompareSlider.tsx), just driven by
// drag instead of scroll. Constrained to fixed-width columns so it
// previews at realistic widths even on a desktop browser.
export default function NorthlineComparePreview() {
  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: C.navy, color: C.text }}>
      <div className="mx-auto w-full max-w-[1100px] px-6 py-14 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>
          Prototype checkpoint &middot; not linked from the live site
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-tight">
          Northline mobile rebuild &mdash; drag control
        </h1>
        <p className="mt-2 max-w-[560px] text-[15px]" style={{ color: C.muted }}>
          Drag (or use arrow keys once focused) to scrub the actual
          element-by-element rebuild forward and back &mdash; the same
          timeline the desktop scroll sequence runs, just driven by the
          slider instead of scroll position. Vertical scrolling on this
          page is completely normal &mdash; only the track below each stage
          responds to drag.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.25em]" style={{ color: C.faint }}>
              Phone width (390px)
            </p>
            <div className="mx-auto w-[390px] max-w-full">
              <NorthlineCompareSlider />
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.25em]" style={{ color: C.faint }}>
              Small-tablet width (700px)
            </p>
            <div className="mx-auto w-[700px] max-w-full">
              <NorthlineCompareSlider />
            </div>
          </div>
        </div>

        {/* Scroll-past content, purely so this page can demonstrate that
            vertical scrolling stays completely natural around the slider. */}
        <div className="mt-24 max-w-[560px] space-y-6" style={{ color: C.faint }}>
          <p className="text-[13px]">
            (Spacer content below — scroll past the slider above to confirm
            the page keeps scrolling normally and the slider never traps the
            scroll gesture.)
          </p>
          <div className="h-[60vh]" />
          <p className="text-[13px]">You reached the bottom of the spacer. Nothing was trapped.</p>
        </div>
      </div>
    </div>
  );
}
