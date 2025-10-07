import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero opacity-95 z-10" />
        <img 
          src={heroBackground} 
          alt="Business growth visualization" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src={revoraLogo} 
              alt="Revora Marketing" 
              className="h-16 mx-auto"
            />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight tracking-tight">
            Add $10K+ Monthly Revenue
            <br />
            <span className="text-accent">in 90 Days</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-light leading-relaxed">
            We help local service businesses generate 30-50 qualified leads per month using proven Facebook Ads—or you don't pay.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button variant="hero" size="xl" className="group">
              Schedule Free Strategy Call
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              See How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">30-50</div>
              <div className="text-sm text-primary-foreground/80">Qualified Leads/Month</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">90 Days</div>
              <div className="text-sm text-primary-foreground/80">To $10K+ Revenue</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">100%</div>
              <div className="text-sm text-primary-foreground/80">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full p-1">
          <div className="w-1 h-3 bg-accent rounded-full mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
