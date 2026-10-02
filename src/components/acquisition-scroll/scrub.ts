// Seeks a paused video to `from + p * (to - from)` (to: null = clip end),
// coalescing requests while a seek is in flight. Videos are never play()ed;
// scroll position drives currentTime via a proxy tween.
//
// Opt-in "play" mode (film preview only; the scroll route never sets it):
// when the master timeline runs on a real-time clock, seeking every frame
// would judder, so each clip instead PLAYS natively at the rate the
// timeline is advancing it (estimated per update, smoothed), re-seeking
// only on drift or jumps, and pauses when the timeline stops driving it.
type ScrubMode = "seek" | "play";
let mode: ScrubMode = "seek";
export const setScrubMode = (m: ScrubMode) => { mode = m; };

export function makeScrubber(v: HTMLVideoElement, from: number, to: number | null) {
  let want = 0;
  const target = () => {
    const end = Math.min(to ?? v.duration, v.duration - 0.04);
    return from + want * (end - from);
  };
  const apply = () => {
    if (!v.duration) return;
    const t = target();
    if (Math.abs(v.currentTime - t) > 0.008) v.currentTime = t;
  };

  // play-mode state
  let lastNow = 0, lastT = -1, rate = 1, idle = 0;
  const follow = () => {
    if (!v.duration) return;
    const t = target();
    const now = performance.now();
    const dt = (now - lastNow) / 1000;
    const inst = lastT >= 0 && dt > 0 && dt < 0.25 ? (t - lastT) / dt : 0;
    lastNow = now;
    lastT = t;
    window.clearTimeout(idle);
    idle = window.setTimeout(() => v.pause(), 150);
    if (inst > 0.1 && inst < 4) {
      rate = rate * 0.8 + inst * 0.2;
      const r = Math.min(4, Math.max(0.25, rate));
      if (Math.abs(v.playbackRate - r) > 0.03) v.playbackRate = r;
      if (Math.abs(v.currentTime - t) > 0.25 && !v.seeking) v.currentTime = t;
      if (v.paused) void v.play().catch(() => {});
    } else {
      // held, reversed or jumped (e.g. Replay): park on the exact frame
      if (!v.paused) v.pause();
      if (Math.abs(v.currentTime - t) > 0.008 && !v.seeking) v.currentTime = t;
    }
  };

  // in play mode a playing video must not be re-seeked on every "seeked"
  const onSeeked = () => { if (mode === "seek") apply(); };
  v.addEventListener("seeked", onSeeked);
  v.addEventListener("loadedmetadata", apply);
  return {
    seek: (p: number) => {
      want = p;
      if (mode === "play") follow();
      else if (!v.seeking) apply();
    },
    dispose: () => {
      window.clearTimeout(idle);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("loadedmetadata", apply);
    },
  };
}
