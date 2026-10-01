// Copy + fictional data for the isolated lead-journey prototype
// (/concept/lead-journey). All contact details are reserved fictional
// values: 555-01xx numbers and the example.com domain.

// Supplied Northline Roofing ad creative. Drop the final PNG here; until
// it exists the components render an obvious labelled placeholder.
export const AD_IMAGE = "/lead-journey/northline-roofing-ad.png";

// Revora-world accent. Single swap point if the brand accent changes.
export const ACCENT = "#c8e64a";
export const REVORA_BG = "#0a0b0c";

// Stage is authored in fixed design pixels and scaled to fit (16:9).
export const STAGE_W = 1600;
export const STAGE_H = 900;
export const COL_W = 640;
export const STATUS_H = 36;
export const APPBAR_H = 56;
// The phone UI is rendered larger than 1:1 so it fills the frame.
export const WORLD_SCALE = 1.25;

export const AD = {
  name: "Northline Roofing",
  body: "Roof showing its age? Get a free, no-obligation roofing estimate from a trusted local crew.",
  headline: "FREE ROOFING ESTIMATE",
  description: "Protect your home before small problems become expensive ones.",
  cta: "Get Quote",
};

export const FORM_TITLE = "Get Your Free Roofing Estimate";

export const QUESTIONS = [
  { q: "What do you need help with?", options: ["Full roof replacement", "Roof repair", "Not sure"], pick: 0 },
  { q: "When are you looking to get started?", options: ["ASAP", "Within 30 days", "1–3 months", "Just researching"], pick: 1 },
  { q: "Are you the homeowner?", options: ["Yes", "No"], pick: 0 },
];

export const LEAD = {
  name: "Daniel Mercer",
  phone: "(519) 555-0148",
  email: "daniel.mercer@example.com",
};

export const CONTACT_FIELDS = [
  { label: "Full name", value: LEAD.name },
  { label: "Phone number", value: LEAD.phone },
  { label: "Email", value: LEAD.email },
];

export const CRITERIA = ["Homeowner", "Full roof replacement", "Within 30 days", "Contact details captured"];
// The same answers as the homeowner gave them, before Revora reframes
// them as validated criteria (same row order, so cards never cross).
export const ANSWERS = ["Homeowner: Yes", "Full roof replacement", "Within 30 days", LEAD.name];
