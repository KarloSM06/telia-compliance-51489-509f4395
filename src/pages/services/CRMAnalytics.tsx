import { BarChart3, TrendingUp, Users, Calendar, MessageSquare, Star, Database, Lock } from "lucide-react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FeatureShowcase } from "@/components/services/FeatureShowcase";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";

export default function CRMAnalytics() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      title: "Lead Tracking",
      description: "Följ hela kundresan från första kontakt till avslut, med fullständig historik och insikter.",
      icon: Users
    },
    {
      title: "ROI Dashboard",
      description: "Se exakt hur varje marknadsföringskanal presterar med detaljerad ROI-analys och kostnadsspårning.",
      icon: TrendingUp
    },
    {
      title: "Kommunikationsloggar",
      description: "All kommunikation (samtal, SMS, email) samlas automatiskt för fullständig översikt.",
      icon: MessageSquare
    },
    {
      title: "Kalenderintegration",
      description: "Synka bokningar och möten från alla källor till en central kalender med automatisk påminnelse.",
      icon: Calendar
    },
    {
      title: "Review Management",
      description: "Hantera och analysera kundrecensioner från alla plattformar på ett ställe.",
      icon: Star
    },
    {
      title: "Custom Reporting",
      description: "Skapa skräddarsydda rapporter och dashboards för just era KPI:er och mål.",
      icon: BarChart3
    }
  ];

  const options = [
    {
      title: "Hiems CRM Platform",
      description: "Använd vår färdiga CRM-plattform med alla funktioner inkluderade",
      features: [
        "Snabb setup – igång på dagar",
        "Regelbundna uppdateringar",
        "Delad infrastruktur",
        "Support inkluderad",
        "Månadsbaserad licens"
      ],
      price: "Från 2 995 kr/mån",
      highlight: false
    },
    {
      title: "Custom Dashboard (Du äger)",
      description: "Vi bygger en skräddarsydd lösning som du äger 100%",
      features: [
        "Full kontroll över kod & data",
        "Anpassad efter era behov",
        "Egen hosting (eller vi hjälper)",
        "Ingen månatlig licens",
        "Kontinuerlig support"
      ],
      price: "Engångskostnad + support",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        <ServiceHero
          title="CRM & Analytics Platform"
          description="Komplett system för att hantera leads, spåra ROI och optimera er försäljning. Välj mellan vår färdiga plattform eller en skräddarsydd lösning ni äger."
          icon={BarChart3}
        />

        {/* Options */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Två alternativ – ett mål</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Välj lösningen som passar er bäst
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {options.map((option, index) => (
                <AnimatedSection key={index} delay={index * 200}>
                  <Card className={`p-8 h-full relative ${
                    option.highlight 
                      ? 'border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-accent/10' 
                      : 'border-primary/10 bg-gradient-to-br from-card/80 to-card/50'
                  } backdrop-blur-md`}>
                    {option.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-primary text-sm font-bold">
                        REKOMMENDERAD
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      {option.highlight ? <Lock className="w-6 h-6 text-primary" /> : <Database className="w-6 h-6 text-primary" />}
                      <h3 className="text-2xl font-bold">{option.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">{option.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-6 border-t border-border/30">
                      <p className="text-2xl font-bold text-primary mb-4">{option.price}</p>
                      <Button 
                        className="w-full bg-gradient-gold text-primary hover:shadow-glow"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Läs mer
                      </Button>
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
              <h2 className="text-4xl font-bold mb-4">Funktioner</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Allt ni behöver för att hantera kundrelationer och maximera ROI
              </p>
            </AnimatedSection>

            <FeatureShowcase features={features} />
          </div>
        </section>

        {/* Data Security */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <Card className="p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                <div className="max-w-3xl mx-auto text-center">
                  <Lock className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="text-4xl font-bold mb-6">Säker datahantering</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    All kunddata krypteras både i vila och transit. Vi följer GDPR och säkerställer att ni har full kontroll över er data.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="font-bold text-primary mb-2">Kryptering</p>
                      <p className="text-sm text-muted-foreground">AES-256 standard</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-2">GDPR-kompatibel</p>
                      <p className="text-sm text-muted-foreground">Full datakontroll</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-2">Backup</p>
                      <p className="text-sm text-muted-foreground">Dagliga säkerhetskopior</p>
                    </div>
                  </div>
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
              title="Vilken lösning passar er?"
              description="Boka en genomgång så hjälper vi er välja rätt CRM-lösning för era behov."
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