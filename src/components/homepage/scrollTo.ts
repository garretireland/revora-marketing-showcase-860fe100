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

// Film teasers ("... · 58 sec"): land so nothing sits under the fixed nav.
// Prefer showing the intro row + heading + the whole player; otherwise the
// film heading just below the nav; only if even that can't fit the player,
// centre the player (it must land inside its autoplay threshold).
// (Previously the player was always centred, which on short viewports put
// the film heading -- and the intro row above it -- under the nav.)
export function scrollToFilm() {
  const player = document.getElementById("acquisition-film-player");
  const section = document.getElementById("acquisition-film");
  if (!player || !section) return;
  const behavior: ScrollBehavior = reducedMotion() ? "auto" : "smooth";
  // the row's wrapper: unaffected by the row's own entrance transform
  const intro = document.querySelector<HTMLElement>("[data-pv-foot]")?.parentElement;
  const navBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 72;
  const gap = 16;
  const docY = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
  const playerBottom = docY(player) + player.offsetHeight;
  const fits = (top: number) => playerBottom - top <= window.innerHeight - navBottom - gap - 8;
  const top = intro && fits(docY(intro)) ? docY(intro) : fits(docY(section)) ? docY(section) : null;
  if (top === null) player.scrollIntoView({ behavior, block: "center" });
  else window.scrollTo({ top: Math.max(0, top - navBottom - gap), behavior });
}
