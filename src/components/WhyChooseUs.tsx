import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Proven track record with 150+ local businesses",
  "Transparent reporting and communication",
  "Custom strategies tailored to your market",
  "Dedicated account manager for your business",
  "Flexible month-to-month contracts",
  "Results-driven approach with clear KPIs",
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Why Partner With
                  <span className="text-accent"> Revora?</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  We're not just another marketing agency. We're your growth partner, 
                  dedicated to your success with the same passion you bring to your business.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 group"
                  >
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                    <span className="text-foreground text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Stats card */}
            <div className="bg-gradient-hero rounded-2xl p-12 shadow-elegant text-center space-y-8">
              <h3 className="text-2xl font-semibold text-primary-foreground">
                Our Impact in Numbers
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-accent">$12M+</div>
                  <div className="text-primary-foreground/90">Revenue Generated for Clients</div>
                </div>
                
                <div className="h-px bg-primary-foreground/20" />
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-accent">4,800+</div>
                  <div className="text-primary-foreground/90">Qualified Leads Delivered</div>
                </div>
                
                <div className="h-px bg-primary-foreground/20" />
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-accent">247%</div>
                  <div className="text-primary-foreground/90">Average Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
