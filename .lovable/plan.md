# Three-tier homepage story: desktop, laptop/tablet, phone

Goal: every visitor gets the same Revora story. The desktop animation stays exactly as it is. Laptops, tablets and phones get their own layouts built for their screen sizes.

## Tiers

```text
1280px and wider  -> DesktopCinematic (unchanged, full GSAP pinned timeline)
768px to 1279px   -> TabletCinematic  (new, "cinematic-lite")
below 768px       -> PhoneStory       (new, replaces MobileFallback)
reduced motion    -> the tier that matches the screen width, shown with no motion
```

Today, a visitor with reduced motion turned on at 1280px or wider gets the mobile fallback. With this change they get the tablet layout with no motion. The desktop code is not touched.

## Component architecture

- `CinematicExperience` becomes a small switch. It uses one `useTier()` hook built on `matchMedia` with 768px and 1280px breakpoints, plus the reduced-motion setting. It returns `desktop`, `tablet` or `phone` and renders the matching component. `DesktopCinematic` keeps its `key={resizeBucket}` remount logic.
- Move the new code into `src/components/cinematic/`:
  - `storyContent.ts`: the single source for all story copy. It holds headlines, the tagline, offer and pricing text, CTA labels and links, the Capture/Qualify/Focus labels, and Northline/landscaping captions.
  - `shared.tsx`: pieces moved out of the big file without changing them: `SceneMedia`, `RoofingConcept`, `LandscapingConcept`, `WebsiteRevealPanel`, `LeadFlowPanel`, `Stat`, `Node`, the `CROWD_NODES` data, and a new `OrangeThread` line component.
  - `TabletCinematic.tsx` and `PhoneStory.tsx`: the new tiers.
  - `useScrollReveal.ts`: a light IntersectionObserver hook that toggles a CSS class. It replaces the current `MobileReveal`.
- `DesktopCinematic` changes only its import sources and reads copy from `storyContent.ts`. The approach is to extract the code without rewriting it. No timeline values, scene order, positions or tweens change.

## Reuse from DesktopCinematic

- Reused as-is: the media slots (`mediaSlots.ts`), the street and neighborhood photo, the Northline and landscaping concept panels (their existing `isStatic` mode), the website reveal and lead-flow panels, the aerial map nodes, and the orange colour token.
- Not reused: the GSAP master timeline, pinning, 3D laptop dive, and the pixel values baked in from the window size.

## Tablet/laptop composition (768 to 1279px)

Nine normal-flow sections. Nothing pins for more than about one screen height, so there's no scroll trap.
1. **Hero:** the full-screen street photo with a slow CSS drift. Headline on the left, CTAs at the bottom left.
2. **Tagline:** "We build for the businesses that build." in large display type on navy. It fades up as it scrolls in.
3. **Website craft:** a two-column split. The laptop/website panel sticks on one side while three short craft points scroll past on the other.
4. **Northline:** a large roofing concept panel, slightly offset, with a caption and a "concept" label.
5. **Landscaping:** mirrored layout, so the page alternates left and right.
6. **Offer/CTA:** the $997 / $99/mo / no lock-in figures in an editorial row, with the existing buttons.
7. **Aerial market:** a sticky aerial map image with nodes that light up as you scroll (a CSS class change). One node turns orange.
8. **Homeowner:** a photo slot with a device on one side and the inquiry card sliding in.
9. **Capture, Qualify, Focus:** three stacked steps joined by one orange line that draws as you scroll. Poor fits fade out and one opportunity stays.

## Phone composition (below 768px)

A linear story in the same order, built for a single column but still editorial:
- The full-bleed street photo with the headline set low on the screen. No drift.
- Big, left-aligned type. Tight margins. Photos edge to edge instead of boxed cards.
- Northline and landscaping appear as tall, cropped concept panels, each with a small label.
- The aerial map shows as a single image with fixed orange highlights.
- The homeowner is one photo with the inquiry card overlaid.
- Capture, Qualify, Focus is a vertical timeline on a thin orange line down the left edge.
- Pricing, then the CTAs. The Book a Call button stays within easy thumb reach at the end.

## Orange connective motif

One `OrangeThread` SVG component with a `pathLength=1` stroke. On desktop it keeps its current behaviour. On tablet it draws as each section enters the screen. On phone it's a continuous thin vertical line down the left side that fills as you scroll (a CSS variable updated from one passive scroll listener, throttled with requestAnimationFrame). It's used sparingly. It's not a decoration on every section.

## Reduced motion

A `motion-reduce:` Tailwind variant plus a check inside the hook. When reduced motion is on, content is visible straight away, the thread is fully drawn, and there's no drift, parallax or sticky scrubbing. The layout doesn't change.

## Performance

- The tablet and phone tiers don't use GSAP. They use only CSS transitions and IntersectionObserver. The desktop code is lazy-loaded (`React.lazy`), so phones never download GSAP or the desktop scenes.
- Images get `loading="lazy"` except the hero, `decoding="async"`, and correctly sized sources where the media slots allow. Video slots only play on desktop and tablet. On phones they show their poster image.
- The only animated properties are `transform` and `opacity`.

## Copy in one place

All commercial wording, prices, CTA links and scene labels live in `storyContent.ts`. All three tiers read from it, so a price or link is changed once. No new claims, customers or numbers are added. Existing copy moves over word for word.

## Files expected to change

- `src/components/cinematic/CinematicExperience.tsx`: becomes the tier switch. The desktop code moves to its own file, with import changes only.
- New: `DesktopCinematic.tsx` (the code moved as-is), `TabletCinematic.tsx`, `PhoneStory.tsx`, `shared.tsx`, `storyContent.ts`, `useScrollReveal.ts`, `useTier.ts`, all in `src/components/cinematic/`.
- `tailwind.config.ts`: a couple of reveal and thread keyframes.
- Not touched: `Header.tsx`, `mediaSlots.ts`, routes, and the other pages.

## How to test all three tiers before publishing

- **In Lovable:** use the device button above the preview to switch between phone and tablet. For the desktop tier, open the preview in a new browser tab at full width, since the preview panel is usually narrower than 1280px.
- **In a normal browser:** open developer tools (F12), turn on device mode, and set the width to 390, 820, 1024, 1279 and 1440 to cover each tier and the edges between them. Drag the width across 768 and 1280 to confirm the switch is clean.
- **Reduced motion:** in developer tools, open Rendering and emulate "prefers-reduced-motion: reduce".
- I'll also take screenshots at each of those widths before reporting back, and state which tier each screenshot shows.
