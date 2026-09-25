import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import revoraLogo from "@/assets/revora-logo.png";
import heroBackground from "@/assets/hero-bg.jpg";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-hero opacity-95 z-10" />
          <img 
            src={heroBackground} 
            alt="Contact Revora Marketing" 
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
              Let's Talk Growth
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Whether you need a website or a full growth system, book a discovery call or reach out directly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & CTA */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl font-semibold text-foreground mb-6">
                  Get in <span className="text-accent">Touch</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Whether you have questions or you're ready to get started, we're here to help. 
                  Reach out and let's discuss how we can help your business grow.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <a href="tel:5197179806" className="text-muted-foreground hover:text-accent transition-colors">
                      (519) 717-9806
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a href="mailto:garret@revoramarketingagency.com" className="text-muted-foreground hover:text-accent transition-colors break-all">
                      garret@revoramarketingagency.com
                    </a>
                  </div>
                </div>

              </div>

              <div className="pt-6">
                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-muted-foreground">Saturday - Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            {/* Schedule Call CTA */}
            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 space-y-6 h-fit">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
                  <Calendar className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="font-display text-3xl font-semibold text-foreground">
                  Book a 15-Minute Discovery Call
                </h3>
                <p className="text-muted-foreground text-lg">
                  In just 15 minutes, we'll talk through your business and figure out which path, website, growth system, or both, actually makes sense.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>No pressure, no commitments</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>See which path fits your business</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>Website pricing is public. Growth investment is discussed on the call</span>
                </div>
              </div>

              <Button variant="default" size="xl" className="w-full" asChild>
                <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                  Book a 15-Minute Discovery Call
                </a>
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Typically responds within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;