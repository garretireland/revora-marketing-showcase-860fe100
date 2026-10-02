import { ArrowRight } from "lucide-react";
import { CALENDLY, C } from "./tokens";

// The homepage's two (and only two) conversion actions, styled once:
//   BOOK A CALL                  -> direct, high intent (Calendly)
//   SEE WHAT WE'D BUILD FOR YOU  -> lower-friction website entry (dialog)
// "solid" = orange fill, "outline" = hairline ring.

type Variant = "solid" | "outline";
const base = "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold transition-transform hover:-translate-y-0.5";
const look = (v: Variant): React.CSSProperties =>
  v === "solid" ? { background: C.orange, color: C.orangeInk } : { color: C.text, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" };

export function BookCall({ variant = "solid", className = "" }: { variant?: Variant; className?: string }) {
  return (
    <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={`${base} ${className}`} style={look(variant)}>
      Book a Call <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function SeeWhatWedBuild({ onClick, variant = "outline", className = "" }: { onClick: () => void; variant?: Variant; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`${base} ${className}`} style={look(variant)}>
      See What We'd Build For You
    </button>
  );
}
