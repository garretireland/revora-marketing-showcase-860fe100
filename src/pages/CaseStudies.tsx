import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Handshake, Globe, Target, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const principles = [
  {
    icon: Search,
    title: "We Start With Your Bottleneck",
    description: "Not every business needs ads. Some need a better website first. We figure out which one actually moves the needle for you before recommending anything.",
  },
  {
    icon: Globe,
    title: "Website First, Growth When Ready",
    description: "The website is the foundation everyone can use. The growth system is for businesses where landing just a few extra jobs a month would easily cover the investment.",
  },
  {
    icon: Target,
    title: "Honest Mechanics, No Overselling",
    description: "We put an offer for the jobs you want more of in front of the right homeowners. Interested people raise their hand. We pre-qualify them, filter out poor fits, and set up the follow-up, so you get to good opportunities while they're still interested.",
  },
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
            alt="Our Approach"
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
              Our Approach
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Revora is built from the operator's side, working with local service businesses. Here's how we actually think about growing one.
            </p>
          </div>
        </div>
      </section>

      {/* Where We Are Today */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-2xl p-8 md:p-12 space-y-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Handshake className="h-7 w-7 text-accent-foreground" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Real Experience, Stated Plainly</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Revora has run lead-generation advertising for Korporal Images, generating multiple leads for their business.
              We're opening a limited number of Founding Growth Client positions for qualified local service businesses right now.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                How We <span className="text-accent">Think About It</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {principles.map((p, index) => (
                <div
                  key={index}
                  className="bg-card border border-border/50 rounded-2xl p-8 space-y-4 hover:shadow-elegant transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                    <p.icon className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground">
              Want to Be One of Our Founding Clients?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              We're taking on a limited number right now. Let's see if it's a fit.
            </p>
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a 15-Minute Discovery Call
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
