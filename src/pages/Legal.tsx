import { Header1 } from "@/components/ui/header";
import { FileText, Shield, Scale, Cookie, FileCheck, Clock } from "lucide-react";

const Legal = () => {
  const quickLinks = [
    { id: "integritetspolicy", label: "Integritetspolicy", icon: Shield },
    { id: "villkor", label: "Användarvillkor", icon: FileText },
    { id: "allmanna-villkor", label: "Allmänna Villkor", icon: FileCheck },
    { id: "aup", label: "Acceptable Use Policy", icon: Scale },
    { id: "cookie-policy", label: "Cookie-policy", icon: Cookie },
    { id: "dpa", label: "Databehandlingsavtal", icon: FileCheck },
    { id: "sla", label: "Service Level Agreement", icon: Clock },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header1 />
      
      {/* Premium Quick Links Section */}
      <div className="sticky top-0 z-40 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-elegant">
        <nav className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {quickLinks.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-accent/20 rounded-lg transition-all duration-300 hover:shadow-button hover:scale-105"
              >
                <Icon className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-12 relative">
        
        <section id="integritetspolicy" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Integritetspolicy</h1>
          </div>
          <p className="text-white/70 mb-2"><strong>Hiems Handelsbolag</strong> värnar om din integritet och är transparent om hur vi hanterar dina personuppgifter.</p>
          <p className="text-white/70 mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Introduktion</h2>
            <p className="text-white/70 mb-3">Hiems Handelsbolag (org.nr: <strong>969802-0246</strong>) är ansvarig för behandlingen av dina personuppgifter. Denna integritetspolicy förklarar hur vi samlar in, använder, lagrar och skyddar dina personuppgifter när du använder våra tjänster.</p>
            <p className="font-medium text-white">Kontakt: <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a></p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Vilka personuppgifter vi samlar in</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li><strong>Grundläggande information:</strong> Namn, e-postadress, företagsinformation, faktureringsadress</li>
              <li><strong>Teknisk information:</strong> IP-adress, enhet, operativsystem, cookies</li>
              <li><strong>Kommunikationsdata:</strong> Samtalsloggar och kundtjänstkorrespondens</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Varför vi behandlar dina personuppgifter</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Tillhandahålla våra tjänster</li>
              <li>Fakturering och betalningar</li>
              <li>Säkerhet och bedrägeriförebyggande</li>
              <li>Marknadsföring (med samtycke)</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">4. Dina rättigheter enligt GDPR</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Rätt till tillgång och information</li>
              <li>Rätt till rättelse och radering</li>
              <li>Rätt till dataportabilitet</li>
              <li>Rätt att invända mot behandling</li>
            </ul>
            <p className="text-white/70 mt-3">För att utöva dina rättigheter, kontakta oss på <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a>.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">5. Säkerhet och lagringstid</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Kryptering av data och åtkomstkontroller</li>
              <li>Lagringstider: kontodata (3 år), fakturor (7 år), marknadsföring (tills samtycke återkallas)</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">6. Delning med tredje parter</h2>
            <p className="text-white/70">Personuppgifter delas endast med nödvändiga tjänsteleverantörer och myndigheter vid laglig förfrågan. Alla parter omfattas av DPA och GDPR.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Kontakt och klagomål</h2>
            <p className="text-white/70 mb-2">Dataskyddsärenden: <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a></p>
            <p className="text-white/70">Tillsynsmyndighet: Integritetsskyddsmyndigheten (<a href="mailto:imy@imy.se" className="text-accent hover:underline">imy@imy.se</a>)</p>
          </article>
        </section>

        <section id="villkor" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Användarvillkor</h1>
          </div>
          <p className="text-white/70 mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Allmänna bestämmelser</h2>
            <p className="text-white/70">Dessa villkor gäller mellan <strong>Hiems Handelsbolag (969802-0246)</strong> och kunden. Genom att använda våra tjänster godkänner du dessa villkor.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Tjänstebeskrivning</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>AI-driven samtals- och meddelandehantering</li>
              <li>SMS och notifieringar</li>
              <li>Dashboard och analys</li>
              <li>API-integrationer</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Kundens ansvar</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Använd tjänsten lagligt</li>
              <li>Skydda inloggningsuppgifter</li>
              <li>Betala avtalade avgifter</li>
              <li>Inte skicka spam eller bryta mot lag</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">4. Betalning</h2>
            <p className="text-white/70">Fakturering sker månadsvis med 30 dagars betalningsvillkor. Dröjsmålsränta enligt räntelagen.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">5. Avtalstid och uppsägning</h2>
            <p className="text-white/70">Uppsägningstid: 30 dagar. Kunddata kan exporteras inom 30 dagar efter avslut.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">6. Ansvar</h2>
            <p className="text-white/70">Hiems ansvarar endast för direkta skador upp till det belopp som betalats under de senaste 12 månaderna.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">7. Immateriella rättigheter</h2>
            <p className="text-white/70">All teknik och dokumentation tillhör Hiems Handelsbolag. Kunden får en icke-exklusiv licens under avtalstiden.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">8. Sekretess</h2>
            <p className="text-white/70">Parterna förbinder sig till sekretess under och två år efter avtalets slut.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Tillämplig lag och tvister</h2>
            <p className="text-white/70 mb-3">Svensk lag gäller. Tvister avgörs av Göteborgs tingsrätt.</p>
            <p className="font-medium text-white">Kontakt: <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a></p>
          </article>
        </section>

        <section id="allmanna-villkor" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Hiems Handelsbolag – Allmänna Villkor (HAV 1.0)</h1>
          </div>
          <div className="space-y-2 text-white/70 mb-6">
            <p><strong>Gäller från och med:</strong> 2025/10/17</p>
            <p><strong>Version:</strong> 1.0</p>
            <p><strong>Publicerad av:</strong> Hiems Handelsbolag (Org.nr 969802-0246, Stockholm, Sverige)</p>
            <p><strong>Kontakt:</strong> <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a></p>
            <p><strong>Webbplats:</strong> <a href="https://hiems.se" className="text-accent hover:underline">https://hiems.se</a></p>
          </div>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Allmänt</h2>
            <p className="text-white/70">Dessa allmänna villkor ("HAV") gäller för alla produkter och tjänster som levereras av Hiems Handelsbolag ("Leverantören") till kund ("Kunden"). Eventuella särskilda villkor eller beskrivningar för en viss tjänst regleras i respektive huvudavtal och dess bilagor, som alltid har företräde vid konflikt med dessa villkor.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Definitioner</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li><strong>Tjänsten:</strong> Den eller de AI-, konsult-, eller supporttjänster som anges i huvudavtalet.</li>
              <li><strong>Kunden:</strong> Den juridiska person eller enskilda firma som har ingått avtal med Hiems Handelsbolag.</li>
              <li><strong>Data:</strong> All information som Kunden tillhandahåller eller som genereras via användningen av Tjänsten.</li>
              <li><strong>Parterna:</strong> Hiems Handelsbolag och Kunden gemensamt.</li>
              <li><strong>Huvudavtalet:</strong> Det undertecknade avtalet som anger tjänstens omfattning, pris, och villkor.</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Avtalets omfattning</h2>
            <p className="text-white/70 mb-3">Hiems Handelsbolag tillhandahåller Tjänster enligt huvudavtalet. Hiems ansvarar för drift, uppdateringar och säkerhet i enlighet med gällande lagar, inklusive GDPR. Kunden ansvarar för att använda Tjänsten i enlighet med gällande lag, Användarvillkor och Hiems Acceptable Use Policy (AUP).</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">4. Avgifter och betalning</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Fakturering sker enligt huvudavtalet.</li>
              <li>Betalningsvillkor är 30 dagar netto om inget annat anges.</li>
              <li>Vid försenad betalning tillkommer dröjsmålsränta enligt svensk räntelag (1975:635) samt eventuell påminnelseavgift.</li>
              <li>Hiems Handelsbolag förbehåller sig rätten att justera priser vid förändrade kostnader eller växelkursförändringar. Kunden meddelas minst 30 dagar innan prisändring träder i kraft.</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">5. Avtalstid och uppsägning</h2>
            <p className="text-white/70 mb-3">Avtalets bindningstid och uppsägningstid regleras i huvudavtalet. Om inget annat anges gäller 30 dagars uppsägningstid. Hiems Handelsbolag har rätt att säga upp avtalet med omedelbar verkan om Kunden:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>a) Bryter mot dessa villkor eller AUP,</li>
              <li>b) Inte betalar inom 30 dagar efter förfallodatum,</li>
              <li>c) Använder Tjänsten på ett sätt som orsakar skada, störning eller rättslig risk.</li>
            </ul>
            <p className="text-white/70">Efter uppsägning raderas kunddata inom 30 dagar, enligt Databehandlingsavtalet (DPA).</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">6. Dataskydd och sekretess</h2>
            <p className="text-white/70 mb-3">Hiems Handelsbolag agerar som personuppgiftsbiträde i relation till Kunden, som är personuppgiftsansvarig.</p>
            <p className="text-white/70 mb-3">All behandling av personuppgifter sker enligt:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>Databehandlingsavtalet (DPA),</li>
              <li>Integritetspolicyn,</li>
              <li>Acceptable Use Policy (AUP).</li>
            </ul>
            <p className="text-white/70">All data lagras inom EU, skyddas genom kryptering och hanteras enligt tekniska och organisatoriska säkerhetsåtgärder. Hiems Handelsbolag och Kunden förbinder sig att inte avslöja konfidentiell information till tredje part utan skriftligt medgivande.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">7. Immateriella rättigheter</h2>
            <p className="text-white/70">Alla rättigheter till mjukvara, AI-modeller, kod, dokumentation och varumärken tillhör Hiems Handelsbolag eller dess licensgivare. Kunden får en begränsad och icke-överlåtbar licens att använda Tjänsten under avtalstiden. Kunden får inte dekompilera, kopiera eller distribuera material utan skriftligt tillstånd från Hiems Handelsbolag.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">8. Ansvarsbegränsning</h2>
            <p className="text-white/70 mb-3">Hiems Handelsbolag ansvarar inte för:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>Indirekta skador, dataförlust eller utebliven vinst,</li>
              <li>Förseningar eller fel orsakade av tredje part, nätverk eller force majeure.</li>
            </ul>
            <p className="text-white/70">Hiems Handelsbolags totala ansvar är begränsat till det belopp Kunden betalat under de senaste 12 månaderna.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">9. Kommunikation och support</h2>
            <p className="text-white/70">Kundsupport sker via e-post till <a href="mailto:support@hiems.se" className="text-accent hover:underline">support@hiems.se</a> eller via annan kommunikationskanal enligt huvudavtalet. Planerade driftavbrott eller uppdateringar meddelas i god tid.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">10. Tillämplig lag och tvister</h2>
            <p className="text-white/70">Avtalet regleras av svensk lag. Tvister som inte kan lösas genom dialog avgörs av Stockholms tingsrätt som första instans.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">11. Övrigt</h2>
            <p className="text-white/70 mb-3">Hiems Handelsbolag har rätt att uppdatera dessa allmänna villkor. Senaste versionen publiceras på <a href="https://hiems.se" className="text-accent hover:underline">https://hiems.se</a>. Om väsentliga ändringar görs informeras Kunden minst 30 dagar innan de träder i kraft.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">Tillämpliga dokument</h2>
            <p className="text-white/70 mb-3">Dessa Allmänna Villkor ska alltid läsas tillsammans med följande dokument, tillgängliga på <a href="https://hiems.se" className="text-accent hover:underline">https://hiems.se</a>:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>Databehandlingsavtal (DPA)</li>
              <li>Integritetspolicy</li>
              <li>Acceptable Use Policy (AUP)</li>
              <li>Användarvillkor</li>
            </ul>
            <p className="text-white/70">Genom att underteckna ett kundavtal med Hiems Handelsbolag bekräftar Kunden att denne tagit del av och godkänt dessa dokument.</p>
          </article>
        </section>

        <section id="aup" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Scale className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Acceptable Use Policy (AUP)</h1>
          </div>
          <p className="text-white/70 mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Syfte</h2>
            <p className="text-white/70">Denna policy definierar tillåten användning av Hiems Handelsbolags tjänster.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Tillåten användning</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Affärskommunikation</li>
              <li>Kundservice</li>
              <li>Marknadsföring med samtycke</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Förbjuden användning</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Spam eller massutskick utan samtycke</li>
              <li>Olagligt, stötande eller vilseledande innehåll</li>
              <li>Säkerhetsintrång eller manipulation</li>
            </ul>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Konsekvenser</h2>
            <p className="text-white/70 mb-3">Brott mot denna policy kan leda till varning, avstängning eller permanent avslut av konto.</p>
            <p className="text-white/70">Rapportera överträdelser till <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a>.</p>
          </article>
        </section>

        <section id="cookie-policy" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Cookie className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Cookie-policy</h1>
          </div>
          <p className="text-white/70 mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Vad är cookies?</h2>
            <p className="text-white/70">Cookies är små textfiler som lagras på din enhet för att förbättra användarupplevelsen.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Typer av cookies</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Nödvändiga – krävs för webbplatsens funktion</li>
              <li>Funktionella – sparar inställningar</li>
              <li>Analys – hjälper oss förstå användarbeteende</li>
              <li>Marknadsföring – används för annonser</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Hantering av cookies</h2>
            <p className="text-white/70">Du kan ändra eller återkalla samtycke via cookie-inställningar eller din webbläsare.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Tredjepartstjänster</h2>
            <p className="text-white/70 mb-3">Hiems kan använda Google Analytics, Meta och LinkedIn enligt GDPR och SCC.</p>
            <p className="font-medium text-white">Kontakt: <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a></p>
          </article>
        </section>

        <section id="dpa" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Databehandlingsavtal (DPA)</h1>
          </div>
          <p className="text-white/70 mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Parter</h2>
            <p className="text-white/70"><strong>Personuppgiftsansvarig:</strong> Kunden<br />
            <strong>Personuppgiftsbiträde:</strong> Hiems Handelsbolag (969802-0246)</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Behandling</h2>
            <p className="text-white/70">Hiems behandlar kunddata för att tillhandahålla tjänster, hantera kommunikation och fakturering.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Säkerhetsåtgärder</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Kryptering av data</li>
              <li>Tvåfaktorsautentisering</li>
              <li>Regelbundna säkerhetsrevisioner</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">4. Underbiträden</h2>
            <p className="text-white/70">Endast godkända underbiträden inom EU/EES används. Kunden informeras 30 dagar innan ändring.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">5. Incidenthantering</h2>
            <p className="text-white/70">Incidenter rapporteras inom 24 timmar, full rapport inom 72 timmar.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">6. Radering</h2>
            <p className="text-white/70">All kunddata raderas inom 30 dagar efter avtalets slut. Intyg tillhandahålls.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Tillämplig lag</h2>
            <p className="text-white/70 mb-3">GDPR, svensk dataskyddslag och svensk rätt. Tvister avgörs av Stockholms tingsrätt.</p>
            <p className="font-medium text-white">Kontakt: <a href="mailto:contact@hiems.se" className="text-accent hover:underline">contact@hiems.se</a></p>
          </article>
        </section>

        <section id="sla" className="mb-12 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/20 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Service Level Agreement (SLA)</h1>
          </div>
          <div className="space-y-2 text-white/70 mb-6">
            <p><strong>Version:</strong> 1.1</p>
            <p><strong>Gäller från och med:</strong> 2025-11-02</p>
            <p><strong>Publicerad av:</strong> Hiems Handelsbolag</p>
          </div>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">1. Syfte</h2>
            <p className="text-white/70">Detta Service Level Agreement ("SLA") beskriver de allmänna nivåer för tillgänglighet, support och underhåll som Hiems Handelsbolag ("Hiems", "vi", "oss") erbjuder för våra produkter och tjänster.</p>
            <p className="text-white/70 mt-3">SLA:t gäller som tillägg till våra juridiska villkor (HAV 1.0, DPA, AUP, Integritetspolicy och Användarvillkor) och omfattar alla kunder med ett aktivt avtal eller abonnemang hos Hiems.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">2. Omfattning</h2>
            <p className="text-white/70 mb-3">Hiems utvecklar och tillhandahåller skräddarsydda AI- och automationslösningar för företag, inklusive:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>AI-agenter för röst och text</li>
              <li>Automatisering och systemintegrationer</li>
              <li>Konsultation och anpassning av AI-flöden</li>
              <li>Drift, underhåll och support för aktiva system</li>
            </ul>
            <p className="text-white/70">Detta SLA gäller för den del av tjänsten som drivs, underhålls eller hanteras av Hiems, i den omfattning som framgår av kundens avtal.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">3. Systemtillgänglighet</h2>
            <p className="text-white/70 mb-3">Hiems strävar efter att hålla alla aktiva tjänster tillgängliga minst 99% per kalendermånad, exklusive planerat underhåll.</p>
            <p className="text-white/70 mb-3">Tillgänglighet avser driftstatus för Hiems infrastruktur, molnplattformar och API-tjänster.</p>
            <p className="text-white/70 mb-2">Hiems ansvarar inte för avbrott orsakade av:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Kundens egna system, nätverk eller integrationer</li>
              <li>Tredjepartsleverantörer (t.ex. OpenAI, Twilio, Google Cloud)</li>
              <li>Händelser utanför Hiems rimliga kontroll (force majeure)</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">4. Planerat underhåll</h2>
            <p className="text-white/70 mb-3">Hiems kan utföra planerat underhåll för att förbättra säkerhet, prestanda och stabilitet.</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>Kunder med aktiv prenumeration eller support plan informeras minst 24 timmar i förväg.</li>
              <li>Underhåll sker normalt mellan 22:00–06:00 svensk tid.</li>
              <li>Kortare avbrott kan förekomma under dessa perioder.</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">5. Support och underhåll</h2>
            <p className="text-white/70 mb-3">Kunder som har aktiv månads- eller årsbaserad prenumeration hos Hiems har tillgång till löpande support och underhåll utan extra kostnad.</p>
            <p className="text-white/70 mb-2">Detta inkluderar:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>Hjälp med felsökning och tekniska frågor</li>
              <li>Mindre justeringar och optimeringar av befintliga system</li>
              <li>Säkerhets- och stabilitet uppdateringar</li>
              <li>Tillgång till framtida förbättringar av plattformen</li>
            </ul>
            <p className="text-white/70">Kunder som har betalat en engångsavgift och därmed äger sin lösning omfattas inte av löpande support eller uppdateringar. Dessa kunder kan dock beställa hjälp, uppdateringar eller vidareutveckling som separata konsulttjänster enligt offert.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">6. Incidenthantering</h2>
            <p className="text-white/70 mb-3">Hiems hanterar incidenter och driftstörningar med prioritet baserat på hur allvarligt de påverkar tjänstens funktion. Alla rapporterade problem åtgärdas så snabbt som möjligt enligt rimlig teknisk praxis.</p>
            <p className="text-white/70">Incidenter rapporteras till: <a href="mailto:support@hiems.se" className="text-accent hover:underline">support@hiems.se</a></p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">7. Uppdateringar och förbättringar</h2>
            <p className="text-white/70">Hiems levererar löpande förbättringar och säkerhetsförbättringar för kunder med aktiv prenumeration. Kunder som äger sin lösning kan köpa till uppdateringar eller förbättringar efter behov.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">8. Ansvarsbegränsning</h2>
            <p className="text-white/70 mb-2">Hiems Handelsbolags ansvar är begränsat till det lägsta av:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 mb-3">
              <li>Tre (3) månaders serviceavgift, eller</li>
              <li>Det belopp som betalats för tjänsten under de senaste 90 dagarna.</li>
            </ul>
            <p className="text-white/70">Hiems ansvarar inte för indirekta skador såsom dataförlust, utebliven vinst eller avbrott i kundens verksamhet.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">9. Kundens ansvar</h2>
            <p className="text-white/70 mb-2">Kunden ansvarar för att:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Tillhandahålla korrekt information, inloggningar och API-nycklar</li>
              <li>Säkerställa kompatibilitet med egna system</li>
              <li>Följa Hiems AUP och användarvillkor</li>
              <li>Rapportera fel eller avbrott tydligt till supporten</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">10. Force Majeure</h2>
            <p className="text-white/70">Hiems är inte ansvarigt för förseningar eller avbrott orsakade av händelser utanför rimlig kontroll, såsom naturkatastrofer, krig, myndighetsbeslut, cyberattacker eller fel hos tredjepartsleverantörer.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">11. Ändringar av SLA</h2>
            <p className="text-white/70 mb-3">Hiems förbehåller sig rätten att uppdatera eller ändra detta SLA. Uppdateringar publiceras på hiems.se och träder i kraft 30 dagar efter publicering.</p>
            <p className="text-white/70">Fortsatt användning av tjänsten innebär att Kunden godkänner den uppdaterade versionen.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3">12. Tillämplig lag och tvister</h2>
            <p className="text-white/70 mb-3">Detta SLA regleras av svensk lag.</p>
            <p className="text-white/70">Tvister som inte kan lösas i samförstånd avgörs av Stockholms tingsrätt som första instans.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-white mb-3">Relaterade dokument</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>HAV 1.0 – Allmänt Avtal</li>
              <li>DPA – Databehandlingsavtal</li>
              <li>AUP – Acceptable Use Policy</li>
              <li>Integritetspolicy</li>
              <li>Användarvillkor</li>
            </ul>
          </article>
        </section>

      </main>
    </div>
  );
};

export default Legal;
