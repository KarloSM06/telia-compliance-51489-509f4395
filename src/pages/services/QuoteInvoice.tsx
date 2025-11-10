import { useState } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FeaturesGrid } from "@/components/services/FeaturesGrid";
import { TechnologyStack } from "@/components/services/TechnologyStack";
import { HowItWorksTimeline } from "@/components/services/HowItWorksTimeline";
import { UseCases } from "@/components/services/UseCases";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { servicesData } from "@/data/services";
import { RelatedPackages } from "@/components/services/RelatedPackages";

const QuoteInvoice = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const serviceData = servicesData.find(s => s.id === "quote-invoice")!;

  return (
    <div className="min-h-screen">
      <Header1 />
      <AuroraBackground className="min-h-screen">
        <main className="w-full">
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
        <RelatedPackages serviceId="quote-invoice" onBookDemo={() => setIsConsultationModalOpen(true)} />
        <OwnershipBadge />
        
        {/* Bokningssektion */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Redo att komma igång?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Boka ett kostnadsfritt möte med våra experter och upptäck hur vi kan transformera ditt företag med AI.
            </p>
            <Button
              size="lg"
              onClick={() => setIsConsultationModalOpen(true)}
              className="bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg px-10 py-7"
            >
              <Calendar className="w-6 h-6 mr-2" />
              Boka kostnadsfritt demo
            </Button>
          </div>
        </section>
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
