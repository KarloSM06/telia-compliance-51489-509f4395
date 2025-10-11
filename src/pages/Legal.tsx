import { Header } from "@/components/Header";
import { FileText, Shield, Scale, Cookie, FileCheck } from "lucide-react";

const Legal = () => {
  const quickLinks = [
    { id: "integritetspolicy", label: "Integritetspolicy", icon: Shield },
    { id: "villkor", label: "Användarvillkor", icon: FileText },
    { id: "aup", label: "Acceptable Use Policy", icon: Scale },
    { id: "cookie-policy", label: "Cookie-policy", icon: Cookie },
    { id: "dpa", label: "Databehandlingsavtal", icon: FileCheck },
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
      <Header />
      
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

      </main>
    </div>
  );
};

export default Legal;
