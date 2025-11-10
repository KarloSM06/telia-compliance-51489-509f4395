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
import { TrustMetricsBar } from "@/components/home/TrustMetricsBar";
import { CaseStudiesGrid } from "@/components/home/CaseStudiesGrid";
import { WhyHiemsSection } from "@/components/home/WhyHiemsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { FAQSection } from "@/components/home/FAQSection";
import { aiPackages } from "@/data/packages";
import { industries } from "@/data/industries";
import { caseStudies } from "@/data/caseStudies";
import heroBackground from "@/assets/hero-background.jpg";
import karloImage from "@/assets/karlo-mangione.png";
import antonImage from "@/assets/anton-sallnas.png";
import emilImage from "@/assets/emil-westerberg.png";
import { Sparkles, Zap, Target, CheckCircle, Award, Users, Wrench, ArrowRight } from "lucide-react";
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
      
      {/* Hero Section and All Sections with Aurora Background */}
      <AuroraBackground className="h-auto">
        {/* 1. Hero */}
        <AnimatedHero 
          onBookDemo={() => setIsConsultationModalOpen(true)}
          onViewPackages={() => scrollToSection('paket')}
        />

        {/* 2. Trust Metrics Bar */}
        <TrustMetricsBar />

        {/* 3. Programmen vi jobbar med */}
        <IntegrationHero />

        {/* 4. Företag vi samarbetar med */}
        <ClientLogoCloud />

        {/* 5. Våra Tjänster */}
        <ServicesGrid />

        {/* 6. All Data på Ett Ställe */}
        <UnifiedDashboard />

        {/* 7. AI Capabilities Accordion */}
        <LandingAccordionItem />

        {/* 8. Allt administrativt i ett ekosystem */}
        <UnifiedEcosystem primaryImageSrc={dashboardScreenshot} secondaryImageSrc={calendarScreenshot} />

        {/* 9. Våra AI-paket / Lösningar */}
        <StickyPackageCards packages={aiPackages} onBookDemo={() => setIsConsultationModalOpen(true)} onViewDetails={() => scrollToSection('kontakt')} />
        
        {/* 10. Arbetsprocess */}
        <AnimatedSection>
          <section id="process" className="relative py-12">
            <WorkflowTimeline />
          </section>
        </AnimatedSection>

        {/* 11. Case Studies */}
        <CaseStudiesGrid />

        {/* 12. Varför Hiems */}
        <WhyHiemsSection />

        {/* 13. Priser */}
        <PricingSection onBookDemo={() => setIsConsultationModalOpen(true)} />

        {/* 14. Kundberättelser */}
        <TestimonialsCarousel />

        {/* 15. FAQ */}
        <FAQSection />

        {/* 16. Kontakt / CTA */}
        <ConsultationCTA />
      </AuroraBackground>
      

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};