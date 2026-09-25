import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, BarChart3, Wallet, Calendar, ShieldCheck, Globe, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const Guarantee = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
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
        <div className="relative z-20 container mx-auto px-6 py-20">
          {/* Back button and Logo */}
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

          <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
            {/* Main Headline */}
            <div className="text-center space-y-6">
              <h1 className="font-display text-5xl md:text-7xl font-semibold text-accent leading-tight">
                How We Work
              </h1>
            </div>

            {/* Straightforward Terms Card */}
            <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 md:p-12 shadow-elegant">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-accent mb-6">
                Straightforward, No Fine Print
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                We don't promise results we can't back. Here's exactly how the website build and the growth system work,
                and what's actually included.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Clear Reporting */}
              <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center space-y-6 hover:border-accent/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <BarChart3 className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent">
                  Clear Reporting
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  On growth engagements, you see real numbers, not vanity metrics dressed up to look good.
                </p>
              </div>

              {/* You Control the Spend */}
              <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center space-y-6 hover:border-accent/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <Wallet className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent">
                  You Control the Spend
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  Ad budget is funded directly by you to Meta. We never take a cut or mark it up.
                </p>
              </div>

              {/* No Lock-In */}
              <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center space-y-6 hover:border-accent/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent">
                  No Lock-In
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  No setup fee, month-to-month. About 90 days is a realistic window to evaluate whether it's working, not a guaranteed-results deadline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                What's Included in
                <span className="text-accent"> Each Path</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Two offers, priced and scoped separately.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Globe className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Website: $997 one-time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A professional website built for your business, plus $99/month Website Care to keep it hosted, monitored, and updated.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Target className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Growth System: Founding Client Program</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ad management, lead capture, pre-qualification, and follow-up. We're opening a limited number of founding positions for qualified businesses. Investment and scope are set after we understand your business. No setup fee, month-to-month.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">A Realistic Timeline</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Around 90 days is a fair window to see whether a growth engagement is working for your business. It's not a contractual lock-in, and not a promise of a specific result by that date.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <ShieldCheck className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Flexible Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No long-term contracts on the growth system. No hidden fees on either offer. Cancel a month-to-month growth engagement anytime.
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
              Ready to
              <span className="text-accent"> Talk It Through?</span>
            </h2>

            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Schedule a 15-minute discovery call to figure out which path, website, growth system, or both, makes sense for your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button variant="hero" size="xl" className="group" asChild>
                <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a 15-Minute Discovery Call
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/70 pt-4">
              ✓ Website pricing is public  •  ✓ No obligation to continue
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Guarantee;
