import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, DollarSign, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const caseStudies = [
  {
    business: "Elite Roofing Co.",
    industry: "Roofing Services",
    challenge: "Struggled to generate consistent leads, relied heavily on referrals and outdated marketing methods.",
    results: {
      leads: "47 qualified leads/month",
      revenue: "$18,500 in new monthly revenue",
      roi: "340% ROI in 90 days"
    },
    testimonial: "Revora completely transformed our lead generation. We went from feast or famine to predictable, consistent growth.",
    rating: 5
  },
  {
    business: "Perfect Home HVAC",
    industry: "HVAC Services",
    challenge: "High ad spend with poor lead quality and low conversion rates from previous marketing agency.",
    results: {
      leads: "52 qualified leads/month",
      revenue: "$22,000 in new monthly revenue",
      roi: "425% ROI in 90 days"
    },
    testimonial: "Finally, a marketing partner who actually delivers on their promises. The quality of leads has been outstanding.",
    rating: 5
  },
  {
    business: "Pro Plumbing Solutions",
    industry: "Plumbing Services",
    challenge: "New business with zero online presence, needed to establish market presence quickly.",
    results: {
      leads: "38 qualified leads/month",
      revenue: "$14,200 in new monthly revenue",
      roi: "290% ROI in 90 days"
    },
    testimonial: "As a new business, we needed results fast. Revora helped us go from zero to profitable in under 3 months.",
    rating: 5
  },
  {
    business: "Premier Landscaping",
    industry: "Landscaping Services",
    challenge: "Seasonal business looking to extend revenue throughout the year and reduce dependency on spring rush.",
    results: {
      leads: "43 qualified leads/month",
      revenue: "$16,800 in new monthly revenue",
      roi: "365% ROI in 90 days"
    },
    testimonial: "The targeting was so precise, we're now getting high-value commercial projects year-round, not just residential spring work.",
    rating: 5
  },
  {
    business: "All-Star Auto Detailing",
    industry: "Auto Detailing",
    challenge: "Limited budget and needed to compete with larger, established competitors in the market.",
    results: {
      leads: "34 qualified leads/month",
      revenue: "$11,500 in new monthly revenue",
      roi: "310% ROI in 90 days"
    },
    testimonial: "Revora showed us that you don't need a massive budget to compete—you just need the right strategy.",
    rating: 5
  }
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-hero opacity-95 z-10" />
          <img 
            src={heroBackground} 
            alt="Case Studies" 
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
              Real Results from Real Businesses
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              See how local service businesses are achieving predictable growth with our proven Facebook Ads system.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-accent">$82K+</div>
              <div className="text-muted-foreground">Total New Monthly Revenue</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-accent">214</div>
              <div className="text-muted-foreground">Qualified Leads/Month</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-accent">346%</div>
              <div className="text-muted-foreground">Average ROI</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-accent">90 Days</div>
              <div className="text-muted-foreground">Average Time to Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {caseStudies.map((study, index) => (
              <div 
                key={index}
                className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 space-y-6 hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{study.business}</h3>
                    <p className="text-accent text-lg">{study.industry}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(study.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">The Challenge</h4>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{study.results.leads}</div>
                        <div className="text-sm text-muted-foreground">Qualified Leads</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{study.results.revenue}</div>
                        <div className="text-sm text-muted-foreground">New Revenue</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{study.results.roi}</div>
                        <div className="text-sm text-muted-foreground">Return on Investment</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 border border-border/30 rounded-lg p-6">
                    <p className="text-foreground italic">"{study.testimonial}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join these businesses and start generating qualified leads and predictable revenue in 90 days.
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

export default CaseStudies;