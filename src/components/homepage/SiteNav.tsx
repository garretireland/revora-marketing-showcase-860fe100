import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import revoraLogo from "@/assets/revora-logo.png";
import { CALENDLY, C } from "./tokens";
import { clearHash, goToSection, onSectionClick, reducedMotion } from "./scrollTo";

// The supplied logo art (1024x1024) is navy/orange on transparent with wide
// padding: crop to the wordmark and render it white for the dark site.
// Crop = the artwork's MEASURED opaque bounds (x 11.43%-87.21%, y 38.67%-
// 61.23% of the image) plus ~0.5% breathing room on each side, so no edge
// of the wordmark is clipped. `height` keeps the artwork's on-screen scale.
const CROP = { left: 0.109, top: 0.382, w: 0.768, h: 0.235 };
export function RevoraLogo({ height = 30 }: { height?: number }) {
  const w = height / 0.22; // image width at the established display scale
  return (
    <span className="relative block overflow-hidden" style={{ height: w * CROP.h, width: w * CROP.w }} aria-label="Revora Marketing">
      <img src={revoraLogo} alt="Revora Marketing" className="absolute max-w-none" style={{ width: w, left: -w * CROP.left, top: -w * CROP.top, filter: "brightness(0) invert(1)" }} />
    </span>
  );
}

// Primary destinations only (not every section). Labels -> existing IDs.
const LINKS = [
  ["Websites", "offer"], // the website product/offer, not the mid-page animation
  ["How It Works", "how-it-works"],
  ["Lead Generation", "lead-generation"], // start of the lead-gen chapter (pivot)
  ["Pricing", "founding"], // nav label only; the section stays "Founding Client Program"
  ["FAQ", "faq"],
] as const;

// Mobile menu motion (ms). Open: the panel reveals, then items rise in
// top -> bottom; close is quicker: items fade bottom -> top as the panel
// retracts. Links are live throughout (no waiting on the animation).
const PANEL_IN = 220, PANEL_OUT = 170, OUT_DELAY = 30;
const ITEM_IN = 170, ITEM_START = 30, STAGGER = 40, ITEM_OUT = 110, OUT_STAGGER = 12;
const UNMOUNT = OUT_DELAY + PANEL_OUT + 20;

// per-item motion: rise + fade in, staggered top -> bottom; out bottom -> top.
// Reduced motion: no translate, no stagger (the panel simply appears).
const ITEMS = LINKS.length + 1; // + Book a Call (last)
const itemCls = (shown: boolean) =>
  `transition-[opacity,transform] motion-reduce:transition-none motion-reduce:!translate-y-0 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[10px]"}`;
const itemStyle = (shown: boolean, i: number): React.CSSProperties => ({
  transitionDuration: `${shown ? ITEM_IN : ITEM_OUT}ms`,
  transitionDelay: `${shown ? ITEM_START + i * STAGGER : (ITEMS - 1 - i) * OUT_STAGGER}ms`,
  transitionTimingFunction: shown ? "cubic-bezier(0.22, 1, 0.36, 1)" : "ease-in",
});

export default function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  // mounted: panel in the DOM (kept through the close animation);
  // shown: the animated state (set a frame after mount so it never
  // flashes straight into its final state)
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let raf = 0, timer = 0;
    if (open) {
      setMounted(true);
      raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setShown(true)); });
    } else {
      setShown(false);
      timer = window.setTimeout(() => setMounted(false), reducedMotion() ? 0 : UNMOUNT);
    }
    return () => { cancelAnimationFrame(raf); window.clearTimeout(timer); };
  }, [open]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Refresh should start at the top: no browser scroll restoration on the
  // homepage. A deliberate /#id arrival is honoured once -- after the page
  // has loaded (so pinned/media layout is final) -- then the hash is dropped.
  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const id = window.location.hash.slice(1);
    let cancel = () => {};
    if (id) {
      const go = () => { goToSection(id, "auto"); clearHash(); };
      if (document.readyState === "complete") {
        const r = requestAnimationFrame(go);
        cancel = () => cancelAnimationFrame(r);
      } else {
        window.addEventListener("load", go, { once: true });
        cancel = () => window.removeEventListener("load", go);
      }
    }
    return () => { cancel(); window.history.scrollRestoration = prev; };
  }, []);

  // mobile menu: Escape closes; closes if the layout grows to desktop
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // focus inside the closing menu returns to the toggle
      if (document.getElementById("mobile-menu")?.contains(document.activeElement)) toggleRef.current?.focus();
      setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => { if (mq.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => { window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, [open]);

  const bookCall = (
    <a
      href={CALENDLY}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full px-4 py-2.5 text-[13px] font-semibold transition-transform hover:-translate-y-px md:px-5"
      style={{ background: C.orange, color: C.orangeInk }}
    >
      Book a Call
    </a>
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
      style={{
        background: solid || mounted ? "rgba(7,11,17,0.92)" : "transparent",
        backdropFilter: solid || mounted ? "blur(14px)" : "none",
        borderBottom: `1px solid ${solid || mounted ? C.line : "transparent"}`,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <nav aria-label="Primary" className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between px-6 md:px-10">
        <Link
          to="/"
          aria-label="Revora Marketing home"
          onClick={(e) => { if (window.location.pathname === "/") { e.preventDefault(); clearHash(); window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" }); } }}
        >
          <RevoraLogo />
        </Link>
        <div className="flex items-center gap-3 lg:gap-9">
          <div className="hidden items-center gap-8 text-[14px] lg:flex" style={{ color: C.muted }}>
            {LINKS.map(([label, id]) => (
              <a key={id} href={`/#${id}`} onClick={(e) => onSectionClick(e, id)} className="transition-colors hover:text-white">{label}</a>
            ))}
          </div>
          {bookCall}
          <button
            ref={toggleRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            style={{ color: C.text, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {/* three lines -> X (lines translate to centre + rotate) */}
            <span aria-hidden="true" className="relative block h-[13px] w-[15px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute left-0 h-[1.75px] w-full rounded-full bg-current transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
                  style={{
                    top: i * 5.6,
                    transform: open ? (i === 0 ? "translateY(5.6px) rotate(45deg)" : i === 2 ? "translateY(-5.6px) rotate(-45deg)" : "scaleX(0.4)") : "none",
                    opacity: open && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </span>
          </button>
        </div>
      </nav>

      {/* mobile/tablet menu: a panel under the header bar. Height reveals via
          grid rows (0fr -> 1fr); items are staggered with transition delays. */}
      {mounted && (
        <div
          id="mobile-menu"
          className="grid lg:hidden motion-reduce:!transition-none"
          style={{
            gridTemplateRows: shown ? "1fr" : "0fr",
            opacity: shown ? 1 : 0,
            transitionProperty: "grid-template-rows, opacity",
            transitionDuration: `${shown ? PANEL_IN : PANEL_OUT}ms`,
            transitionDelay: shown ? "0ms" : `${OUT_DELAY}ms`,
            transitionTimingFunction: shown ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.4, 0, 1, 1)",
          }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t" style={{ borderColor: C.line }}>
              <ul className="mx-auto flex w-full max-w-[1240px] flex-col px-6 py-3 md:px-10">
                {LINKS.map(([label, id], i) => (
                  <li key={id} className={itemCls(shown)} style={itemStyle(shown, i)}>
                    <a
                      href={`/#${id}`}
                      onClick={(e) => { onSectionClick(e, id, () => setOpen(false)); if (window.location.pathname !== "/") setOpen(false); }}
                      className="block border-b py-4 text-[17px] font-medium"
                      style={{ borderColor: C.line, color: C.text }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className={`mx-auto w-full max-w-[1240px] px-6 pb-6 pt-2 md:px-10 ${itemCls(shown)}`} style={itemStyle(shown, LINKS.length)}>
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full py-4 text-[15px] font-semibold"
                  style={{ background: C.orange, color: C.orangeInk }}
                >
                  Book a Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
