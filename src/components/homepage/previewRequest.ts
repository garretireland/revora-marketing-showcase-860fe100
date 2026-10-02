// "See What We'd Build For You" request: data shape, validation, and the
// submission seam.
//
// DELIVERY IS NOT CONNECTED YET. This repo has no backend, serverless
// function, form service or env configuration (audited), so there is no
// safe way to deliver a request. submitPreviewRequest() therefore REJECTS
// with "not-configured" -- the UI must never show success until a real
// delivery mechanism replaces the body of that function. Intended
// destination: garret@revoramarketingagency.com, subject
// "New Revora Website Preview Request — [Business Name]".

export type PreviewRequest = {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  improve: string;
  /** honeypot: real people leave this empty */
  company_url: string;
};

export const EMPTY_REQUEST: PreviewRequest = { name: "", business: "", website: "", email: "", phone: "", improve: "", company_url: "" };
export const IMPROVE_MAX = 1000;
export const CONTACT_EMAIL = "garret@revoramarketingagency.com";

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

// The submission seam. Replace this body with the approved delivery
// mechanism (and resolve only on a confirmed backend success).
export async function submitPreviewRequest(r: PreviewRequest): Promise<void> {
  if (r.company_url) return; // honeypot tripped: drop quietly (bots only)
  throw new SubmitError("not-configured");
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
