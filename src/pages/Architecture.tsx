import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArchitecturePhaseCard } from "@/components/home/ArchitecturePhaseCard";
import { architecturePhases } from "@/data/architecture";
import heroBackground from "@/assets/hero-background.jpg";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";

const Architecture = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative overflow-hidden bg-gradient-hero">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-40 lg:py-56 min-h-screen flex items-center">
          <div className="absolute inset-0 overflow-hidden">
            <img src={heroBackground} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95"></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 w-full">
            <AnimatedSection className="max-w-7xl mx-auto text-center">
              <Badge className="mb-6 text-lg px-6 py-2 bg-white/10 text-white border-white/20">
                Teknisk Arkitektur
              </Badge>
              <h1 className="text-6xl sm:text-7xl text-white mb-8 leading-tight font-extrabold text-center lg:text-8xl">
                Den Enhetliga Arkitekturens{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Konst
                </span>
              </h1>
              
              <p className="text-2xl sm:text-3xl text-white/95 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
                Från Integration till Konstruktion – Vi konstruerar enhetliga, skräddarsydda arkitekturer 
                där marknadsledande AI och automatisering konvergerar i ett enda, intelligent operativsystem.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-bold text-xl px-12 py-8 h-auto"
                  onClick={() => setIsConsultationModalOpen(true)}
                >
                  Boka demo
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Introduction */}
        <section className="relative py-24 px-6 lg:px-12 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <AnimatedSection>
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="inline-block mb-8 mx-auto block text-center w-full">
                <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  Från Integration till Konstruktion
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I den moderna digitala ekonomin är teknisk kompetens inte definierad av antalet verktyg man använder, 
                  utan av djupet i integrationen och komplexiteten i den orkestrerade logiken. Vårt arbete överskrider 
                  enkel verktygsanvändning; vi konstruerar enhetliga, skräddarsydda arkitekturer där marknadsledande AI 
                  och automatisering konvergerar i ett enda, intelligent operativsystem.
                </p>
                <p>
                  Detta manifest belyser den mekaniska ingenjörskonsten som ligger bakom vår tekniska stack – från Prompt 
                  Engineering och hanteringen av API-nycklar till implementeringen av Webhooks och den strategiska utrullningen 
                  av varje komponent. Vår slutprodukt är inte en samling applikationer, utan en skräddarsydd, Lovable-driven 
                  Custom Dashboard som fungerar som er kommandobrygga.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Architecture Phases */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
          
          <div className="mx-auto max-w-[1800px] px-6 lg:px-8 relative z-10">
            <div className="space-y-12">
              {architecturePhases.map((phase, index) => (
                <AnimatedSection 
                  key={phase.id} 
                  delay={index * 200}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                >
                  <ArchitecturePhaseCard 
                    phase={phase} 
                    imagePosition={index % 2 === 0 ? 'left' : 'right'} 
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusion / CTA */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
          
          <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center">
              <div className="inline-block mb-8">
                <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  Total Kompetens, Enhetligt Levererad
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
              </div>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-12">
                <p>
                  Vår tekniska stack är en disciplinerad, enhetlig arkitektur. Från den komplexa Prompt Engineering som 
                  styr de intellektuella motorerna, via de säkra API-nycklarna och Webhooks som möjliggör realtidskommunikation, 
                  till den skräddarsydda Lovable-panelen som ger er total kontroll – vi har bemästrat varje lager.
                </p>
                <p className="text-xl font-semibold text-foreground">
                  Vi erbjuder inte bara mjukvara; vi erbjuder ett konceptuellt ingenjörsarbete som omvandlar er 
                  affärslogik till ett autonomt, intelligent system.
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold text-xl px-12 py-8 h-auto"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                Diskutera er arkitektur med oss
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />

      <ConsultationModal
        open={isConsultationModalOpen}
        onOpenChange={setIsConsultationModalOpen}
      />
    </div>
  );
};

export default Architecture;
