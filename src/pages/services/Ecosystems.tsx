import { useState } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { EnhancedServiceHero } from "@/components/services/EnhancedServiceHero";
import { EnhancedFeaturesGrid } from "@/components/services/EnhancedFeaturesGrid";
import { HowItWorksTimeline } from "@/components/services/HowItWorksTimeline";
import { UseCaseShowcase } from "@/components/services/UseCaseShowcase";
import { ServiceDataFlowVisual } from "@/components/services/ServiceDataFlowVisual";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ConsultationModal } from "@/components/ConsultationModal";
import { servicesData } from "@/data/services";
import { RelatedPackages } from "@/components/services/RelatedPackages";
import { Network, Settings, Rocket } from "lucide-react";

const Ecosystems = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "ecosystems")!;

  const flowSteps = [
    { icon: Network, title: "Ecosystem Mapping", description: "Kartlägger hela er verksamhet och identifierar alla integrationer" },
    { icon: Settings, title: "System Design", description: "Designar ett sammanhängande ekosystem där alla delar kommunicerar sömlöst" },
    { icon: Rocket, title: "Full Integration", description: "Implementerar och integrerar alla system för optimal drift och skalbarhet" }
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
        {serviceData.howItWorks && (
          <HowItWorksTimeline steps={serviceData.howItWorks} />
        )}
        <UseCaseShowcase useCases={serviceData.useCases} />
        <RelatedPackages serviceId="ecosystems" onBookDemo={() => setIsConsultationModalOpen(true)} />
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

export default Ecosystems;
