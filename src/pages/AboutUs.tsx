import { Header1 } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Phone, Users, Lightbulb, Rocket, TrendingUp, Linkedin } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ConsultationModal } from "@/components/ConsultationModal";
import { useState } from "react";
import antonImage from "@/assets/anton-sallnas.png";
import karloImage from "@/assets/karlo-mangione.png";
import emilImage from "@/assets/emil-westerberg.png";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";
import svensktLokalImage from "@/assets/data-insight.jpg";
import endToEndImage from "@/assets/service-operations.jpg";
import bvisatRoiImage from "@/assets/growth-sales-accelerator.jpg";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card, CardContent } from "@/components/ui/card";
import { TeamSection } from "@/components/ui/team-section";

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
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  
  const scrollToTeam = () => {
    document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <Header1 />
      
      <AuroraBackground>
        <main className="relative">
          {/* Hero Section */}
          <section className="relative pt-32 pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
            
            {/* Hiems Logo Backgrounds */}
            <div className="absolute -top-32 -right-32 w-[800px] h-[800px] opacity-5 pointer-events-none">
              <img 
                src={hiemsLogoSnowflake} 
                alt="" 
                className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
              />
            </div>
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={0}>
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
                    <Button size="lg" onClick={scrollToTeam}>
                      Möt teamet
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setIsConsultationModalOpen(true)}>
                      Boka demo
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* Vad är Hiems? */}
          <section className="relative py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={100}>
                <div className="mx-auto max-w-4xl">
                  <Card className="bg-card/20 backdrop-blur-md border border-primary/10">
                    <CardContent className="p-10 space-y-8">
                    <div className="text-center space-y-4">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Vad är Hiems?
                      </h2>
                    </div>
                    
                    <p className="text-lg text-center leading-relaxed text-muted-foreground">
                      Hiems är ett svenskt AI-företag som specialiserar sig på praktisk implementation av AI-lösningar för företag. Vi tror inte på fancy teknologi för teknikens skull - vi bygger system som faktiskt ökar lönsamhet och förenklar processer.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                      {[
                        { title: "Svenskt företag", desc: "Som förstår svenska marknaden och företag" },
                        { title: "Teknisk expertis + Affärsförståelse", desc: "Vi både förstår och bygger lösningen" },
                        { title: "End-to-End", desc: "Från strategi till implementation - allt under ett tak" },
                        { title: "Bevisat ROI", desc: "Våra kunder ser mätbar avkastning" }
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3 group">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div>
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="relative py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <div className="grid lg:grid-cols-2 gap-8">
                <AnimatedSection delay={0}>
                  <Card className="h-full bg-card/20 backdrop-blur-md border border-primary/10">
                    <CardContent className="p-10 space-y-6">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Vår Vision
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      Göra AI tillgängligt och lönsamt för alla svenska företag - oavsett storlek eller bransch. AI ska inte vara förbehållet stora koncerner med djupa fickor.
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
                  <Card className="h-full bg-card/20 backdrop-blur-md border border-primary/10">
                    <CardContent className="p-10 space-y-6">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Vår Mission
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      Leverera AI-lösningar som mäts på en sak: resultatet de ger våra kunder. Inga fluffiga buzzwords. Inga tomma löften.
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

          {/* Våra Värderingar */}
          <section className="relative py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={0}>
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
                  { title: "Transparens", desc: "Inga dolda kostnader eller fluffiga löften. Vi är alltid ärliga om vad som är möjligt och vad det kostar." },
                  { title: "Expertis", desc: "Djup teknisk kunskap från AI-modeller till implementation. Vi vet vad vi gör." },
                  { title: "Resultat", desc: "Vi mäts på er framgång, inte våra timmar. Mätbara resultat är vår målsättning." },
                  { title: "Partnerskap", desc: "Vi är er långsiktiga AI-partner, inte bara en leverantör. Vi växer tillsammans." }
                ].map((value, index) => (
                  <AnimatedSection key={value.title} delay={index * 100}>
                    <Card className="h-full bg-card/20 backdrop-blur-md border border-primary/10">
                      <CardContent className="p-8 text-center space-y-4">
                      <h3 className="text-xl font-bold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.desc}
                      </p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          {/* Så Arbetar Vi */}
          <section className="relative py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={0}>
                <div className="text-center space-y-4 mb-16">
                  <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Så Arbetar Vi
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Vår beprövade process för framgångsrik AI-implementation
                  </p>
                </div>
              </AnimatedSection>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Lyssna", desc: "Vi börjar alltid med att förstå era specifika utmaningar och mål.", icon: Users },
                  { title: "Analysera", desc: "Djup behovsanalys innan vi föreslår någon lösning.", icon: Lightbulb },
                  { title: "Bygga", desc: "Skräddarsydda AI-system som löser era verkliga problem.", icon: Rocket },
                  { title: "Optimera", desc: "Kontinuerlig förbättring baserat på data och resultat.", icon: TrendingUp }
                ].map((step, index) => (
                  <AnimatedSection key={step.title} delay={index * 100}>
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30 mx-auto hover:scale-110 transition-transform duration-500">
                        <step.icon className="h-12 w-12 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section - New Component */}
          <section id="team-section">
            <TeamSection
              title="TEAM"
              description="Människorna som gör AI-magin möjlig"
              members={teamMembers.map(member => ({
                name: member.name,
                designation: member.role,
                imageSrc: member.image || "",
                socialLinks: [
                  { icon: Mail, href: `mailto:${member.email}` },
                  { icon: Phone, href: `tel:${member.phone.replace(/\s/g, '')}` }
                ]
              }))}
            />
          </section>

          {/* Vår Resa */}
          <section className="relative py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={0}>
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
                <Card className="bg-card/20 backdrop-blur-md border border-primary/10">
                  <CardContent className="p-10">
                  <div className="space-y-8">
                    {[
                      { year: "2024", title: "Hiems Grundas", desc: "Hiems grundas med fokus på AI-lösningar för att revolutionera svensk affärsverksamhet genom innovativ teknologi." },
                      { year: "2025", title: "ChronoDesk Grundas", desc: "ChronoDesk startas med specialisering inom AI-driven automation och intelligenta system." },
                      { year: "Okt 2025", title: "Historisk Sammanslagning", desc: "Hiems och ChronoDesk slår sina krafter samman och etablerar samtidigt sitt första strategiska partnerskap med en klient." },
                      { year: "2025-", title: "Explosiv Tillväxt", desc: "Ett otroligt snabbt växande företag med fler kunder, fler branscher och fler framgångshistorier varje månad." }
                    ].map((milestone, index) => (
                      <AnimatedSection key={milestone.year} delay={index * 100}>
                        <div className="flex gap-6 group items-center">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-sm text-center text-primary-foreground px-2 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                              {milestone.year}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">{milestone.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{milestone.desc}</p>
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

          {/* Varför Välja Hiems */}
          <section className="relative py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={0}>
                <div className="text-center space-y-4 mb-16">
                  <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Varför Välja Hiems?
                  </h2>
                </div>
              </AnimatedSection>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Svenskt & Lokalt", desc: "Vi förstår svenska företag, svenska marknaden och svenska utmaningar. Ingen kulturell eller språklig barriär.", image: svensktLokalImage },
                  { title: "End-to-End", desc: "Från strategi till drift, vi hanterar allt. En partner för hela er AI-resa, inte bara en leverantör.", image: endToEndImage },
                  { title: "Bevisat ROI", desc: "Våra kunder ser mätbar avkastning. Vi bygger system som faktiskt ökar lönsamhet och effektivitet.", image: bvisatRoiImage }
                ].map((benefit, index) => (
                  <AnimatedSection key={benefit.title} delay={index * 100}>
                    <Card className="h-full bg-card/20 backdrop-blur-md border border-primary/10 overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={benefit.image} 
                          alt={benefit.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent" />
                      </div>
                      <div className="p-8 space-y-4 text-center">
                        <h3 className="text-2xl font-bold">{benefit.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
                      </div>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
              <AnimatedSection delay={0}>
                <Card className="max-w-4xl mx-auto bg-card/20 backdrop-blur-md border border-primary/20">
                  <CardContent className="p-12 text-center space-y-8">
                  <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Redo att transformera er verksamhet med AI?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Boka ett kostnadsfritt strategimöte och få en skräddarsydd plan för hur AI kan öka er lönsamhet.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" onClick={() => setIsConsultationModalOpen(true)}>
                      Boka demo
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => window.location.href = 'mailto:info@hiems.se'}>
                      <Mail className="mr-2 h-4 w-4" />
                      Kontakta oss
                    </Button>
                  </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </section>
        </main>
      </AuroraBackground>

      <ConsultationModal 
        open={isConsultationModalOpen} 
        onOpenChange={setIsConsultationModalOpen} 
      />
    </div>
  );
};

export default AboutUs;
