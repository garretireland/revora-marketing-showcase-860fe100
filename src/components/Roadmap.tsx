import { Calendar, Search, Rocket, Zap, TrendingUp, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const roadmapSteps = [
  {
    icon: Calendar,
    week: "Week 0",
    title: "Onboarding",
    description: "Setup, access, and goal alignment.",
  },
  {
    icon: Search,
    week: "Week 1",
    title: "Audit & Strategy",
    description: "Research, offer optimization, KPI setup.",
  },
  {
    icon: Rocket,
    week: "Week 2",
    title: "Creative & Tracking",
    description: "Launch ads, pixel tracking, landing pages/lead forms.",
  },
  {
    icon: Zap,
    week: "Week 3",
    title: "Sales Systems",
    description: "Follow-up automations, booking integration, sales scripts.",
  },
  {
    icon: Rocket,
    week: "Week 4",
    title: "Launch & Testing",
    description: "Campaigns live, early optimization.",
  },
  {
    icon: TrendingUp,
    week: "Weeks 5–8",
    title: "Optimization & Scaling",
    description: "Weekly reports, conversion coaching, ad scaling.",
  },
  {
    icon: Trophy,
    week: "Weeks 9–12",
    title: "Ramp & Handoff",
    description: "Scale proven campaigns, final audit, growth plan.",
  },
];

const Roadmap = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Your 90-Day
              <span className="text-accent"> Roadmap to Results</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven, step-by-step process to deliver qualified leads and revenue growth in just 90 days.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-accent hidden md:block" />

            <div className="space-y-8">
              {roadmapSteps.map((step, index) => (
                <div 
                  key={index}
                  className="relative flex items-start gap-6 group"
                >
                  {/* Icon circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center shadow-elegant transition-transform group-hover:scale-110">
                      <step.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                          {step.week}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center space-y-6">
            <p className="text-lg font-semibold text-foreground">
              🎯 Results Guaranteed Within 90 Days or You Don't Pay
            </p>
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Schedule Free Strategy Call
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
