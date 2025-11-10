import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsultationModal } from "@/components/ConsultationModal";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";

export function FloatingNavbar() {
  const navigate = useNavigate();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    } else {
      navigate(`/#${sectionId}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
        <div className="mx-auto max-w-7xl rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm shadow-elegant">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => navigateToPage("/")} 
              className="cursor-pointer group flex items-center gap-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-xl" />
                <img 
                  src={hiems_logo} 
                  alt="Hiems" 
                  className="h-10 w-10 rounded-xl shadow-card group-hover:shadow-glow group-hover:rotate-6 transition-all duration-500"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="text-xl font-bold text-primary group-hover:tracking-wider transition-all duration-300">
                Hiems
              </span>
            </button>

            {/* Navigation Links - Desktop */}
            <div className="hidden items-center gap-8 md:flex">
              <button
                onClick={() => scrollToSection("tjanster")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Tjänster
              </button>
              <button
                onClick={() => scrollToSection("paket")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Paket
              </button>
              <button
                onClick={() => scrollToSection("branscher")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Branscher
              </button>
              <button
                onClick={() => navigateToPage("/about")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Om oss
              </button>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Kontakt
              </button>
            </div>

            {/* CTA Button - Desktop */}
            <Button
              size="sm"
              onClick={() => setIsConsultationModalOpen(true)}
              className="hidden md:inline-flex bg-white text-black hover:bg-gray-100 [text-shadow:_0_1px_2px_rgb(0_0_0_/_10%)] font-medium transition-all duration-300 hover:scale-105 shadow-button"
            >
              Boka demo
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-primary p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? "Stäng meny" : "Öppna meny"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 animate-fade-in">
              <button
                onClick={() => scrollToSection("tjanster")}
                className="text-left text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 px-3 hover:bg-white/5 rounded-lg"
              >
                Tjänster
              </button>
              <button
                onClick={() => scrollToSection("paket")}
                className="text-left text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 px-3 hover:bg-white/5 rounded-lg"
              >
                Paket
              </button>
              <button
                onClick={() => scrollToSection("branscher")}
                className="text-left text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 px-3 hover:bg-white/5 rounded-lg"
              >
                Branscher
              </button>
              <button
                onClick={() => navigateToPage("/about")}
                className="text-left text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 px-3 hover:bg-white/5 rounded-lg"
              >
                Om oss
              </button>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="text-left text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 px-3 hover:bg-white/5 rounded-lg"
              >
                Kontakt
              </button>
              <Button
                size="sm"
                onClick={() => setIsConsultationModalOpen(true)}
                className="mt-2 bg-white text-black hover:bg-gray-100 font-medium w-full"
              >
                Boka demo
              </Button>
            </div>
          )}
        </div>
      </nav>

      <ConsultationModal 
        open={isConsultationModalOpen} 
        onOpenChange={setIsConsultationModalOpen} 
      />
    </>
  );
}
