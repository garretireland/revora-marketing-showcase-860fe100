import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Ready to Add $10K+ in
            <span className="text-accent"> Monthly Revenue?</span>
          </h2>
          
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Schedule a 15-minute strategy call to see if your business qualifies for our 
            guaranteed lead generation system—completely risk-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button variant="hero" size="xl" className="group">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Free Strategy Call
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Learn About Our Guarantee
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70 pt-4">
            ✓ No pressure, no commitments  •  ✓ Risk-free guarantee  •  ✓ Results in 90 days
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
