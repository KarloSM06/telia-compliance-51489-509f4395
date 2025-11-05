import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { OnboardingTimeline } from "@/components/home/OnboardingTimeline";
import { CustomerJourneyFlow } from "@/components/home/CustomerJourneyFlow";
import { TechnicalExpertise } from "@/components/home/TechnicalExpertise";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { Card } from "@/components/ui/card";
import { Shield, HeadphonesIcon, GraduationCap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";

export default function HowItWorks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supportAreas = [
    {
      icon: HeadphonesIcon,
      title: "Teknisk Support",
      description: "Snabb hjälp vid tekniska frågor via email, telefon eller chat. Prioriterad support för alla kunder."
    },
    {
      icon: GraduationCap,
      title: "Utbildning & Dokumentation",
      description: "Omfattande träning för ert team och detaljerad dokumentation för alla funktioner."
    },
    {
      icon: TrendingUp,
      title: "Kontinuerlig Optimering",
      description: "Vi följer upp resultat och föreslår förbättringar baserat på användning och feedback."
    },
    {
      icon: Shield,
      title: "Säkerhet & Underhåll",
      description: "Regelbundna säkerhetsuppdateringar, backup och proaktivt underhåll av era system."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Hur vi arbetar
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                En tydlig process från dag 1 till lansering – och långt därefter. Vi finns med er hela vägen.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Onboarding Process */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Implementeringsprocess</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                En strukturerad process som säkerställer lyckad implementation
              </p>
            </AnimatedSection>
            
            <OnboardingTimeline />
          </div>
        </section>

        {/* Customer Journey */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Kundresan</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Se hur era kunder möter Hiems – från första kontakten till långsiktig tillväxt
              </p>
            </AnimatedSection>
            
            <CustomerJourneyFlow />
          </div>
        </section>

        {/* Technical Expertise */}
        <TechnicalExpertise onBookDemo={() => setIsModalOpen(true)} />

        {/* Support & Maintenance */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Support & Underhåll</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Vi försvinner inte efter lansering – vi är er långsiktiga partner
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {supportAreas.map((area, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className="p-8 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md hover:border-primary/30 transition-all duration-500">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-gold shadow-lg">
                        <area.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{area.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{area.description}</p>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <Card className="p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold mb-8">Vår framgångsmätning</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-5xl font-bold text-primary mb-2">98%</p>
                      <p className="text-muted-foreground">Nöjda kunder</p>
                    </div>
                    <div>
                      <p className="text-5xl font-bold text-primary mb-2">&lt;48h</p>
                      <p className="text-muted-foreground">Genomsnittlig svarstid</p>
                    </div>
                    <div>
                      <p className="text-5xl font-bold text-primary mb-2">100%</p>
                      <p className="text-muted-foreground">Transparens</p>
                    </div>
                  </div>
                  <p className="mt-8 text-lg text-muted-foreground">
                    Vi mäter vår framgång på era resultat – inte bara på vad vi levererar
                  </p>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ServiceCTA 
              title="Redo att komma igång?"
              description="Boka ett kostnadsfritt möte så berättar vi mer om hur vi kan hjälpa er."
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