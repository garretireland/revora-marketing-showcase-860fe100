import Header from "@/components/Header";
import CinematicExperience from "@/components/cinematic/CinematicExperience";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

// PROTOTYPE: cinematic scroll-directed homepage journey replaces the
// previous Hero + Services (two-card grid) + Roadmap stack. The
// cinematic sequence itself now explains the website offer, the growth
// mechanism, and the $997/$99/mo pricing, so "return to conversion"
// (Section 11 of the prototype brief) intentionally does NOT repeat the
// old two-card Services grid -- WhyChooseUs/Testimonials/CTA/Footer
// remain as the calmer trust-and-close layer.
//
// Hero.tsx, Services.tsx and Roadmap.tsx are left in place, untouched,
// simply unused here -- easy to revert to if this prototype direction
// is not approved.
const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <CinematicExperience />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
