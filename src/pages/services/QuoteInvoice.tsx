import { FileText, Sparkles, TrendingUp, Clock, Check, Zap } from "lucide-react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FeatureShowcase } from "@/components/services/FeatureShowcase";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";

export default function QuoteInvoice() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      title: "Automatisk Offertgenerering",
      description: "AI analyserar kundförfrågningar och skapar professionella offerter baserat på era priser och tjänster.",
      icon: Sparkles
    },
    {
      title: "Smart Prisberäkning",
      description: "Dynamisk prissättning baserad på projektomfång, historik och marknadspriser för maximal lönsamhet.",
      icon: TrendingUp
    },
    {
      title: "Automatisk Fakturering",
      description: "Generera och skicka fakturor automatiskt när offerter accepteras, med påminnelser och uppföljning.",
      icon: FileText
    },
    {
      title: "Integration med Befintliga System",
      description: "Koppla till era bokföringssystem, CRM och e-post för sömlös datahantering.",
      icon: Zap
    },
    {
      title: "Påminnelser & Uppföljning",
      description: "Automatiska påminnelser för förfallna fakturor och uppföljning av ej besvarade offerter.",
      icon: Clock
    },
    {
      title: "Mallhantering",
      description: "Skapa och hantera professionella mallar för offerter och fakturor med ert varumärke.",
      icon: Check
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Kund skickar förfrågan",
      description: "Via email, formulär eller direkt integration"
    },
    {
      step: "2", 
      title: "AI analyserar behov",
      description: "Systemet tolkar förfrågan och identifierar relevanta tjänster"
    },
    {
      step: "3",
      title: "Offert genereras",
      description: "Professionell offert skapas baserat på era mallar och priser"
    },
    {
      step: "4",
      title: "Automatisk uppföljning",
      description: "Påminnelser skickas vid förfall, faktura genereras vid accept"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        <ServiceHero
          title="Offert & Faktura Automation"
          description="Automatisera hela processen från offertförfrågan till fakturering. Spara tid, minska fel och öka lönsamheten med AI-driven automation."
          icon={FileText}
        />

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Så fungerar det</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                En enkel process som sparar dig timmar varje vecka
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="p-6 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-gold mb-4 text-primary font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Funktioner</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Allt du behöver för professionell offert- och fakturahantering
              </p>
            </AnimatedSection>

            <FeatureShowcase features={features} />
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <Card className="p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-4xl font-bold mb-6">Typisk ROI</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <p className="text-5xl font-bold text-primary mb-2">75%</p>
                      <p className="text-muted-foreground">Mindre tid på administration</p>
                    </div>
                    <div>
                      <p className="text-5xl font-bold text-primary mb-2">3x</p>
                      <p className="text-muted-foreground">Snabbare offertprocess</p>
                    </div>
                    <div>
                      <p className="text-5xl font-bold text-primary mb-2">95%</p>
                      <p className="text-muted-foreground">Färre faktureringsfel</p>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Baserat på genomsnittliga resultat från våra kunder under första året
                  </p>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Ownership */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <OwnershipBadge />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ServiceCTA 
              title="Redo att automatisera?"
              description="Boka ett kostnadsfritt möte så visar vi hur mycket tid och pengar du kan spara."
              primaryAction={() => setIsModalOpen(true)}
            />
          </div>
        </section>
      </main>

      <Footer />
      <ConsultationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}