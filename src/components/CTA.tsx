import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground">
            Need a Better Website?
            <span className="text-accent"> Or Ready for More Opportunities?</span>
          </h2>

          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            In a 15-minute call, we'll figure out which path, website, growth system, or both, actually fits your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                Book a 15-Minute Discovery Call
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <a href="/guarantee">
                See How We Work
              </a>
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70 pt-4">
            ✓ Website pricing is public  •  ✓ Two paths, pick what fits
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
