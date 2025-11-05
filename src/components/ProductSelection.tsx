import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StickyPackageCards } from "@/components/home/StickyPackageCards";
import { IndustryGallery } from "@/components/home/IndustryGallery";
import { CustomerJourneyFlow } from "@/components/home/CustomerJourneyFlow";
import { OnboardingTimeline } from "@/components/home/OnboardingTimeline";
import { TechnicalExpertise } from "@/components/home/TechnicalExpertise";
import { CaseStudyCard } from "@/components/home/CaseStudyCard";
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
        <section id="hero" className="relative py-20 lg:py-32 flex items-center">
          <AnimatedHero onBookDemo={() => setIsConsultationModalOpen(true)} onViewPackages={() => scrollToSection('paket')} />
        </section>

        {/* Programmen vi jobbar med */}
        <IntegrationHero />

        {/* Företag vi samarbetar med */}
        <ClientLogoCloud />

        {/* Våra Tjänster & Teknologier */}
        <ServicesGrid />

        {/* All Data på Ett Ställe */}
        <UnifiedDashboard />

        {/* Våra AI-paket / Lösningar */}
        <StickyPackageCards packages={aiPackages} onBookDemo={() => setIsConsultationModalOpen(true)} onViewDetails={() => scrollToSection('kontakt')} />
      </AuroraBackground>

      {/* Branschspecifika lösningar */}
      

      {/* Kundflöde & värde */}
      

      {/* Teknisk Expertis */}
      

      {/* Onboarding-process */}
      

      {/* Case / Kundreferenser - DOLD (Ta bort kommentarerna för att visa igen) */}
      {/* <section id="case" className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Verkliga resultat från våra kunder
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
              Se hur andra företag har transformerat sin verksamhet med Hiems AI-lösningar
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => <AnimatedSection key={caseStudy.id} delay={index * 150}>
                <CaseStudyCard caseStudy={caseStudy} onBookDemo={() => setIsConsultationModalOpen(true)} />
              </AnimatedSection>)}
          </div>
        </div>
       </section> */}

      {/* Blogg / Insikter */}
      

      {/* Kontakt / CTA */}
      


      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};