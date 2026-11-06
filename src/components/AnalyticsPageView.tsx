import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initAnalyticsIfConsented, track } from "@/lib/analytics";

// Same shape as ScrollToTop: a null-rendering component keyed on
// useLocation(). Deliberately skips its own first pathname-effect run
// (hasMounted ref) -- the page the visitor is already on is covered once,
// by whichever of the two paths below actually initializes tracking for
// this load (a returning visitor's persisted consent, or a fresh
// Accept click), not by this component. This only ever fires for
// pathname CHANGES after that, so the two can never double-count the
// same page_view no matter when in the session consent happens to be
// granted. track() itself is a silent no-op without consent, so this
// runs safely regardless of consent state.
export default function AnalyticsPageView() {
  const { pathname } = useLocation();
  const hasMounted = useRef(false);

  // Mount-once: resume tracking for a RETURNING visitor who already
  // consented in a prior session. Without this, persisted consent would
  // silently produce zero tracking on every visit after the first,
  // since nothing else in the app re-initializes gtag.js on a fresh load.
  useEffect(() => {
    initAnalyticsIfConsented();
  }, []);

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    track("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
