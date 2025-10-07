import { Card } from "@/components/ui/card";
import { Search, TrendingUp, Target, Users, BarChart3, Globe } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Local SEO",
    description: "Dominate local search results and get found by customers in your area when they need you most.",
  },
  {
    icon: TrendingUp,
    title: "Paid Advertising",
    description: "Strategic Google and social media ads that deliver qualified leads and maximize your marketing budget.",
  },
  {
    icon: Target,
    title: "Lead Generation",
    description: "Proven systems that consistently bring high-quality leads directly to your business.",
  },
  {
    icon: Users,
    title: "Social Media Marketing",
    description: "Build a strong online presence and engage with your community across all platforms.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Clear, actionable insights that show exactly how your marketing investments are performing.",
  },
  {
    icon: Globe,
    title: "Website Design",
    description: "Beautiful, conversion-focused websites that turn visitors into customers.",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-background" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Comprehensive Marketing
            <span className="text-accent"> Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything your local service business needs to grow, all under one roof.
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
      </div>
    </section>
  );
};

export default Services;
