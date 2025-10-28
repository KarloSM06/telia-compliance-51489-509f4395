import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { architecturePhases } from "@/data/architecture";
import { ArchitecturePhaseCard } from "@/components/home/ArchitecturePhaseCard";
import heroBackground from "@/assets/hero-background.jpg";

const Architecture = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <img src={heroBackground} alt="Architecture Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95"></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 w-full py-24">
            <AnimatedSection className="max-w-6xl mx-auto text-center">
              <Badge className="mb-6 text-lg px-6 py-2 bg-white/10 text-white border-white/20">
                Teknisk Arkitektur
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl text-white mb-8 leading-tight font-extrabold">
                Den Enhetliga Arkitekturens{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Konst
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
                Från Integration till Konstruktion – Vi konstruerar enhetliga, skräddarsydda arkitekturer 
                där marknadsledande AI och automatisering konvergerar i ett ende, intelligent operativsystem.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  Inledning: Från Integration till Konstruktion
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

        {/* Architecture Phases - Alternating Layout */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-primary/5 via-background to-primary/5">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-20 space-y-6">
              <div className="inline-block">
                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  De Fyra Faserna
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                En djupdykning i hur vi konstruerar intelligenta, skräddarsydda system från grunden
              </p>
            </div>

            <div className="space-y-16 mb-20">
              {architecturePhases.map((phase, index) => (
                <AnimatedSection 
                  key={phase.id} 
                  delay={index * 200} 
                  direction={index % 2 === 0 ? 'left' : 'right'}
                >
                  <ArchitecturePhaseCard 
                    phase={phase}
                    imagePosition={index % 2 === 0 ? "left" : "right"}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--primary)/0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--primary)/0.08),transparent_50%)]" />
          
          <AnimatedSection>
            <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
              <div className="inline-block">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  Slutsats: Total Kompetens, Enhetligt Levererad
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
              </div>
              <div className="text-xl text-muted-foreground leading-relaxed space-y-6">
                <p>
                  Vår tekniska stack är en disciplinerad, enhetlig arkitektur. Från den komplexa Prompt Engineering 
                  som styr de intellektuella motorerna, via de säkra API-nycklarna och Webhooks som möjliggör 
                  realtidskommunikation, till den skräddarsydda Lovable-panelen som ger er total kontroll – vi har 
                  bemästrat varje lager.
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Vi erbjuder inte bara mjukvara; vi erbjuder ett konceptuellt ingenjörsarbete som omvandlar er 
                  affärslogik till ett autonomt, intelligent system.
                </p>
              </div>
              <div className="pt-8">
                <Button 
                  size="lg"
                  className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105"
                  onClick={() => window.location.href = '/'}
                >
                  Utforska Våra Lösningar
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Architecture;
