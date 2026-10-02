import { Link } from "react-router-dom";
import { RevoraLogo } from "./SiteNav";
import { CALENDLY, C, CONTAINER } from "./tokens";
import { onSectionClick } from "./scrollTo";

// Minimal footer. Only real, existing details: the established contact
// email and the existing Privacy Policy route. No invented socials/legal.

const LINKS = [
  ["Websites", "#offer"],
  ["How It Works", "#how-it-works"],
  ["Lead Generation", "#lead-generation"],
  ["Founding Program", "#founding"],
  ["FAQ", "#faq"],
] as const;

const EMAIL = "garret@revoramarketingagency.com";

export default function SiteFooter() {
  return (
    <footer className="border-t py-14 md:py-16" style={{ background: C.ink, borderColor: C.line }}>
      <div className={`${CONTAINER} flex flex-col gap-10 md:flex-row md:items-start md:justify-between`}>
        <div>
          <RevoraLogo height={26} />
          <p className="mt-4 text-[14px]" style={{ color: C.faint }}>Websites + Lead Generation for Local Service Businesses</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-[14px] sm:grid-cols-3 md:flex md:gap-8" style={{ color: C.muted }}>
          {LINKS.map(([label, href]) => (
            <a key={href} href={`/${href}`} onClick={(e) => onSectionClick(e, href.slice(1))} className="transition-colors hover:text-white">{label}</a>
          ))}
        </nav>
      </div>
      <div className={`${CONTAINER} mt-12 flex flex-col gap-4 border-t pt-8 text-[13px] md:flex-row md:items-center md:justify-between`} style={{ borderColor: C.line, color: C.faint }}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors hover:text-white" style={{ color: C.orange }}>Book a Call</a>
          <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">{EMAIL}</a>
          <Link to="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link>
        </div>
        <span>© {new Date().getFullYear()} Revora Marketing</span>
      </div>
    </footer>
  );
}
