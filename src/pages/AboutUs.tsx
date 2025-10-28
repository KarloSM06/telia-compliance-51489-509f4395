import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Phone } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import antonImage from "@/assets/anton-sallnas.png";
import karloImage from "@/assets/karlo-mangione.png";
import emilImage from "@/assets/emil-westerberg.png";

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
  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Header />
      
      <main className="pt-16 relative">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Möt teamet bakom{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Hiems
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/90">
                Vi är ett svenskt team som brinner för att göra AI tillgängligt, kraftfullt och lönsamt för företag. Inga buzzwords. Inga löften vi inte kan hålla. Bara konkreta lösningar som faktiskt fungerar.
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
            {teamMembers.map((member, index) => {
              const isImageLeft = index % 2 === 0;
              
              return (
                <AnimatedSection key={member.name} delay={index * 100}>
                  <Card className="flex flex-col lg:flex-row overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 group">
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
                          <div className="w-48 h-48 rounded-full bg-gradient-primary flex items-center justify-center border-4 border-primary/30">
                            <span className="text-6xl font-bold text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      <CardContent className="flex-1 p-8 space-y-6">
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
                          {member.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-3 group/item">
                              <div className="mt-1 flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-base leading-relaxed text-foreground/90">
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

        {/* Philosophy Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Vår filosofi
              </h2>
              <p className="mt-6 text-lg text-white/80">
                AI behöver inte vara komplicerat eller skrämmande. Det är ett verktyg - ett jävligt bra verktyg som kan öka lönsamhet och förenkla processer när det implementeras rätt.
              </p>
              <p className="mt-4 text-base text-white/70">
                Vi lovar att hålla det enkelt, konkret och utan fluffiga buzzwords. Om du funderar på hur AI kan göra skillnad i ditt företag - hör av dig.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
