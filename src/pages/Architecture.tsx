import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Architecture = () => {
  const phases = [
    {
      phase: "Fas 1",
      title: "Fundamentet - LLM & Data Enrichment",
      description: "Systemets intellektuella kärna och datainsamlingsmotor som skapar basen för all anpassning.",
      modules: [
        {
          title: "AI Modeller (LLM)",
          technologies: ["OpenAI GPT-5", "Claude 3.7", "Deepseek", "Gemini"],
          logos: [
            "/images/logos/openai-new.png",
            "/images/logos/claude.png",
            "/images/logos/deepseek.png",
            "/images/logos/gemini.png"
          ],
          description: "Vi bygger en LLM-router som dynamiskt väljer den mest effektiva modellen per uppgift. Genom Proprietär Fine-Tuning och RAG (Retrieval-Augmented Generation) anpassar vi modellernas output till er domänspecifika terminologi."
        },
        {
          title: "Lead Generation & Berikning",
          technologies: ["Apollo", "Apify", "Eniro", "Explorium"],
          logos: [
            "/images/logos/apollo.png",
            "/images/logos/apify.png",
            "/images/logos/eniro.png",
            "/images/logos/explorium.png"
          ],
          description: "Vi skapar automatiserade datamining-pipelines. Apify används för att bygga skräddarsydda web-scraping bots som drar in realtidsdata. Denna rådata berikas sedan med firmografisk och teknografisk data."
        }
      ]
    },
    {
      phase: "Fas 2",
      title: "Inmatning och Digitalisering",
      description: "Extern kommunikation och tidsbaserad logik transformeras till strukturerade datapaket.",
      modules: [
        {
          title: "Telefoni & SMS",
          technologies: ["Telnyx", "Twilio"],
          logos: ["/images/logos/telnyx.png", "/images/logos/twilio.png"],
          description: "Implementeras via Carrier-Grade API-åtkomst. Vi konfigurerar Bi-Directional Webhooks för att omedelbart fånga inkommande samtal och meddelanden."
        },
        {
          title: "AI Röstsystem",
          technologies: ["Vapi", "Retell"],
          logos: ["/images/logos/vapi.png", "/images/logos/retell.png"],
          description: "Röstagenterna hanteras som tillståndslösa tjänster med ultra-låg latens och asynkron datahämtning för realtidsbeslut."
        },
        {
          title: "Kalenderintegrationer",
          technologies: ["Google Calendar", "Microsoft Outlook", "Calendly"],
          logos: [],
          description: "Vi etablerar en Centraliserad Tillgänglighets-API som synkroniserar tillgängligheten mellan alla system med Custom Conflict Resolution Logic."
        }
      ]
    },
    {
      phase: "Fas 3",
      title: "Orkestrering och Processautomatisering",
      description: "Det centrala nervsystemet som dirigerar dataflöden och affärslogik.",
      modules: [
        {
          title: "Automatiseringsplattformar",
          technologies: ["n8n", "Make.com"],
          logos: ["/images/logos/n8n.png", "/images/logos/make.png"],
          description: "Vi använder iPaaS-plattformar för komplex, event-driven logik. All data fungerar som triggers för Datatransformation (ETL), Villkorsstyrd Logik och API-Routing."
        },
        {
          title: "Lovable Backend Logic",
          technologies: ["Lovable"],
          logos: ["/images/logos/lovable.png"],
          description: "För komplexa och skräddarsydda uppgifter som kräver proprietär AI-logik bygger vi mikrotjänster i Lovable. Dessa funktioner anropas som API endpoints direkt från n8n/Make-flödena."
        }
      ]
    },
    {
      phase: "Fas 4",
      title: "Visualisering, Kontroll och Dashboard",
      description: "Alla processade, berikade och dirigerade dataflöden konvergerar i Lovable.",
      modules: [
        {
          title: "Custom Dashboard",
          technologies: ["Lovable"],
          logos: ["/images/logos/lovable.png"],
          description: "Dynamisk Visualisering & Kontrollcenter där alla dataflöden presenteras. Proprietära Widgets drar in realtidsdata för total kontroll och handlingsbar insikt.",
          features: [
            "Total Kontroll: Visualisera prestanda för LLM-routern",
            "Realtidslatens för AI-röstsystem",
            "Övervaka alla aktiva workflows",
            "LLM-sammanfattning av dagens Leads",
            "Status i realtid på bokningskonflikter",
            "Direkt kontroll över LLM-val per kundinteraktion"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/20 via-background to-background">
          <div className="absolute inset-0 bg-[url('/images/tools-background.jpg')] bg-cover bg-center opacity-10" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 w-full py-24">
            <AnimatedSection className="max-w-5xl mx-auto text-center">
              <Badge className="mb-6 text-lg px-6 py-2">Vår Arkitektur</Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl text-foreground mb-8 leading-tight font-extrabold">
                Ett Enhetligt, Skräddarsytt{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Ekosystem
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Istället för att bara integrera system, konstruerar vi ett enhetligt ekosystem. 
                Alla moduler konvergerar i er Custom Dashboard, byggd i Lovable – din Single Pane of Glass.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Phases Section */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-32">
            {phases.map((phase, phaseIndex) => (
              <AnimatedSection key={phaseIndex} delay={phaseIndex * 0.1}>
                <div className="space-y-8">
                  {/* Phase Header */}
                  <div className="text-center space-y-4">
                    <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">
                      {phase.phase}
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                      {phase.title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      {phase.description}
                    </p>
                  </div>

                  {/* Modules Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mt-12">
                    {phase.modules.map((module, moduleIndex) => (
                      <Card 
                        key={moduleIndex} 
                        className="group hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/50"
                      >
                        <CardHeader>
                          <CardTitle className="text-2xl mb-4">{module.title}</CardTitle>
                          
                          {/* Technology Logos */}
                          {module.logos.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-4">
                              {module.logos.map((logo, logoIndex) => (
                                <div 
                                  key={logoIndex}
                                  className="w-16 h-16 rounded-lg bg-card-foreground/5 p-2 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                                >
                                  <img 
                                    src={logo} 
                                    alt={module.technologies[logoIndex]}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Technology Tags */}
                          <div className="flex flex-wrap gap-2">
                            {module.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <CardDescription className="text-base leading-relaxed">
                            {module.description}
                          </CardDescription>
                          
                          {/* Special Features for Dashboard */}
                          {module.features && (
                            <ul className="mt-6 space-y-2">
                              {module.features.map((feature, featureIndex) => (
                                <li 
                                  key={featureIndex}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-primary mt-1">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Result Section */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Slutsats:{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Ett Intelligent Operativsystem
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Vi tillhandahåller inte en samling verktyg, utan ett skräddarsytt, intelligent 
                operativsystem där Lovable-panelen fungerar som er kommandobrygga – vilket bevisar 
                vår fullständiga bemästring av stacken.
              </p>
              
              <Card className="mt-12 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl">Single Pane of Glass</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Genom denna fas säkerställs att ett Twilio SMS om en bokning (Fas 2) kan trigga 
                    ett n8n-flöde (Fas 3) som anropar LLM:en (Fas 1) för att summera meddelandet, 
                    och sedan uppdatera Google Calendar (Fas 2). Allt synligt och kontrollerbart 
                    från en enda dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Architecture;
