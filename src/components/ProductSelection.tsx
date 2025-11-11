import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { WorkflowTimeline } from "@/components/home/WorkflowTimeline";
import { AlternatingServicesSection } from "@/components/home/AlternatingServicesSection";
import { ProcessGrid } from "@/components/home/ProcessGrid";
import { CaseStudyShowcase } from "@/components/home/CaseStudyShowcase";
import { BenefitsGrid } from "@/components/home/BenefitsGrid";
import { PricingCards } from "@/components/home/PricingCards";
import { TestimonialsGrid } from "@/components/home/TestimonialsGrid";
import { FAQAccordion } from "@/components/home/FAQAccordion";
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

        {/* 6. Case Study Showcase */}
        <CaseStudyShowcase />

        {/* 7. Pricing Cards */}
        <PricingCards />

        {/* 8. FAQ Accordion */}
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