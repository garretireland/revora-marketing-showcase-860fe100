import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Target, Mail, Calendar, GraduationCap, BarChart3, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Facebook,
    title: "Facebook Ads Management",
    description: "Done-for-you ad campaigns with proven creative, targeting, and tracking that deliver results.",
  },
  {
    icon: Target,
    title: "Lead Generation System",
    description: "Guaranteed 30-50 qualified leads per month, not just clicks or impressions.",
  },
  {
    icon: Mail,
    title: "Automated Follow-Up",
    description: "Email and SMS automation that keeps your leads warm and moving through your pipeline.",
  },
  {
    icon: Calendar,
    title: "Booking & Scheduling",
    description: "Seamless tools to get prospects on your calendar and into your sales process.",
  },
  {
    icon: GraduationCap,
    title: "Sales Follow-Up & Scripts",
    description: "Proven conversion systems and scripts to help you close more deals and maximize ROI.",
  },
  {
    icon: BarChart3,
    title: "Weekly Reports & Coaching",
    description: "Transparent performance tracking with weekly reports and monthly strategy calls.",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-background" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Complete Lead Generation
            <span className="text-accent"> System</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to generate, nurture, and convert qualified leads into paying customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <service.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="xl" className="group" asChild>
            <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
              Book Your Call Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
