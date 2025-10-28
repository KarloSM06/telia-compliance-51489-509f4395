import { Link } from "react-router-dom";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Button } from "@/components/ui/button";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";
import { Linkedin } from "lucide-react";
export const Footer = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  return <footer className="bg-[#0A0A0A] text-white py-16 px-6">
      {/* CTA Section */}
      

      {/* Main Footer Content - 4 columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        
        {/* Column 1: Hiems + beskrivning */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img src={hiems_logo} alt="Hiems" className="h-12 w-12" />
            <h3 className="text-xl font-bold">Hiems</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Skräddarsydda AI-ekosystem som transformerar ditt företag
          </p>
        </div>
        
        {/* Column 2: Navigering */}
        <div>
          <h4 className="mb-4 text-base font-semibold">Navigering</h4>
          <ul className="list-none p-0 m-0 text-muted-foreground text-sm space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Hem
              </Link>
            </li>
            <li>
              <button onClick={() => scrollToSection('paket')} className="hover:text-white transition-colors text-left">
                Lösningar
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('branscher')} className="hover:text-white transition-colors text-left">
                Bransch
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('case')} className="hover:text-white transition-colors text-left">
                Case
              </button>
            </li>
            <li>
              <Link to="/om-oss" className="hover:text-white transition-colors">
                Om oss
              </Link>
            </li>
            <li>
              <button onClick={() => scrollToSection('kontakt')} className="hover:text-white transition-colors text-left">
                Kontakt
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Kontakt */}
        <div>
          <h4 className="mb-4 text-base font-semibold">Kontakt</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📞 070-657 15 32</p>
            <p>
              <a href="mailto:contact@hiems.se" className="hover:text-white transition-colors">
                📧 contact@hiems.se
              </a>
            </p>
          </div>
        </div>
        
        {/* Column 4: Sociala medier */}
        <div>
          <h4 className="mb-4 text-base font-semibold">Följ oss</h4>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/hiems-hb" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom row: GDPR + Policy links + Copyright */}
      <div className="border-t border-white/10 pt-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Hiems HB. Alla rättigheter förbehållna.
          </p>
          <div className="flex flex-wrap gap-6 text-xs justify-center">
            <Link to="/regelverk#integritetspolicy" className="hover:text-white transition-colors">
              GDPR / Integritetspolicy
            </Link>
            <Link to="/regelverk#anvandarvillkor" className="hover:text-white transition-colors">
              Användarvillkor
            </Link>
            <Link to="/regelverk#cookie-policy" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
      
      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </footer>;
};