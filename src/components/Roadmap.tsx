import { Search, Hammer, Eye, Rocket, Calculator, Layers, RefreshCw, ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const websiteSteps = [
  { icon: Search, title: "Understand Your Business", description: "What you do, who you serve, and what should stand out." },
  { icon: Hammer, title: "Build the Site", description: "A professional website built around your business." },
  { icon: Eye, title: "Review & Refine", description: "You review it, we adjust it." },
  { icon: RefreshCw, title: "Launch & Care", description: "Site goes live. Website Care keeps it hosted, monitored, and updated." },
];

const growthSteps = [
  { icon: Calculator, title: "Understand the Economics", description: "Which jobs you actually want more of, and what they're worth to you." },
  { icon: Layers, title: "Build the Offer & System", description: "The ad, the landing page, and the follow-up behind them." },
  { icon: Rocket, title: "Launch", description: "Campaigns go live, funded directly by you." },
  { icon: RefreshCw, title: "Learn & Refine", description: "We adjust based on what's actually happening, not guesswork." },
];

type Step = { icon: LucideIcon; title: string; description: string };

// V2: each step observes its own visibility so the active step highlights
// as the page scrolls past it, a lightweight "scroll progression" rather
// than a static list. Reduced-motion users get the same information
// immediately, useInView resolves to true instantly for them.
function TimelineStep({ step, isLast }: { step: Step; isLast: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });

  return (
    <div ref={ref} className="relative flex items-start gap-5 group">
      <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-elegant transition-all duration-500 group-hover:scale-110",
            inView ? "bg-gradient-accent ring-4 ring-accent/25" : "bg-primary/15",
          )}
        >
          <step.icon className={cn("h-6 w-6 transition-colors duration-500", inView ? "text-accent-foreground" : "text-primary/50")} />
        </div>
        {!isLast && (
          <div
            className={cn("w-0.5 flex-1 mt-2 mb-2 transition-colors duration-500 min-h-[2rem]", inView ? "bg-accent/50" : "bg-border")}
          />
        )}
      </div>
      <div className="flex-1 bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-elegant transition-all duration-300 mb-2">
        <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

function TimelineColumn({ heading, steps }: { heading: string; steps: Step[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-accent uppercase tracking-wide text-center lg:text-left">
        {heading}
      </h3>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <TimelineStep key={index} step={step} isLast={index === steps.length - 1} />
        ))}
      </div>
    </div>
  );
}

const Roadmap = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              How It
              <span className="text-accent"> Actually Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Two paths, depending on where your business is at. We move quickly and adjust based on what's actually happening, not empty promises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <TimelineColumn heading="Website Path" steps={websiteSteps} />
            <TimelineColumn heading="Growth Path" steps={growthSteps} />
          </div>

          <div className="mt-16 text-center">
            <Button variant="hero" size="xl" className="group" asChild>
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

export default Roadmap;
