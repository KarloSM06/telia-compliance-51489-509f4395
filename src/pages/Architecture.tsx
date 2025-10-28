import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Architecture = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute inset-0 bg-[url('/images/n8n-workflow-background.png')] bg-cover bg-center opacity-5" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 w-full py-32">
            <AnimatedSection className="max-w-6xl mx-auto text-center space-y-8">
              <Badge className="text-lg px-8 py-3 bg-gradient-gold text-primary font-bold shadow-button">
                Systemarkitektur
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-tight">
                Den Enhetliga Arkitekturens{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Konst
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                Att Skapa Skräddarsydd Intelligens
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <Card className="border-primary/30 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-3xl lg:text-4xl mb-4">
                    Från Verktygsanvändare till Systemarkitekt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    I den moderna affärsdigitaliseringens era har vi bevittnat ett skifte. Företag nöjer sig inte 
                    längre med att köpa in programvara; de kräver intelligenta system. Utmaningen ligger inte i att 
                    hitta de bästa enskilda verktygen – OpenAI, Gemini, Twilio eller n8n är alla marknadsledande 
                    inom sina respektive nischer – utan i att <span className="text-foreground font-semibold">bemästra integreringen av dessa 
                    heterogena komponenter till en symfonisk, enhetlig helhet</span>.
                  </p>
                  <p>
                    Vårt arbete är inte att tillhandahålla en "stack", utan att konstruera ett proprietärt 
                    operativsystem skräddarsytt för varje kunds unika logik. Vi är systemarkitekter i korsningen 
                    mellan API, AI och affärsverksamhet, med målet att transformera komplexa processer till en 
                    elegant, automatiserad end-to-end-upplevelse, synlig och styrbar via en enda, unik 
                    instrumentpanel: <span className="text-primary font-bold">Lovable Custom Dashboard</span>.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del I: Intelligensens Fundament */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection className="text-center space-y-4">
              <Badge variant="outline" className="text-base px-6 py-2 border-primary/50">
                Del I
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Intelligensens Fundament
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                LLM-Router och Datadigitalisering
              </p>
            </AnimatedSection>

            {/* LLM Mastery */}
            <AnimatedSection delay={0.1}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl">LLM-Bemästring</CardTitle>
                      <CardDescription className="text-base">
                        Mer än ett Enkelt API-Anrop
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-3 max-w-xs justify-end">
                      {[
                        { src: "/images/logos/openai-new.png", alt: "OpenAI GPT-5" },
                        { src: "/images/logos/claude.png", alt: "Claude 3.7" },
                        { src: "/images/logos/deepseek.png", alt: "Deepseek" },
                        { src: "/images/logos/gemini.png", alt: "Gemini" }
                      ].map((logo, idx) => (
                        <div 
                          key={idx}
                          className="w-14 h-14 rounded-xl bg-card-foreground/5 p-2 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                        >
                          <img 
                            src={logo.src} 
                            alt={logo.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base leading-relaxed">
                  <p className="text-muted-foreground">
                    Vår expertis inom AI-modeller (LLM) handlar om strategisk modellhantering. Vi inser att ingen 
                    enskild Large Language Model är bäst på allt. Istället för att låsa oss vid en leverantör har 
                    vi utvecklat en <span className="text-foreground font-semibold">Hybrid LLM Routing Strategy</span>.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-primary/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Val av Motor</h4>
                        <p className="text-muted-foreground">
                          För rå resonemangskapacitet använder vi OpenAI GPT-5 eller Claude 3.7. För snabba, 
                          kostnadsoptimerade klassificeringsuppgifter eller multimodala förmågor används Gemini 
                          eller Deepseek. Denna valfrihet säkerställer maximal precision till lägsta möjliga tokenkostnad.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Proprietär Finetuning & RAG</h4>
                        <p className="text-muted-foreground">
                          Genom Fine-Tuning på kundens egna domänspecifika data optimerar vi modellen för att tala 
                          med företagets röst. Genom Retrieval-Augmented Generation (RAG) kopplar vi modellen till 
                          vektordatabaser som lagrar uppdaterad, proprietär data – vilket eliminerar hallucinationer.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Data Enrichment */}
            <AnimatedSection delay={0.2}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl">Data Enrichment</CardTitle>
                      <CardDescription className="text-base">
                        Från Rådata till Handlingsbara Insikter
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-3 max-w-xs justify-end">
                      {[
                        { src: "/images/logos/apify.png", alt: "Apify" },
                        { src: "/images/logos/apollo.png", alt: "Apollo" },
                        { src: "/images/logos/eniro.png", alt: "Eniro" },
                        { src: "/images/logos/explorium.png", alt: "Explorium" }
                      ].map((logo, idx) => (
                        <div 
                          key={idx}
                          className="w-14 h-14 rounded-xl bg-card-foreground/5 p-2 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                        >
                          <img 
                            src={logo.src} 
                            alt={logo.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base leading-relaxed">
                  <p className="text-muted-foreground">
                    Inget system kan agera intelligent utan perfekt data. Vår Lead Generation & Berikningsmodul 
                    är designad för att eliminera datagaps.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-primary/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Skalbar Datamining</h4>
                        <p className="text-muted-foreground">
                          Med plattformar som Apify bygger vi skräddarsydda, robotiserade scraping-lösningar. 
                          Dessa är inte statiska; de anpassas efter strukturella förändringar på webbplatser.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Kvalitetssäkring</h4>
                        <p className="text-muted-foreground">
                          Rådata från Apify matchas och berikas med firmografiska och teknografiska detaljer via 
                          Apollo, Explorium och Eniro. Vår process inkluderar Data Normalization och Quality 
                          Assurance (DQA)-steg inom automatiseringsflödet.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del II: Händelsedigitalisering */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection className="text-center space-y-4">
              <Badge variant="outline" className="text-base px-6 py-2 border-primary/50">
                Del II
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Händelsedigitalisering och Inmatning
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transformering av kommunikation till strukturerade digitala händelser
              </p>
            </AnimatedSection>

            {/* Voice Agents */}
            <AnimatedSection delay={0.1}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl">Real-Time Voice Agents</CardTitle>
                      <CardDescription className="text-base">
                        Låg Latens och State Management
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      {[
                        { src: "/images/logos/vapi.png", alt: "Vapi" },
                        { src: "/images/logos/retell.png", alt: "Retell" },
                        { src: "/images/logos/twilio.png", alt: "Twilio" },
                        { src: "/images/logos/telnyx.png", alt: "Telnyx" }
                      ].map((logo, idx) => (
                        <div 
                          key={idx}
                          className="w-14 h-14 rounded-xl bg-card-foreground/5 p-2 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                        >
                          <img 
                            src={logo.src} 
                            alt={logo.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base leading-relaxed">
                  <p className="text-muted-foreground">
                    Vårt AI-röstsystem är konstruerat för att eliminera den robotliknande fördröjningen. Med Vapi 
                    och Retell ligger vår bemästring i hanteringen av <span className="text-foreground font-semibold">Ultra-Low Latency (under 300 millisekunder)</span>, 
                    vilket är avgörande för en naturlig konversation.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-primary/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Asynkron Processering</h4>
                        <p className="text-muted-foreground">
                          Vi designar Voice LLM Agents för att hantera interruption handling och asynkron datahämtning. 
                          Agenten kan initiera ett API-anrop till kalendersystemet samtidigt som den pratar, utan märkbar paus.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-foreground mb-2">SIP/WebRTC-Integration</h4>
                        <p className="text-muted-foreground">
                          Genom att integrera Twilio och Telnyx på SIP Trunking-nivå säkerställer vi carrier-grade 
                          kvalitet och global skalbarhet för höga volymer av programmatiska samtal.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Calendar Integration */}
            <AnimatedSection delay={0.2}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="text-3xl mb-2">
                    Enhetlig Kalender- och Kommunikationslogik
                  </CardTitle>
                  <CardDescription className="text-base">
                    Google Calendar • Microsoft Outlook • Calendly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-base leading-relaxed">
                  <p className="text-muted-foreground">
                    För att kunna boka tider eller skicka påminnelser måste systemet ha en enhetlig bild av 
                    tillgängligheten, oavsett om kunden använder Google Calendar, Microsoft Outlook eller Calendly.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-primary/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground mb-2">API-Mastery</h4>
                        <p className="text-muted-foreground">
                          Vi hanterar alla kalenderintegrationer på API-nivå för att bygga ett Centraliserat 
                          Tillgänglighetsregister med Custom Conflict Resolution Logic.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Kommunikationsflöden</h4>
                        <p className="text-muted-foreground">
                          Genom att länka kalenderhändelserna till Telnyx/Twilio skapar vi automatiserade 
                          kommunikationsflöden – SMS 24 timmar före möte, varnings-SMS vid avbokning.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del III: Orkestrering */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection className="text-center space-y-4">
              <Badge variant="outline" className="text-base px-6 py-2 border-primary/50">
                Del III
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Orkestrering
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Det Skräddarsydda Nervsystemet
              </p>
            </AnimatedSection>

            {/* iPaaS Mastery */}
            <AnimatedSection delay={0.1}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl">iPaaS-Bemästring</CardTitle>
                      <CardDescription className="text-base">
                        Skalbarhet och Redundans
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      {[
                        { src: "/images/logos/n8n.png", alt: "n8n" },
                        { src: "/images/logos/make.png", alt: "Make.com" }
                      ].map((logo, idx) => (
                        <div 
                          key={idx}
                          className="w-14 h-14 rounded-xl bg-card-foreground/5 p-2 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                        >
                          <img 
                            src={logo.src} 
                            alt={logo.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base leading-relaxed">
                  <p className="text-muted-foreground">
                    Det som särskiljer oss från standardintegratörer är vår förmåga att bygga komplexa, 
                    villkorsstyrda, end-to-end-workflows. Våra automatiseringsplattformar utgör systemets nervsystem.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-primary/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Avancerad Flödesdesign</h4>
                        <p className="text-muted-foreground">
                          Vår kompetens ligger i att hantera flöden med hundratals noder, med strikt fokus på 
                          Idempotens och Error Handling med automatiska back-off-strategier.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Datatransformation (ETL)</h4>
                        <p className="text-muted-foreground">
                          Den kritiska Extract, Transform, Load (ETL)-processen, där rådata omvandlas till det 
                          exakta JSON-format som krävs av destinationssystemet. 100% skräddarsydd för kundens datamodell.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Lovable Backend */}
            <AnimatedSection delay={0.2}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl">Lovable</CardTitle>
                      <CardDescription className="text-base">
                        Bakom kulisserna – Proprietär Logik
                      </CardDescription>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-card-foreground/5 p-3 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 hover:scale-110">
                      <img 
                        src="/images/logos/lovable.png" 
                        alt="Lovable"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base leading-relaxed">
                  <p className="text-muted-foreground">
                    För de mest unika affärsutmaningarna där ingen hyllvara räcker, använder vi Lovable för att 
                    skapa proprietära mikrotjänster.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-primary/40 space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Custom AI-Logik</h4>
                        <p className="text-muted-foreground">
                          Detta kan vara en unik algoritm för att beräkna ett "Engagement Score" för ett lead 
                          baserat på alla interaktioner, eller en specialiserad bildigenkänningsfunktion. 
                          Funktioner containeriseras och exponeras som enkla HTTP-anrop.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Arkitektonisk Flexibilitet</h4>
                        <p className="text-muted-foreground">
                          Genom att frikoppla denna specialiserade logik från de större iPaaS-flödena skapar vi 
                          en modulär arkitektur. Den proprietära AI-logiken i Lovable kan enkelt återanvändas.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del IV: Kontrollcentret */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection className="text-center space-y-4">
              <Badge variant="outline" className="text-base px-6 py-2 border-primary/50">
                Del IV
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Kontrollcentret
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Den Skräddarsydda Lovable Dashboarden
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/30 hover:border-primary/50 bg-gradient-to-br from-background to-primary/10">
                <CardHeader>
                  <CardTitle className="text-3xl mb-2">
                    En "Single Pane of Glass"
                  </CardTitle>
                  <CardDescription className="text-base">
                    Hela denna komplexa arkitektur konvergerar i en enda, enhetlig vy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 text-base leading-relaxed">
                  <p className="text-muted-foreground text-lg">
                    Målet är att eliminera verktygströtthet genom att ge användaren en enda plats för att se, 
                    styra och optimera hela det digitala ekosystemet.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-background/50 border border-primary/20 space-y-3 hover:border-primary/40 transition-colors">
                      <h4 className="font-bold text-foreground text-lg">Dynamisk Visualisering</h4>
                      <p className="text-muted-foreground">
                        Genom att dra in data direkt från iPaaS-flödena kan vi visualisera nyckeltal i realtid. 
                        Se faktisk kostnad per token från LLM-routern, genomsnittlig latens i röstagenterna, 
                        och exakta konverteringsfrekvenser.
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-xl bg-background/50 border border-primary/20 space-y-3 hover:border-primary/40 transition-colors">
                      <h4 className="font-bold text-foreground text-lg">Interaktiv Kontroll</h4>
                      <p className="text-muted-foreground">
                        Dashboarden är interaktiv och tillåter realtidsjusteringar som direkt påverkar 
                        back-end-processerna – prioritera leads, styra LLM-routern, övervaka flöden.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-primary/20">
                    <h4 className="font-bold text-foreground text-xl mb-4">Den Skräddarsydda Upplevelsen</h4>
                    <p className="text-muted-foreground">
                      Det unika med Lovable i detta sammanhang är att det inte finns några standardmallar. 
                      Varje diagram, varje knapp, varje datavisualisering är <span className="text-foreground font-semibold">unikt kodad för att 
                      spegla exakt de affärsregler och KPI:er som definierar kundens framgång</span>. Det är det 
                      ultimata beviset på bemästring: att kunna ta en teknisk kedja som spänner över globala 
                      telekom-API:er, avancerade AI-modeller och komplex databashantering, och presentera det 
                      hela som en intuitiv och vacker användarupplevelse.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Conclusion Section */}
        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <Card className="border-primary/40 shadow-elegant bg-gradient-to-br from-primary/5 via-background to-background">
                <CardHeader>
                  <CardTitle className="text-4xl lg:text-5xl mb-6 text-center">
                    Från Komplexitet till{" "}
                    <span className="bg-gradient-gold bg-clip-text text-transparent">
                      Konkurrensfördel
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Vårt arbete är en pågående prövning av ingenjörskonst och affärsstrategi. Det handlar om att 
                    hantera systemens inneboende komplexitet (API-versioner, hastighetsbegränsningar, LLM-drift) 
                    och transformera den till en friktionsfri konkurrensfördel för våra kunder.
                  </p>
                  <p>
                    Vi har valt och bemästrat varje verktyg – från Telnyx till Gemini – inte för deras individuella 
                    meriter, utan för deras plats i den större, skräddarsydda arkitekturen.
                  </p>
                  <p className="text-foreground font-semibold text-xl pt-4">
                    Genom att leverera denna enhetliga arkitektur, kulminerande i den skräddarsydda kontrollpanelen 
                    byggd i Lovable, skapar vi system som inte bara automatiserar, utan som agerar intelligent, 
                    agerar snabbt och agerar i enlighet med era exakta affärsbehov.
                  </p>
                  <p className="text-center pt-6 text-xl italic">
                    Vår kompetens är inte i verktygen; den är i den arkitektur vi skapar mellan dem.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Architecture;
