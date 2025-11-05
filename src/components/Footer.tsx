import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";
import { Linkedin } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Footer = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container grid gap-3 px-4 py-10 md:px-6 lg:grid-cols-4 border-x border-muted"
      >
        <div className="space-y-3">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <img src={hiems_logo} alt="Hiems" className="h-10 w-10" />
            </motion.div>
            <span className="font-bold text-xl">Hiems</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Skräddarsydda AI-ekosystem som transformerar ditt företag
          </p>
          <div className="flex space-x-3">
            <motion.div whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <a href="https://www.linkedin.com/company/hiems-hb" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </motion.div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Navigering</h3>
          <nav className="mt-4 flex flex-col space-y-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Hem</Link>
            <button onClick={() => scrollToSection("ai-paket")} className="text-muted-foreground hover:text-foreground text-left">Lösningar</button>
            <button onClick={() => scrollToSection("branschlosningar")} className="text-muted-foreground hover:text-foreground text-left">Bransch</button>
            <Link to="/om-oss" className="text-muted-foreground hover:text-foreground">Om oss</Link>
            <button onClick={() => scrollToSection("kontakt")} className="text-muted-foreground hover:text-foreground text-left">Kontakt</button>
          </nav>
        </div>

        <div>
          <h3 className="text-lg font-medium">Kontakt</h3>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>📞 070-657 15 32</p>
            <p><a href="mailto:contact@hiems.se" className="hover:text-foreground">📧 contact@hiems.se</a></p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Nyhetsbrev</h3>
          <p className="text-sm text-muted-foreground">Få de senaste insikterna</p>
          <form className="flex space-x-3">
            <Input type="email" placeholder="Din e-post" className="max-w-lg flex-1 rounded-3xl" />
            <Button type="submit" className="rounded-3xl">Prenumerera</Button>
          </form>
        </div>
      </motion.div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">© 2025 Hiems HB. Alla rättigheter förbehållna.</p>
          <div className="flex flex-wrap gap-6 text-xs">
            <Link to="/regelverk#integritetspolicy" className="text-muted-foreground hover:text-foreground">GDPR</Link>
            <Link to="/regelverk#anvandarvillkor" className="text-muted-foreground hover:text-foreground">Användarvillkor</Link>
            <Link to="/regelverk#cookie-policy" className="text-muted-foreground hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </footer>
  );
};
