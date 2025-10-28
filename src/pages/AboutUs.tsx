import { Header } from "@/components/Header";
import { Mail, Phone, Linkedin, TrendingUp, Target, Zap, Users, Sparkles, Code, Rocket, Brain, Award } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import antonImage from "@/assets/anton-sallnas.png";
import karloImage from "@/assets/karlo-mangione.png";
import emilImage from "@/assets/emil-westerberg.png";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Anton Sallnäs",
      role: "CEO & Grundare",
      image: antonImage,
      email: "anton@hiems.se",
      phone: "070-657 15 32",
      description: "Precis som Karlo gick Anton på Södra Latin och såg tidigt potentialen i AI. Efter sin värnpliktstjänstgöring lärde han sig mycket om ledarskap, organisation och beslutsfattande under press – erfarenheter som format hans roll som CEO.",
      expertise: [
        "Ledarskap & strategi",
        "AI-implementering",
        "Organisationsutveckling",
        "Affärsutveckling"
      ],
      highlight: "Kombinerar stark ledarskapserfarenhet från lumpen med teknisk förståelse och affärsmässigt tänkande. Har expertis inom pappersarbete, administration och strukturerad projektledning.",
      icon: Target
    },
    {
      name: "Karlo Mangione",
      role: "COO & Teknisk Lead",
      image: karloImage,
      email: "karlo.mangione@hiems.se",
      phone: "070-231 22 71",
      description: "Sedan 2022 har Karlo arbetat med AI – inte för att det är fancy tech, utan för att han såg något som många missade: AI behöver inte vara komplicerat eller hotfullt. Det är ett verktyg. Ett jävligt bra verktyg som kan öka lönsamhet och förenkla processer när det implementeras rätt.",
      expertise: [
        "AI-utveckling",
        "Teknisk arkitektur",
        "Strategisk riktning",
        "Hands-on utveckling"
      ],
      highlight: "Som COO jobbar Karlo med allt från strategisk riktning till hands-on utveckling av skräddarsydda AI-lösningar. Hans styrka ligger i den tekniska djupdykningen – han är den som både förstår affären och kan bygga lösningen. Driven, passionerad och slutför det han påbörjar. Period.",
      icon: Code,
      philosophy: "Vi hjälper företag över alla branscher att implementera AI på riktigt. Ingen copy-paste. Ingen one-size-fits-all. Vi börjar alltid med en ordentlig behovsanalys och bygger sedan system som faktiskt löser era specifika utmaningar och ökar er lönsamhet. Enkelt, konkret och utan fluffiga buzzwords."
    },
    {
      name: "Emil Westerberg",
      role: "CLO",
      image: emilImage,
      email: "emil@hiems.se",
      phone: "072-327 34 65",
      description: "Emil gick på Bernadotte Gymnasiet och såg tidigt AI:s potential att förändra hur företag arbetar. Med gedigen erfarenhet från värnpliktstjänstgöring har han lärt sig mycket om ledarskap, teamarbete och att hålla huvudet kallt under press.",
      expertise: [
        "Dokumentation & administration",
        "Processutveckling",
        "Kundrelationer",
        "Projektkoordinering"
      ],
      highlight: "Emil har stor expertis inom pappersarbete, administration och att hålla ordning på komplexa projekt. Hans strukturerade arbetssätt och förmåga att se till att alla detaljer är på plats gör honom ovärderlig för teamet.",
      icon: Users
    },
    {
      name: "Malte Ekbäck",
      role: "CFO",
      image: null,
      email: "malte@hiems.se",
      phone: "073-024 66 28",
      description: "Malte har alltid varit driven och velat skapa värde. Från att sälja kläder till att hantera ekonomi och strategi – hans resa har handlat om att förstå vad som driver lönsamhet och tillväxt.",
      expertise: [
        "Ekonomisk strategi",
        "Affärsutveckling",
        "Försäljning",
        "Värdeskapande"
      ],
      highlight: "Maltes kreativitet och driv kombinerat med hans förståelse för både ekonomi och försäljning gör honom till en nyckelspelare. Han ser möjligheter där andra ser utmaningar och driver alltid mot mätbara resultat.",
      icon: TrendingUp
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      
      <main className="pt-16 relative">
        {/* Hero Section */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Möt teamet bakom{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Hiems
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-6 leading-relaxed">
                Vi är ett svenskt teknikföretag som specialiserar sig på AI-driven automation
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Vi skapar skräddarsydda intelligenta lösningar som gör din verksamhet snabbare, smartare och framför allt mer lönsam. Varje teammedlem bidrar med unik expertis för att leverera resultat som gör skillnad.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-12 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="space-y-24">
              {teamMembers.map((member, index) => {
                const Icon = member.icon;
                return (
                  <AnimatedSection 
                    key={member.name} 
                    delay={index * 150}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                  >
                    <Card className="bg-gradient-to-br from-background/95 via-background/90 to-primary/5 backdrop-blur-xl border-border/50 hover:border-accent/30 transition-all duration-500 shadow-2xl hover:shadow-glow overflow-hidden group">
                      <CardContent className="p-0">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
                          {/* Image Section */}
                          <div className={`relative ${index % 2 === 0 ? '' : 'lg:col-start-2'}`}>
                            <div className="relative p-8 lg:p-12">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              {member.image ? (
                                <div className="relative">
                                  <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                  <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl border-2 border-accent/20 group-hover:border-accent/40 transition-all duration-500 group-hover:scale-[1.02]"
                                  />
                                </div>
                              ) : (
                                <div className="relative">
                                  <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                  <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-accent/20 group-hover:border-accent/40 transition-all duration-500 shadow-2xl">
                                    <span className="text-8xl font-bold text-white">
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className={`p-8 lg:p-12 space-y-6 ${index % 2 === 0 ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                            {/* Header */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-gold/10 border border-accent/20">
                                  <Icon className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                    {member.name}
                                  </h2>
                                  <p className="text-lg text-accent font-semibold">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                              {member.description}
                            </p>

                            {/* Highlight */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/5 border border-accent/10">
                              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                                {member.highlight}
                              </p>
                            </div>

                            {/* Philosophy (if exists) */}
                            {member.philosophy && (
                              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/20">
                                <p className="text-sm sm:text-base text-white/90 leading-relaxed italic">
                                  "{member.philosophy}"
                                </p>
                              </div>
                            )}

                            {/* Expertise */}
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                                Expertområden
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {member.expertise.map((skill, i) => (
                                  <div 
                                    key={i}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/30"
                                  >
                                    <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-sm text-white/80">{skill}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Contact */}
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/30">
                              <a 
                                href={`mailto:${member.email}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 hover:bg-accent/10 border border-border/30 hover:border-accent/30 transition-all duration-300 group/link"
                              >
                                <Mail className="w-4 h-4 text-accent group-hover/link:scale-110 transition-transform" />
                                <span className="text-sm text-white/80 group-hover/link:text-white transition-colors">
                                  {member.email}
                                </span>
                              </a>
                              <a 
                                href={`tel:${member.phone.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 hover:bg-accent/10 border border-border/30 hover:border-accent/30 transition-all duration-300 group/link"
                              >
                                <Phone className="w-4 h-4 text-accent group-hover/link:scale-110 transition-transform" />
                                <span className="text-sm text-white/80 group-hover/link:text-white transition-colors">
                                  {member.phone}
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <div className="inline-block">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  Våra värderingar
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
              </div>
              <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mt-6">
                Vi tror att framtidens företag inte bara använder AI – de samarbetar med den
              </p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <AnimatedSection delay={0}>
                <Card className="bg-background/50 backdrop-blur-xl border-border/50 hover:border-accent/30 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gradient-gold/10 flex items-center justify-center border border-accent/20">
                      <Zap className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Effektivitet</h3>
                    <p className="text-white/70">
                      Frigör tid genom intelligent automation och förenklade processer
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection delay={100}>
                <Card className="bg-background/50 backdrop-blur-xl border-border/50 hover:border-accent/30 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gradient-gold/10 flex items-center justify-center border border-accent/20">
                      <Brain className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Innovation</h3>
                    <p className="text-white/70">
                      Ligger steget före med modern AI-teknik och kreativa lösningar
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection delay={200}>
                <Card className="bg-background/50 backdrop-blur-xl border-border/50 hover:border-accent/30 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gradient-gold/10 flex items-center justify-center border border-accent/20">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Partnerskap</h3>
                    <p className="text-white/70">
                      Din strategiska partner för långsiktig framgång och tillväxt
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutUs;