import { C } from "@/components/homepage/tokens";
import { PIECES, EXTRAS, rect, BLUEPRINT, OLD_BG, CHAR } from "./rebuildTimeline";

// The simulated Northline browser canvas buildTimeline() animates. Split
// into its own file (exporting ONLY this one component) so that both
// WebsiteTransformation.tsx (desktop) and NorthlineCompareSlider.tsx
// (mobile) can import it directly without importing each other -- avoids a
// circular import between the two, and keeps every file in this feature
// either "components only" or "data/logic only" for React Fast Refresh.
export function Canvas() {
  return (
    <div data-wt-canvas className="relative h-full w-full overflow-hidden font-sans" style={{ background: OLD_BG }}>
      {/* the new ground, revealed behind the line */}
      <div data-wt-newbg className="absolute inset-0 origin-left" style={{ background: CHAR, willChange: "transform" }} />
      {PIECES.map((p) => (
        <div key={p.id} data-wt-piece={p.id} className="absolute overflow-hidden" style={{ ...rect(p.from), zIndex: p.z ?? 2 }}>
          <div data-wt-old className="absolute inset-0">{p.old}</div>
          {p.neu && <div data-wt-new className="absolute inset-0 opacity-0">{p.neu}</div>}
          <div data-wt-frame className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0" style={BLUEPRINT} />
        </div>
      ))}
      {EXTRAS}
      {/* the Revora rebuild line */}
      <div data-wt-line className="absolute top-0 h-full w-[3px] opacity-0" style={{ left: 0, zIndex: 20, background: C.orange, boxShadow: `0 0 18px 2px ${C.orange}66`, willChange: "transform, opacity" }} />
    </div>
  );
}
