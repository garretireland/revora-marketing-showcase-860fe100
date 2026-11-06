import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C, CONTAINER } from "@/components/homepage/tokens";
import {
  declineAnalyticsConsent, getStoredConsent, grantAnalyticsConsent,
  onConsentChange, onConsentPanelRequest,
} from "@/lib/analytics";

// Compact, non-blocking bottom bar (not a focus-trapping modal -- it
// doesn't need to block the rest of the page). Accept/Decline are
// deliberately equal size, weight and prominence: same pill button,
// same padding, only the accent color differs (orange ring = accept,
// white ring = decline) -- there is no "big orange button vs small grey
// link" pattern here, since neither choice should read as the "right"
// one. Real <button> elements throughout, so keyboard/tab behavior and
// focus rings are native, not reimplemented.
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // no stored choice yet -> show immediately on first load
    if (!getStoredConsent()) setVisible(true);
    // "Cookie Settings" in the footer re-opens this regardless of any
    // prior choice, so a visitor can change their mind later
    const offPanel = onConsentPanelRequest(() => setVisible(true));
    // hide once a choice is made (covers both this banner's own buttons
    // and, in principle, any other future entry point that calls these)
    const offConsent = onConsentChange(() => setVisible(false));
    return () => { offPanel(); offConsent(); };
  }, []);

  if (!visible) return null;

  const btn = "flex-1 sm:flex-none rounded-full px-6 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5";

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t"
      style={{ background: C.raised, borderColor: C.line }}
    >
      <div className={`${CONTAINER} flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-[14px] leading-relaxed" style={{ color: C.muted }}>
          We use optional analytics to understand how visitors use this site. Nothing is tracked unless you accept.{" "}
          <Link to="/privacy-policy" className="underline underline-offset-4 transition-colors hover:text-white">Privacy Policy</Link>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { declineAnalyticsConsent(); }}
            className={btn}
            style={{ color: C.text, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => { grantAnalyticsConsent(); }}
            className={btn}
            style={{ color: C.orange, boxShadow: `inset 0 0 0 1px ${C.orange}` }}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
