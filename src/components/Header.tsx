import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import revoraLogo from "@/assets/revora-logo.png";

// Header has two treatments:
// - "immersive": homepage only, while the cinematic opening/experience
//   (#services) is on screen. Slim, dark translucent glass over imagery.
// - "standard": everywhere else. Slim light glass.
// Both keep every nav destination, the CTA and the mobile menu.
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const [immersive, setImmersive] = useState(pathname === "/");

  useEffect(() => {
    if (pathname !== "/") {
      setImmersive(false);
      return;
    }
    const check = () => {
      const el = document.getElementById("services");
      setImmersive(!el || el.getBoundingClientRect().bottom > 72);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Our Approach", href: "/case-studies" },
    { title: "How We Work", href: "/guarantee" },
    { title: "Contact", href: "/contact" },
  ];

  const handleNavClick = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const shell = immersive
    ? "bg-primary/35 border-primary-foreground/10 text-primary-foreground"
    : "bg-background/85 border-border text-foreground";
  const linkCls = immersive
    ? "text-primary-foreground/75 hover:text-primary-foreground"
    : "text-foreground/75 hover:text-accent";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${shell}`}>
      <nav className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={handleNavClick}>
            {/* Logo sits on a small light plate in immersive mode so the navy
                wordmark and orange arrow stay exactly as designed. */}
            <span className={`rounded-md transition-colors duration-500 ${immersive ? "bg-background/90 px-1.5" : ""}`}>
              <img src={revoraLogo} alt="Revora Marketing" className="h-14 md:h-16" />
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                onClick={handleNavClick}
                className={`text-sm font-medium tracking-wide transition-colors ${linkCls}`}
              >
                {link.title}
              </Link>
            ))}
            <Button variant={immersive ? "hero" : "default"} size="sm" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a 15-Minute Discovery Call
              </a>
            </Button>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-3 pb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className={`font-medium transition-colors ${linkCls}`}
                onClick={() => {
                  handleNavClick();
                  setIsMenuOpen(false);
                }}
              >
                {link.title}
              </Link>
            ))}
            <Button variant={immersive ? "hero" : "default"} size="default" className="w-full" asChild>
              <a href="https://calendly.com/garret-revoramarketingagency/30min" target="_blank" rel="noopener noreferrer">
                Book a 15-Minute Discovery Call
              </a>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
