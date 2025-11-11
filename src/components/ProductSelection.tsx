import { lazy, Suspense, useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { caseStudies } from "@/data/caseStudies";
import stockholmAC from "@/assets/stockholm-air-condition.png";
import bremilersVVS from "@/assets/bremilers-vvs.png";

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
        <section className="relative py-24 md:py-40 bg-white">
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 md:px-8 py-12 md:py-16 border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="text-center mb-16">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                  Senaste Projekt Vi är Stolta Över
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
                {caseStudies[0].company}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                {caseStudies[0].industry}
              </p>

              {/* Client Logos Grid */}
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
                <div className="group relative animate-fade-in-up">
                  <img 
                    src={stockholmAC} 
                    alt="Stockholm AC" 
                    className="w-full h-40 object-cover filter grayscale hover:grayscale-0 transition-all duration-300 scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="group relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                  <img 
                    src={bremilersVVS} 
                    alt="Bremilers VVS" 
                    className="w-full h-24 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-display font-normal text-gray-900 mb-4">Problem</h3>
                <p className="text-gray-600">{caseStudies[0].problem}</p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-normal text-gray-900 mb-4">Lösning</h3>
                <p className="text-gray-600">{caseStudies[0].solution}</p>
              </div>
            </div>
          </div>
        </section>

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