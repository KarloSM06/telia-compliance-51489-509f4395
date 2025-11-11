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
import { AlternatingServicesSection } from "@/components/home/AlternatingServicesSection";
import { ProcessGrid } from "@/components/home/ProcessGrid";
import { CaseStudyShowcase } from "@/components/home/CaseStudyShowcase";
import { BenefitsGrid } from "@/components/home/BenefitsGrid";
import { PricingCards } from "@/components/home/PricingCards";
import { TestimonialsGrid } from "@/components/home/TestimonialsGrid";
import { FAQAccordion } from "@/components/home/FAQAccordion";
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
      
      {/* Hero Section and All Content with Aurora Background */}
      <AuroraBackground className="h-auto">
        {/* 1. Hero */}
        <AnimatedHero onBookDemo={() => setIsConsultationModalOpen(true)} onViewPackages={() => scrollToSection('paket')} />

        {/* 2. Alternating Services */}
        <AlternatingServicesSection />

        {/* 3. Integration Hero (verktygskarusell) */}
        <IntegrationHero />

        {/* 4. Process Grid (4 steg) */}
        <ProcessGrid />

        {/* 5. Benefits Grid */}
        <BenefitsGrid />

        {/* 6. Pricing Cards */}
        <PricingCards />

        {/* 7. Client Logos */}
        <ClientLogoCloud />

        {/* 8. Services Grid */}
        <ServicesGrid />

        {/* 9. Unified Dashboard */}
        <UnifiedDashboard />

        {/* 10. AI Capabilities Accordion */}
        

        {/* 11. Unified Ecosystem */}
        

        {/* 12. Workflow Timeline */}
        <AnimatedSection>
          <section id="process" className="relative py-12">
            <WorkflowTimeline />
          </section>
        </AnimatedSection>

        {/* 13. Sticky Package Cards */}
        <StickyPackageCards packages={aiPackages} onBookDemo={() => setIsConsultationModalOpen(true)} onViewDetails={() => scrollToSection('kontakt')} />

        {/* 14. Case Study Showcase */}
        <CaseStudyShowcase />

        {/* 15. Testimonials Grid */}
        <TestimonialsGrid />

        {/* 16. FAQ Accordion */}
        <FAQAccordion />

        {/* 17. Consultation CTA */}
        <ConsultationCTA />
      </AuroraBackground>

      {/* Branschspecifika lösningar */}
      

      {/* Kundflöde & värde */}
      

      {/* Teknisk Expertis */}
      

      {/* Onboarding-process */}
      

      {/* Blogg / Insikter */}
      

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};