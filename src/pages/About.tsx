import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
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
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-accent leading-tight">
              About Revora Marketing
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              We help local service businesses build a stronger online presence and create more opportunities for work, starting with a website, and building toward a full growth system when it makes sense.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground text-center mb-12">
              Our <span className="text-accent">Story</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Revora Marketing was founded with a simple belief: local service businesses deserve the same quality of online presence and customer acquisition that bigger companies use, without the complexity or the agency runaround.
              </p>
              <p>
                We start every relationship the same way: figuring out what's actually holding a business back. For a lot of local service businesses, that's a website that doesn't represent the quality of their work, so we start there, with a professional website, built fast, for a flat price.
              </p>
              <p>
                For businesses ready for more, where landing just a few extra jobs a month would easily cover the cost, we build the customer-acquisition system behind the website: paid advertising, lead capture, pre-qualification, and follow-up, so you get to good opportunities while they're still interested.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground text-center">
              What We <span className="text-accent">Stand For</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Target className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Practical, Not Theoretical</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We think in terms of jobs booked and calls answered, not clicks and impressions dressed up as KPIs.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Users className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Built From the Operator's Side</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Garret runs a local service business himself. Revora is built around how those businesses actually operate, not generic agency theory.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Straightforward Pricing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A $997 website and $99/month Website Care, both fixed and public. Growth engagements are no-setup-fee and month-to-month. Investment is set after we understand your business, not pulled from a generic price list.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Award className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Honest by Default</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We won't promise results we can't back. Growth engagements are month-to-month with no setup fee, and you control your own ad spend directly.
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
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Let's talk about what's actually holding your business back online.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a 15-Minute Discovery Call
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