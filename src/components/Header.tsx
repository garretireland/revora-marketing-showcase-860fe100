import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import revoraLogo from "@/assets/revora-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { title: "Home", href: "/", scrollToTop: true },
    { title: "About", href: "/about" },
    { title: "Testimonials", href: "/case-studies" },
    { title: "Contact", href: "/contact" },
    { title: "Guarantee", href: "/guarantee" },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={revoraLogo} 
              alt="Revora Marketing" 
              className="h-20"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                onClick={link.scrollToTop ? handleHomeClick : undefined}
                className="text-foreground/80 hover:text-accent transition-colors font-medium"
              >
                {link.title}
              </Link>
            ))}
            <Button variant="default" size="default" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a Call
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="text-foreground/80 hover:text-accent transition-colors font-medium"
                onClick={(e) => {
                  if (link.scrollToTop) {
                    handleHomeClick(e);
                  }
                  setIsMenuOpen(false);
                }}
              >
                {link.title}
              </Link>
            ))}
            <Button variant="default" size="default" className="w-full" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a Call
              </a>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
