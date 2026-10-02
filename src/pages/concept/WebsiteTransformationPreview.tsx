import WebsiteTransformation from "@/components/website-transformation/WebsiteTransformation";
import { C } from "@/components/homepage/tokens";

// Isolated review route for the website-transformation cinematic. Not
// linked from any nav; `/` keeps its static stage until this is approved.
export default function WebsiteTransformationPreview() {
  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: C.navy, color: C.text }}>
      <section className="flex h-[70vh] flex-col items-center justify-center text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.orange }}>Prototype · website transformation</p>
        <p className="mt-4 text-[15px]" style={{ color: C.faint }}>Scroll ↓</p>
      </section>
      <WebsiteTransformation />
      <section className="flex h-[80vh] items-center justify-center text-[14px]" style={{ background: C.ink, color: C.faint }}>
        Page continues here · scroll up to reverse
      </section>
    </div>
  );
}
