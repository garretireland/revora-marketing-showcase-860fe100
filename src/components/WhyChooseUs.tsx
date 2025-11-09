import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Guaranteed 30-50 qualified leads per month within 90 days",
  "Complete done-for-you system—ads, automation, and follow-up",
  "Risk-free guarantee: If we don't deliver, you don't pay",
  "Focus on conversions, not just clicks or impressions",
  "Weekly reports and monthly strategy calls included",
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
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Why Choose
                  <span className="text-accent"> Revora?</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Unlike agencies that sell clicks, we deliver qualified leads and give you 
                  the complete system to convert them into revenue—backed by a satisfaction guarantee.
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

            {/* Right column - Stats card */}
            <div className="bg-gradient-hero rounded-2xl p-12 shadow-elegant text-center space-y-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-accent" />
                <h3 className="text-2xl font-semibold text-primary-foreground">
                  Risk-Free Guarantee
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-accent">30-50</div>
                  <div className="text-primary-foreground/90">Qualified Leads Per Month</div>
                </div>
                
                <div className="h-px bg-primary-foreground/20" />
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-accent">90 Days</div>
                  <div className="text-primary-foreground/90">To Guaranteed Results</div>
                </div>
                
                <div className="h-px bg-primary-foreground/20" />
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-accent">$10K+</div>
                  <div className="text-primary-foreground/90">Monthly Revenue Increase</div>
                </div>
              </div>
              
              <p className="text-sm text-primary-foreground/90 italic pt-4 border-t border-primary-foreground/20">
                If we don't deliver, you don't pay—simple as that.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Get Your Free Strategy Session
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
