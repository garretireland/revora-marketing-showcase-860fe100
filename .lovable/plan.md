# Homepage audit: why the cinematic sequence isn't showing

No files are changed by this audit.

## Diagnosis

1. The homepage (`/`) renders `Index` → `Header`, `CinematicExperience`, `WhyChooseUs`, `Testimonials`, `CTA`, `Footer`.
2. `CinematicExperience` is always mounted, but it's a switch:
   `desktopMotion ? <DesktopCinematic/> : <MobileFallback/>`.
   `desktopMotion` is true only when the window is **at least 1280px wide** AND reduced motion is **off**.
3. At 1280px+: `DesktopCinematic` runs the pinned GSAP timeline: the truck hero, then "We build for the businesses that build.", laptop entrance and dive, Northline, landscaping, CTA transition, aerial market, homeowner, then Capture / Qualify / Focus.
4. Your preview is **822px wide**, so `MobileFallback` renders instead: a stacked version with no scroll animation, followed by the regular sections. That's what you're seeing.
5. The GSAP timeline can't be reached below 1280px, or on any device with reduced motion turned on.
6. All the listed scenes still exist in the code, but only inside `DesktopCinematic`. None of them are mounted at 822px.
7. Why my report was wrong: I described the desktop version and didn't say it only appears at 1280px or wider. The preview panel is narrower than that. My checks ran at desktop width, so the report matched those checks but not your view.
8. The last change touched three files:
   - `CinematicExperience.tsx`: new full-screen truck-photo Scene 1 with its scroll animation and handoff into the laptop scene (desktop only), plus a restyled mobile opening.
   - `Header.tsx`: a slimmer menu bar with a dark see-through style over the opening scenes and a light style everywhere else.
   - `tailwind.config.ts`: added the slow drift animation for the photo.
   (Two TypeScript config files also show changes in history. They were not part of the design work.)
9. Yes. The 1280px breakpoint puts the preview panel and many laptops (1024–1279px, or browser windows that aren't full screen) into the no-animation version.

## Proposed next step (only after your approval)

- **Option A:** Leave the code as it is. To see the full sequence, open the preview in a full-width browser tab at 1280px or wider.
- **Option B:** Lower the breakpoint to 1024px and fix the layouts that break between 1024px and 1280px. The earlier reason for 1280px was cramped text in that range.

Tell me which option you want. I'll wait for your decision before changing anything.
