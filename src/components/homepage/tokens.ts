// Revora homepage design tokens. Orange means action / emphasis /
// transformation -- never decoration.
export const C = {
  ink: "#070b11", // deepest navy-black (section grounds)
  navy: "#0a1018", // primary ground
  raised: "#0f1722", // subtle raised surface
  line: "rgba(255,255,255,0.09)", // hairlines
  text: "#f4f1ec", // warm off-white
  muted: "rgba(244,241,236,0.62)",
  faint: "rgba(244,241,236,0.38)",
  orange: "#FF8838",
  orangeInk: "#0a1018", // text on orange
};

// Booking destination (existing Calendly event; never described by duration).
export const CALENDLY = "https://calendly.com/garret-revoramarketingagency/30min";

export const CONTAINER = "mx-auto w-full max-w-[1240px] px-6 md:px-10";

export const OFFER = [
  { value: "$997", label: "website build" },
  { value: "$99/mo", label: "Website Care" },
  { value: "No lock-in", label: "" },
] as const;
