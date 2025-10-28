import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Architecture = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/20 via-background to-background">
          <div className="absolute inset-0 bg-[url('/images/tools-background.jpg')] bg-cover bg-center opacity-10" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 w-full py-24">
            <AnimatedSection className="max-w-5xl mx-auto text-center">
              <Badge className="mb-6 text-lg px-6 py-2">Teknisk Arkitektur</Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl text-foreground mb-8 leading-tight font-extrabold">
                Den Enhetliga Arkitekturens{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Konst
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Från Integration till Konstruktion – Vi konstruerar enhetliga, skräddarsydda arkitekturer 
                där marknadsledande AI och automatisering konvergerar i ett enda, intelligent operativsystem.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">
                Inledning: Från Integration till Konstruktion
              </h2>
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

        {/* Del I: Den Intellektuella Kärnan */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">Del I</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Den Intellektuella Kärnan
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  AI-Modeller och Prompt Engineering
                </p>
              </div>
            </AnimatedSection>

            {/* AI Models Section */}
            <AnimatedSection delay={0.1}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl mb-6">Grundläggande Förståelse av AI-Modeller (LLM)</CardTitle>
                  <CardDescription className="text-base">
                    LLM:er bygger på Transformer-arkitekturen, som möjliggör djupgående förståelse av språkets 
                    kontext och relationer. Vår strategiska användning av flera modeller är avgörande för att 
                    optimera både prestanda och kostnad.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* OpenAI GPT-5 */}
                    <Card className="bg-card-foreground/5">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/openai-new.png" 
                              alt="OpenAI"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <CardTitle className="text-xl">OpenAI GPT-5</CardTitle>
                        </div>
                        <CardDescription>
                          Representerar toppen av generell intelligens och resonemangsförmåga. Vi utnyttjar dess 
                          råa kapacitet för komplexa summeringsuppgifter och multi-step resonemang, ofta via dess 
                          Function Calling (Tools)-förmåga för att interagera med externa API:er.
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Claude 3.7 */}
                    <Card className="bg-card-foreground/5">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/claude.png" 
                              alt="Claude"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <CardTitle className="text-xl">Claude 3.7</CardTitle>
                        </div>
                        <CardDescription>
                          Värderas för dess stora kontextfönster och förmåga att bibehålla koherens över extremt 
                          långa dokument. Används strategiskt för analys av juridiska dokument eller omfattande 
                          kundhistorik.
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Deepseek */}
                    <Card className="bg-card-foreground/5">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/deepseek.png" 
                              alt="Deepseek"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <CardTitle className="text-xl">Deepseek</CardTitle>
                        </div>
                        <CardDescription>
                          Används för nischade, specialiserade uppgifter (t.ex. kodgenerering eller teknisk analys) 
                          där dess träningsdata ger en fördel över generella modeller.
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Gemini */}
                    <Card className="bg-card-foreground/5">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/gemini.png" 
                              alt="Gemini"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <CardTitle className="text-xl">Gemini</CardTitle>
                        </div>
                        <CardDescription>
                          Används för dess integrerade multimodala kapacitet (text, bild, video) och dess synergier 
                          inom Google Cloud Platform för skalbarhet.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Prompt Engineering Section */}
            <AnimatedSection delay={0.2}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl mb-6">Vad är Prompt Engineering?</CardTitle>
                  <CardDescription className="text-base">
                    Prompt engineering – en term som snabbt blivit central i diskussionen kring artificiell intelligens 
                    – är konsten och vetenskapen att utforma de instruktioner, eller "prompter", som matas in i 
                    generativa AI-modeller för att uppnå önskat resultat.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Introduction */}
                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        Det är en avgörande disciplin som överbryggar klyftan mellan mänsklig intention och maskinell 
                        tolkning, särskilt i användningen av Stora Språkmodeller (LLMs) som ChatGPT och liknande tjänster. 
                        I grunden är en prompt den text eller de data som initierar en respons från en AI-modell. Det kan 
                        vara en enkel fråga, en detaljerad uppgiftsbeskrivning, eller till och med ett komplext kodstycke.
                      </p>
                    </div>

                    <Separator />

                    {/* Clear Instructions */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">Konsten att Ge Klara Instruktioner</h4>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Framgångsrik prompt engineering bygger på ett antal best practices. Den viktigaste principen är 
                        klarhet och specificitet. En vag prompt som "Skriv om hundar" kan ge ett allmänt och intetsägande 
                        svar. En ingenjörsmässigt utformad prompt kan däremot vara:
                      </p>
                      <Card className="bg-primary/5 border-primary/20 mb-6">
                        <CardContent className="pt-6">
                          <p className="text-sm italic text-muted-foreground">
                            "Skriv en 500 ord lång, humoristisk essä i stil med Mark Twain om vikten av att ha en 
                            Golden Retriever som sällskapshund."
                          </p>
                        </CardContent>
                      </Card>
                      <p className="text-muted-foreground leading-relaxed">
                        Genom att specificera ämne, längd, ton, stil och format guidas AI:n till att leverera ett 
                        högkvalitativt och relevant resultat.
                      </p>
                    </div>

                    <Separator />

                    {/* Iterative Refinement */}
                    <div>
                      <h4 className="text-xl font-semibold mb-3">Iterativ Förfining</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Ett annat centralt element är den iterativa förfiningen. Sällan ger den första prompten det 
                        perfekta svaret. Prompt engineering är en process av kontinuerlig justering: man utvärderar 
                        resultatet, identifierar brister och förfinar prompten tills utgången matchar målet. Detta kan 
                        innebära att man lägger till mer kontext, ger exempel på önskat utdataformat (så kallad 
                        "few-shot prompting") eller till och med instruerar modellen att anta en specifik roll, som 
                        till exempel en "expertmarknadsförare" eller en "akademisk forskare".
                      </p>
                    </div>

                    <Separator />

                    {/* Techniques */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">Teknik och Användningsområden</h4>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Prompt engineering är inte enbart en textbaserad konst. Det finns avancerade tekniker som:
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-card-foreground/5">
                          <CardHeader>
                            <CardTitle className="text-lg">Zero-shot/Few-shot Prompting</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Att ge inga eller ett fåtal exempel i prompten för att visa AI:n det önskade mönstret.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-card-foreground/5">
                          <CardHeader>
                            <CardTitle className="text-lg">Chain-of-Thought (CoT)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Att instruera AI:n att visa sina mellanliggande tankesteg innan den ger ett slutgiltigt 
                              svar, vilket ofta förbättrar komplexa resonemang.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-card-foreground/5">
                          <CardHeader>
                            <CardTitle className="text-lg">Role Prompting</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Att tilldela AI:n en persona eller roll för att styra dess perspektiv och ton.
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        Användningsområdena är enorma: från att generera kod och designa bilder till att sammanfatta 
                        komplexa rapporter och simulera kundtjänstdialoger. I en kommersiell kontext möjliggör prompt 
                        engineering utvecklingen av specialiserade AI-applikationer genom att finjustera LLM:s beteende 
                        utan att behöva träna om hela modellen.
                      </p>
                    </div>

                    <Separator />

                    {/* Key Competency */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">En Nyckelkompetens i AI-Åldern</h4>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        I takt med att generativa AI-modeller blir allt mer integrerade i vårt arbetsliv och samhälle, 
                        växer prompt engineering fram som en kritisk kompetens. Det är den mänskliga inblandningen som 
                        säkerställer att de kraftfulla AI-verktygen används effektivt och etiskt. Det handlar om att 
                        lära sig "tala AI:s språk" för att låsa upp dess fulla potential.
                      </p>
                      <Card className="bg-gradient-gold/10 border-primary/30">
                        <CardContent className="pt-6">
                          <p className="text-foreground font-semibold text-center leading-relaxed">
                            Sammanfattningsvis är prompt engineering mycket mer än att bara skriva instruktioner. Det är 
                            en sofistikerad metodik som kombinerar språkförståelse, logik och experimenterande. Det är en 
                            nyckel till att transformera rå AI-kapacitet till målinriktade, värdefulla applikationer och 
                            utgör därmed en hörnsten i den pågående AI-revolutionen.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* RAG Section */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">RAG (Retrieval-Augmented Generation)</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Detta är kritiskt för att eliminera AI-hallucinationer. Vi använder vektordatabaser för att 
                        infoga realtidsdata (t.ex. från er CRM eller interna dokument) i LLM:ens kontext vid behov. 
                        Detta gör att LLM:en kan basera sina svar på faktiskt, proprietärt underlag.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del II: Det Centrala Nervsystemet */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">Del II</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Det Centrala Nervsystemet
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Automatisering och Datakontroll
                </p>
              </div>
            </AnimatedSection>

            {/* Automation Platforms */}
            <AnimatedSection delay={0.1}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl mb-6">Automatiseringsplattformar: Orkestrering av Workflows</CardTitle>
                  <CardDescription className="text-base mb-6">
                    Automationsplattformarna fungerar som systemets centrala nervsystem, som dirigerar dataflöden 
                    och affärslogik. De är vår Integration Platform as a Service (iPaaS).
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="w-20 h-20 rounded-lg bg-card-foreground/5 p-3 flex items-center justify-center">
                      <img 
                        src="/images/logos/n8n.png" 
                        alt="n8n"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-20 h-20 rounded-lg bg-card-foreground/5 p-3 flex items-center justify-center">
                      <img 
                        src="/images/logos/make.png" 
                        alt="Make.com"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Vi använder dessa plattformar för att designa event-driven, multi-step workflows. Vår kompetens 
                    ligger i att bygga redundant logik som hanterar API Rate Limiting, Back-off Strategier och komplex 
                    felhantering för att garantera att data aldrig går förlorad.
                  </p>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Exempel på Bemästring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Skapa en n8n-nod som tar emot en Twilio-webhook (nytt SMS), skickar SMS-innehållet till GPT-5 
                        för klassificering, och sedan uppdaterar en Google Calendar-händelse – allt inom loppet av sekunder.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* API Keys and Webhooks */}
            <AnimatedSection delay={0.2}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl mb-6">Grundstenarna för Kommunikation</CardTitle>
                  <CardDescription className="text-base">
                    API-nycklar och Webhooks – De grundläggande mekanismerna som möjliggör realtidskommunikation 
                    mellan systemen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* API Keys */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">A. API-nycklar (Application Programming Interface Keys)</h4>
                      <p className="text-muted-foreground mb-4">
                        En API-nyckel är en unik identifierare som används för att autentisera en användare, 
                        utvecklare eller ett program till ett API.
                      </p>
                      <Card className="bg-card-foreground/5">
                        <CardHeader>
                          <CardTitle className="text-lg">Vår Kompetens</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Vi hanterar API-nycklar genom strikta Secret Management-protokoll. Nycklarna lagras säkert 
                            i Vaults (t.ex. i n8n eller i molntjänster) och exponeras aldrig i klartext i koden. Detta 
                            garanterar att kommunikationen med kritiska tjänster (som OpenAI och Telnyx) är säker och att 
                            åtkomsten kan dras tillbaka omedelbart vid behov. Vi använder även OAuth2-tokens där det är 
                            möjligt, vilket ger en säkrare, tidsbegränsad åtkomst.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* Webhooks */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">B. Webhooks</h4>
                      <p className="text-muted-foreground mb-4">
                        En Webhook är ett automatiserat meddelande som skickas från en applikation till en annan när 
                        en specifik händelse inträffar. Det är en omvänd API-begäran – istället för att ständigt fråga 
                        ("poll"), skickar applikationen informationen omedelbart.
                      </p>
                      <Card className="bg-card-foreground/5">
                        <CardHeader>
                          <CardTitle className="text-lg">Vår Kompetens</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Vi implementerar Bi-Directional Webhooks för att uppnå real-time prestanda. Till exempel 
                            skickar Twilio en webhook till vår n8n-plattform omedelbart när ett SMS tas emot. Detta 
                            eliminerar latens och resurskrävande polling, vilket är avgörande för låg-latenssystem som 
                            AI-röstagenter och omedelbara kalenderuppdateringar. Vi bygger Custom Webhook Endpoints som 
                            kan ta emot och validera datapaket från alla källor.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del III: Datainsamling och Kommunikation */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">Del III</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Datainsamling och Kommunikation
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Vår Tekniska Stack
                </p>
              </div>
            </AnimatedSection>

            {/* Voice Systems and Telephony */}
            <AnimatedSection delay={0.1}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl mb-6">AI Röstsystem och Telefoni</CardTitle>
                  <CardDescription className="text-base mb-6">
                    Att skapa en naturlig röstupplevelse kräver bemästring av latens och tal-till-text-teknik.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Voice AI */}
                    <Card className="bg-card-foreground/5">
                      <CardHeader>
                        <CardTitle className="text-xl mb-4">Voice AI Agents</CardTitle>
                        <div className="flex gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/vapi.png" 
                              alt="Vapi"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/retell.png" 
                              alt="Retell"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Dessa plattformar är Voice API:er som hanterar röstkommunikationen i realtid. Vi konfigurerar 
                          dem på SIP/WebRTC-nivå för att hantera anslutningen till telekomnätet. Vår expertis ligger i 
                          att optimera LLM-responstiden inom röstloopen, vilket säkerställer att agenten kan svara inom 
                          den mänskliga toleransgränsen (ca 300 ms latens) och därmed hantera avbrott på ett naturligt sätt.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Telephony */}
                    <Card className="bg-card-foreground/5">
                      <CardHeader>
                        <CardTitle className="text-xl mb-4">Global Telefoni & SMS</CardTitle>
                        <div className="flex gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/telnyx.png" 
                              alt="Telnyx"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="w-16 h-16 rounded-lg bg-background p-2 flex items-center justify-center">
                            <img 
                              src="/images/logos/twilio.png" 
                              alt="Twilio"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Dessa är Telecom Carriers som tillhandahåller de grundläggande numren och anslutningarna. 
                          Vi använder deras API:er för att programmatiskt skicka/ta emot SMS och samtal, bygga 
                          IVR-system (Interactive Voice Response) och hantera telefoni-routing-logik i skala.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Data Enrichment */}
            <AnimatedSection delay={0.2}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl mb-6">Data Enrichment & Kalenderkontroll</CardTitle>
                  <CardDescription className="text-base mb-6">
                    För att skapa ett smart system måste data vara aktuell, berikad och tidsstyrd.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Data Enrichment */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">Prospektering & Data Berikning</h4>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="w-16 h-16 rounded-lg bg-card-foreground/5 p-2 flex items-center justify-center">
                          <img src="/images/logos/apollo.png" alt="Apollo" className="w-full h-full object-contain" />
                        </div>
                        <div className="w-16 h-16 rounded-lg bg-card-foreground/5 p-2 flex items-center justify-center">
                          <img src="/images/logos/apify.png" alt="Apify" className="w-full h-full object-contain" />
                        </div>
                        <div className="w-16 h-16 rounded-lg bg-card-foreground/5 p-2 flex items-center justify-center">
                          <img src="/images/logos/eniro.png" alt="Eniro" className="w-full h-full object-contain" />
                        </div>
                        <div className="w-16 h-16 rounded-lg bg-card-foreground/5 p-2 flex items-center justify-center">
                          <img src="/images/logos/explorium.png" alt="Explorium" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Vi skapar en Automated Data Science Pipeline. Apify används för att bygga specialiserade 
                        Web Scraping-bots som hämtar ostrukturerad data. Denna data berikas sedan med firmografiska/
                        teknografiska detaljer via Explorium och kompletteras med lokala data från Eniro. Allt styrs 
                        av en automatiserad workflow som matar det berikade och strukturerade datat in i era LLM:er.
                      </p>
                    </div>

                    <Separator />

                    {/* Calendar Control */}
                    <div>
                      <h4 className="text-2xl font-bold mb-4">Kalender & Bokning</h4>
                      <div className="flex gap-2 mb-4">
                        <Badge variant="secondary">Google Calendar</Badge>
                        <Badge variant="secondary">Microsoft Outlook</Badge>
                        <Badge variant="secondary">Calendly</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Vi skapar ett Canonical Time Layer. Istället för att bara integrera dessa, skapar vi en 
                        centraliserad Tillgänglighets-API som hanterar bi-directional sync och conflict resolution 
                        logic via automatiseringsplattformarna. Detta garanterar att både AI-röstagenterna och mänskliga 
                        säljare alltid ser samma, realtidsuppdaterade tillgänglighet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Del IV: Konvergens och Det Skräddarsydda Gränssnittet */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-7xl mx-auto space-y-16">
            <AnimatedSection>
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">Del IV</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Konvergens och Det Skräddarsydda Gränssnittet
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-lg bg-card-foreground/5 p-4 flex items-center justify-center">
                      <img 
                        src="/images/logos/lovable.png" 
                        alt="Lovable"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-3xl mb-2">Lovable</CardTitle>
                      <CardDescription className="text-base">
                        Skräddarsydd Utveckling och Custom Dashboard
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-semibold mb-3">AI Utveckling</h4>
                      <p className="text-muted-foreground">
                        När en LLM inte är tillräckligt snabb eller specialiserad, bygger vi proprietära AI-modeller 
                        (t.ex. specialiserad Lead Scoring eller Bildklassificering) och containeriserar dem som 
                        mikrotjänster. Dessa mikrotjänster exponeras som API:er som vår n8n/Make-logik anropar.
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-xl font-semibold mb-3">Custom Dashboard</h4>
                      <p className="text-muted-foreground mb-6">
                        Detta är den slutliga presentationen av vår tekniska bemästring. Dashboarden är ett Single 
                        Pane of Glass som konsumerar data från alla de integrerade källorna. Vi kodar unika Widgets 
                        som visualiserar:
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                            <CardTitle className="text-lg">LLM Router Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Vilken modell hanterade vilken uppgift och till vilken kostnad.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                            <CardTitle className="text-lg">Automation Health</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Status i realtid för de mest kritiska n8n/Make-workflows.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                            <CardTitle className="text-lg">Real-time Lead Scoring</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              En visualisering av berikad data, som ger säljteamet handlingsbara insikter.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Conclusion */}
        <section className="py-24 px-6 lg:px-12">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Slutsats:{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Total Kompetens, Enhetligt Levererad
                </span>
              </h2>
              <div className="text-xl text-muted-foreground leading-relaxed space-y-6 text-left">
                <p>
                  Vår tekniska stack är en disciplinerad, enhetlig arkitektur. Från den komplexa Prompt Engineering 
                  som styr de intellektuella motorerna, via de säkra API-nycklarna och Webhooks som möjliggör 
                  realtidskommunikation, till den skräddarsydda Lovable-panelen som ger er total kontroll – vi har 
                  bemästrat varje lager.
                </p>
                <p className="text-center text-2xl font-semibold">
                  Vi erbjuder inte bara mjukvara; vi erbjuder ett konceptuellt ingenjörsarbete som omvandlar er 
                  affärslogik till ett autonomt, intelligent system.
                </p>
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
