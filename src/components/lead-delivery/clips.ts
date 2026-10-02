// Physical footage for /concept/lead-delivery, in play order. `out` is
// how each clip hands over to what follows:
//   join    -> next clip, invisible back-to-back cut
//   whip    -> next clip, short photographic motion/whip cut
//   digital -> the contractor-lead digital sequence (camera enters phone)
// Split aerial footage? List each part in order with out: "join".
export type ClipOut = "join" | "whip" | "digital";

// Source time (s) the aerial clip starts from, skipping part of the slow
// high cruise. Its end is untouched (approved street rip + whip).
export const AERIAL_START_OFFSET = 2.5;

export const CLIPS: { src: string; out: ClipOut; start?: number }[] = [
  { src: "/lead-delivery/aerial-delivery.mp4", out: "whip", start: AERIAL_START_OFFSET },
  { src: "/lead-delivery/northline-arrival.mp4", out: "digital" },
];

// Seconds. Judge these by eye against the real footage.
export const HOLD = 1.4; // on the accepted Qualified Lead frame
export const WHIP_OUT = 0.12; // outgoing street flight smear before the cut
export const WHIP_IN = 0.24; // Northline settles out of the smear
export const HANDOFF = 0.45; // phone-screen push before the digital takes over
