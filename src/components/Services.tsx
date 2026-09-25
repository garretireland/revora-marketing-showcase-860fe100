import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const websiteFeatures = [
  { icon: Globe, text: "A professional website built to represent your business well online" },
  { icon: ShieldCheck, text: "Website Care keeps your site hosted, monitored, and updated" },
];

const growthSteps = [
  { title: "Put an offer in front of the right homeowners", description: "For the jobs you actually want more of." },
  { title: "Interested homeowners raise their hand", description: "No cold outreach. They come to you." },
  { title: "We capture and pre-qualify the leads", description: "Weeding out the ones that aren't a fit." },
  { title: "You talk to good opportunities while they're still interested", description: "Follow-up is set up behind the scenes so nothing goes cold." },
];

// V2: a restrained, abstract stand-in for the four-step mechanism above --
// simple connected geometry, never a literal bullhorn/funnel/dashboard
// icon. Purely decorative reinforcement; the actual text list below it is
// what carries comprehension.
function GrowthMechanismDiagram() {
  return (
    <svg viewBox="0 0 260 40" className="w-full h-10" aria-hidden="true">
      <line x1="20" y1="20" x2="240" y2="20" stroke="hsl(var(--primary-foreground) / 0.25)" strokeWidth="1.5" />
      {[20, 93, 166, 240].map((x, i) => (
        <circle key={i} cx={x} cy={20} r={i === 3 ? 6 : 4.5} fill="hsl(var(--accent))" opacity={0.35 + i * 0.2} />
      ))}
    </svg>
  );
}

// V2: the Website card's editorial preview. Deliberately abstract
// wireframe content, never a fabricated "real" screenshot -- replace the
// inner panel with an actual page-preview image/render once one exists.
function WebsitePreviewPanel() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/60 bg-background shadow-soft">
      <div className="h-40 overflow-hidden p-4">
        <div className="animate-[panel-scroll_9s_ease-in-out_infinite] motion-reduce:animate-none space-y-3">
          <div className="h-2 w-1/3 rounded bg-primary/15" />
          <div className="h-16 rounded-lg bg-gradient-accent/15" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded bg-muted" />
            <div className="h-1.5 w-5/6 rounded bg-muted" />
          </div>
          <div className="h-6 w-20 rounded bg-accent" />
          <div className="h-16 rounded-lg bg-secondary" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded bg-muted" />
            <div className="h-1.5 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </div>
      <p className="border-t border-border/60 bg-secondary/60 px-3 py-1.5 text-center text-[10px] italic text-muted-foreground">
        Preview asset pending final design
      </p>
    </div>
  );
}

const Services = () => {
  const { ref: gridRef, inView } = useInView<HTMLDivElement>();

  return (
    <section className="py-24 bg-background" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            Two Ways We
            <span className="text-accent"> Help</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A professional website is the foundation. When you're ready for more opportunities, we build the customer-acquisition system behind it.
          </p>
        </div>

        <div ref={gridRef} className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* WEBSITE OFFER -- lighter surface, editorial preview */}
          <Card
            className={cn(
              "p-8 md:p-10 border-border/50 bg-card space-y-6 transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
            )}
          >
            <WebsitePreviewPanel />
            <div className="space-y-2">
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Website</h3>
              <p className="text-muted-foreground leading-relaxed">
                A professional website is the foundation. It's how your business looks the moment someone checks you out online.
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-accent">$997</span>
              <span className="text-muted-foreground">one-time</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">$99</span>
              <span className="text-muted-foreground">a month for Website Care</span>
            </div>

            <ul className="space-y-3 pt-2">
              {websiteFeatures.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item.text}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="w-full group" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Get Your Website
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </Card>

          {/* GROWTH SYSTEM OFFER -- deeper, navy-tinted surface: the upper tier */}
          <Card
            className={cn(
              "p-8 md:p-10 border-0 bg-gradient-hero text-primary-foreground shadow-elegant space-y-6 transition-all duration-700 delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
            )}
          >
            <GrowthMechanismDiagram />
            <div className="space-y-2">
              <h3 className="font-display text-2xl md:text-3xl font-semibold">Growth System</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                For businesses ready for more opportunities, we build the customer-acquisition system behind the website: paid advertising, lead capture, qualification, and follow-up.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5">
              <span className="text-sm font-semibold text-accent">Founding Growth Client Program</span>
            </div>
            <div className="text-sm text-primary-foreground/70">No setup fee. Month-to-month. Investment is set after we understand your business.</div>

            <ol className="space-y-3 pt-2">
              {growthSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-primary-foreground/70">{step.description}</div>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-xs text-primary-foreground/60">
              We're currently taking on a limited number of founding growth clients. Best fit for higher-value trades: roofing, concrete, HVAC installs, remodeling, and similar work, where a few closed jobs comfortably justify the investment.
            </p>

            <Button
              variant="outline"
              size="lg"
              className="w-full group bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                See If You Qualify
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
