import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake, ArrowRight } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-24 bg-warm">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Built for Local Service
              <span className="text-accent"> Businesses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We work with a small number of local service businesses at a time, so every engagement gets real attention.
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-left space-y-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center mb-2">
              <Handshake className="h-7 w-7 text-accent-foreground" />
            </div>
            <p className="text-foreground text-lg leading-relaxed">
              We've run real lead-generation advertising, including for Korporal Images, generating multiple leads, and we're now opening a limited number of Founding Growth Client positions for qualified local service businesses.
            </p>
          </div>

          <div className="pt-4">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/case-studies">
                Read Our Approach
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
