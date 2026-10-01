import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MessageSquare, Signal, Wifi } from "lucide-react";
import { REVORA_BG, STAGE_H, STAGE_W } from "@/components/lead-journey/content";
import { DetailFace, NotificationFace, ObjectFace } from "./LeadCard";
import CallingScreen from "./CallingScreen";

// ISOLATED PROTOTYPE -- contractor receives the qualified lead. Starts
// where the live-action push-in into the contractor's phone ends, so the
// frame IS the phone display (no device mockup); the lock-screen
// wallpaper runs full-bleed. One shell element ([data-cl="shell"]) is the
// travelling lead: it arrives as the homeowner sequence's lead object,
// compresses into a notification, expands into the actionable lead, then
// opens out into the calling state. One GSAP timeline, ~6.5s, remount to
// replay. Tokens are imported read-only from the frozen lead-journey.

const SHELL = {
  object: { top: 300, width: 640, height: 300, borderRadius: 30 },
  notif: { top: 330, width: 760, height: 128, borderRadius: 28 },
  detail: { top: 50, width: 760, height: 800, borderRadius: 36 },
  full: { top: 0, width: STAGE_W, height: STAGE_H, borderRadius: 0 },
};

const WALLPAPER =
  "radial-gradient(ellipse 60% 70% at 22% 18%, #33465c 0%, transparent 60%), radial-gradient(ellipse 55% 60% at 82% 92%, #5e4128 0%, transparent 62%), linear-gradient(160deg, #18202b 0%, #111419 55%, #1a1611 100%)";

export default function ContractorLead() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const shell = q('[data-cl="shell"]');

      // ---- initial state
      gsap.set(q('[data-cl="world"]'), { scale: 1.06, filter: "blur(8px)" });
      gsap.set(shell, { xPercent: -50, ...SHELL.object, opacity: 0, y: -40, scale: 0.92, filter: "blur(10px)" });
      gsap.set(q('[data-cl="face-notif"], [data-cl="face-detail"], [data-cl="lock-dim"]'), { opacity: 0 });
      gsap.set(q("[data-cl-in]"), { opacity: 0, y: 14 });
      gsap.set(q("[data-contractor-handoff]"), { autoAlpha: 0, backgroundColor: "transparent" });
      gsap.set(q("[data-cl-call-in]"), { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. inside the contractor's phone; the lead object arrives
      tl.to(q('[data-cl="world"]'), { scale: 1, filter: "blur(0px)", duration: 0.7 }, 0)
        .to(shell, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 0.45);

      // 2. it compresses into a Revora notification; the phone buzzes
      // (faces overlap through every morph so the shell is never empty)
      tl.to(q('[data-cl="face-object"]'), { opacity: 0, duration: 0.3 }, 1.25)
        .to(shell, { ...SHELL.notif, duration: 0.5, ease: "power3.inOut" }, 1.25)
        .to(q('[data-cl="crew"]'), { y: 148, duration: 0.5, ease: "power3.inOut" }, 1.3)
        .to(q('[data-cl="face-notif"]'), { opacity: 1, duration: 0.3 }, 1.4)
        .to(shell, { keyframes: { x: [0, -6, 6, -4, 4, -2, 0] }, duration: 0.38, ease: "none" }, 1.8)
        .fromTo(q('[data-cl="face-notif"] [data-cl="pulse"]'), { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.8, duration: 0.75, ease: "power2.out" }, 1.82);

      // 3. it expands into the actionable lead
      // detail content builds top-down while the shell grows, so its edge
      // reveals rows rather than empty panel
      tl.to(q('[data-cl="face-notif"]'), { opacity: 0, y: 24, duration: 0.3, ease: "power1.in" }, 2.45)
        .to(shell, { ...SHELL.detail, duration: 0.6, ease: "power3.inOut" }, 2.45)
        .to(q('[data-cl="lock"]'), { filter: "blur(16px)", duration: 0.6, ease: "power2.inOut" }, 2.45)
        .to(q('[data-cl="lock-dim"]'), { opacity: 1, duration: 0.6 }, 2.45)
        .to(q('[data-cl="face-detail"]'), { opacity: 1, duration: 0.01 }, 2.55)
        .to(q("[data-cl-in]"), { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, 2.57);
      [0, 1, 2, 3].forEach((i) => {
        tl.to(q(`[data-cl-check="${i}"]`), { strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" }, 3.0 + i * 0.12);
      });

      // 4. readable hold, then the contractor taps CALL LEAD
      const tap = q('[data-cl="tap"]');
      tl.fromTo(tap, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.14 }, 4.95)
        .to(tap, { opacity: 0, scale: 1.6, duration: 0.42, ease: "power1.out" }, 5.13)
        .to(q('[data-cl="call"]'), { scale: 0.975, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 4.95);

      // 5. the lead opens out into the outgoing call (handoff frame)
      // Calling content arrives inside the growing shell (its own ground
      // stays transparent until the shell is full-frame), while the lead
      // detail recedes behind it.
      tl.to(q('[data-cl="face-detail"]'), { opacity: 0, scale: 0.98, y: -10, duration: 0.4, ease: "power1.in" }, 5.25)
        .to(shell, { ...SHELL.full, backgroundColor: REVORA_BG, duration: 0.55, ease: "power3.inOut" }, 5.25)
        .set(q("[data-contractor-handoff]"), { autoAlpha: 1 }, 5.4)
        .to(q("[data-cl-call-in]"), { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 5.42)
        .set(q("[data-contractor-handoff]"), { backgroundColor: REVORA_BG }, 5.8);

      tl.eventCallback("onComplete", () => {
        gsap.fromTo(q('[data-cl="ring"]'), { scale: 1, opacity: 0.7 }, { scale: 1.5, opacity: 0, duration: 1.8, ease: "power1.out", repeat: -1, stagger: 0.9 });
        gsap.to(q('[data-cl="calling-label"]'), { opacity: 0.45, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) tl.progress(1);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9", background: REVORA_BG }}>
      <div
        ref={stageRef}
        className="absolute left-0 top-0 origin-top-left overflow-hidden font-sans"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden", WebkitFontSmoothing: "antialiased" }}
      >
        <div data-cl="world" className="absolute inset-0">
          {/* contractor's lock screen */}
          <div data-cl="lock" className="absolute -inset-6" style={{ background: WALLPAPER }}>
            <div className="absolute inset-6">
              <div className="flex h-12 items-center justify-between px-10 text-[16px] font-semibold text-white/90">
                <span />
                <span className="flex items-center gap-2"><Signal size={17} /><Wifi size={17} /><span className="inline-block h-[13px] w-[26px] rounded-[4px] border border-white/80 p-[2px]"><span className="block h-full w-2/3 rounded-[1px] bg-white/90" /></span></span>
              </div>
              <div className="mt-6 text-center text-[22px] font-medium text-white/75">Tuesday, October 6</div>
              <div className="text-center text-[150px] font-extralight leading-[1.05] tracking-[-0.03em] text-white/95">2:17</div>

              <div data-cl="crew" className="absolute left-[calc(50%-380px)] top-[330px] flex w-[760px] items-center gap-5 rounded-[28px] px-6 py-[22px]" style={{ background: "rgba(255,255,255,0.11)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#2f8f5b]"><MessageSquare size={26} color="#fff" fill="#fff" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-[14px] font-semibold uppercase tracking-[0.16em] text-white/50"><span>Crew chat</span><span className="normal-case tracking-normal text-white/40">12m ago</span></div>
                  <div className="mt-1 truncate text-[18px] text-white/85">Mike R.: Tear-off's done on the Hillcrest job. Starting underlayment.</div>
                </div>
              </div>
            </div>
          </div>
          <div data-cl="lock-dim" className="absolute inset-0 bg-black/55" />

          {/* the travelling lead */}
          <div
            data-cl="shell"
            className="absolute left-1/2 overflow-hidden"
            style={{ background: "rgba(16,17,19,0.94)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 40px 120px rgba(0,0,0,0.55)" }}
          >
            <ObjectFace />
            <NotificationFace />
            <DetailFace />
          </div>
        </div>

        <CallingScreen />
      </div>
    </div>
  );
}
