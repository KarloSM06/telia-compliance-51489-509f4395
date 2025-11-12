import { lazy, Suspense, useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { CaseStudyShowcase } from "@/components/home/CaseStudyShowcase";

// Lazy load sektioner för bättre performance
const AlternatingServicesSection = lazy(() => import("@/components/home/AlternatingServicesSection").then(m => ({ default: m.AlternatingServicesSection })));
const ProcessGrid = lazy(() => import("@/components/home/ProcessGrid").then(m => ({ default: m.ProcessGrid })));
const BenefitsGrid = lazy(() => import("@/components/home/BenefitsGrid").then(m => ({ default: m.BenefitsGrid })));
const PricingCards = lazy(() => import("@/components/home/PricingCards").then(m => ({ default: m.PricingCards })));
const FAQAccordion = lazy(() => import("@/components/home/FAQAccordion").then(m => ({ default: m.FAQAccordion })));
const ConsultationCTA = lazy(() => import("@/components/ConsultationCTA").then(m => ({ default: m.ConsultationCTA })));
const IntegrationHero = lazy(() => import("@/components/ui/integration-hero"));

// Skeleton för lazy loaded sektioner
const SectionSkeleton = () => (
  <div className="py-12 md:py-16 lg:py-24">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="h-96 bg-white/60 rounded-3xl animate-pulse" />
    </div>
  </div>
);
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
        <Suspense fallback={<SectionSkeleton />}>
          <AlternatingServicesSection />
        </Suspense>

        {/* 3. Process Grid (4 steg) */}
        <Suspense fallback={<SectionSkeleton />}>
          <ProcessGrid />
        </Suspense>

        {/* 4. Benefits Grid */}
        <Suspense fallback={<SectionSkeleton />}>
          <BenefitsGrid />
        </Suspense>

        {/* 5. Case Study */}
        <CaseStudyShowcase />

        {/* 6. Pricing Cards */}
        <Suspense fallback={<SectionSkeleton />}>
          <PricingCards />
        </Suspense>

        {/* 7. Integration Hero (verktygskarusell) */}
        <Suspense fallback={<SectionSkeleton />}>
          <IntegrationHero />
        </Suspense>

        {/* 8. FAQ Accordion */}
        <Suspense fallback={<SectionSkeleton />}>
          <FAQAccordion />
        </Suspense>

        {/* 9. Consultation CTA */}
        <Suspense fallback={<SectionSkeleton />}>
          <ConsultationCTA />
        </Suspense>
      </AuroraBackground>

      {/* Branschspecifika lösningar */}
      

      {/* Kundflöde & värde */}
      

      {/* Teknisk Expertis */}
      

      {/* Onboarding-process */}
      

      {/* Blogg / Insikter */}
      

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};