// Centralized GA4 analytics. The ONLY file in this app that touches
// window.gtag / window.dataLayer directly -- every other file calls
// track()/grantAnalyticsConsent()/etc. from here, never gtag() itself.
//
// Deferred-loading design (owner decision, Phase 7D): gtag.js is not
// injected at all until a visitor explicitly accepts analytics. Before
// that: no script tag, no network request to googletagmanager.com, no GA
// cookies, no queued/replayed events.
//
// Phase 7D correctness pass: deferred loading alone isn't enough to
// guarantee withdrawal actually stops collection once the library HAS
// run -- removing the <script> tag does nothing to event listeners the
// library already registered for its own automatic Enhanced Measurement
// signals (scroll depth, outbound clicks, etc.), which operate inside
// gtag.js's own closures and never pass through our track() wrapper at
// all. The real, Google-documented mechanism for "tell an already-running
// instance to stop" is the Consent Mode API itself: gtag('consent',
// 'default'/'update', { analytics_storage: ... }). The library is
// designed to respect this signal for ALL of its own collection, not just
// hits we explicitly fire -- so it's used here even though the script
// itself is also removed (defense in depth, not a substitute for it).
//
// Never pass visitor-identifying data (name, email, phone, business,
// form content) as event parameters -- every call site in this app is
// reviewed to only ever pass bare events or a page_path string.

const GA_MEASUREMENT_ID = "G-DH48LGP4Y1";
const CONSENT_KEY = "revora_consent";
const SCRIPT_ID = "ga4-gtag-script";

export type ConsentState = { analytics: boolean; timestamp: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// true only once gtag.js has ACTUALLY finished loading and been
// configured (set inside the script's onload, not when injection starts)
// -- track() gates on this, not on injection having merely begun, so
// nothing can fire into a half-initialized or since-declined instance.
let gtagReady = false;

const listeners = new Set<(c: ConsentState | null) => void>();
const panelListeners = new Set<() => void>();

function notifyConsent(c: ConsentState | null) {
  listeners.forEach((cb) => cb(c));
}

export function onConsentChange(cb: (c: ConsentState | null) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Lets the footer's "Cookie Settings" link reopen the banner without the
// banner and footer needing to know about each other directly.
export function requestConsentPanel() {
  panelListeners.forEach((cb) => cb());
}

export function onConsentPanelRequest(cb: () => void): () => void {
  panelListeners.add(cb);
  return () => panelListeners.delete(cb);
}

export function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.analytics === "boolean" ? parsed : null;
  } catch {
    return null; // storage disabled/unavailable: treat as no decision yet
  }
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent()?.analytics === true;
}

function setStoredConsent(analytics: boolean) {
  const state: ConsentState = { analytics, timestamp: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: consent still applies for this page load via
    // the in-memory gtagReady flag, it just won't persist across visits
  }
  notifyConsent(state);
}

function gtagStub(...args: unknown[]) { window.dataLayer!.push(args); }

// Injects gtag.js and, only once it has genuinely finished loading, moves
// consent to 'granted' and configures it. Handles the real async race:
// if the visitor declines WHILE this is still in flight, onload's own
// consent re-check sees that and skips granting/configuring entirely --
// analytics_storage stays at its 'denied' default the whole time, no hit
// is ever sent for that load, and gtagReady never becomes true.
function ensureGtagLoaded() {
  if (gtagReady || document.getElementById(SCRIPT_ID)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtagStub;
  // Consent Mode default: denied until explicitly updated below. Set
  // synchronously, before the async script load even starts, so there is
  // no window where the library could initialize without this baseline.
  window.gtag("consent", "default", { analytics_storage: "denied" });
  window.gtag("js", new Date());

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    if (!hasAnalyticsConsent()) return; // race guard: declined while this was loading
    window.gtag!("consent", "update", { analytics_storage: "granted" });
    // send_page_view: false -- we manage every page_view manually (see
    // grantAnalyticsConsent/initAnalyticsIfConsented + AnalyticsPageView)
    // so GA4's own automatic initial page_view (part of Enhanced
    // Measurement) never fires and can never double up with our own.
    window.gtag!("config", GA_MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });
    gtagReady = true;
    // the one manual page_view for whatever page the visitor is actually
    // on by the time loading finishes (read live, not captured earlier --
    // correct even if they navigated client-side during the load).
    track("page_view", { page_path: window.location.pathname });
  };
  document.head.appendChild(script);
}

// Removes GA's first-party cookies for this domain.
function clearAnalyticsCookies() {
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"));
  for (const name of names) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  }
}

export function grantAnalyticsConsent() {
  setStoredConsent(true);
  ensureGtagLoaded(); // onload fires the initial page_view once truly ready
}

export function declineAnalyticsConsent() {
  setStoredConsent(false);
  // Tell an already-running instance to stop via the mechanism it's
  // actually designed to respect -- this is what stops its OWN internal
  // Enhanced Measurement listeners (scroll, outbound clicks, etc.), not
  // just our track() calls, which removing the script tag alone cannot do.
  if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
  document.getElementById(SCRIPT_ID)?.remove();
  gtagReady = false;
  clearAnalyticsCookies();
  // Declining/withdrawing stops all FUTURE collection and removes what we
  // can locally. It does not retroactively delete data already sent to
  // Google under a prior consent -- that requires Google's own deletion
  // tools, not something this client-side code can do.
}

// Call once at app startup. If a PRIOR session already consented
// (persisted in localStorage), re-initializes tracking for this new page
// load/visit -- without this, a returning visitor who consented last time
// would get silently zero tracking on every subsequent visit. Safe to
// call unconditionally: no-ops instantly if there's no stored consent.
export function initAnalyticsIfConsented() {
  if (hasAnalyticsConsent()) ensureGtagLoaded();
}

export function track(eventName: string, params?: Record<string, string | number | boolean>) {
  if (!hasAnalyticsConsent() || !gtagReady || !window.gtag) return;
  window.gtag("event", eventName, params ?? {});
}
