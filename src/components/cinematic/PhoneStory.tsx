import { Button } from "@/components/ui/button";
import {
  CALENDLY, STORY, IMG, Reveal, Thread, Eyebrow, Photo,
  RoofingFrame, LandscapingFrame, SiteFrame, MarketMap, InquiryCard, QualifyRail,
} from "./storyParts";

// <768px: the same nine beats as a linear, left-aligned editorial read.
// Full-bleed photography, no drift/parallax/sticky, CSS reveals only.
export default function PhoneStory() {
  return (
    <div id="services" className="bg-primary text-primary-foreground" style={{ overflowX: "clip" }}>
      {/* 1. Establishing hero, type set low over the dark grade */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-10 pt-28">
        <div className="absolute inset-0">
          <Photo slot={IMG.establishing} eager position="74% 55%" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary from-40% via-primary/55 to-primary/10" />
        <div className="relative space-y-5">
          <Eyebrow className="animate-fade-in text-primary-foreground/70">{STORY.eyebrow}</Eyebrow>
          <h1 className="animate-fade-in [animation-delay:150ms] font-display text-[clamp(2.4rem,11vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em]">
            {STORY.headline}
          </h1>
          <p className="animate-fade-in [animation-delay:300ms] text-base font-light leading-relaxed text-primary-foreground/80">{STORY.sub}</p>
          <div className="animate-fade-in [animation-delay:450ms] space-y-3 pt-1">
            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="/#services">{STORY.ctaOffer}</a>
            </Button>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="block py-2 text-center text-sm font-medium underline decoration-primary-foreground/30 underline-offset-8">
              {STORY.ctaCall}
            </a>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-primary-foreground/15 border-t border-primary-foreground/15 pt-4">
            {STORY.heroStats.map(([v, l]) => (
              <div key={v} className="px-3 first:pl-0">
                <dt className="font-display text-lg">{v}</dt>
                <dd className="mt-0.5 text-[11px] text-primary-foreground/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Tagline */}
      <section className="px-6 py-24">
        <Thread className="mb-8 w-20" />
        <Reveal as="h2" className="font-display text-[2.6rem] font-light leading-[1.05] tracking-tight">
          We build for the businesses that <span className="text-accent">build.</span>
        </Reveal>
      </section>

      {/* 3. Craft */}
      <section className="space-y-10 pb-24">
        <Reveal className="space-y-3 px-6">
          <p className="font-display text-3xl font-light leading-tight">{STORY.craftA}</p>
          <p className="font-display text-3xl font-light leading-tight text-accent">{STORY.craftB}</p>
        </Reveal>
        <Reveal dir="right" className="-mr-10 pl-6">
          <SiteFrame />
        </Reveal>
        <p className="border-l border-accent/60 mx-6 pl-4 text-sm leading-relaxed text-primary-foreground/70">{STORY.websiteBody}</p>
      </section>

      {/* 4 + 5. Concepts, tall frames, alternating bleed */}
      <section className="space-y-14 pb-24">
        <p className="px-6 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">{STORY.conceptNote}</p>
        <div className="space-y-4">
          <Eyebrow className="px-6 text-primary-foreground/70">Northline Roofing</Eyebrow>
          <Reveal className="pr-10 -ml-2">
            <RoofingFrame tall />
          </Reveal>
        </div>
        <div className="space-y-4">
          <Eyebrow className="justify-end px-6 text-primary-foreground/70">Landscaping</Eyebrow>
          <Reveal className="pl-10 -mr-2">
            <LandscapingFrame tall />
          </Reveal>
        </div>
      </section>

      {/* 6. Offer */}
      <section className="bg-card px-6 py-20 text-primary">
        <Reveal className="space-y-5">
          <Thread className="w-16" />
          <h2 className="font-display text-4xl font-light leading-[1.08]">{STORY.foundation}</h2>
          <p className="text-muted-foreground">{STORY.foundationSub}</p>
        </Reveal>
        <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6">
          <div>
            <dt className="font-display text-3xl">$997</dt>
            <dd className="mt-1 text-xs text-muted-foreground">Website Build</dd>
          </div>
          <div>
            <dt className="font-display text-3xl">$99/mo</dt>
            <dd className="mt-1 text-xs text-muted-foreground">Website Care</dd>
          </div>
        </dl>
        <Button size="lg" className="mt-8 w-full" asChild>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer">{STORY.ctaCall}</a>
        </Button>
      </section>

      {/* 7. Aerial market, full bleed */}
      <section>
        <MarketMap className="aspect-[4/5] w-full" />
        <Reveal className="space-y-4 px-6 pb-20 pt-10">
          <h2 className="font-display text-4xl font-light leading-[1.05]">
            {STORY.marketA}
            <br />
            <span className="text-accent">{STORY.marketB}</span>
          </h2>
          <p className="text-sm text-primary-foreground/65">{STORY.marketNote}</p>
        </Reveal>
      </section>

      {/* 8. Homeowner with inquiry overlay */}
      <section className="relative">
        <div className="aspect-[4/5] w-full">
          <Photo slot={IMG.homeowner} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
        <div className="relative -mt-40 space-y-6 px-6 pb-20">
          <Reveal dir="right">
            <InquiryCard className="ml-auto w-[72%]" />
          </Reveal>
          <Reveal as="p" className="font-display text-2xl font-light leading-tight">{STORY.homeowner}</Reveal>
          <Reveal as="p" className="font-display text-3xl font-light">
            Attention. <span className="text-accent">Interest.</span>
          </Reveal>
        </div>
      </section>

      {/* 9. Capture -> Qualify -> Focus */}
      <section className="space-y-12 px-6 py-20">
        <QualifyRail />
        <Reveal as="p" className="leading-relaxed text-primary-foreground/75">{STORY.qualifyBody}</Reveal>
        <Reveal className="space-y-2">
          <p className="font-display text-3xl font-light">
            Follow up. <span className="text-accent">Conversation.</span>
          </p>
          <p className="text-sm text-primary-foreground/70">{STORY.followBody}</p>
        </Reveal>
      </section>

      <section className="border-t border-primary-foreground/10 px-6 py-20">
        <Reveal className="space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary-foreground/50">{STORY.systemLabel}</p>
          <p className="font-display text-4xl font-semibold tracking-[0.1em]">REVORA</p>
          <p className="text-primary-foreground/70">{STORY.signoff}</p>
          <p className="text-sm text-primary-foreground/60">{STORY.systemTerms}</p>
          <Button variant="hero" size="lg" className="w-full" asChild>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer">{STORY.ctaCall}</a>
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
