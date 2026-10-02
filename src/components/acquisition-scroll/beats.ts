// Story beats for /concept/acquisition-scroll, in order. PACING V2 (trailer
// role; compress information, protect physical camera continuity, ~48s): `dur` is in NATURAL-SCROLL SECONDS -- QA measured
// ~102s for 1730vh, i.e. ~17vh per second of ordinary scrolling. Pinned
// scroll distance = total x VH_PER_SEC. To give a beat time back, raise its
// dur (and its pace segments) here.

export const ORANGE = "#FF8838"; // Revora orange (dark text on it)
export const NAVY = "#0a1018"; // deep navy / near-black ground

export const VH_PER_SEC = 17; // vh of scroll per natural-scroll second

// Opening scene (SearchScene, authored in "scene seconds"):
//   Z canvassing clip 0-3.5s  -> scene 0 .. 3.5   (broad area search)
//   DIRECT CUT
//   bridge clip 3.0-5.0s      -> scene 3.5 .. 5.5 (dive through the canopy;
//     its last frame matches Prequel frame 0)
//   DIRECT CUT
//   prequel clip 0-10.04s     -> scene 5.5 .. 15.54 (candidate analysis;
//     its 5.04s+ is the established house approach, spliced in the source)
const dir = "/acquisition/acquisition-";
export const CANVASS = { src: `${dir}search-flight-scrub.mp4`, from: 0, to: 3.5 };
export const BRIDGE = { src: `${dir}search-bridge-scrub.mp4`, from: 3.0, to: 5.0 };
export const SCENE_BRIDGE_AT = CANVASS.to - CANVASS.from;
export const PREQUEL = { src: `${dir}search-prequel-approach-scrub.mp4`, len: 10.04 };
export const SCENE_PREQUEL_AT = SCENE_BRIDGE_AT + (BRIDGE.to - BRIDGE.from);
// [timeline second reached, seconds spent getting there]. Spans the
// "search" and "approach" beats. Footage speed noted per segment.
export const SEARCH_PACE: [number, number][] = [
  [SCENE_BRIDGE_AT, 2.8], // Z canvassing: searching -> candidates found (1.25x)
  [SCENE_PREQUEL_AT, 1.4], // bridge: canopy dive (1.43x)
  [SCENE_PREQUEL_AT + 5.04, 4.4], // prequel: reject, reject, RIGHT FIT, commit (1.15x)
  [SCENE_PREQUEL_AT + 10.04, 4.2], // built-in approach to the window (1.2x)
];
// LeadJourney timeline (~16.2s authored) paced unevenly into ~6.2s.
export const JOURNEY_PACE: [number, number][] = [
  [3.5, 0.9], // feed scroll -> ad settles
  [5.3, 1.2], // ad read -> push -> Get Quote tap
  [10.0, 1.5], // form opens, three answers tapped
  [11.6, 0.7], // contact captured -> submit
  [14.4, 0.9], // answers lift out -> validated
  [16.15, 1.0], // QUALIFIED LEAD title payoff
];
// ContractorLead timeline (~6.3s authored) paced unevenly into 3.4s.
export const CONTRACTOR_PACE: [number, number][] = [
  [2.2, 0.8], // lead arrives -> Revora notification + buzz
  [3.7, 0.7], // expands -> lead detail builds
  [4.95, 1.2], // lead detail held readable
  [6.34, 0.9], // CALL LEAD tap -> Calling Daniel Mercer
];
const sum = (p: [number, number][]) => p.reduce((s, [, d]) => s + d, 0);

export const BEATS = [
  { id: "search", label: "Canvass → candidates → RIGHT FIT", dur: SEARCH_PACE[0][1] + SEARCH_PACE[1][1] + SEARCH_PACE[2][1] },
  { id: "approach", label: "Race to the house → upstairs window", dur: SEARCH_PACE[3][1] },
  { id: "window", label: "Through the glass → office", dur: 3.1 },
  { id: "office", label: "Homeowner enters, sits, picks up phone", dur: 4.0 },
  { id: "phone", label: "Push into the phone", dur: 3.6 },
  { id: "journey", label: "Ad → form → qualification → Qualified Lead", dur: sum(JOURNEY_PACE) },
  { id: "launch", label: "Qualified Lead launches", dur: 1.0 },
  { id: "aerial", label: "Delivery flight", dur: 4.0 },
  { id: "connector", label: "Street race → Northline jobsite", dur: 2.4 },
  { id: "northline", label: "Northline jobsite → contractor's phone", dur: 6.6 },
  { id: "contractor", label: "Notification → lead → CALL LEAD → calling", dur: sum(CONTRACTOR_PACE) },
  { id: "hold", label: "Calling Daniel Mercer", dur: 0.6 },
] as const;

export type BeatId = (typeof BEATS)[number]["id"];

export const BEAT_AT = (() => {
  const at = {} as Record<BeatId, number>;
  let t = 0;
  for (const b of BEATS) { at[b.id] = t; t += b.dur; }
  return at;
})();
export const BEAT_DUR = Object.fromEntries(BEATS.map((b) => [b.id, b.dur])) as Record<BeatId, number>;
export const TOTAL = BEATS.reduce((s, b) => s + b.dur, 0);
// Pinned scroll length, in vh.
export const SCROLL_VH = Math.round(TOTAL * VH_PER_SEC);

// Scrub-optimised derivatives (keyframe every 6 frames) in public/acquisition.
// Originals: media/acquisition-masters/ and public/lead-delivery/.
// from/to = source seconds scrubbed across the beat (to: null = clip end).
// Optional pace = uneven [source second reached, seconds spent] segments.
// Trims remove the parts adjacent clips repeat; speeds are PACING V2.
export type Footage = { id: string; src: string; from: number; to: number | null; pace?: [number, number][] };
export const FOOTAGE = [
  // window pass -> empty office; static tail (3.6s+) dropped (1.16x)
  { id: "window", src: `${dir}window-office-scrub.mp4`, from: 0, to: 3.6 },
  // still-empty office -> enters -> sits with phone (1.08x)
  { id: "office", src: `${dir}office-homeowner-scrub.mp4`, from: 0.3, to: 4.6 },
  // over-the-shoulder push (cut-in on the same action); stop before soft (1.17x)
  { id: "phone", src: `${dir}phone-push-scrub.mp4`, from: 4.4, to: 8.6 },
  // in at 5.2s: after the source's internal splice (~5.04s) and all the
  // redundant high cruise, just before the descent begins (~5.4s) (1.21x)
  { id: "aerial", src: `${dir}aerial-delivery-scrub.mp4`, from: 5.2, to: null },
  // street race in; static jobsite tail (3.6s+) dropped -- it equals Northline 0-1s (1.08x)
  { id: "connector", src: `${dir}delivery-connector-scrub.mp4`, from: 1.0, to: 3.6 },
  // uniform: approach -> contractor -> phone push (1.36x)
  { id: "northline", src: `${dir}northline-arrival-scrub.mp4`, from: 1.0, to: 10.0 },
] as const satisfies readonly Footage[];
export type FootageId = (typeof FOOTAGE)[number]["id"];
