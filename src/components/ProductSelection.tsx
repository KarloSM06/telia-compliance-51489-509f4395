import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { StickyPackageCards } from "@/components/home/StickyPackageCards";
import { WorkflowTimeline } from "@/components/home/WorkflowTimeline";
import { StatsBar } from "@/components/home/StatsBar";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { aiPackages } from "@/data/packages";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedHero } from "@/components/ui/animated-hero";
import IntegrationHero from "@/components/ui/integration-hero";
import { ClientLogoCloud } from "@/components/ClientLogoCloud";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { UnifiedDashboard } from "@/components/home/UnifiedDashboard";
import { LandingAccordionItem } from "@/components/home/LandingAccordionItem";
import { UnifiedEcosystem } from "@/components/home/UnifiedEcosystem";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";
import calendarScreenshot from "@/assets/calendar-screenshot.png";
export const ProductSelection = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
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
  const handleIndustryClick = (industryId: string) => {
    setSelectedIndustry(industryId);
    setIsConsultationModalOpen(true);
  };
  return <div className="relative bg-gradient-hero min-h-screen">
      
      {/* Hero Section and Packages with Aurora Background */}
      <AuroraBackground className="h-auto">
        {/* Hero Section */}
        <section id="hero" className="relative py-12 lg:py-16 pb-16 lg:pb-24 flex items-center">
          <AnimatedHero onBookDemo={() => setIsConsultationModalOpen(true)} onViewPackages={() => scrollToSection('paket')} />
        </section>

        {/* Social Proof Stats */}
        

        {/* Så fungerar det */}
        <ProcessSteps />

        {/* Företag vi samarbetar med */}
        <ClientLogoCloud />

        {/* Våra Tjänster & Teknologier */}
        <ServicesGrid />

        {/* Våra AI-paket / Lösningar */}
        <StickyPackageCards packages={aiPackages} onBookDemo={() => setIsConsultationModalOpen(true)} onViewDetails={() => scrollToSection('kontakt')} />

        {/* Programmen vi jobbar med */}
        <IntegrationHero />

        {/* All Data på Ett Ställe */}
        <UnifiedDashboard />

        {/* AI Capabilities Accordion */}
        <LandingAccordionItem />

        {/* Allt administrativt i ett ekosystem */}
        <UnifiedEcosystem primaryImageSrc={dashboardScreenshot} secondaryImageSrc={calendarScreenshot} />
        
        {/* Arbetsprocess */}
        <AnimatedSection>
          <section id="process" className="relative py-12">
            <WorkflowTimeline />
          </section>
        </AnimatedSection>

        {/* Kontakt / CTA */}
        <ConsultationCTA />
      </AuroraBackground>

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};