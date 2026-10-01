import { useState } from "react";
import ContractorLead from "@/components/contractor-lead/ContractorLead";

// Isolated review route for the contractor-receives-lead prototype. Not
// linked from any nav; not part of the production cinematic.
const FRAME_W = "min(100%, calc((100svh - 96px) * 16 / 9))";

export default function ContractorLeadPreview() {
  const [run, setRun] = useState(0);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050505] px-4 py-6 font-sans">
      <div className="w-full" style={{ maxWidth: FRAME_W }}>
        <ContractorLead key={run} />
      </div>
      <div className="flex w-full items-center justify-between text-xs text-white/40" style={{ maxWidth: FRAME_W }}>
        <span>Concept preview · Contractor receives qualified lead</span>
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
