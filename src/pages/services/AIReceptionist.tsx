import { Bot, MessageSquare, Calendar, Mail, Phone, Globe, Clock, Zap } from "lucide-react";
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

export default function AIReceptionist() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      title: "24/7 Kundservice",
      description: "AI-agenten är alltid tillgänglig och kan svara på kundfrågor när som helst, även utanför kontorstid.",
      icon: Clock
    },
    {
      title: "Automatisk Mötesbokning",
      description: "Kunder kan boka möten direkt via chatbot eller SMS, med automatisk synkning till er kalender.",
      icon: Calendar
    },
    {
      title: "SMS-konversationer",
      description: "Hantera kundkommunikation via SMS med naturliga konversationer och intelligent svarsgenerering.",
      icon: MessageSquare
    },
    {
      title: "Email-hantering",
      description: "Automatisk sortering och svar på vanliga email-förfrågningar, med eskalering vid behov.",
      icon: Mail
    },
    {
      title: "Flerspråkigt Stöd",
      description: "Kommunicera med kunder på flera språk automatiskt för att nå en bredare marknad.",
      icon: Globe
    },
    {
      title: "Snabb Integration",
      description: "Koppla till befintliga system som CRM, kalender och e-post för sömlös datahantering.",
      icon: Zap
    }
  ];

  const capabilities = [
    {
      title: "Svara på vanliga frågor",
      description: "Om öppettider, priser, tjänster och mer"
    },
    {
      title: "Boka och omboka möten",
      description: "Automatisk hantering av kalender och bokningar"
    },
    {
      title: "Hantera förfrågningar",
      description: "Samla in information och dirigera till rätt person"
    },
    {
      title: "Ge produktinformation",
      description: "Detaljerad information om era produkter och tjänster"
    },
    {
      title: "Skicka bekräftelser",
      description: "Automatiska bekräftelser för bokningar och förfrågningar"
    },
    {
      title: "Eskalera vid behov",
      description: "Smart routing till mänsklig handläggare när det behövs"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        <ServiceHero
          title="AI-Receptionist & SMS-Agent"
          description="Er digitala receptionist som aldrig sover. Hantera kundkommunikation, boka möten och svara på frågor automatiskt – 24 timmar om dygnet."
          icon={Bot}
        />

        {/* Capabilities */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Vad AI-receptionisten kan göra</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                En komplett lösning för kundkommunikation
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="p-6 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md hover:border-primary/30 transition-all duration-500">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
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
              <h2 className="text-4xl font-bold mb-4">Tekniska funktioner</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Kraftfull AI-teknologi som fungerar sömlöst med era system
              </p>
            </AnimatedSection>

            <FeatureShowcase features={features} />
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Perfekt för</h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Service & Hantverkare",
                  description: "Hantera bokningar och förfrågningar automatiskt medan ni fokuserar på jobbet.",
                  stats: "95% av bokningar hanteras automatiskt"
                },
                {
                  title: "Hälsa & Wellness",
                  description: "Boka behandlingar, svara på frågor om tjänster och hantera ombokningar.",
                  stats: "50% färre missade samtal"
                },
                {
                  title: "Konsulter & Coacher",
                  description: "Låt AI hantera din kalender medan du fokuserar på klienterna.",
                  stats: "70% mindre administrativt arbete"
                }
              ].map((useCase, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className="p-8 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md">
                    <h3 className="text-2xl font-bold mb-4 text-primary">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-6">{useCase.description}</p>
                    <div className="pt-6 border-t border-border/30">
                      <p className="text-sm font-semibold text-green-500">{useCase.stats}</p>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
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
              title="Testa AI-receptionisten"
              description="Boka en demo så får du se hur AI kan hantera din kundkommunikation."
              primaryText="Boka demo"
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