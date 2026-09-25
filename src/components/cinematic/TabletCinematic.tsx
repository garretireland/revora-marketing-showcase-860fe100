import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  CALENDLY, STORY, IMG, Reveal, Thread, Eyebrow, Photo,
  RoofingFrame, LandscapingFrame, SiteFrame, MarketMap, InquiryCard, QualifyRail,
} from "./storyParts";

// 768-1279px "cinematic-lite": same nine story beats as DesktopCinematic,
// composed for laptop/tablet widths in normal document flow. Sticky media
// is used in exactly two places (craft, aerial) and never longer than
// ~one extra viewport, so there is no scroll trap.
export default function TabletCinematic() {
  return (
    <div id="services" className="overflow-x-clip bg-primary text-primary-foreground">
      {/* 1. Establishing hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden px-10 pb-16 pt-32 lg:px-16">
        <div className="absolute inset-0">
          <Photo slot={IMG.establishing} eager className="animate-slow-drift" position="70% 60%" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        <div className="relative max-w-[640px] space-y-7">
          <Eyebrow className="animate-fade-in text-primary-foreground/70">{STORY.eyebrow}</Eyebrow>
          <h1 className="animate-fade-in [animation-delay:150ms] font-display text-6xl lg:text-7xl font-light leading-[1.02] tracking-[-0.02em]">
            {STORY.headline}
          </h1>
          <p className="animate-fade-in [animation-delay:300ms] max-w-xl text-lg font-light leading-relaxed text-primary-foreground/80">{STORY.sub}</p>
          <div className="animate-fade-in [animation-delay:450ms] flex flex-wrap items-center gap-6 pt-1">
            <Button variant="hero" size="lg" className="group" asChild>
              <a href="/#services">
                {STORY.ctaOffer}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline decoration-primary-foreground/30 underline-offset-8 hover:decoration-accent">
              {STORY.ctaCall}
            </a>
          </div>
          <dl className="animate-fade-in [animation-delay:600ms] grid max-w-lg grid-cols-3 divide-x divide-primary-foreground/15 border-t border-primary-foreground/15 pt-4">
            {STORY.heroStats.map(([v, l]) => (
              <div key={v} className="px-4 first:pl-0">
                <dt className="font-display text-2xl">{v}</dt>
                <dd className="mt-0.5 text-xs text-primary-foreground/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Tagline */}
      <section className="relative px-10 py-36 lg:px-16">
        <Thread className="mb-12 w-32" />
        <Reveal as="h2" className="max-w-4xl font-display text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight">
          We build for the businesses that <span className="text-accent">build.</span>
        </Reveal>
      </section>

      {/* 3. Digital craftsmanship: sticky site frame + scrolling statement */}
      <section className="relative grid grid-cols-2 gap-12 px-10 pb-32 lg:gap-20 lg:px-16">
        <div className="sticky top-32 self-start">
          <Reveal dir="left">
            <SiteFrame />
          </Reveal>
        </div>
        <div className="flex min-h-[110vh] flex-col justify-between pt-6">
          <Reveal className="space-y-5">
            <p className="font-display text-4xl lg:text-5xl font-light leading-tight">{STORY.craftA}</p>
            <p className="font-display text-4xl lg:text-5xl font-light leading-tight text-accent">{STORY.craftB}</p>
          </Reveal>
          <Reveal className="space-y-4 border-l border-accent/60 pl-6">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/50">{STORY.websiteTitle}</p>
            <p className="max-w-sm text-lg font-light leading-relaxed text-primary-foreground/80">{STORY.websiteBody}</p>
          </Reveal>
        </div>
      </section>

      {/* 4. Northline / roofing concept, offset right */}
      <section className="bg-warm/5 px-10 py-28 lg:px-16">
        <p className="mb-10 text-[11px] uppercase tracking-[0.35em] text-primary-foreground/50">{STORY.conceptNote}</p>
        <div className="grid grid-cols-12 items-center gap-8">
          <Reveal dir="left" className="col-span-4 space-y-4">
            <Eyebrow className="text-primary-foreground/70">Northline Roofing</Eyebrow>
            <p className="text-base leading-relaxed text-primary-foreground/70">{STORY.roofingBody}</p>
          </Reveal>
          <Reveal dir="right" className="col-span-8 -mr-10 lg:-mr-16">
            <RoofingFrame />
          </Reveal>
        </div>
      </section>

      {/* 5. Landscaping concept, mirrored */}
      <section className="px-10 pb-32 pt-8 lg:px-16">
        <div className="grid grid-cols-12 items-center gap-8">
          <Reveal dir="left" className="col-span-8 -ml-10 lg:-ml-16">
            <LandscapingFrame />
          </Reveal>
          <Reveal dir="right" className="col-span-4 space-y-4 text-right">
            <Eyebrow className="justify-end text-primary-foreground/70">Landscaping</Eyebrow>
            <p className="text-base leading-relaxed text-primary-foreground/70">{STORY.landscapingBody}</p>
          </Reveal>
        </div>
      </section>

      {/* 6. Offer / CTA on a light surface */}
      <section className="bg-card px-10 py-32 text-primary lg:px-16">
        <div className="grid grid-cols-12 gap-10">
          <Reveal className="col-span-7 space-y-6">
            <Thread className="w-24" />
            <h2 className="font-display text-5xl lg:text-6xl font-light leading-[1.05]">{STORY.foundation}</h2>
            <p className="text-lg text-muted-foreground">{STORY.foundationSub}</p>
          </Reveal>
          <Reveal delay={150} className="col-span-5 self-end space-y-8">
            <dl className="grid grid-cols-2 gap-6 border-t border-border pt-6">
              <div>
                <dt className="font-display text-4xl text-primary">$997</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Website Build</dd>
              </div>
              <div>
                <dt className="font-display text-4xl text-primary">$99/mo</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Website Care</dd>
              </div>
            </dl>
            <Button size="lg" className="w-full" asChild>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer">{STORY.ctaCall}</a>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* 7. Aerial market: sticky photo, copy scrolls over it */}
      <section className="relative">
        <div className="sticky top-0 h-[100svh]">
          <MarketMap className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/60" />
        </div>
        <div className="relative -mt-[100svh] flex min-h-[150svh] flex-col justify-end px-10 pb-24 lg:px-16">
          <Reveal className="max-w-xl space-y-5">
            <h2 className="font-display text-5xl lg:text-6xl font-light leading-[1.05]">
              {STORY.marketA}
              <br />
              <span className="text-accent">{STORY.marketB}</span>
            </h2>
            <p className="max-w-md text-sm text-primary-foreground/70">{STORY.marketNote}</p>
          </Reveal>
        </div>
      </section>

      {/* 8. Homeowner */}
      <section className="relative grid min-h-[90svh] grid-cols-12 items-center">
        <div className="absolute inset-0">
          <Photo slot={IMG.homeowner} />
          <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/60 to-transparent" />
        </div>
        <div className="relative col-span-6 col-start-7 space-y-8 px-10 py-24 lg:px-16">
          <Reveal as="p" className="font-display text-3xl lg:text-4xl font-light leading-tight">{STORY.homeowner}</Reveal>
          <Reveal as="p" delay={150} className="font-display text-4xl lg:text-5xl font-light">
            Attention. <span className="text-accent">Interest.</span>
          </Reveal>
          <Reveal dir="right" delay={300}>
            <InquiryCard className="max-w-xs" />
          </Reveal>
        </div>
      </section>

      {/* 9. Capture -> Qualify -> Focus, then close */}
      <section className="grid grid-cols-12 gap-10 px-10 py-32 lg:px-16">
        <div className="col-span-6">
          <QualifyRail />
        </div>
        <div className="col-span-6 flex flex-col justify-between gap-12">
          <Reveal as="p" className="text-lg font-light leading-relaxed text-primary-foreground/80">{STORY.qualifyBody}</Reveal>
          <Reveal className="space-y-3">
            <p className="font-display text-4xl lg:text-5xl font-light">
              Follow up.
              <br />
              <span className="text-accent">Conversation.</span>
            </p>
            <p className="text-primary-foreground/70">{STORY.followBody}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-primary-foreground/10 px-10 py-28 lg:px-16">
        <Reveal className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/50">{STORY.systemLabel}</p>
          <p className="font-display text-5xl font-semibold tracking-[0.1em]">REVORA</p>
          <p className="text-primary-foreground/70">{STORY.signoff}</p>
          <p className="text-sm text-primary-foreground/60">{STORY.systemTerms}</p>
          <Button variant="hero" size="xl" asChild>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer">{STORY.ctaCall}</a>
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
