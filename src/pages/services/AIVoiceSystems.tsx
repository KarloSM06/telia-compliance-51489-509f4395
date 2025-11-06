import { useState } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { EnhancedServiceHero } from "@/components/services/EnhancedServiceHero";
import { EnhancedFeaturesGrid } from "@/components/services/EnhancedFeaturesGrid";
import { TechStackGrid } from "@/components/services/TechStackGrid";
import { HowItWorksTimeline } from "@/components/services/HowItWorksTimeline";
import { UseCaseShowcase } from "@/components/services/UseCaseShowcase";
import { ServiceDataFlowVisual } from "@/components/services/ServiceDataFlowVisual";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ConsultationModal } from "@/components/ConsultationModal";
import { servicesData } from "@/data/services";
import { RelatedPackages } from "@/components/services/RelatedPackages";
import { Mic, Headphones, MessageCircle } from "lucide-react";

const AIVoiceSystems = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "ai-voice")!;

  const flowSteps = [
    { icon: Mic, title: "Voice Input", description: "Tar emot och transkriberar röstinput med hög precision på svenska" },
    { icon: Headphones, title: "AI Understanding", description: "Analyserar tal, förstår kontext och identifierar avsikt" },
    { icon: MessageCircle, title: "Natural Response", description: "Genererar naturligt tal och svarar med röst i realtid" }
  ];

  return (
    <div className="min-h-screen">
      <Header1 />
      <AuroraBackground className="min-h-screen">
        <main className="w-full">
        <EnhancedServiceHero
          icon={serviceData.icon}
          title={serviceData.heroTitle}
          subtitle={serviceData.heroSubtitle}
          onBookDemo={() => setIsConsultationModalOpen(true)}
        />
        <ServiceDataFlowVisual steps={flowSteps} />
        <EnhancedFeaturesGrid features={serviceData.features} />
        <TechStackGrid technologies={serviceData.technologies} />
        {serviceData.howItWorks && (
          <HowItWorksTimeline steps={serviceData.howItWorks} />
        )}
        <UseCaseShowcase useCases={serviceData.useCases} />
        <RelatedPackages serviceId="ai-voice" onBookDemo={() => setIsConsultationModalOpen(true)} />
        <OwnershipBadge />
        <ServiceCTA onBookDemo={() => setIsConsultationModalOpen(true)} />
        </main>
      </AuroraBackground>
      <Footer />
      <ConsultationModal
        open={isConsultationModalOpen}
        onOpenChange={setIsConsultationModalOpen}
      />
    </div>
  );
};

export default AIVoiceSystems;
