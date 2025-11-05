import { Layout, Code, Smartphone, Palette, Server, Shield } from "lucide-react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FeatureShowcase } from "@/components/services/FeatureShowcase";
import { OwnershipBadge } from "@/components/services/OwnershipBadge";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ProcessTimeline } from "@/components/services/ProcessTimeline";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Lightbulb, FileCode, TestTube, Rocket, HeadphonesIcon } from "lucide-react";

export default function CustomDashboards() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      title: "Full Kod-äganderätt",
      description: "Ni får all källkod och äger 100% av applikationen. Ingen inlåsning, total frihet att vidareutveckla.",
      icon: Code
    },
    {
      title: "Mobil-responsiv Design",
      description: "Alla lösningar fungerar perfekt på desktop, tablet och mobil med modern responsive design.",
      icon: Smartphone
    },
    {
      title: "Skräddarsydd Design",
      description: "Design och funktionalitet anpassas helt efter ert varumärke och era specifika behov.",
      icon: Palette
    },
    {
      title: "Modern Tech Stack",
      description: "Vi bygger med React, TypeScript och Supabase – samma teknologi som Hiems använder.",
      icon: Server
    },
    {
      title: "Säker & Skalbar",
      description: "Enterprise-grade säkerhet med kryptering och infrastruktur som växer med ert företag.",
      icon: Shield
    },
    {
      title: "Integration-first",
      description: "Sömlös integration med era befintliga system, API:er och databaser.",
      icon: Layout
    }
  ];

  const processSteps = [
    {
      title: "Discovery & Design",
      description: "Vi kartlägger era behov, skapar wireframes och designar användargränssnittet tillsammans med er.",
      icon: Lightbulb,
      duration: "1-2 veckor"
    },
    {
      title: "Utveckling",
      description: "Vårt team bygger applikationen med regelbundna demos och möjlighet till feedback.",
      icon: FileCode,
      duration: "4-8 veckor"
    },
    {
      title: "Testing & QA",
      description: "Grundlig testning av funktionalitet, säkerhet och prestanda innan lansering.",
      icon: TestTube,
      duration: "1 vecka"
    },
    {
      title: "Deployment",
      description: "Vi lanserar applikationen på er egen hosting eller hjälper er sätta upp infrastruktur.",
      icon: Rocket,
      duration: "1 vecka"
    },
    {
      title: "Training & Support",
      description: "Utbildning för ert team och kontinuerlig support efter lansering.",
      icon: HeadphonesIcon,
      duration: "Kontinuerlig"
    }
  ];

  const examples = [
    {
      title: "Kundportal",
      description: "Låt era kunder logga in och se bokningar, fakturor och kommunikationshistorik.",
      use: "Servicebolag, konsulter"
    },
    {
      title: "Admin Dashboard",
      description: "Kraftfullt verktyg för att hantera bokningar, kunder och analysera data.",
      use: "E-handel, SaaS-företag"
    },
    {
      title: "Booking System",
      description: "Skräddarsytt bokningssystem med integration till kalender och betalning.",
      use: "Hotell, events, kurser"
    },
    {
      title: "Analytics Platform",
      description: "Custom analytics med realtidsdata och avancerad rapportering.",
      use: "Marketing, sales"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        <ServiceHero
          title="Skräddarsydda Dashboards & Webbappar"
          description="Vi bygger custom web-applikationer och dashboards som ni äger 100%. Från design till deployment – allt anpassat efter era behov."
          icon={Layout}
        />

        {/* What We Build */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Vad vi bygger</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Från enkla dashboards till kompletta SaaS-plattformar
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map((example, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="p-6 h-full border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md hover:border-primary/30 transition-all duration-500">
                    <h3 className="text-xl font-bold mb-3 text-primary">{example.title}</h3>
                    <p className="text-muted-foreground mb-4">{example.description}</p>
                    <div className="pt-4 border-t border-border/30">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Användningsområde:</span> {example.use}
                      </p>
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
              <h2 className="text-4xl font-bold mb-4">Inkluderat i varje projekt</h2>
            </AnimatedSection>

            <FeatureShowcase features={features} />
          </div>
        </section>

        {/* Development Process */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Utvecklingsprocess</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transparent process från start till mål
              </p>
            </AnimatedSection>

            <ProcessTimeline steps={processSteps} orientation="vertical" />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <Card className="p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-4xl font-bold mb-6">Teknologi vi använder</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Vi bygger med modern, beprövad teknologi som säkerställer säkerhet, prestanda och skalbarhet.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vite', 'PostgreSQL', 'Edge Functions', 'REST APIs'].map((tech, i) => (
                      <div key={i} className="p-4 rounded-xl bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                        <p className="font-semibold text-primary">{tech}</p>
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
              title="Låt oss bygga tillsammans"
              description="Berätta om er idé så hjälper vi er att göra den till verklighet."
              primaryText="Diskutera ditt projekt"
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