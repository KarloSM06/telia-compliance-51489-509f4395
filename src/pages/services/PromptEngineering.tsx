import { useState } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FeaturesGrid } from "@/components/services/FeaturesGrid";
import { TechnologyStack } from "@/components/services/TechnologyStack";
import { UseCases } from "@/components/services/UseCases";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ConsultationModal } from "@/components/ConsultationModal";
import { servicesData } from "@/data/services";

const PromptEngineering = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "prompt-engineering")!;

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      <main>
        <ServiceHero
          icon={serviceData.icon}
          title={serviceData.heroTitle}
          subtitle={serviceData.heroSubtitle}
          onBookDemo={() => setIsConsultationModalOpen(true)}
        />
        <FeaturesGrid features={serviceData.features} />
        <TechnologyStack technologies={serviceData.technologies} />
        <UseCases useCases={serviceData.useCases} />
        <OwnershipBadge />
        <ServiceCTA onBookDemo={() => setIsConsultationModalOpen(true)} />
      </main>
      <Footer />
      <ConsultationModal
        open={isConsultationModalOpen}
        onOpenChange={setIsConsultationModalOpen}
      />
    </div>
  );
};

export default PromptEngineering;
