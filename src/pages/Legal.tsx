import { Header } from "@/components/Header";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        
        <section id="integritetspolicy" className="mb-12 bg-card p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">Integritetspolicy</h1>
          <p className="text-muted-foreground mb-2"><strong>Hiems Handelsbolag</strong> värnar om din integritet och är transparent om hur vi hanterar dina personuppgifter.</p>
          <p className="text-muted-foreground mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduktion</h2>
            <p className="text-muted-foreground mb-3">Hiems Handelsbolag (org.nr: <strong>969802-0246</strong>) är ansvarig för behandlingen av dina personuppgifter. Denna integritetspolicy förklarar hur vi samlar in, använder, lagrar och skyddar dina personuppgifter när du använder våra tjänster.</p>
            <p className="font-medium">Kontakt: <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a></p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Vilka personuppgifter vi samlar in</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Grundläggande information:</strong> Namn, e-postadress, företagsinformation, faktureringsadress</li>
              <li><strong>Teknisk information:</strong> IP-adress, enhet, operativsystem, cookies</li>
              <li><strong>Kommunikationsdata:</strong> Samtalsloggar och kundtjänstkorrespondens</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Varför vi behandlar dina personuppgifter</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Tillhandahålla våra tjänster</li>
              <li>Fakturering och betalningar</li>
              <li>Säkerhet och bedrägeriförebyggande</li>
              <li>Marknadsföring (med samtycke)</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Dina rättigheter enligt GDPR</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Rätt till tillgång och information</li>
              <li>Rätt till rättelse och radering</li>
              <li>Rätt till dataportabilitet</li>
              <li>Rätt att invända mot behandling</li>
            </ul>
            <p className="text-muted-foreground mt-3">För att utöva dina rättigheter, kontakta oss på <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a>.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Säkerhet och lagringstid</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kryptering av data och åtkomstkontroller</li>
              <li>Lagringstider: kontodata (3 år), fakturor (7 år), marknadsföring (tills samtycke återkallas)</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Delning med tredje parter</h2>
            <p className="text-muted-foreground">Personuppgifter delas endast med nödvändiga tjänsteleverantörer och myndigheter vid laglig förfrågan. Alla parter omfattas av DPA och GDPR.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Kontakt och klagomål</h2>
            <p className="text-muted-foreground mb-2">Dataskyddsärenden: <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a></p>
            <p className="text-muted-foreground">Tillsynsmyndighet: Integritetsskyddsmyndigheten (<a href="mailto:imy@imy.se" className="text-primary hover:underline">imy@imy.se</a>)</p>
          </article>
        </section>

        <section id="villkor" className="mb-12 bg-card p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">Användarvillkor</h1>
          <p className="text-muted-foreground mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Allmänna bestämmelser</h2>
            <p className="text-muted-foreground">Dessa villkor gäller mellan <strong>Hiems Handelsbolag (969802-0246)</strong> och kunden. Genom att använda våra tjänster godkänner du dessa villkor.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Tjänstebeskrivning</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>AI-driven samtals- och meddelandehantering</li>
              <li>SMS och notifieringar</li>
              <li>Dashboard och analys</li>
              <li>API-integrationer</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Kundens ansvar</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Använd tjänsten lagligt</li>
              <li>Skydda inloggningsuppgifter</li>
              <li>Betala avtalade avgifter</li>
              <li>Inte skicka spam eller bryta mot lag</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Betalning</h2>
            <p className="text-muted-foreground">Fakturering sker månadsvis med 30 dagars betalningsvillkor. Dröjsmålsränta enligt räntelagen.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Avtalstid och uppsägning</h2>
            <p className="text-muted-foreground">Uppsägningstid: 30 dagar. Kunddata kan exporteras inom 30 dagar efter avslut.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Ansvar</h2>
            <p className="text-muted-foreground">Hiems ansvarar endast för direkta skador upp till det belopp som betalats under de senaste 12 månaderna.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Immateriella rättigheter</h2>
            <p className="text-muted-foreground">All teknik och dokumentation tillhör Hiems Handelsbolag. Kunden får en icke-exklusiv licens under avtalstiden.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Sekretess</h2>
            <p className="text-muted-foreground">Parterna förbinder sig till sekretess under och två år efter avtalets slut.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Tillämplig lag och tvister</h2>
            <p className="text-muted-foreground mb-3">Svensk lag gäller. Tvister avgörs av Göteborgs tingsrätt.</p>
            <p className="font-medium">Kontakt: <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a></p>
          </article>
        </section>

        <section id="aup" className="mb-12 bg-card p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">Acceptable Use Policy (AUP)</h1>
          <p className="text-muted-foreground mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Syfte</h2>
            <p className="text-muted-foreground">Denna policy definierar tillåten användning av Hiems Handelsbolags tjänster.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Tillåten användning</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Affärskommunikation</li>
              <li>Kundservice</li>
              <li>Marknadsföring med samtycke</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Förbjuden användning</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Spam eller massutskick utan samtycke</li>
              <li>Olagligt, stötande eller vilseledande innehåll</li>
              <li>Säkerhetsintrång eller manipulation</li>
            </ul>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Konsekvenser</h2>
            <p className="text-muted-foreground mb-3">Brott mot denna policy kan leda till varning, avstängning eller permanent avslut av konto.</p>
            <p className="text-muted-foreground">Rapportera överträdelser till <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a>.</p>
          </article>
        </section>

        <section id="cookie-policy" className="mb-12 bg-card p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">Cookie-policy</h1>
          <p className="text-muted-foreground mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Vad är cookies?</h2>
            <p className="text-muted-foreground">Cookies är små textfiler som lagras på din enhet för att förbättra användarupplevelsen.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Typer av cookies</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Nödvändiga – krävs för webbplatsens funktion</li>
              <li>Funktionella – sparar inställningar</li>
              <li>Analys – hjälper oss förstå användarbeteende</li>
              <li>Marknadsföring – används för annonser</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Hantering av cookies</h2>
            <p className="text-muted-foreground">Du kan ändra eller återkalla samtycke via cookie-inställningar eller din webbläsare.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Tredjepartstjänster</h2>
            <p className="text-muted-foreground mb-3">Hiems kan använda Google Analytics, Meta och LinkedIn enligt GDPR och SCC.</p>
            <p className="font-medium">Kontakt: <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a></p>
          </article>
        </section>

        <section id="dpa" className="mb-12 bg-card p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">Databehandlingsavtal (DPA)</h1>
          <p className="text-muted-foreground mb-6"><strong>Senast uppdaterad:</strong> 2025-10-11</p>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Parter</h2>
            <p className="text-muted-foreground"><strong>Personuppgiftsansvarig:</strong> Kunden<br />
            <strong>Personuppgiftsbiträde:</strong> Hiems Handelsbolag (969802-0246)</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Behandling</h2>
            <p className="text-muted-foreground">Hiems behandlar kunddata för att tillhandahålla tjänster, hantera kommunikation och fakturering.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Säkerhetsåtgärder</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kryptering av data</li>
              <li>Tvåfaktorsautentisering</li>
              <li>Regelbundna säkerhetsrevisioner</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Underbiträden</h2>
            <p className="text-muted-foreground">Endast godkända underbiträden inom EU/EES används. Kunden informeras 30 dagar innan ändring.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Incidenthantering</h2>
            <p className="text-muted-foreground">Incidenter rapporteras inom 24 timmar, full rapport inom 72 timmar.</p>
          </article>

          <article className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Radering</h2>
            <p className="text-muted-foreground">All kunddata raderas inom 30 dagar efter avtalets slut. Intyg tillhandahålls.</p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Tillämplig lag</h2>
            <p className="text-muted-foreground mb-3">GDPR, svensk dataskyddslag och svensk rätt. Tvister avgörs av Stockholms tingsrätt.</p>
            <p className="font-medium">Kontakt: <a href="mailto:contact@hiems.se" className="text-primary hover:underline">contact@hiems.se</a></p>
          </article>
        </section>

      </main>
    </div>
  );
};

export default Legal;
