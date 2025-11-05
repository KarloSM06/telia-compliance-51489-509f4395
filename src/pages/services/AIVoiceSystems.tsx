import { useState } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FeaturesGrid } from "@/components/services/FeaturesGrid";
import { TechnologyStack } from "@/components/services/TechnologyStack";
import { HowItWorksTimeline } from "@/components/services/HowItWorksTimeline";
import { UseCases } from "@/components/services/UseCases";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ConsultationModal } from "@/components/ConsultationModal";
import { servicesData } from "@/data/services";

const AIVoiceSystems = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "ai-voice")!;

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
        {serviceData.howItWorks && (
          <HowItWorksTimeline steps={serviceData.howItWorks} />
        )}
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

export default AIVoiceSystems;
