import {
  Bell, Globe, Home, Menu, MessageCircle, MoreHorizontal, PlaySquare, Search, Share2, Signal, Store, ThumbsUp, Users, Wifi, Heart,
} from "lucide-react";
import { AD, COL_W, STATUS_H } from "./content";
import { AdImage, NorthlineMark, Tap } from "./primitives";

// Native-feeling social feed (Meta-inspired, not a clone). The feed list
// is translated by the timeline via [data-lj="feed-list"]; the ad is
// measured via [data-lj="ad"] so the scroll settles it in frame.

const GRAY = "#65676b";

function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white" style={{ background: bg }}>
      {initials}
    </div>
  );
}

function PostHeader({ avatar, name, meta }: { avatar: React.ReactNode; name: string; meta: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 pb-3 pt-3.5">
      {avatar}
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-[15px] font-semibold text-[#050505]">{name}</div>
        <div className="mt-0.5 flex items-center gap-1 text-[13px]" style={{ color: GRAY }}>{meta}</div>
      </div>
      <MoreHorizontal size={20} color={GRAY} />
    </div>
  );
}

function Engagement({ count, comments }: { count: string; comments: string }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5 text-[14px]" style={{ color: GRAY }}>
        <div className="flex items-center gap-1.5">
          <span className="flex">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1877f2] ring-2 ring-white"><ThumbsUp size={10} color="#fff" fill="#fff" /></span>
            <span className="-ml-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#f33e58] ring-2 ring-white"><Heart size={10} color="#fff" fill="#fff" /></span>
          </span>
          {count}
        </div>
        <span>{comments}</span>
      </div>
      <div className="mx-4 flex border-t border-[#ced0d4] py-1 text-[14px] font-semibold" style={{ color: GRAY }}>
        {[[ThumbsUp, "Like"], [MessageCircle, "Comment"], [Share2, "Share"]].map(([Icon, label]) => {
          const I = Icon as typeof ThumbsUp;
          return (
            <div key={label as string} className="flex flex-1 items-center justify-center gap-2 py-2">
              <I size={18} /> {label as string}
            </div>
          );
        })}
      </div>
    </>
  );
}

// Cards run edge-to-edge across the whole frame (mobile-app style) so the
// feed fills the viewport instead of sitting in a desktop column.
const BLEED: React.CSSProperties = { boxShadow: "0 0 0 100vmax #fff", clipPath: "inset(0 -100vmax)" };

function Card({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="mb-2.5 bg-white" style={BLEED} {...rest}>{children}</div>;
}

// Status bar stays; the tab bar ([data-lj="appbar"]) slides away on scroll.
export function FeedChrome() {
  return (
    <>
      <div data-lj="appbar" className="absolute inset-x-0 z-10 bg-white" style={{ top: STATUS_H, boxShadow: "0 1px 0 #dadde1" }}>
        <div className="mx-auto flex h-14 items-stretch justify-between px-2" style={{ width: COL_W }}>
          {[Home, Users, PlaySquare, Store, Bell, Menu].map((Icon, i) => (
            <div key={i} className="relative flex flex-1 items-center justify-center" style={{ color: i === 0 ? "#1877f2" : GRAY }}>
              <Icon size={24} strokeWidth={i === 0 ? 2.3 : 1.9} />
              {i === 0 && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#1877f2]" />}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 z-20 bg-white" style={{ height: STATUS_H }}>
        <div className="mx-auto flex h-full items-center justify-between px-5 text-[14px] font-semibold text-[#050505]" style={{ width: COL_W }}>
          <span>7:42</span>
          <span className="flex items-center gap-1.5"><Signal size={15} /><Wifi size={15} /><span className="ml-0.5 inline-block h-[11px] w-[22px] rounded-[3px] border border-[#050505] p-[1.5px]"><span className="block h-full w-3/4 rounded-[1px] bg-[#050505]" /></span></span>
        </div>
      </div>
    </>
  );
}

export function FeedList() {
  return (
    <div data-lj="feed-list" className="relative mx-auto will-change-transform" style={{ width: COL_W }}>
      {/* Composer */}
      <Card>
        <div className="flex items-center gap-2.5 px-4 py-3">
          <Avatar initials="DM" bg="#7a8a9e" />
          <div className="flex-1 rounded-full bg-[#f0f2f5] px-4 py-2.5 text-[15px]" style={{ color: GRAY }}>What's on your mind?</div>
          <Search size={20} color={GRAY} />
        </div>
      </Card>

      {/* Friend status on a colour background */}
      <Card>
        <PostHeader avatar={<Avatar initials="MC" bg="#b0746a" />} name="Megan Clarke" meta={<>1h · <Users size={12} /></>} />
        <div className="flex h-[300px] items-center justify-center px-12 text-center text-[30px] font-bold leading-snug text-white" style={{ background: "linear-gradient(135deg,#f5a25d 0%,#e2596b 100%)" }}>
          First proper fall morning. Coffee on the porch before work ☕🍂
        </div>
        <Engagement count="Jess Tran and 23 others" comments="5 comments" />
      </Card>

      {/* Neighbourhood group post */}
      <Card>
        <PostHeader
          avatar={<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b7a57] text-[13px] font-bold text-white">RN</div>}
          name="Riverside Neighbours"
          meta={<>Chris Olsen · 3h · <Globe size={12} /></>}
        />
        <p className="px-4 pb-3 text-[15px] leading-[1.4] text-[#050505]">
          Reminder: fall leaf collection starts Monday on the east side. Bags out by 7 a.m. and keep them off the sidewalk 🍁
        </p>
        <Engagement count="41" comments="12 comments" />
      </Card>

      {/* Sponsored: Northline Roofing */}
      <Card data-lj="ad">
        <PostHeader avatar={<NorthlineMark size={40} />} name={AD.name} meta={<>Sponsored · <Globe size={12} /></>} />
        <p className="px-4 pb-3 text-[15px] leading-[1.4] text-[#050505]">{AD.body}</p>
        <AdImage className="block aspect-video w-full" />
        <div className="flex items-center gap-4 bg-[#f0f2f5] px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold tracking-[0.01em] text-[#050505]">{AD.headline}</div>
            <div className="mt-0.5 text-[14px] leading-snug" style={{ color: GRAY }}>{AD.description}</div>
          </div>
          <div data-press="quote" className="relative shrink-0 rounded-md bg-[#e2e5e9] px-5 py-2.5 text-[15px] font-semibold text-[#050505]">
            {AD.cta}
            <Tap id="quote" />
          </div>
        </div>
        <Engagement count="86" comments="9 comments" />
      </Card>

      <Card>
        <PostHeader avatar={<Avatar initials="JP" bg="#5b6fb0" />} name="Jordan Pike" meta={<>5h · <Users size={12} /></>} />
        <p className="px-4 pb-3 text-[15px] leading-[1.4] text-[#050505]">
          Anyone have a good recommendation for a furnace tune-up before winter hits?
        </p>
        <Engagement count="14" comments="31 comments" />
      </Card>
    </div>
  );
}
