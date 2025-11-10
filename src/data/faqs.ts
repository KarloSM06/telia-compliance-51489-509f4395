export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Hur lång tid tar det att införa en AI-lösning?",
    answer: "Vanligtvis 2-4 veckor från första möte till driftstart, beroende på komplexitet och omfattning. Vi börjar med en behovsanalys, följt av utveckling och implementation, och avslutar med test och optimering innan full driftstart.",
    category: "getting-started"
  },
  {
    id: "faq-2",
    question: "Krävs det teknisk kunskap från vår sida?",
    answer: "Nej, vi hanterar all teknisk implementation. Ni behöver bara ge oss tillgång till era system och delta i möten för kravställning och feedback. Vi ser till att allt fungerar sömlöst utan att ni behöver teknisk expertis.",
    category: "getting-started"
  },
  {
    id: "faq-3",
    question: "Vad kostar det att komma igång?",
    answer: "Startpriser från 7 995 kr/mån beroende på paket och omfattning. Vi erbjuder alltid en kostnadsfri behovsanalys först där vi går igenom era specifika behov och ger en skräddarsydd offert. Slutligt pris beror på komplexitet och antal integrationer.",
    category: "pricing"
  },
  {
    id: "faq-4",
    question: "Vilka system kan Hiems integreras med?",
    answer: "Vi integrerar med de flesta CRM-system, telefonisystem, mejlplattformar och affärssystem. Exempel inkluderar Salesforce, HubSpot, Twilio, Telnyx, Google Workspace, Microsoft 365, Slack, och många fler. Om ert system har ett API kan vi troligen integrera med det.",
    category: "technology"
  },
  {
    id: "faq-5",
    question: "Äger vi lösningen ni bygger?",
    answer: "Ja, du kan välja att äga all kod och infrastruktur helt utan beroenden till Hiems. Vi erbjuder både hanterade lösningar där vi sköter allt, och fullständig äganderätt där ni får all kod och kan drifta själva eller med annan leverantör.",
    category: "ownership"
  },
  {
    id: "faq-6",
    question: "Vad händer om något går fel?",
    answer: "Vi erbjuder 24/7 support och monitoring för alla våra lösningar. Alla system har redundans och backup-system för att säkerställa kontinuitet. Vid problem får ni omedelbar support och vi arbetar tills allt fungerar igen. Tillgänglighetsgaranti ingår i alla våra paket.",
    category: "support"
  },
  {
    id: "faq-7",
    question: "Var lagras min data?",
    answer: "All data lagras säkert i EU-baserade datacenter som följer GDPR och andra relevanta regleringar. Vi använder kryptering både i transit och i vila, och ni har full kontroll över er data. På begäran kan vi även erbjuda on-premise lösningar.",
    category: "technology"
  },
  {
    id: "faq-8",
    question: "När ser jag resultat?",
    answer: "De flesta kunder ser mätbara resultat inom första månaden efter driftstart. Typiska förbättringar inkluderar kortare svarstider, färre missade samtal, och tidsbesparingar på 20-60% för manuella processer. Vi sätter upp tydliga KPI:er från start så att ni kan följa utvecklingen.",
    category: "results"
  }
];
