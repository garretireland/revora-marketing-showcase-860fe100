// Centralized media-slot configuration for the cinematic experience.
//
// This is the ONE place that knows which scenes will eventually receive a
// real Higgsfield-generated (or otherwise sourced) image/video asset, and
// what that asset's desktop vs. mobile variant path is expected to be.
// Nothing else in CinematicExperience.tsx should hardcode a future asset
// path -- it should look it up here via <SceneMedia slot={MEDIA_SLOTS.x} />.
//
// <SceneMedia> falls back to the existing CSS/SVG placeholder whenever a
// slot has no src configured, so the build never depends on a missing
// file. When a real asset is ready, set its slot's src here; no other file
// needs to change.
//
// Per the production-design direction: Higgsfield generates environmental/
// cinematic PLATES only (establishing shots, camera movement, atmosphere).
// It never generates website typography, UI, ad creative, or readable
// interfaces -- those stay real HTML/CSS/SVG so they remain crisp and
// accurate. That's why there is no media slot for the website-reveal or
// lead-flow panels below; those are intentionally code, not media.
//
// MEDIA INTEGRATION PASS -- the three slots below now have a real
// `desktopSrc` still, sourced by inspecting ~/Downloads for content/
// dimensions/recency (never guessed filenames) and visually confirming
// each image against its intended composition before copying it into
// src/assets/. `aerialServiceArea` and `homeownerInterior` stay declared
// `kind: "video"` for their eventual final asset, but a still image is a
// perfectly valid `desktopSrc` for a video-kind slot in the interim --
// SceneMedia only renders a <video> tag once BOTH kind is "video" and a
// src is actually a video file extension; a .png desktopSrc on a
// video-kind slot renders as an <img>, same as an image-kind slot. This
// keeps the slot's own "what this scene will eventually be" documentation
// (kind) separate from "what's actually wired in right now" (desktopSrc).
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
  /** CSS object-position for this slot's image/video, tuned per asset so
   * its real focal point (not just the geometric center) stays in frame
   * under object-fit: cover in whatever container the slot renders into.
   * Undefined = "center" (SceneMedia's default). */
  objectPosition?: string;
};

import northlineRoofHeroSrc from "@/assets/northline-roof-hero.png";
import aerialServiceAreaSrc from "@/assets/aerial-service-area.png";
import homeownerInteriorSrc from "@/assets/homeowner-interior.png";
import revoraEstablishingSrc from "@/assets/revora-establishing.png";
import craftsmanshipSrc from "@/assets/craftsmanship.png";

export const MEDIA_SLOTS: Record<string, MediaSlot> = {
  northlineRoofHero: {
    id: "northline-roof-hero",
    description:
      "Scene 4 Roofing concept's media block, and /concept/northline's own hero media plane. Real asset: a low-angle dusk shot of a dark shingle roof with a prominent chimney/architectural mass, warm grazing light along the eaves.",
    kind: "image",
    desktopSrc: northlineRoofHeroSrc,
    // Chimney/architectural mass sits right-of-center in the source frame,
    // roofline peak center-upper -- favor right + upper-middle so a wide
    // landscape container (Scene 4's RoofingConcept box) keeps both in
    // frame under cover-fit instead of defaulting to dead-center.
    objectPosition: "62% 40%",
  },
  aerialServiceArea: {
    id: "aerial-service-area",
    description:
      "Scene 6's market/service-area backdrop, currently CSS road/block texture layered on top. Real asset: a high-oblique aerial/drone still of a large suburban neighborhood extending to the horizon.",
    kind: "video",
    desktopSrc: aerialServiceAreaSrc,
    // Neighborhood detail is dense and fairly even across the frame with a
    // thin sky band at the very top -- bias slightly down so cover-fit
    // keeps rooftops/streets (where the market-signal node overlay sits)
    // filling the frame rather than cropping into the empty sky.
    objectPosition: "50% 62%",
  },
  homeownerInterior: {
    id: "homeowner-interior",
    description:
      "Scene 7's over-the-shoulder interior, currently a CSS gradient + geometric room cues. Real asset: an over-the-shoulder still of a homeowner at a kitchen island, laptop open in front of her.",
    kind: "video",
    desktopSrc: homeownerInteriorSrc,
    // Person (foreground subject) sits left-of-center, laptop screen
    // center-right -- bias left/upper-middle so cover-fit keeps the person
    // from cropping off the left edge while the laptop (the eventual
    // future ad-compositing target) stays visible right of center.
    objectPosition: "38% 42%",
  },
  // NEW SLOTS -- assets copied in and available, deliberately NOT yet
  // consumed by any <SceneMedia> in CinematicExperience.tsx. Lovable is
  // being given the first opportunity to design the opening act around
  // these two; wiring them into a specific scene is a follow-up decision,
  // not this pass's.
  revoraEstablishing: {
    id: "revora-establishing",
    description:
      "Available for a future Revora-first opening/establishing beat (not yet wired into any scene). Real asset: a cinematic golden-hour suburban street, an unbranded dark work truck in the foreground, homes visible to the right, large dark negative space (foreground foliage silhouette) on the left -- composed to leave that left third open for headline/brand copy.",
    kind: "image",
    desktopSrc: revoraEstablishingSrc,
    // Truck + homes sit right-of-center, dark negative space occupies the
    // left third of the source frame -- bias right/lower-middle so a
    // cover-fit container keeps the truck and houses in frame rather than
    // centering into the empty foliage silhouette.
    objectPosition: "68% 60%",
  },
  craftsmanship: {
    id: "craftsmanship",
    description:
      "Available for a future craftsmanship/detail beat (not yet wired into any scene). Real asset: a cinematic close-up of a tradesperson's hands working with a hand tool (utility knife on material), warm practical lighting, large dark negative space on the left -- composed to leave that left third open for headline/brand copy.",
    kind: "image",
    desktopSrc: craftsmanshipSrc,
    // Hands + tool sit right-of-center in the source frame, dark negative
    // space occupies the left third -- bias right/lower-middle for the
    // same reason as revoraEstablishing above.
    objectPosition: "66% 58%",
  },
};
