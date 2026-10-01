import { useState } from "react";
import LeadJourney from "@/components/lead-journey/LeadJourney";

// Isolated review route for the digital lead-journey prototype. Not linked
// from any nav; not part of the production cinematic.
const FRAME_W = "min(100%, calc((100svh - 96px) * 16 / 9))";

export default function LeadJourneyPreview() {
  const [run, setRun] = useState(0);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050505] px-4 py-6 font-sans">
      <div className="w-full" style={{ maxWidth: FRAME_W }}>
        <LeadJourney key={run} />
      </div>
      <div className="flex w-full items-center justify-between text-xs text-white/40" style={{ maxWidth: FRAME_W }}>
        <span>Concept preview · Digital lead journey</span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="rounded-full border border-white/15 px-4 py-1.5 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Replay
        </button>
      </div>
    </main>
  );
}
