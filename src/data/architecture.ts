import { Brain, Workflow, Server, BarChart3, type LucideIcon } from "lucide-react";

export interface ArchitecturePhase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  image: string;
  sections: ArchitectureSection[];
}

export interface ArchitectureSection {
  heading: string;
  content: string;
  tools?: { name: string; logo: string; description: string }[];
  highlights?: string[];
}

export const architecturePhases: ArchitecturePhase[] = [
  {
    id: "del-1",
    title: "Del I: Den Intellektuella Kärnan",
    subtitle: "AI-Modeller och Prompt Engineering",
    description: "Kärnan i våra lösningar är de storskaliga språkmodellerna (LLM), som fungerar som systemets intellektuella motor. Vår expertis ligger i att finjustera och dirigera dessa modeller för domänspecifik excellens.",
    icon: Brain,
    image: "/images/expertise/ai-models.jpg",
    sections: [
      {
        heading: "Grundläggande Förståelse av AI-Modeller (LLM)",
        content: "LLM:er bygger på Transformer-arkitekturen, som möjliggör djupgående förståelse av språkets kontext och relationer. Vår strategiska användning av flera modeller är avgörande för att optimera både prestanda och kostnad.",
        tools: [
          {
            name: "OpenAI GPT-5",
            logo: "/images/logos/openai-new.png",
            description: "Toppen av generell intelligens. Används för komplexa summeringsuppgifter och multi-step resonemang via Function Calling."
          },
          {
            name: "Claude 3.7",
            logo: "/images/logos/claude.png",
            description: "Stort kontextfönster för analys av juridiska dokument och omfattande kundhistorik."
          },
          {
            name: "Deepseek",
            logo: "/images/logos/deepseek.png",
            description: "Specialist för kodgenerering och teknisk analys där träningsdata ger en fördel."
          },
          {
            name: "Gemini",
            logo: "/images/logos/gemini.png",
            description: "Multimodal kapacitet (text, bild, video) och synergier inom Google Cloud Platform."
          }
        ]
      },
      {
        heading: "Vad är Prompt Engineering?",
        content: "Prompt engineering är konsten och vetenskapen att utforma de instruktioner som matas in i generativa AI-modeller för att uppnå önskat resultat. Det är en avgörande disciplin som överbryggar klyftan mellan mänsklig intention och maskinell tolkning.",
        highlights: [
          "Klarhet och specificitet: En vag prompt ger intetsägande svar. En ingenjörsmässigt utformad prompt specificerar ämne, längd, ton, stil och format.",
          "Iterativ förfining: Kontinuerlig justering och utvärdering tills utgången matchar målet.",
          "Avancerade tekniker: Zero-shot/Few-shot, Chain-of-Thought (CoT), Role Prompting för optimal prestanda.",
          "RAG (Retrieval-Augmented Generation): Eliminerar AI-hallucinationer genom att infoga realtidsdata från vektordatabaser."
        ]
      }
    ]
  },
  {
    id: "del-2",
    title: "Del II: Det Centrala Nervsystemet",
    subtitle: "Automatisering och Datakontroll",
    description: "Systemets intelligens måste omsättas i handling. Detta kräver en robust, skalbar orkestreringsplattform som fungerar som systemets centrala nervsystem.",
    icon: Workflow,
    image: "/images/n8n-workflow-background.png",
    sections: [
      {
        heading: "Automatiseringsplattformar: Orkestrering av Workflows",
        content: "Automationsplattformarna fungerar som systemets centrala nervsystem, som dirigerar dataflöden och affärslogik. De är vår Integration Platform as a Service (iPaaS).",
        tools: [
          {
            name: "n8n",
            logo: "/images/logos/n8n.png",
            description: "Event-driven workflows med redundant logik, API Rate Limiting och komplex felhantering."
          },
          {
            name: "Make.com",
            logo: "/images/logos/make.png",
            description: "Integration platform för att garantera att data aldrig går förlorad."
          }
        ],
        highlights: [
          "Exempel: En n8n-nod tar emot Twilio-webhook (nytt SMS), skickar innehållet till GPT-5 för klassificering, och uppdaterar Google Calendar – allt inom sekunder."
        ]
      },
      {
        heading: "API-nycklar och Webhooks",
        content: "Grundläggande mekanismer som möjliggör realtidskommunikation mellan systemen.",
        highlights: [
          "API-nycklar: Unik identifierare för autentisering. Vi hanterar dem genom strikta Secret Management-protokoll i Vaults.",
          "Webhooks: Automatiserade meddelanden när specifika händelser inträffar. Vi implementerar Bi-Directional Webhooks för real-time prestanda och eliminering av latens.",
          "OAuth2-tokens: Säkrare, tidsbegränsad åtkomst där det är möjligt."
        ]
      }
    ]
  },
  {
    id: "del-3",
    title: "Del III: Datainsamling och Kommunikation",
    subtitle: "Vår Tekniska Stack",
    description: "Den här delen förklarar hur vi använder de enskilda plattformarna för att bygga en komplett, integrerad lösning för datainsamling och kommunikation.",
    icon: Server,
    image: "/images/expertise/telephony.jpg",
    sections: [
      {
        heading: "AI Röstsystem och Telefoni",
        content: "Att skapa en naturlig röstupplevelse kräver bemästring av latens och tal-till-text-teknik.",
        tools: [
          {
            name: "Vapi",
            logo: "/images/logos/vapi.png",
            description: "Voice AI agent optimerad för ultra-låg latens (ca 300 ms) och naturlig konversation."
          },
          {
            name: "Retell",
            logo: "/images/logos/retell.png",
            description: "AI phone system konfigurerat på SIP/WebRTC-nivå för telekomnätet."
          },
          {
            name: "Telnyx",
            logo: "/images/logos/telnyx.png",
            description: "Global telefoni för programmatiska SMS och samtal med IVR-system."
          },
          {
            name: "Twilio",
            logo: "/images/logos/twilio.png",
            description: "SMS & Voice API för telefoni-routing-logik i skala."
          }
        ]
      },
      {
        heading: "Data Enrichment & Kalenderkontroll",
        content: "För att skapa ett smart system måste data vara aktuell, berikad och tidsstyrd.",
        tools: [
          {
            name: "Apollo",
            logo: "/images/logos/apollo.png",
            description: "B2B prospektering med firmografiska och teknografiska detaljer."
          },
          {
            name: "Apify",
            logo: "/images/logos/apify.png",
            description: "Specialiserade Web Scraping-bots för ostrukturerad data."
          },
          {
            name: "Eniro",
            logo: "/images/logos/eniro.png",
            description: "Kompletterar med lokala svenska data."
          },
          {
            name: "Explorium",
            logo: "/images/logos/explorium.png",
            description: "Data berikning med firmografiska och teknografiska detaljer."
          }
        ],
        highlights: [
          "Kalender & Bokning: Vi skapar ett Canonical Time Layer med centraliserad Tillgänglighets-API.",
          "Bi-directional sync och conflict resolution via automatiseringsplattformarna.",
          "Google Calendar, Microsoft Outlook och Calendly synkroniseras i realtid."
        ]
      }
    ]
  },
  {
    id: "del-4",
    title: "Del IV: Konvergens och Det Skräddarsydda Gränssnittet",
    subtitle: "Lovable Custom Dashboard",
    description: "Slutligen sammanförs alla dessa komponenter i en enda, unik upplevelse där alla dataflöden presenteras i en skräddarsydd dashboard.",
    icon: BarChart3,
    image: "/images/logos/lovable.png",
    sections: [
      {
        heading: "Skräddarsydd Utveckling",
        content: "När en LLM inte är tillräckligt snabb eller specialiserad, bygger vi proprietära AI-modeller och containeriserar dem som mikrotjänster.",
        highlights: [
          "Specialiserad Lead Scoring eller Bildklassificering som mikrotjänster.",
          "Exponeras som API:er som vår n8n/Make-logik anropar.",
          "Full flexibilitet för domänspecifika behov."
        ]
      },
      {
        heading: "Custom Dashboard: Single Pane of Glass",
        content: "Detta är den slutliga presentationen av vår tekniska bemästring. Dashboarden konsumerar data från alla integrerade källor och ger er total kontroll.",
        highlights: [
          "LLM Router Performance: Vilken modell hanterade vilken uppgift och till vilken kostnad.",
          "Automation Health: Status i realtid för de mest kritiska n8n/Make-workflows.",
          "Real-time Lead Scoring: Visualisering av berikad data för handlingsbara insikter.",
          "Unika Widgets: Varje diagram, knapp och datavisualisering är unikt kodad för era KPI:er."
        ]
      }
    ]
  }
];
