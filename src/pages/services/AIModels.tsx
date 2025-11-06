import { useState } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { EnhancedServiceHero } from "@/components/services/EnhancedServiceHero";
import { EnhancedFeaturesGrid } from "@/components/services/EnhancedFeaturesGrid";
import { TechStackGrid } from "@/components/services/TechStackGrid";
import { UseCaseShowcase } from "@/components/services/UseCaseShowcase";
import { ServiceDataFlowVisual } from "@/components/services/ServiceDataFlowVisual";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ConsultationModal } from "@/components/ConsultationModal";
import { servicesData } from "@/data/services";
import { RelatedPackages } from "@/components/services/RelatedPackages";
import { Brain, Database, Zap } from "lucide-react";

const AIModels = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "ai-models")!;

  const flowSteps = [
    { icon: Database, title: "Data Input", description: "Träningsdata och prompts matas in i systemet för optimal modellkonfiguration" },
    { icon: Brain, title: "AI-Processering", description: "Avancerade språkmodeller (GPT-4, Claude) processar och genererar intelligent output" },
    { icon: Zap, title: "Smart Output", description: "Färdig, kontext-medveten output levereras direkt till era system" }
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
        <UseCaseShowcase useCases={serviceData.useCases} />
        <RelatedPackages serviceId="ai-models" onBookDemo={() => setIsConsultationModalOpen(true)} />
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

export default AIModels;
