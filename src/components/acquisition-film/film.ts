import { SCENE_BRIDGE_AT, SCENE_PREQUEL_AT } from "@/components/acquisition-scroll/beats";

// FILM PACING (QA pass #5) for the clock-driven film preview
// (/concept/acquisition-film-render). Same source project as the scroll
// cinematic, re-paced for intentional viewing. All `dur` values are FILM
// SECONDS. Picture only -- no sound yet.

const P = SCENE_PREQUEL_AT; // SearchScene: Z 0-3.5, bridge 3.5-5.5, Prequel 5.5+

// [SearchScene timeline second reached, film seconds]. The first 8
// segments are the search beat; the rest are the approach beat.
const SEARCH_SEGMENTS = 8;
export const FILM_SEARCH_PACE: [number, number][] = [
  [SCENE_BRIDGE_AT, 3.5], // Z canvassing (1.0x)
  [P, 2.0], // bridge canopy dive (1.0x)
  [P + 0.82, 1.5], // candidate #1: checking -> not a fit (0.55x)
  [P + 1.5, 0.7], // redirect flyover (0.97x)
  [P + 2.5, 1.7], // candidate #2: checking -> not a fit (0.59x)
  [P + 3.3, 0.8], // redirect flyover (1.0x)
  [P + 4.45, 2.1], // final house: checking -> RIGHT FIT + lock (0.55x)
  [P + 5.04, 0.6], // overlays gone, commit (0.98x)
  // approach: brief commit, then the camera LAUNCHES at the window
  [P + 6.0, 0.96], // treetops clear -> driveway, house established (1.0x)
  [P + 6.6, 0.333], // launch (1.8x)
  [P + 7.4, 0.267], // (3.0x)
  [P + 8.3, 0.2], // front rushing in (4.5x)
  [P + 9.2, 0.15], // (6.0x)
  [P + 10.04, 0.105], // window attack (8.0x) -> hard cut
];

// LeadJourney authored timeline (0-16.15s) -> 10.8s
export const FILM_JOURNEY_PACE: [number, number][] = [
  [3.5, 1.25], // feed -> ad enters and settles
  [4.2, 1.15], // settled ad read
  [5.3, 0.7], // push in -> Get Quote tap
  [10.0, 2.7], // form + three answers (unchanged)
  [11.6, 1.3], // contact captured -> submit
  [14.4, 1.7], // answers lift out -> validated
  [16.15, 2.0], // QUALIFIED LEAD payoff
];

// ContractorLead authored timeline (0-6.34s) -> 5.8s
export const FILM_CONTRACTOR_PACE: [number, number][] = [
  [2.2, 1.4], // lead arrives -> notification + buzz
  [3.7, 0.8], // expands
  [4.95, 2.2], // lead detail readable
  [6.34, 1.4], // CALL LEAD -> Calling
];

const sum = (p: [number, number][]) => p.reduce((s, [, d]) => s + d, 0);

// Same scrub-optimised derivatives as the scroll cinematic; film trims.
// In/out points chosen by frame comparison (mean luma difference).
// pace = [source second reached, film seconds]; omitted = uniform.
export type FilmFootage = { id: string; src: string; from: number; to: number; pace?: [number, number][] };
const dir = "/acquisition/acquisition-";
export const FILM_FOOTAGE = [
  // hard cut from Prequel 10.0s (best match 0.08s); rips through the glass
  // at the approach's velocity, decelerates only once inside the office
  // (6.0x -> 4.0x -> 2.0x -> 1.0x)
  { id: "window", src: `${dir}window-office-scrub.mp4`, from: 0.08, to: 3.6, pace: [[0.68, 0.1], [1.28, 0.15], [1.88, 0.3], [3.6, 1.72]] },
  // empty room in (0.0s); he walks in during playback (1.0x)
  { id: "office", src: `${dir}office-homeowner-scrub.mp4`, from: 0.0, to: 5.0 },
  // 0.25s moving dissolve from office 4.75-5.0s; phone 0.3-0.55s overlaps it
  // (best framing match to office 5.0s is phone ~0.4-0.5s; the residual
  // difference is a global exposure step, which the dissolve blends).
  // Through the dissolve at 1.0x, then once he's on his phone: GO
  // (2.0x -> 3.0x -> 4.0x orbit + push), last 0.5s (7.0-8.6s, 3.2x) is the
  // screen takeover. Stop before the image goes soft.
  { id: "phone", src: `${dir}phone-push-scrub.mp4`, from: 0.3, to: 8.6, pace: [[0.9, 0.35], [1.5, 0.3], [2.5, 0.333], [4.4, 0.475], [7.0, 0.65], [8.6, 0.5]] },
  // aerial travel + descent at 1.0x, dive accelerates (1.4x), then the low
  // street rip at 2.0x
  { id: "aerial", src: `${dir}aerial-delivery-scrub.mp4`, from: 5.2, to: 10.0, pace: [[6.5, 1.3], [7.3, 0.57], [8.5, 0.6], [10.0, 0.75]] },
  // direct cut from aerial 10.0s (best match 0.13s): carries the 2.0x rip,
  // then decelerates into the jobsite (2.0x -> 1.6x -> 1.25x -> 1.0x)
  { id: "connector", src: `${dir}delivery-connector-scrub.mp4`, from: 0.13, to: 3.6, pace: [[1.0, 0.435], [1.8, 0.5], [2.6, 0.64], [3.6, 1.0]] },
  // best in-point vs connector 3.6s is 0.2s (source framing/colour differ) (1.2x)
  { id: "northline", src: `${dir}northline-arrival-scrub.mp4`, from: 0.2, to: 10.0 },
] as const satisfies readonly FilmFootage[];
export type FilmFootageId = (typeof FILM_FOOTAGE)[number]["id"];

const footDur = (id: FilmFootageId, uniform: number) => {
  const f: FilmFootage = FILM_FOOTAGE.find((x) => x.id === id)!;
  return f.pace ? sum(f.pace) : uniform;
};

export const FILM_BEATS = [
  { id: "search", label: "Search · candidates · RIGHT FIT", dur: sum(FILM_SEARCH_PACE.slice(0, SEARCH_SEGMENTS)) },
  { id: "approach", label: "Commit → accelerate → window", dur: sum(FILM_SEARCH_PACE.slice(SEARCH_SEGMENTS)) },
  { id: "window", label: "Through the glass → office", dur: footDur("window", 0) },
  { id: "office", label: "Homeowner enters, sits", dur: footDur("office", 5.0) },
  { id: "phone", label: "Orbit + push into the phone", dur: footDur("phone", 0) },
  { id: "journey", label: "Ad → form → qualification → Qualified Lead", dur: sum(FILM_JOURNEY_PACE) },
  { id: "launch", label: "Qualified Lead launches", dur: 1.5 },
  { id: "aerial", label: "Delivery flight", dur: footDur("aerial", 0) },
  { id: "connector", label: "Street race → Northline jobsite", dur: footDur("connector", 0) },
  { id: "northline", label: "Northline arrival → contractor's phone", dur: footDur("northline", 9.8 / 1.2) },
  { id: "contractor", label: "Notification → lead detail → CALL LEAD → Calling", dur: sum(FILM_CONTRACTOR_PACE) },
  { id: "hold", label: "Calling Daniel Mercer", dur: 2.0 },
] as const;

export type FilmBeatId = (typeof FILM_BEATS)[number]["id"];
export const FILM_AT = (() => {
  const at = {} as Record<FilmBeatId, number>;
  let t = 0;
  for (const b of FILM_BEATS) { at[b.id] = t; t += b.dur; }
  return at;
})();
export const FILM_DUR = Object.fromEntries(FILM_BEATS.map((b) => [b.id, b.dur])) as Record<FilmBeatId, number>;
export const FILM_TOTAL = FILM_BEATS.reduce((s, b) => s + b.dur, 0);

// Physical phone screens, tracked for the screen takeovers.
export type Quad = [[number, number], [number, number], [number, number], [number, number]];
// Homeowner phone: the display's four corners (TL, TR, BR, BL, frame
// fractions) measured at phone source times across the takeover segment.
export const HOMEOWNER_SCREEN_TRACK: { t: number; q: Quad }[] = [
  { t: 7.0, q: [[0.381, 0.348], [0.464, 0.324], [0.539, 0.644], [0.455, 0.709]] },
  { t: 7.8, q: [[0.37, 0.296], [0.477, 0.278], [0.566, 0.713], [0.466, 0.769]] },
  { t: 8.6, q: [[0.349, 0.296], [0.498, 0.222], [0.609, 0.778], [0.502, 0.885]] },
];
// display aspect (width / height) of the physical screen, for the UI strip
export const HOMEOWNER_SCREEN_ASPECT = 0.42;
// Contractor phone (Northline source seconds across its final 0.6s of film).
export const CONTRACTOR_SCREEN_TRACK: { t: number; q: Quad }[] = [
  { t: 9.28, q: [[0.242, 0.219], [0.365, 0.181], [0.533, 0.681], [0.424, 0.759]] },
  { t: 9.64, q: [[0.203, 0.213], [0.375, 0.17], [0.571, 0.781], [0.448, 0.889]] },
  { t: 10.0, q: [[0.193, 0.176], [0.411, 0.13], [0.641, 0.87], [0.488, 0.985]] },
];
export const CONTRACTOR_SCREEN_ASPECT = 0.42;
