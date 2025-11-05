import { Zap, Mail, Database, FileText, Share2, TrendingUp, Clock, Workflow } from "lucide-react";
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

export default function Automations() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    {
      title: "Email-automation",
      description: "Automatiska email-sekvenser, uppföljning och personaliserade meddelanden baserat på kundhandlingar.",
      icon: Mail,
      examples: ["Välkomstserier", "Uppföljning av offerter", "Påminnelser"]
    },
    {
      title: "Data-automation",
      description: "Automatisk datahantering mellan system, validering och synkronisering i realtid.",
      icon: Database,
      examples: ["CRM-synk", "Datavalidering", "Automatisk backup"]
    },
    {
      title: "Dokument-automation",
      description: "Generera dokument, rapporter och kontrakt automatiskt baserat på mallar och data.",
      icon: FileText,
      examples: ["Kontrakt", "Rapporter", "Fakturor"]
    },
    {
      title: "Social Media",
      description: "Schemalägg inlägg, automatisk publicering och analysrapporter för sociala medier.",
      icon: Share2,
      examples: ["Schemalagda posts", "Analytics", "Innehållskurering"]
    },
    {
      title: "Workflow-automation",
      description: "Automatisera hela arbetsflöden med triggers, conditions och actions mellan olika system.",
      icon: Workflow,
      examples: ["Onboarding", "Godkännandeflöden", "Eskalering"]
    },
    {
      title: "Rapportering",
      description: "Automatiska rapporter och dashboards som uppdateras i realtid med data från alla källor.",
      icon: TrendingUp,
      examples: ["Sales reports", "Analytics", "KPI-dashboards"]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Spara tid",
      stat: "15+ timmar/vecka",
      description: "Genomsnittlig tidsbesparing för våra kunder"
    },
    {
      icon: TrendingUp,
      title: "Öka produktivitet",
      stat: "3x",
      description: "Snabbare processer med automation"
    },
    {
      icon: Zap,
      title: "Minska fel",
      stat: "95%",
      description: "Färre manuella fel med automation"
    }
  ];

  const useCases = [
    {
      title: "E-handel",
      automation: "Orderhantering, lagerstatus, kundkommunikation",
      result: "80% snabbare orderprocess"
    },
    {
      title: "Tjänsteföretag",
      automation: "Bokningar, påminnelser, fakturering, uppföljning",
      result: "50% mindre administration"
    },
    {
      title: "Marknadsföring",
      automation: "Lead nurturing, kampanjhantering, rapportering",
      result: "3x fler kvalificerade leads"
    },
    {
      title: "Kundservice",
      automation: "Ticket routing, automatiska svar, eskalering",
      result: "90% snabbare svarstid"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        <ServiceHero
          title="Workflow-automationer"
          description="Automatisera repetitiva processer och frigör tid för det som verkligen betyder något. Från enkla email-sekvenser till komplexa arbetsflöden."
          icon={Zap}
        />

        {/* Categories */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Vad vi kan automatisera</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Från email till komplexa arbetsflöden – vi automatiserar allt
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="p-6 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md hover:border-primary/30 transition-all duration-500">
                    <div className="p-3 rounded-xl bg-gradient-gold inline-flex mb-4">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <div className="pt-4 border-t border-border/30">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Exempel:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Resultat som räknas</h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className="p-8 text-center border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                    <benefit.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-5xl font-bold text-primary mb-2">{benefit.stat}</p>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases by Industry */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Automation per bransch</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Se hur automation kan transformera er verksamhet
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="p-8 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md">
                    <h3 className="text-2xl font-bold mb-4 text-primary">{useCase.title}</h3>
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Vad vi automatiserar:</p>
                      <p className="text-foreground">{useCase.automation}</p>
                    </div>
                    <div className="pt-6 border-t border-border/30">
                      <p className="text-sm font-semibold text-green-500">{useCase.result}</p>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <Card className="p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold mb-8 text-center">Så går vi till väga</h2>
                  <div className="space-y-6">
                    {[
                      { step: "1", title: "Kartläggning", desc: "Vi identifierar repetitiva processer och bottlenecks" },
                      { step: "2", title: "Design", desc: "Skapa automation-flows som passar era arbetsprocesser" },
                      { step: "3", title: "Implementation", desc: "Bygga och testa automationerna i er miljö" },
                      { step: "4", title: "Training", desc: "Utbilda ert team och säkerställ smooth adoption" },
                      { step: "5", title: "Optimering", desc: "Kontinuerlig förbättring baserat på data och feedback" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0 text-primary font-bold">
                          {item.step}
                        </div>
                        <div className="pt-1">
                          <h3 className="font-bold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Ownership */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <OwnershipBadge />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ServiceCTA 
              title="Vilka processer kan ni automatisera?"
              description="Boka en kostnadsfri automation-audit så identifierar vi era största möjligheter."
              primaryText="Boka automation-audit"
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