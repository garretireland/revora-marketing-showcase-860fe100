import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { BookCall } from "./Cta";
import { C, CONTAINER } from "./tokens";

// The rendered acquisition film as a premium in-page player. ONE production
// MP4 (no live cinematic source on the homepage). Autoplays muted from 0
// when the player has substantially arrived in view; pauses + resets when
// it leaves; restarts from 0 on every return. Never pins or locks scroll.
// Custom controls only: play/pause, seek/scrub (the progress line), replay.
// No audio track exists yet, so there is no mute control.

// V2 render (stabilised house markers, larger labels, no baked captions).
// V1 (revora-acquisition-film.mp4) is kept alongside as the rollback asset.
const SRC = "/video/revora-acquisition-film-v2.mp4";
const POSTER = "/video/revora-acquisition-film-v2-poster.jpg"; // same frame as V1's poster (1.53s), without the removed baked caption
const ENTER = 0.85; // visible fraction that counts as "arrived" (capped by viewport height)
const LEAVE = 0.4; // below this it has left the viewing area

type State = "idle" | "playing" | "paused" | "ended";

// STORY LAYER: live chapter cards synced to video.currentTime (nothing here
// is baked into the MP4). Times are film seconds. Each card enters in ONE
// shot-aware position, holds, exits; the next may sit elsewhere, chosen
// from that shot's negative space. Desktop (md+) and mobile have their own
// placements (the small mobile frame has different free space).
type Scrim = "corner" | "left" | "right" | "cornerTL" | "cornerTR";
type Place = { box: React.CSSProperties; w: string; scrim?: Scrim; dark?: boolean; right?: boolean };
// `right` = right-aligned. mobile: `lines` = its own line breaks;
// `fit` = sized to the only free gutter in the shot; `quiet` = deliberately
// secondary to a baked payoff (~21% smaller)
type MPlace = Place & { lines: string[]; fit?: boolean; quiet?: boolean };
// `lines` = deliberate desktop line breaks; `small` = a tighter gutter.
type Beat = { at: number; out: number; text: string; lines?: string[]; sub?: string; small?: boolean; place: Place; m: MPlace };
const LOWER_LEFT = (w: string, bottom = "14%"): Place => ({ box: { left: "6%", bottom }, w, scrim: "corner" });
const MID_LEFT = (w: string, left = "6%", scrim?: Scrim): Place => ({ box: { left, top: "50%", transform: "translateY(-50%)" }, w, scrim });
const MID_RIGHT = (w: string, right = "5%", scrim?: Scrim): Place => ({ box: { right, top: "50%", transform: "translateY(-50%)" }, w, scrim });
const STORY: Beat[] = [
  {
    at: 0.3, out: 3.4, text: "One homeowner. One opportunity.", lines: ["One homeowner.", "One opportunity."], sub: "Watch what happens before the phone rings.",
    // raised above the baked bottom-left caption ("Candidates found")
    place: LOWER_LEFT("45%"),
    // m: lower-left over the darker foreground, clear of the baked top-left title
    m: { box: { left: "5%", bottom: "17%" }, w: "72%", scrim: "corner", lines: ["One homeowner.", "One opportunity."] },
  },
  {
    at: 3.8, out: 5.5, text: "We find the right one.",
    place: LOWER_LEFT("45%"),
    // m: right-centre in the forward dive (baked "Analyzing fit…" is bottom-left; top is bright sky)
    m: { ...MID_RIGHT("50%", "5%", "right"), right: true, lines: ["We find", "the right one."] },
  },
  {
    at: 15.5, out: 18.3, text: "Right house. Right homeowner.", lines: ["Right house.", "Right homeowner."],
    // carries the glass rip -> office dissolve (16.9-17.2); lands as he
    // walks in (~17.2). Upper-right over the right bookshelf: clear of the
    // window and of him entering from the left. 0.7s clear before card 3.
    place: { box: { right: "6%", top: "9%" }, w: "30%", scrim: "cornerTR", right: true },
    m: { box: { right: "5%", top: "8%" }, w: "36%", scrim: "cornerTR", right: true, lines: ["Right house.", "Right", "homeowner."] }, // 3 lines: one line would cross the window
  },
  {
    at: 19.0, out: 22.0, text: "We earn his attention.", lines: ["We earn", "his attention."],
    // over the desk; clear of the homeowner and the folio
    place: LOWER_LEFT("38%", "10%"),
    // m: upper-right over the dark bookshelves -- clear of him as he
    // crosses to the chair, of his head once seated, and of the folio
    m: { box: { right: "5%", top: "8%" }, w: "34%", scrim: "cornerTR", right: true, lines: ["We earn", "his attention."] },
  },
  {
    at: 27.0, out: 29.6, text: "Interest becomes intent.",
    // light feed/form scene: dark ink in the free left gutter
    place: { ...MID_LEFT("17%", "3.5%"), dark: true },
    // m: right gutter, dark ink -- beside the Get Quote tap
    m: { ...MID_RIGHT("21%", "4%"), dark: true, right: true, lines: ["Interest", "becomes", "intent."] },
  },
  {
    at: 31.9, out: 33.5, text: "Not every lead is worth your time.", lines: ["Not every", "lead is worth", "your time."],
    // light -> dark transition; left gutter, clear of the answer cards
    place: MID_LEFT("22%", "3.5%", "left"),
    // m: upper-left, above the answer cards (over the exiting form header)
    m: { box: { left: "5%", top: "9%" }, w: "62%", scrim: "cornerTL", lines: ["Not every lead", "is worth your time."] },
  },
  {
    at: 37.6, out: 40.9, text: "Next: the one who can close it.", lines: ["Next: the one", "who can close it."],
    // the delivery race: carries the tree dive (~38.8) and the aerial ->
    // street hard cut (40.3); clears before the jobsite reveal (~42.0)
    place: { ...MID_RIGHT("34%", "6%", "right"), right: true },
    m: { ...MID_RIGHT("50%", "5%", "right"), right: true, lines: ["Next: the one", "who can close it."] },
  },
  {
    at: 44.0, out: 47.5, text: "We put it in your hands.", lines: ["We put it", "in your hands."],
    // over the dark truck, clear of the contractor
    place: LOWER_LEFT("34%", "28%"), // raised: 2 lines would reach the door logo as the camera moves
    // m: left-centre over the truck's dark windows -- clear of the
    // contractor, his phone and the NORTHLINE door logo below
    m: { ...MID_LEFT("40%", "5%", "left"), lines: ["We put it", "in your hands."] },
  },
  {
    at: 53.2, out: 55.4, text: "Right person. Right information. Right time.", lines: ["Right person.", "Right information.", "Right time."], small: true,
    // dark gutter beside the lead card
    place: MID_LEFT("25%", "3%"),
    // m: the lead card fills all but a ~26% gutter each side and the shot
    // has no other free space, so this one is sized to fit the gutter
    m: { ...MID_LEFT("24%", "2.5%"), fit: true, lines: ["Right person.", "Right", "information.", "Right time."] },
  },
  {
    at: 56.2, out: Infinity, text: "You answer. You quote. You close.", lines: ["You answer.", "You quote.", "You close."],
    // as the Calling screen lands (CALL LEAD tap ~55.7s); held through the end
    place: MID_LEFT("28%", "5%"),
    // m: quieter than the Calling / Daniel Mercer payoff it supports
    m: { ...MID_LEFT("30%", "5%"), quiet: true, lines: ["You answer.", "You quote.", "You close."] },
  },
];
const SCRIM: Record<Scrim, string> = {
  corner: "radial-gradient(120% 95% at 0% 100%, rgba(7,11,17,0.6) 0%, rgba(7,11,17,0.32) 38%, rgba(7,11,17,0) 66%)",
  cornerTR: "radial-gradient(120% 95% at 100% 0%, rgba(7,11,17,0.55) 0%, rgba(7,11,17,0.28) 38%, rgba(7,11,17,0) 66%)",
  cornerTL: "radial-gradient(120% 95% at 0% 0%, rgba(7,11,17,0.62) 0%, rgba(7,11,17,0.32) 38%, rgba(7,11,17,0) 66%)",
  left: "linear-gradient(90deg, rgba(7,11,17,0.72) 0%, rgba(7,11,17,0.4) 20%, rgba(7,11,17,0) 32%)",
  right: "linear-gradient(270deg, rgba(7,11,17,0.55) 0%, rgba(7,11,17,0.28) 28%, rgba(7,11,17,0) 50%)",
};
const beatAt = (t: number) => STORY.findIndex((b) => t >= b.at && t < b.out);
const LIGHT = "#f6f2ec";
const SHADOW = "0 1px 2px rgba(0,0,0,0.3), 0 6px 30px rgba(0,0,0,0.4)";
const mmss = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export default function AcquisitionFilm() {
  const boxRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const [state, setState] = useState<State>("idle");
  const stateRef = useRef<State>("idle");
  stateRef.current = state;
  const [beat, setBeat] = useState(-1);
  const beatRef = useRef(-1);
  const [dragging, setDragging] = useState(false);
  // touch has no hover: controls show briefly after any interaction
  const [poke, setPoke] = useState(false);
  const pokeTimer = useRef(0);
  // slider value for assistive tech: updated on interaction/state changes,
  // never per frame (no running announcements)
  const [ariaNow, setAriaNow] = useState(0);

  const nudge = () => {
    setPoke(true);
    window.clearTimeout(pokeTimer.current);
    pokeTimer.current = window.setTimeout(() => setPoke(false), 2600);
  };
  // push the playhead into the progress line + story state right now
  const sync = () => {
    const v = vidRef.current;
    if (!v) return;
    const p = v.duration ? v.currentTime / v.duration : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (thumbRef.current) thumbRef.current.style.transform = `translateX(${p * 100}%)`;
    const i = beatAt(v.currentTime);
    if (i !== beatRef.current) { beatRef.current = i; setBeat(i); }
  };

  const play = () => {
    const v = vidRef.current;
    if (!v) return;
    v.play().then(() => setState("playing")).catch(() => setState(v.currentTime > 0 ? "paused" : "idle"));
  };
  const restart = () => {
    const v = vidRef.current;
    if (!v) return;
    v.currentTime = 0;
    setAriaNow(0);
    sync();
    play();
  };
  const pause = () => {
    const v = vidRef.current;
    if (!v) return;
    v.pause(); // manual pause HOLDS the current time
    setState("paused");
    setAriaNow(Math.round(v.currentTime));
  };
  const toggle = () => {
    const v = vidRef.current;
    if (!v) return;
    if (state === "ended") return restart();
    if (v.paused) play();
    else pause();
  };

  // autoplay on arrival, reset on leaving. A manual pause while still in
  // view is never overridden: only a fresh arrival (after leaving) restarts.
  useEffect(() => {
    const box = boxRef.current, v = vidRef.current;
    if (!box || !v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // a tall player on a short viewport can never be 85% visible: cap it
    const enter = Math.min(ENTER, (window.innerHeight * 0.92) / Math.max(1, box.offsetHeight));
    const io = new IntersectionObserver(([e]) => {
      const r = e.intersectionRatio;
      if (!inView.current && r >= enter - 0.001) {
        inView.current = true;
        if (!reduce) restart();
      } else if (inView.current && r < LEAVE) {
        inView.current = false;
        v.pause();
        v.currentTime = 0;
        setState("idle");
        setAriaNow(0);
        sync();
      }
    }, { threshold: [0, LEAVE, enter, 1] });
    io.observe(box);
    return () => io.disconnect();
    // mount-only; restart/sync only touch refs + state setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // progress line + story follow the playhead (rAF, no re-renders unless
  // the story beat changes). The per-frame loop runs only while the video
  // is actually playing; any seek/pause/reset updates once.
  useEffect(() => {
    const v = vidRef.current;
    let raf = 0;
    const tick = () => {
      if (!scrub.current || scrub.current.mode !== "drag") sync();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; sync(); };
    const once = () => sync();
    v?.addEventListener("playing", start);
    v?.addEventListener("pause", stop);
    v?.addEventListener("ended", stop);
    v?.addEventListener("seeked", once);
    v?.addEventListener("loadedmetadata", once);
    return () => {
      cancelAnimationFrame(raf);
      v?.removeEventListener("playing", start);
      v?.removeEventListener("pause", stop);
      v?.removeEventListener("ended", stop);
      v?.removeEventListener("seeked", once);
      v?.removeEventListener("loadedmetadata", once);
      window.clearTimeout(pokeTimer.current);
    };
  }, []);

  // SEEK. Seeks are coalesced: while one is in flight the latest target
  // waits and is applied on `seeked`, so a fast drag never queues a backlog.
  const pending = useRef<number | null>(null);
  const seekTo = (t: number) => {
    const v = vidRef.current;
    if (!v || !v.duration) return;
    const time = Math.min(v.duration, Math.max(0, t));
    if (v.seeking) pending.current = time;
    else v.currentTime = time;
    // a seek leaves the reset/ended states: hold here, ready to play on
    const s = stateRef.current;
    if (s === "idle" || s === "ended") setState("paused");
    setAriaNow(Math.round(time));
  };
  const onSeeked = () => {
    const v = vidRef.current;
    if (v && pending.current !== null) { v.currentTime = pending.current; pending.current = null; }
  };
  const fracAt = (x: number) => {
    const r = seekRef.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (x - r.left) / r.width));
  };
  const showAt = (f: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${f})`;
    if (thumbRef.current) thumbRef.current.style.transform = `translateX(${f * 100}%)`;
  };
  const seekToX = (x: number) => {
    const v = vidRef.current;
    if (!v || !v.duration) return;
    const f = fracAt(x);
    showAt(f);
    seekTo(f * v.duration);
    // story follows the target immediately (currentTime may lag a seek)
    const i = beatAt(f * v.duration);
    if (i !== beatRef.current) { beatRef.current = i; setBeat(i); }
  };

  // Pointer scrubbing. Mouse: seek on press, drag to scrub. Touch: the
  // strip is `touch-action: pan-y`, so vertical swipes stay page scrolls
  // (the browser cancels us); a tap seeks, a horizontal drag scrubs.
  const scrub = useRef<{ id: number; x0: number; y0: number; mode: "pending" | "drag"; wasPlaying: boolean } | null>(null);
  const beginDrag = (e: React.PointerEvent) => {
    const v = vidRef.current!;
    seekRef.current?.setPointerCapture(e.pointerId);
    scrub.current!.mode = "drag";
    if (!v.paused) v.pause();
    setDragging(true);
  };
  const endDrag = () => {
    const s = scrub.current;
    setDragging(false);
    scrub.current = null;
    nudge();
    if (s?.wasPlaying) play();
  };
  const onPointerDown = (e: React.PointerEvent) => {
    const v = vidRef.current;
    if (!v || !v.duration || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.stopPropagation();
    scrub.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, mode: "pending", wasPlaying: !v.paused && stateRef.current === "playing" };
    nudge();
    if (e.pointerType === "mouse") { beginDrag(e); seekToX(e.clientX); }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = scrub.current;
    if (!s || s.id !== e.pointerId) return;
    if (s.mode === "pending") {
      const dx = Math.abs(e.clientX - s.x0), dy = Math.abs(e.clientY - s.y0);
      if (dx > 6 && dx > dy) beginDrag(e);
      else { if (dy > 10) scrub.current = null; return; }
    }
    seekToX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = scrub.current;
    if (!s || s.id !== e.pointerId) return;
    if (s.mode === "pending") { scrub.current = null; seekToX(e.clientX); return; } // tap
    seekToX(e.clientX);
    endDrag();
  };
  const onPointerCancel = () => {
    if (scrub.current?.mode === "drag") endDrag();
    else scrub.current = null;
  };
  const onSeekKey = (e: React.KeyboardEvent) => {
    const v = vidRef.current;
    if (!v || !v.duration) return;
    const step: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -10, PageUp: 10 };
    let t: number | null = null;
    if (e.key in step) t = v.currentTime + step[e.key];
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = v.duration;
    else if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); return; }
    if (t === null) return;
    e.preventDefault();
    seekTo(t);
    sync();
    nudge();
  };

  // reset (idle at 0 / poster) never shows a card, even for a stale frame
  const active = state === "idle" ? -1 : beat;
  const chrome = state === "paused" || poke || dragging;
  const cardMotion = (on: boolean) =>
    `transition-[opacity,transform] motion-reduce:transition-none motion-reduce:translate-y-0 ${on ? "opacity-100 translate-y-0 duration-[420ms] ease-out" : "opacity-0 translate-y-[8px] duration-[260ms] ease-in"}`;
  const scrimFor = (sc: Scrim | undefined, on: boolean) =>
    sc && <div className={`absolute inset-0 transition-opacity motion-reduce:transition-none ${on ? "opacity-100 duration-[420ms]" : "opacity-0 duration-[260ms]"}`} style={{ background: SCRIM[sc] }} />;
  const dur = vidRef.current?.duration || 0;

  return (
    <section id="acquisition-film" className="relative pb-24 pt-4 md:pb-32" style={{ background: C.ink }}>
      <div className={CONTAINER}>
        <div className="mx-auto max-w-[920px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.03em]" style={{ color: C.text }}>
                See how Revora finds the opportunity.
              </h2>
              <p className="mt-3 text-[17px]" style={{ color: C.muted }}>One qualified lead. Start to finish.</p>
            </div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.faint }}>58 sec · Sound off</p>
          </div>

          <p id="acquisition-film-story" className="sr-only">
            The film follows one opportunity: {STORY.map((b) => [b.text, b.sub].filter(Boolean).join(" ")).join(" ")}
          </p>

          {/* the player */}
          <div
            ref={boxRef}
            id="acquisition-film-player"
            className="group relative mt-8 overflow-hidden rounded-[10px] [container-type:inline-size]"
            style={{ aspectRatio: "16 / 9", background: "#000", boxShadow: "0 50px 120px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)" }}
          >
            <video
              ref={vidRef}
              src={SRC}
              poster={POSTER}
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              aria-describedby="acquisition-film-story"
              onEnded={() => { setState("ended"); setAriaNow(Math.round(vidRef.current?.duration || 0)); }}
              onSeeked={onSeeked}
              onClick={() => { nudge(); toggle(); }}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            />

            {/* story cards over the footage; decorative for AT -- the full
                story is in #acquisition-film-story. Desktop (md+): */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
              {STORY.map((b, i) => {
                const on = i === active;
                return (
                  <div key={i}>
                    {scrimFor(b.place.scrim, on)}
                    <div className={`absolute ${b.place.right ? "text-right" : ""}`} style={{ ...b.place.box, maxWidth: b.place.w }}>
                      <div className={cardMotion(on)}>
                        <p
                          className={`font-display font-medium leading-[1.08] tracking-[-0.02em] ${b.sub ? "text-[clamp(26px,4.35cqw,40px)]" : b.small ? "text-[clamp(16px,2.6cqw,24px)]" : "text-[clamp(20px,3.5cqw,34px)]"}`}
                          style={{ color: b.place.dark ? "#0a1018" : LIGHT, textShadow: b.place.dark ? "none" : SHADOW }}
                        >
                          {b.lines ? b.lines.map((l, k) => <span key={k} className="block">{l}</span>) : b.text}
                        </p>
                        {b.sub && <p className="mt-3 text-[clamp(12px,1.65cqw,15px)] leading-snug" style={{ color: "rgba(246,242,236,0.82)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>{b.sub}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* mobile: inside the frame, shot-aware placement */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 md:hidden">
              {STORY.map((b, i) => {
                const on = i === active;
                const m = b.m;
                return (
                  <div key={i}>
                    {scrimFor(m.scrim, on)}
                    <div className={`absolute ${m.right ? "text-right" : ""}`} style={{ ...m.box, maxWidth: m.w }}>
                      <div className={cardMotion(on)}>
                        <p
                          className={`font-display font-medium leading-[1.1] tracking-[-0.015em] ${b.sub ? "text-[clamp(17px,5.2cqw,21px)]" : m.fit ? "text-[clamp(12px,3.5cqw,15px)]" : m.quiet ? "text-[clamp(12px,3.7cqw,15px)]" : "text-[clamp(15px,4.7cqw,19px)]"}`}
                          style={{ color: m.dark ? "#0a1018" : LIGHT, textShadow: m.dark ? "none" : SHADOW }}
                        >
                          {m.lines.map((l, k) => <span key={k} className="block whitespace-nowrap">{l}</span>)}
                        </p>
                        {b.sub && <p className="mt-1.5 text-[clamp(11px,3.3cqw,13px)] leading-snug" style={{ color: "rgba(246,242,236,0.86)", textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}>{b.sub}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* idle / paused: one restrained play affordance */}
            {(state === "idle" || state === "paused") && (
              <button type="button" onClick={() => { nudge(); play(); }} aria-label="Play film" className="absolute inset-0 flex items-center justify-center focus-visible:outline-none [&:focus-visible>span]:shadow-[inset_0_0_0_2px_#FF8838,0_0_0_3px_rgba(255,136,56,0.35)]" style={{ background: "linear-gradient(180deg, rgba(7,11,17,0) 55%, rgba(7,11,17,0.45) 100%)" }}>
                <span className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm transition-transform group-hover:scale-105 md:h-16 md:w-16" style={{ background: "rgba(7,11,17,0.5)", boxShadow: `inset 0 0 0 1.5px ${C.orange}` }}>
                  <Play size={22} fill={C.orange} color={C.orange} className="ml-1" />
                </span>
              </button>
            )}

            {/* ended: hold the last frame + final card, offer Replay */}
            {state === "ended" && (
              <div className="absolute inset-0 flex items-end justify-center pb-10" style={{ background: "linear-gradient(180deg, rgba(7,11,17,0) 50%, rgba(7,11,17,0.7) 100%)" }}>
                <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold outline-none focus-visible:shadow-[inset_0_0_0_2px_#FF8838]" style={{ background: "rgba(7,11,17,0.75)", color: C.text, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" }}>
                  <RotateCcw size={15} /> Replay
                </button>
              </div>
            )}

            {/* play/pause + replay: bottom-right (clear of every story card);
                shown when paused/interacting, on hover (pointer devices) or focus */}
            <div className={`absolute bottom-7 right-2.5 z-10 flex gap-1.5 transition-opacity duration-300 md:bottom-6 md:right-3 ${state === "ended" || state === "idle" ? "pointer-events-none opacity-0" : chrome ? "opacity-100" : "opacity-0 focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"}`}>
              <button type="button" onClick={() => { nudge(); toggle(); }} aria-label={state === "playing" ? "Pause film" : "Play film"} className="flex h-8 w-8 items-center justify-center rounded-full outline-none backdrop-blur-sm focus-visible:shadow-[inset_0_0_0_2px_#FF8838] md:h-9 md:w-9" style={{ background: "rgba(7,11,17,0.6)", color: C.text }}>
                {state === "playing" ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button type="button" onClick={() => { nudge(); restart(); }} aria-label="Replay film from the start" className="flex h-8 w-8 items-center justify-center rounded-full outline-none backdrop-blur-sm focus-visible:shadow-[inset_0_0_0_2px_#FF8838] md:h-9 md:w-9" style={{ background: "rgba(7,11,17,0.6)", color: C.text }}>
                <RotateCcw size={15} />
              </button>
            </div>

            {/* seek: the thin orange line is the visual; the hit target is a
                28px (20px md+) strip along the bottom edge */}
            <div
              ref={seekRef}
              role="slider"
              tabIndex={0}
              aria-label="Seek film"
              aria-valuemin={0}
              aria-valuemax={Math.round(dur) || 59}
              aria-valuenow={ariaNow}
              aria-valuetext={`${mmss(ariaNow)} of ${mmss(dur || 59)}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              onKeyDown={onSeekKey}
              onFocus={() => setAriaNow(Math.round(vidRef.current?.currentTime || 0))}
              className="group/seek absolute inset-x-0 bottom-0 z-20 h-7 cursor-pointer select-none outline-none [-webkit-touch-callout:none] [touch-action:pan-y] md:h-5"
            >
              <div className={`absolute inset-x-0 bottom-0 bg-white/15 transition-[height] duration-200 ${dragging ? "h-[4px]" : "h-[2px] group-focus-visible/seek:h-[4px] [@media(hover:hover)]:group-hover/seek:h-[4px]"}`}>
                <div ref={barRef} className="h-full w-full origin-left" style={{ background: C.orange, transform: "scaleX(0)" }} />
                {/* full-width carrier moved by transform (no per-frame layout);
                    the handle sits on its left edge */}
                <div ref={thumbRef} className="pointer-events-none absolute inset-0" style={{ transform: "translateX(0%)", willChange: "transform" }}>
                  <div
                    className={`absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 ${dragging || chrome ? "opacity-100" : "opacity-0 group-focus-visible/seek:opacity-100 [@media(hover:hover)]:group-hover/seek:opacity-100"}`}
                    style={{ background: C.orange, boxShadow: "0 0 0 3px rgba(7,11,17,0.45)" }}
                  />
                </div>
              </div>
              {/* keyboard focus ring hugging the bottom edge */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[10px] opacity-0 group-focus-visible/seek:opacity-100" style={{ boxShadow: "inset 0 0 0 2px rgba(255,136,56,0.9)" }} />
            </div>
          </div>

          <p className="mt-4 text-[12px]" style={{ color: C.faint }}>Illustrative Revora concept.</p>

          {/* the film is proof; this is the conversion moment */}
          <div className="mt-14 flex flex-col items-start gap-5 border-t pt-10 md:flex-row md:items-center md:justify-between" style={{ borderColor: C.line }}>
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-tight tracking-[-0.02em]" style={{ color: C.text }}>
              Want this working for your business?
            </p>
            <BookCall />
          </div>
        </div>
      </div>
    </section>
  );
}
