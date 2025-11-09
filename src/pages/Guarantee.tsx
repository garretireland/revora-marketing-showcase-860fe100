import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Star, HandCoins, Lock, BarChart3, Calendar, Shield } from "lucide-react";
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
              <h1 className="text-5xl md:text-7xl font-bold text-accent leading-tight">
                The Revora Guarantee
              </h1>
            </div>

            {/* 90-Day Guarantee Card */}
            <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 md:p-12 shadow-elegant">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
                90-Day Growth Guarantee
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Add $10k+ in new monthly revenue or get 30-50 qualified leads in just 90 days — Guaranteed. 
                Our proven Facebook Ads system delivers predictable leads and consistent revenue growth, or you don't pay.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Measurable Results */}
              <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center space-y-6 hover:border-accent/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <Star className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent">
                  Measurable Results
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  We track every metric that matters. You'll see exactly where every lead comes from and which 
                  campaigns drive the most revenue for your business.
                </p>
              </div>

              {/* Money-Back Promise */}
              <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center space-y-6 hover:border-accent/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <HandCoins className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent">
                  Money-Back Promise
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  Don't see results in 90 days? We continue working free until you do, or we issue a full refund. 
                  Your success is non-negotiable.
                </p>
              </div>

              {/* Zero Risk */}
              <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center space-y-6 hover:border-accent/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <Lock className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent">
                  Zero Risk
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  No long-term contracts. No hidden fees. Just pure, predictable revenue growth. If we don't deliver, 
                  you don't pay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                What's Included in
                <span className="text-accent"> Your Guarantee</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to generate qualified leads and convert them into revenue—backed by our risk-free promise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Complete Lead Generation System</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Done-for-you Facebook Ads campaigns, automated follow-up sequences, booking tools, 
                  and weekly performance reports—all designed to deliver 30-50 qualified leads per month.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Sales Follow-Up & Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Proven conversion scripts, sales follow-up, and monthly strategy calls to help you close more 
                  deals and maximize your ROI from every lead we deliver.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Shield className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">90-Day Performance Promise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We guarantee 30-50 qualified leads or $10K+ in new monthly revenue within 90 days. 
                  If we don't deliver, you don't pay—and we keep working until we do.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Lock className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Flexible Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No long-term contracts. No hidden setup fees. Cancel anytime if you're not satisfied. 
                  Your success is our only commitment.
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
              Ready to See
              <span className="text-accent"> Real Results?</span>
            </h2>
            
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Schedule a 15-minute strategy call to see if your business qualifies for our 
              guaranteed lead generation system—completely risk-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button variant="hero" size="xl" className="group" asChild>
                <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Free Strategy Call
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/70 pt-4">
              ✓ No pressure, no commitments  •  ✓ Risk-free guarantee  •  ✓ Results in 90 days
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Guarantee;
