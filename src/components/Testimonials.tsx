import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    business: "Elite Roofing & Restoration",
    role: "Owner",
    result: "$47K in new revenue",
    timeframe: "First 90 days",
    leads: "62 qualified leads",
    quote: "Before Revora, we were spending thousands on ads with barely any results. Within 90 days, they delivered 62 qualified leads and we closed $47,000 in new business. The automated follow-up system alone was worth it.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    business: "Premier HVAC Solutions",
    role: "Founder",
    result: "$83K in revenue",
    timeframe: "First 6 months",
    leads: "127 qualified leads",
    quote: "I was skeptical about the guarantee, but they over-delivered. The sales scripts and conversion training helped us close deals we would have missed. Our booking calendar went from empty to fully booked.",
    rating: 5,
  },
  {
    name: "Jennifer Chen",
    business: "Precision Plumbing Co.",
    role: "CEO",
    result: "$31K increase",
    timeframe: "90 days",
    leads: "54 qualified leads",
    quote: "What sets them apart is the complete system—not just ads. The follow-up automation, booking tools, and weekly coaching made all the difference. We finally have a predictable lead flow.",
    rating: 5,
  },
  {
    name: "David Torres",
    business: "Crystal Clear Window Cleaning",
    role: "Owner",
    result: "$38K in new contracts",
    timeframe: "First 90 days",
    leads: "71 qualified leads",
    quote: "We went from struggling to find customers to turning down work. The Facebook ads brought in consistent commercial and residential leads, and the booking system made scheduling seamless. Best investment we ever made.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Real Results from
              <span className="text-accent"> Real Businesses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how local service businesses are adding $10K+ in monthly revenue with our proven system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card relative overflow-hidden"
              >
                {/* Quote icon decoration */}
                <Quote className="absolute -top-2 -right-2 h-24 w-24 text-accent/10 rotate-12" />
                
                <div className="relative space-y-6">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Results */}
                  <div className="bg-gradient-accent rounded-lg p-4 space-y-2">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {testimonial.result}
                    </div>
                    <div className="text-sm text-accent-foreground/80">
                      {testimonial.leads} • {testimonial.timeframe}
                    </div>
                  </div>

                  {/* Author info */}
                  <div className="pt-4 border-t border-border">
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.business}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-accent">150+</div>
              <div className="text-muted-foreground">Businesses Helped</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-accent">$2.1M+</div>
              <div className="text-muted-foreground">Revenue Generated</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-accent">98%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
