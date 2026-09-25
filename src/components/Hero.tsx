import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// V2 hero structural system. Three independently swappable layers:
//   Layer A - real-world backdrop (currently a graded placeholder panel,
//             not a photo -- see the comment on that div below).
//   Layer B - the orange connective line (pure SVG/CSS, no media asset).
//   Layer C - the website-composition panel (currently a wireframe
//             placeholder, never a fabricated "screenshot").
// Desktop-only (hidden below `lg`): mobile keeps the plain gradient
// background with zero extra layers, zero video/parallax, per the
// approved blueprint's mobile-first-performance rule.
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Base gradient -- unchanged on every viewport, this alone is the
          entire mobile background. */}
      <div className="absolute inset-0 z-0 bg-gradient-hero" />

      {/* Layer A: real-world backdrop.
          PLACEHOLDER -- this is a graded color panel, not a photo. The
          blueprint calls for a real or Higgsfield-generated establishing
          shot of real trade work here (see V2 blueprint item 5). Swapping
          it in is a one-line change: replace this div's background with
          an <img>/<video> using the same absolute positioning, nothing
          else in this file needs to change. */}
      <div className="absolute inset-y-0 right-0 w-[46%] z-0 hidden lg:block overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210,45%,24%)] via-[hsl(210,50%,14%)] to-[hsl(210,52%,9%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 25% 20%, white 0%, transparent 45%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0px, transparent 38px, hsl(0 0% 100%) 39px)",
          }}
        />
      </div>

      {/* Layer B: the orange connective line -- pure SVG, pathLength=1 so
          the draw animation is unit-independent of the actual path shape.
          Represents the link between real-world craftsmanship and the
          digital presentation in Layer C, not a literal object. */}
      <svg
        className="absolute inset-0 z-[5] hidden lg:block pointer-events-none"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 40 55 C 52 55, 58 40, 72 40"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="0.35"
          strokeLinecap="round"
          pathLength={1}
          className="animate-line-draw"
        />
      </svg>

      {/* Layer C: website-composition panel.
          PLACEHOLDER -- a wireframe representation, deliberately abstract
          so it is never mistaken for a real client site. Replace the
          contents of the white panel below with an actual page-preview
          image/render once one exists; the frame/shadow treatment and
          arrival animation do not need to change. */}
      <div
        className="absolute right-[6%] top-1/2 -translate-y-1/2 z-10 hidden lg:block w-[280px] animate-panel-in"
        aria-hidden="true"
      >
        <div className="rounded-xl border border-white/10 bg-white shadow-elegant p-4">
          <div className="h-2 w-1/3 rounded bg-primary/15 mb-4" />
          <div className="h-20 rounded-lg bg-gradient-accent/15 mb-4" />
          <div className="space-y-1.5 mb-4">
            <div className="h-1.5 w-full rounded bg-muted" />
            <div className="h-1.5 w-5/6 rounded bg-muted" />
            <div className="h-1.5 w-2/3 rounded bg-muted" />
          </div>
          <div className="h-7 w-24 rounded bg-accent" />
        </div>
        <p className="mt-2 text-center text-[10px] italic text-primary-foreground/40">
          Preview asset pending final design
        </p>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Headline */}
          <h1 className="animate-fade-in font-display text-5xl md:text-7xl font-semibold text-primary-foreground leading-tight tracking-tight">
            Websites &amp; Customer Acquisition
            <br />
            <span className="text-accent">for Local Service Businesses</span>
          </h1>

          <div className="animate-fade-in [animation-delay:150ms] space-y-8">
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-light leading-relaxed">
              A professional website that makes your business look as good as your work. When it's the right fit, we can also build a customer-acquisition system to bring in more of the jobs you actually want.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Button variant="hero" size="xl" className="group" asChild>
                <a href="/#services">
                  See the Website Offer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                  Book a 15-Minute Discovery Call
                </a>
              </Button>
            </div>

            {/* Offer indicators */}
            <div className="pt-8 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">$997</div>
                <div className="text-sm text-primary-foreground/80">Professional Website, One-Time</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">$99/mo</div>
                <div className="text-sm text-primary-foreground/80">Ongoing Website Care</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">No Lock-In</div>
                <div className="text-sm text-primary-foreground/80">Straightforward Terms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
