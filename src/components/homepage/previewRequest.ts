// "See What We'd Build For You" request: data shape, validation, and
// delivery via NETLIFY FORMS (the production host). The form is registered
// at deploy time by the static <form name="website-preview-request"> in
// index.html; submissions are a urlencoded POST with form-name. The UI shows
// success ONLY when submitPreviewRequest() resolves, i.e. Netlify's form
// handler accepted the submission. Anything else rejects (and the dialog
// offers the email / Book a Call fallback).

export type PreviewRequest = {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  improve: string;
  /** honeypot: real people leave this empty */
  "bot-field": string;
};

export const EMPTY_REQUEST: PreviewRequest = { name: "", business: "", website: "", email: "", phone: "", improve: "", "bot-field": "" };
export const IMPROVE_MAX = 1000;
export const CONTACT_EMAIL = "garret@revoramarketingagency.com";
export const FORM_NAME = "website-preview-request";

export type FieldErrors = Partial<Record<keyof PreviewRequest, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// accepts "example.com", "www.example.com", "https://example.com/page"
const SITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;

export function validate(r: PreviewRequest): FieldErrors {
  const e: FieldErrors = {};
  if (!r.name.trim()) e.name = "Please enter your name.";
  if (!r.business.trim()) e.business = "Please enter your business name.";
  if (!r.email.trim()) e.email = "Please enter your email.";
  else if (!EMAIL_RE.test(r.email.trim())) e.email = "That email doesn't look quite right.";
  if (r.website.trim() && !SITE_RE.test(r.website.trim())) e.website = "Enter a web address like yourbusiness.com, or leave it blank.";
  const digits = r.phone.replace(/\D/g, "");
  if (r.phone.trim() && (digits.length < 10 || digits.length > 15)) e.phone = "Enter a phone number with area code, or leave it blank.";
  if (r.improve.length > IMPROVE_MAX) e.improve = `Please keep this under ${IMPROVE_MAX} characters.`;
  return e;
}

export const normalizeWebsite = (w: string) => {
  const t = w.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

export class SubmitError extends Error {
  constructor(public code: "not-configured" | "network" | "server") {
    super(code);
  }
}

// Resolves only when Netlify's form handler accepted the submission.
// Rejects on network failure/timeout, a non-2xx response (e.g. form
// detection off -> 404/405), or a 2xx that is just the app shell (a
// rewrite, not the form handler).
export async function submitPreviewRequest(r: PreviewRequest): Promise<void> {
  if (r["bot-field"]) return; // honeypot tripped: drop quietly (bots only)
  const body = new URLSearchParams({
    "form-name": FORM_NAME,
    name: r.name.trim(),
    business: r.business.trim(),
    website: normalizeWebsite(r.website),
    email: r.email.trim(),
    phone: r.phone.trim(),
    improve: r.improve.trim(),
    "bot-field": "",
  }).toString();
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 15000);
  let res: Response;
  try {
    res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body, signal: ctrl.signal });
  } catch {
    throw new SubmitError("network");
  } finally {
    window.clearTimeout(timer);
  }
  if (!res.ok) throw new SubmitError("server");
  const text = await res.text().catch(() => "");
  if (text.includes('id="root"')) throw new SubmitError("not-configured");
}

// Honest fallback while delivery isn't connected: a pre-filled email the
// prospect sends themselves (nothing is sent automatically).
export function mailtoFor(r: PreviewRequest) {
  const lines = [
    "Revora website preview request",
    "",
    `Name: ${r.name.trim()}`,
    `Business: ${r.business.trim()}`,
    `Email: ${r.email.trim()}`,
    r.website.trim() && `Website: ${normalizeWebsite(r.website)}`,
    r.phone.trim() && `Phone: ${r.phone.trim()}`,
    r.improve.trim() && `\nWhat they'd like to improve:\n${r.improve.trim()}`,
  ].filter(Boolean);
  const subject = `New Revora Website Preview Request — ${r.business.trim() || "Website"}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
