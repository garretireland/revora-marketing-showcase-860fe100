import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-hero opacity-95 z-10" />
          <img 
            src={heroBackground} 
            alt="About Revora Marketing" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 container mx-auto px-6 py-20">
          <div className="mb-12 flex items-center justify-between max-w-6xl mx-auto">
            <Button variant="ghost" size="lg" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <img 
              src={revoraLogo} 
              alt="Revora Marketing" 
              className="h-12"
            />
          </div>

          <div className="max-w-6xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-accent leading-tight">
              About Revora Marketing
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              We're on a mission to help local service businesses predictably scale their revenue through data-driven Facebook Ads.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-12">
              Our <span className="text-accent">Story</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Revora Marketing was founded with a simple belief: local service businesses deserve the same high-quality marketing strategies that enterprise companies use—without the complexity or massive budgets.
              </p>
              <p>
                After working with hundreds of local businesses and seeing firsthand how difficult it is to generate consistent, qualified leads, we developed a proven system that delivers results in 90 days or less.
              </p>
              <p>
                Our Facebook Ads methodology isn't just about getting clicks—it's about generating real revenue. Every campaign we run is built around one goal: adding $10K+ in monthly revenue to your business through qualified leads that actually convert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center">
              What We <span className="text-accent">Stand For</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Target className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Results-Driven</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We don't believe in vanity metrics. Our focus is on qualified leads and revenue growth—the numbers that actually matter to your bottom line.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Users className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Partnership Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your success is our success. We work alongside you as partners, not just vendors, to ensure you get the results you deserve.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Predictable Growth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No guesswork. Our proven system delivers 30-50 qualified leads per month and $10K+ in new revenue within 90 days—guaranteed.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Award className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Risk-Free Promise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We back every campaign with our 90-day guarantee. If we don't deliver results, we keep working for free or refund your investment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Let's discuss how we can help your business achieve predictable, profitable growth.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Schedule Your Free Strategy Call
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;