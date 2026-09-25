// Centralized media-slot configuration for the cinematic experience.
//
// This is the ONE place that knows which scenes will eventually receive a
// real Higgsfield-generated (or otherwise sourced) image/video asset, and
// what that asset's desktop vs. mobile variant path is expected to be.
// Nothing else in CinematicExperience.tsx should hardcode a future asset
// path -- it should look it up here via <SceneMedia slot={MEDIA_SLOTS.x} />.
//
// IMPORTANT: none of the paths below point at files that actually exist
// yet. Every slot is deliberately `desktopSrc: undefined` /
// `mobileSrc: undefined` until real assets are produced -- <SceneMedia>
// falls back to the existing CSS/SVG placeholder whenever a slot has no
// src configured, so the build never depends on a missing file. When a
// real asset is ready, set its slot's src here; no other file needs to
// change.
//
// Per the production-design direction: Higgsfield generates environmental/
// cinematic PLATES only (establishing shots, camera movement, atmosphere).
// It never generates website typography, UI, ad creative, or readable
// interfaces -- those stay real HTML/CSS/SVG so they remain crisp and
// accurate. That's why there is no media slot for the website-reveal or
// lead-flow panels below; those are intentionally code, not media.

export type MediaSlotKind = "image" | "video";

export type MediaSlot = {
  id: string;
  description: string;
  kind: MediaSlotKind;
  /** Desktop asset path, once produced. Undefined = use the placeholder. */
  desktopSrc?: string;
  /** Mobile-optimized variant, once produced. Falls back to desktopSrc if
   * that exists and this doesn't, otherwise falls back to the placeholder. */
  mobileSrc?: string;
  /** Poster frame for a video slot -- required before a real video is wired
   * in, so a video element never has to fetch the first frame itself. */
  posterSrc?: string;
};

export const MEDIA_SLOTS: Record<string, MediaSlot> = {
  northlineRoofHero: {
    id: "northline-roof-hero",
    description:
      "Scene 4 Roofing concept's media block. Intended future asset: the Northline finished-roof still already generated externally, or its eventual deconstruction video (see /concept/northline for the production-design destination this feeds).",
    kind: "image",
  },
  aerialServiceArea: {
    id: "aerial-service-area",
    description:
      "Scene 6's market/service-area backdrop, currently CSS road/block texture. Intended future asset: an aerial/city cinematic plate (Higgsfield establishing shot + camera drift).",
    kind: "video",
  },
  homeownerInterior: {
    id: "homeowner-interior",
    description:
      "Scene 7's over-the-shoulder interior, currently a CSS gradient + geometric room cues. Intended future asset: a homeowner/interior atmosphere plate (Higgsfield, no realistic human rendering).",
    kind: "video",
  },
};
