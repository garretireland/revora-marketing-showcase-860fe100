import revoraLogo from "@/assets/revora-logo.png";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <img 
              src={revoraLogo} 
              alt="Revora Marketing" 
              className="h-12"
            />
            <p className="text-primary-foreground/80 max-w-md">
              Helping local service businesses dominate their markets with data-driven marketing strategies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#services" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/case-studies" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4 text-accent" />
                <span>(519) 717-9806</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <a 
                  href="mailto:garret@revoramarketingagency.com" 
                  className="break-all hover:text-accent transition-colors"
                >
                  garret@revoramarketingagency.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-accent mt-1" />
                <span>Toronto ON, Canada</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Revora Marketing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
