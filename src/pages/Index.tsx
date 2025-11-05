import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import IntegrationHero from "@/components/ui/integration-hero";
import { ClientLogoCloud } from "@/components/ClientLogoCloud";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ValueProposition } from "@/components/home/ValueProposition";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ConsultationModal } from "@/components/ConsultationModal";
import { useState } from "react";

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      <main>
        <AuroraBackground className="h-auto">
          <section id="hero" className="relative py-20 lg:py-32 flex items-center">
            <AnimatedHero 
              onBookDemo={() => setIsConsultationModalOpen(true)}
              onViewPackages={() => scrollToSection('tjanster')}
            />
          </section>

          <IntegrationHero />
          <ClientLogoCloud />
        </AuroraBackground>

        <div id="tjanster">
          <ServicesOverview />
        </div>
        
        <ValueProposition />
      </main>
      <Footer />
      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>
  );
};

export default Index;
