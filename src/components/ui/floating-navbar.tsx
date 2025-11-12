import { Button } from "@/components/ui/button";
import { Menu, X, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingNavbar() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    }
  };

  return (
    <>
    <nav className="fixed left-0 right-0 top-4 z-50 px-4">
      <div 
        className={`mx-auto rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-elegant transition-all duration-300 ${
          isScrolled ? "max-w-5xl px-4 py-3" : "max-w-7xl px-6 py-4"
        }`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className={`cursor-pointer group flex items-center gap-3 transition-all duration-300 hover:scale-105 ${
                isScrolled ? "ml-2" : ""
              }`}
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
                onClick={() => scrollToSection("process")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Process
              </button>
              <button
                onClick={() => scrollToSection("fordelar")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Fördelar
              </button>
              <button
                onClick={() => scrollToSection("priser")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Priser
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Kontakt
              </button>
            </div>

            {/* CTA Button - Desktop */}
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="hidden md:inline-flex px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              Boka ett möte
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 transition-colors hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
                <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-20 left-4 right-4 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection("tjanster");
                }}
                className="text-left px-4 py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white/10"
              >
                Tjänster
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection("process");
                }}
                className="text-left px-4 py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white/10"
              >
                Process
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection("fordelar");
                }}
                className="text-left px-4 py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white/10"
              >
                Fördelar
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection("priser");
                }}
                className="text-left px-4 py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white/10"
              >
                Priser
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection("faq");
                }}
                className="text-left px-4 py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white/10"
              >
                FAQ
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection("kontakt");
                }}
                className="text-left px-4 py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white/10"
              >
                Kontakt
              </button>
              <div className="border-t border-white/10 pt-4 mt-4">
                <button
                  className="w-full px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsConsultationModalOpen(true);
                  }}
                >
                  Boka ett möte
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <ConsultationModal
        open={isConsultationModalOpen} 
        onOpenChange={setIsConsultationModalOpen} 
      />
    </>
  );
}
