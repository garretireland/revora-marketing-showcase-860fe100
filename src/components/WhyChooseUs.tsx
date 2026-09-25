import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Two clear paths: a website first, or a full growth system when you're ready",
  "Straightforward pricing, no hidden fees",
  "You fund and control your own ad spend directly. We never mark it up",
  "Growth engagements are month-to-month, with no setup fee",
  "Built around your business's actual bottleneck, not a one-size-fits-all package",
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                  How Revora
                  <span className="text-accent"> Operates</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Revora is built from the operator's side. Marketing has to connect to the jobs you actually want to win, not just clicks and impressions, so we start with what your business actually needs.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group"
                  >
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                    <span className="text-foreground text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Terms card */}
            <div className="bg-gradient-hero rounded-2xl p-12 shadow-elegant text-center space-y-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <ShieldCheck className="h-8 w-8 text-accent" />
                <h3 className="text-2xl font-semibold text-primary-foreground">
                  How We're Structured
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">No Setup Fee</div>
                  <div className="text-primary-foreground/90">On growth engagements</div>
                </div>

                <div className="h-px bg-primary-foreground/20" />

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">Month-to-Month</div>
                  <div className="text-primary-foreground/90">No long-term contracts</div>
                </div>

                <div className="h-px bg-primary-foreground/20" />

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">You Control the Spend</div>
                  <div className="text-primary-foreground/90">Ad budget is funded directly by you</div>
                </div>
              </div>

              <p className="text-sm text-primary-foreground/90 italic pt-4 border-t border-primary-foreground/20">
                Straightforward terms, explained upfront. No fine print.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="xl" className="group max-w-full whitespace-normal text-center h-auto py-4" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a 15-Minute Discovery Call
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
