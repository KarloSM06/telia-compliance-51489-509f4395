import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Phone, Target, Rocket, Users, Lightbulb, Eye, Heart, TrendingUp, Shield, Handshake, Zap, Award, Globe } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import antonImage from "@/assets/anton-sallnas.png";
import karloImage from "@/assets/karlo-mangione.png";
import emilImage from "@/assets/emil-westerberg.png";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";

// Logo imports for tech expertise
import openaiLogo from "/images/logos/openai.png";
import claudeLogo from "/images/logos/claude.png";
import geminiLogo from "/images/logos/gemini.png";
import deepseekLogo from "/images/logos/deepseek.png";
import vapiLogo from "/images/logos/vapi.png";
import retellLogo from "/images/logos/retell.png";
import makeLogo from "/images/logos/make.png";
import n8nLogo from "/images/logos/n8n.png";
import lovableLogo from "/images/logos/lovable.png";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  email: string;
  phone: string;
  bio: string;
  highlights: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Karlo Mangione",
    role: "COO",
    image: karloImage,
    email: "karlo.mangione@hiems.se",
    phone: "070-231 22 71",
    bio: "Sedan 2022 har jag arbetat med AI, inte för att det är fancy tech, utan för att jag såg något som många missade: AI behöver inte vara komplicerat eller hotfullt. Det är ett verktyg. Ett jävligt bra verktyg som kan öka lönsamhet och förenkla processer när det implementeras rätt.",
    highlights: [
      "Strategisk riktning och hands-on utveckling av skräddarsydda AI-lösningar",
      "Både förstår affären och kan bygga lösningen tekniskt",
      "Hjälper företag över alla branscher att implementera AI på riktigt",
      "Ingen copy-paste. Ingen one-size-fits-all. Alltid ordentlig behovsanalys först",
      "Bygger system som faktiskt löser specifika utmaningar och ökar lönsamhet",
      "Driven, passionerad och slutför det jag påbörjar. Period.",
      "Bakgrund från Södra Latins naturvetenskapsprogram",
      "Nyfikenhet och vilja att lösa problem driver mig framåt varje dag"
    ]
  },
  {
    name: "Anton Sallnäs",
    role: "CEO",
    image: antonImage,
    email: "anton@hiems.se",
    phone: "070-657 15 32",
    bio: "Som grundare och VD för Hiems leder jag vår vision att göra AI tillgängligt och kraftfullt för alla företag. Min resa började på Södra Latin där grunden lades, men det är passionen för teknologi och affärsutveckling som driver mig.",
    highlights: [
      "Grundare och VD - driver Hiems strategiska vision",
      "Såg tidigt den enorma potentialen i AI för företag",
      "Bakgrund från Södra Latins naturvetenskapsprogram",
      "Expert på att identifiera affärsmöjligheter med AI-teknik",
      "Bygger långsiktiga partnerskap med våra kunder",
      "Fokus på att göra komplex teknologi enkel att använda",
      "Strategisk affärsutveckling och ledarskap"
    ]
  },
  {
    name: "Emil Westerberg",
    role: "CLO",
    image: emilImage,
    email: "emil@hiems.se",
    phone: "072-327 34 65",
    bio: "Med en bakgrund från Bernadotte Gymnasiet och värnplikten har jag utvecklat en unik kombination av teknisk expertis och ledarskapsförmåga. Min tid i lumpen lärde mig ovärderliga lärdomar om organisation, struktur och att leda under press.",
    highlights: [
      "Chief Legal Officer - ansvarar för legal och compliance",
      "Bakgrund från Bernadotte Gymnasiet",
      "Militär utbildning gav stark grund i ledarskap och organisation",
      "Expert inom dokumentation och pappersarbete",
      "Säkerställer att alla våra AI-lösningar följer regelverk och best practices",
      "Strukturerad approach till komplexa utmaningar",
      "Bygger robusta processer och system"
    ]
  },
  {
    name: "Malte Ekbäck",
    role: "CFO",
    email: "malte@hiems.se",
    phone: "073-024 66 28",
    bio: "Jag har alltid varit driven av att skapa värde. Från att sälja kläder som tonåring till att hantera företagets ekonomi - min entreprenörsanda och kreativitet har följt med genom hela resan.",
    highlights: [
      "Chief Financial Officer - driver företagets ekonomiska strategi",
      "Entreprenör sedan tidig ålder med försäljningserfarenhet",
      "Kreativ problemlösare som ser möjligheter överallt",
      "Har byggt upp affärsförståelse genom praktisk erfarenhet",
      "Driven av att maximera värdeskapande för kunder och företag",
      "Kombinerar finansiell expertis med entreprenöriellt tänkande",
      "Fokus på hållbar tillväxt och lönsamhet"
    ]
  }
];

const AboutUs = () => {
  const scrollToTeam = () => {
    document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-32 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
          
          {/* Hiems Logo Backgrounds - Multiple Snowflakes */}
          {/* Top Right - Large Slow Rotation */}
          <div className="absolute -top-32 -right-32 w-[800px] h-[800px] opacity-5 pointer-events-none">
            <img 
              src={hiemsLogoSnowflake} 
              alt="" 
              className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
            />
          </div>
          
          {/* Top Left - Medium Fast Rotation */}
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
            <img 
              src={hiemsLogoSnowflake} 
              alt="" 
              className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]"
            />
          </div>
          
          {/* Bottom Center - Small Medium Rotation */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] opacity-[0.04] pointer-events-none">
            <img 
              src={hiemsLogoSnowflake} 
              alt="" 
              className="w-full h-full object-contain animate-[spin_50s_linear_infinite]"
            />
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="mx-auto max-w-4xl text-center space-y-8">
                <div className="inline-block">
                  <span className="text-sm font-semibold tracking-wider text-primary uppercase">Om Hiems</span>
                  <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                  Där AI blir verklighet för svenska företag
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Möt teamet som kombinerar djup teknisk expertis med affärsförståelse - ingen copy-paste, inga buzzwords, bara AI-lösningar som faktiskt levererar resultat.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" onClick={scrollToTeam} className="gap-2">
                    <Users className="h-5 w-5" />
                    Möt teamet
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => window.location.href = '/demo'}>
                    Boka demo
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Vad är Hiems? Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/3 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.12),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="mx-auto max-w-4xl">
                <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                  <CardContent className="p-10 space-y-8">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30">
                        <Rocket className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Vad är Hiems?
                      </h2>
                    </div>
                    
                    <p className="text-lg text-center leading-relaxed text-muted-foreground">
                      Hiems är ett svenskt AI-företag som specialiserar sig på praktisk implementation av AI-lösningar för företag. Vi tror inte på fancy teknologi för teknikens skull - vi bygger system som faktiskt ökar lönsamhet och förenklar processer.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                      <div className="flex items-start gap-3 group">
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div>
                          <h4 className="font-semibold mb-1">Svenskt företag</h4>
                          <p className="text-sm text-muted-foreground">Som förstår svenska marknaden och företag</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 group">
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div>
                          <h4 className="font-semibold mb-1">Teknisk expertis + Affärsförståelse</h4>
                          <p className="text-sm text-muted-foreground">Vi både förstår och bygger lösningen</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 group">
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div>
                          <h4 className="font-semibold mb-1">End-to-End</h4>
                          <p className="text-sm text-muted-foreground">Från strategi till implementation - allt under ett tak</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 group">
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div>
                          <h4 className="font-semibold mb-1">Bevisat ROI</h4>
                          <p className="text-sm text-muted-foreground">Våra kunder ser mätbar avkastning</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Vår Vision & Mission Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-8">
              <AnimatedSection delay={0}>
                <Card className="h-full border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500">
                  <CardContent className="p-10 space-y-6 h-full flex flex-col">
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30">
                        <Eye className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Vår Vision
                      </h3>
                    </div>
                    
                    <p className="text-lg leading-relaxed text-muted-foreground flex-1">
                      Göra AI tillgängligt och lönsamt för alla svenska företag - oavsett storlek eller bransch. AI ska inte vara förbehållet stora koncerner med djupa fickor. Det är ett verktyg som alla kan och bör använda.
                    </p>
                    
                    <div className="pt-4 border-t border-primary/10">
                      <p className="text-sm text-muted-foreground italic">
                        "AI är inte framtiden - det är nuet. Vi gör det tillgängligt för alla."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection delay={100}>
                <Card className="h-full border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500">
                  <CardContent className="p-10 space-y-6 h-full flex flex-col">
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30">
                        <Target className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Vår Mission
                      </h3>
                    </div>
                    
                    <p className="text-lg leading-relaxed text-muted-foreground flex-1">
                      Leverera AI-lösningar som mäts på en sak: resultatet de ger våra kunder. Inga fluffiga buzzwords. Inga tomma löften. Bara konkreta system som automatiserar processer, ökar försäljning och ger mätbar ROI.
                    </p>
                    
                    <div className="pt-4 border-t border-primary/10">
                      <p className="text-sm text-muted-foreground italic">
                        "Vi mäts på era resultat, inte våra timmar."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Våra Värderingar Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/3 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.12),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Våra Värderingar
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Fyra principer som styr allt vi gör
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Transparens",
                  description: "Inga dolda kostnader eller fluffiga löften. Vi är alltid ärliga om vad som är möjligt och vad det kostar."
                },
                {
                  icon: Zap,
                  title: "Expertis",
                  description: "Djup teknisk kunskap från AI-modeller till implementation. Vi vet vad vi gör."
                },
                {
                  icon: TrendingUp,
                  title: "Resultat",
                  description: "Vi mäts på er framgång, inte våra timmar. Mätbara resultat är vår målsättning."
                },
                {
                  icon: Handshake,
                  title: "Partnerskap",
                  description: "Vi är er långsiktiga AI-partner, inte bara en leverantör. Vi växer tillsammans."
                }
              ].map((value, index) => (
                <AnimatedSection key={value.title} delay={index * 80}>
                  <Card className="h-full border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 group">
                    <CardContent className="p-8 space-y-4 text-center h-full flex flex-col">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30 mx-auto group-hover:scale-110 transition-transform duration-500">
                        <value.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Vår Approach Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Så Arbetar Vi
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Vår beprövade process för framgångsrik AI-implementation
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting line - hidden on mobile */}
              <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" style={{ top: '3rem' }} />
              
              {[
                {
                  step: "01",
                  title: "Lyssna",
                  description: "Vi börjar alltid med att förstå era specifika utmaningar och mål.",
                  icon: Users
                },
                {
                  step: "02",
                  title: "Analysera",
                  description: "Djup behovsanalys innan vi föreslår någon lösning.",
                  icon: Lightbulb
                },
                {
                  step: "03",
                  title: "Bygga",
                  description: "Skräddarsydda AI-system som löser era verkliga problem.",
                  icon: Rocket
                },
                {
                  step: "04",
                  title: "Optimera",
                  description: "Kontinuerlig förbättring baserat på data och resultat.",
                  icon: TrendingUp
                }
              ].map((step, index) => (
                <AnimatedSection key={step.step} delay={index * 100}>
                  <div className="relative">
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 mx-auto hover:scale-110 transition-transform duration-500 relative z-10">
                          <step.icon className="h-10 w-10 text-primary-foreground" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-lg">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section id="team-section" className="relative py-24 bg-gradient-to-b from-background via-primary/3 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--primary)/0.12),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12 relative">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Möt Vårt Team
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Människorna som gör AI-magin möjlig
                </p>
              </div>
            </AnimatedSection>
            
            {teamMembers.map((member, index) => {
              const isImageLeft = index % 2 === 0;
              
              return (
                <AnimatedSection key={member.name} delay={index * 100}>
                  <Card className="flex flex-col lg:flex-row overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group">
                    {/* Image Section */}
                    <div className={`lg:w-2/5 relative overflow-hidden flex-shrink-0 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      {member.image ? (
                        <>
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center border-4 border-primary/30 shadow-lg">
                            <span className="text-6xl font-bold text-primary-foreground">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      <CardContent className="flex-1 p-8 lg:p-10 space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                          <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            {member.name}
                          </h3>
                          <p className="text-lg text-muted-foreground font-light">
                            {member.role}
                          </p>
                        </div>
                        
                        {/* Bio */}
                        <p className="text-base leading-relaxed text-foreground/90">
                          {member.bio}
                        </p>
                        
                        {/* Highlights List */}
                        <div className="space-y-3">
                          {member.highlights.slice(0, 5).map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-3 group/item">
                              <div className="mt-1 flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-sm leading-relaxed text-muted-foreground">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1 gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                            onClick={() => window.location.href = `mailto:${member.email}`}
                          >
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                            onClick={() => window.location.href = `tel:${member.phone.replace(/\s/g, '')}`}
                          >
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        {/* Vår Historia Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Vår Resa
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Från vision till verklighet
                </p>
              </div>
            </AnimatedSection>
            
            <div className="max-w-4xl mx-auto">
              <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
                <CardContent className="p-10">
                  <div className="space-y-8">
                    {[
                      {
                        year: "2022",
                        title: "Grundandet",
                        description: "Anton och Karlo grundar Hiems med en vision: göra AI praktiskt och lönsamt för svenska företag."
                      },
                      {
                        year: "2023",
                        title: "Första Kunderna",
                        description: "Proof of concept levereras. Våra första kunder ser mätbar ROI från AI-implementation."
                      },
                      {
                        year: "2024",
                        title: "Team Expansion",
                        description: "Emil och Malte ansluter. Hiems-produktportfölj lanseras med Eko, Gastro, Krono och Talent."
                      },
                      {
                        year: "2025",
                        title: "Fortsatt Tillväxt",
                        description: "Fler kunder, fler branscher, fler framgångshistorier. AI-framtiden är här."
                      }
                    ].map((milestone, index) => (
                      <AnimatedSection key={milestone.year} delay={index * 100}>
                        <div className="flex gap-6 group">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                              {milestone.year}
                            </div>
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className="text-2xl font-bold mb-2">{milestone.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                        {index < 3 && (
                          <div className="ml-10 w-0.5 h-8 bg-gradient-to-b from-primary/50 to-primary/20" />
                        )}
                      </AnimatedSection>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Teknisk Expertis Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/3 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.12),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Teknisk Expertis
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Vi behärskar hela AI-ekosystemet
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: "OpenAI", logo: openaiLogo },
                { name: "Claude", logo: claudeLogo },
                { name: "Gemini", logo: geminiLogo },
                { name: "DeepSeek", logo: deepseekLogo },
                { name: "Vapi", logo: vapiLogo },
                { name: "Retell", logo: retellLogo },
                { name: "Make", logo: makeLogo },
                { name: "n8n", logo: n8nLogo },
                { name: "Lovable", logo: lovableLogo }
              ].map((tech, index) => (
                <AnimatedSection key={tech.name} delay={index * 50}>
                  <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500 group">
                    <CardContent className="p-6 flex items-center justify-center h-32">
                      <img 
                        src={tech.logo} 
                        alt={tech.name} 
                        className="max-w-full max-h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Varför Välja Hiems Section */}
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Varför Välja Hiems?
                </h2>
              </div>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Svenskt & Lokalt",
                  description: "Vi förstår svenska företag, svenska marknaden och svenska utmaningar. Ingen kulturell eller språklig barriär."
                },
                {
                  icon: Award,
                  title: "End-to-End",
                  description: "Från strategi till drift, vi hanterar allt. En partner för hela er AI-resa, inte bara en leverantör."
                },
                {
                  icon: TrendingUp,
                  title: "Bevisat ROI",
                  description: "Våra kunder ser mätbar avkastning. Vi bygger system som faktiskt ökar lönsamhet och effektivitet."
                }
              ].map((benefit, index) => (
                <AnimatedSection key={benefit.title} delay={index * 100}>
                  <Card className="h-full border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 group">
                    <CardContent className="p-10 space-y-6 text-center h-full flex flex-col">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30 mx-auto group-hover:scale-110 transition-transform duration-500">
                        <benefit.icon className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed flex-1">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Kontakt & CTA Section */}
        <section className="relative py-32 bg-gradient-to-b from-background via-primary/10 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.2),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <AnimatedSection>
              <Card className="max-w-4xl mx-auto border border-primary/20 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-md shadow-2xl shadow-primary/20">
                <CardContent className="p-12 text-center space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30 mx-auto">
                      <Rocket className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Redo att ta steget in i AI-framtiden?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Boka din gratis behovsanalys idag och låt oss visa hur AI kan transformera ert företag.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" className="gap-2" onClick={() => window.location.href = '/demo'}>
                      <Rocket className="h-5 w-5" />
                      Boka Gratis Behovsanalys
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => window.location.href = 'mailto:info@hiems.se'}>
                      <Mail className="h-5 w-5" />
                      Kontakta Oss
                    </Button>
                  </div>
                  
                  <div className="pt-8 border-t border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      Eller kontakta vårt team direkt - vi svarar alltid inom 24 timmar.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
