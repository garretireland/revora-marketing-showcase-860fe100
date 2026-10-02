// Shared homepage scrolling. Section links keep real "/#id" hrefs but a
// plain click on "/" just scrolls (no hash written, no history entry).
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll to a homepage section; the sticky-header offset comes from the
// shared scroll-margin on section[id] (see Index.tsx), not per-link numbers.
export function goToSection(id: string, behavior?: ScrollBehavior) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: behavior ?? (reducedMotion() ? "auto" : "smooth"), block: "start" });
  return true;
}

export const clearHash = () => {
  if (window.location.hash) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
};

// Real "/#id" hrefs keep anchor semantics (and work from any route / in a
// new tab). On the homepage a plain click just scrolls: no hash is written
// and no history entry is added, so a refresh doesn't return to the section.
export function onSectionClick(e: React.MouseEvent<HTMLAnchorElement>, id: string, after?: () => void) {
  if (window.location.pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  goToSection(id);
  clearHash();
  after?.();
}

// Smooth-scroll a target into the middle of the viewport (used by the film
// teasers so the player lands inside its autoplay threshold).
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
}
