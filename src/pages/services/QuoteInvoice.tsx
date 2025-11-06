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
import { FileInput, Calculator, FileCheck } from "lucide-react";

const QuoteInvoice = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "quote-invoice")!;

  const flowSteps = [
    { icon: FileInput, title: "Data Input", description: "Samlar in projektdata, kravspecifikationer och prislistor automatiskt" },
    { icon: Calculator, title: "AI Calculation", description: "Beräknar kostnader, estimerar tid och genererar professionella offerter" },
    { icon: FileCheck, title: "Document Generation", description: "Skapar färdiga dokument och fakturor redo för godkännande" }
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
        <RelatedPackages serviceId="quote-invoice" onBookDemo={() => setIsConsultationModalOpen(true)} />
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

export default QuoteInvoice;
