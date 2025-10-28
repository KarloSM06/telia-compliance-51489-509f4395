import { LucideIcon } from "lucide-react";
import { Brain, Workflow, Database, Layout } from "lucide-react";

export interface ArchitecturePhase {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string[];
  icon: LucideIcon;
  image: string;
  subsections: ArchitectureSubsection[];
}

export interface ArchitectureSubsection {
  title: string;
  description: string;
  items?: ArchitectureTool[];
  techniques?: ArchitectureTechnique[];
  highlights?: string[];
}

export interface ArchitectureTool {
  name: string;
  description: string;
  logo?: string;
}

export interface ArchitectureTechnique {
  name: string;
  description: string;
}

export const architecturePhases: ArchitecturePhase[] = [
  {
    id: "phase-1",
    badge: "Del I",
    title: "Den Intellektuella Kärnan",
    subtitle: "AI-Modeller och Prompt Engineering",
    description: [
      "Kärnan i våra lösningar är de storskaliga språkmodellerna (LLM), som fungerar som systemets intellektuella motor. Vår expertis ligger i att finjustera och dirigera dessa modeller för domänspecifik excellens.",
      "LLM:er bygger på Transformer-arkitekturen, som möjliggör djupgående förståelse av språkets kontext och relationer. Vår strategiska användning av flera modeller är avgörande för att optimera både prestanda och kostnad."
    ],
    icon: Brain,
    image: "/images/expertise/ai-models.jpg",
    subsections: [
      {
        title: "AI-Modeller (LLM)",
        description: "Vår strategiska användning av flera modeller optimerar både prestanda och kostnad.",
        items: [
          {
            name: "OpenAI GPT-5",
            description: "Toppen av generell intelligens och resonemangsförmåga. Används för komplexa summeringar och multi-step resonemang via Function Calling.",
            logo: "/images/logos/openai-new.png"
          },
          {
            name: "Claude 3.7",
            description: "Värderas för sitt stora kontextfönster och förmåga att bibehålla koherens över extremt långa dokument.",
            logo: "/images/logos/claude.png"
          },
          {
            name: "Deepseek",
            description: "Specialist för nischade uppgifter som kodgenerering och teknisk analys där träningsdata ger fördel.",
            logo: "/images/logos/deepseek.png"
          },
          {
            name: "Gemini",
            description: "Integrerad multimodal kapacitet (text, bild, video) med synergier inom Google Cloud Platform.",
            logo: "/images/logos/gemini.png"
          }
        ]
      },
      {
        title: "Prompt Engineering",
        description: "Konsten och vetenskapen att utforma instruktioner som matas in i AI-modeller för optimalt resultat.",
        highlights: [
          "Klarhet och specificitet i instruktioner",
          "Iterativ förfining av prompter",
          "Zero-shot och Few-shot prompting",
          "Chain-of-Thought (CoT) resonemang",
          "Role Prompting för specifika perspektiv"
        ]
      },
      {
        title: "RAG (Retrieval-Augmented Generation)",
        description: "Kritiskt för att eliminera AI-hallucinationer genom att infoga realtidsdata i LLM:ens kontext.",
        highlights: [
          "Vektordatabaser för snabb sökning",
          "Integration med CRM och interna system",
          "Faktabaserade svar på proprietärt underlag",
          "Eliminering av AI-hallucinationer"
        ]
      }
    ]
  },
  {
    id: "phase-2",
    badge: "Del II",
    title: "Det Centrala Nervsystemet",
    subtitle: "Automatisering och Datakontroll",
    description: [
      "Systemets intelligens måste omsättas i handling. Detta kräver en robust, skalbar orkestreringsplattform.",
      "Automationsplattformarna fungerar som systemets centrala nervsystem, som dirigerar dataflöden och affärslogik. De är vår Integration Platform as a Service (iPaaS)."
    ],
    icon: Workflow,
    image: "/images/n8n-workflow-background.png",
    subsections: [
      {
        title: "Automatiseringsplattformar",
        description: "Event-driven, multi-step workflows med redundant logik för kritiska dataflöden.",
        items: [
          {
            name: "n8n",
            description: "Workflow automation med robust felhantering, API rate limiting och back-off strategier.",
            logo: "/images/logos/n8n.png"
          },
          {
            name: "Make.com",
            description: "Integration platform för komplexa, parallella workflows och dataorkestration.",
            logo: "/images/logos/make.png"
          }
        ]
      },
      {
        title: "API-nycklar & Autentisering",
        description: "Säker hantering av API-nycklar genom strikta Secret Management-protokoll.",
        highlights: [
          "Lagring i säkra Vaults (aldrig i klartext)",
          "OAuth2-tokens för tidsbegränsad åtkomst",
          "Omedelbar återkallelse vid säkerhetsincidenter",
          "Säker kommunikation med alla tjänster"
        ]
      },
      {
        title: "Webhooks",
        description: "Bi-directional webhooks för real-time prestanda och eliminering av latens.",
        highlights: [
          "Automatiska meddelanden vid händelser",
          "Custom webhook endpoints för alla källor",
          "Validering av datapaket",
          "Real-time uppdateringar (<300ms latens)"
        ]
      }
    ]
  },
  {
    id: "phase-3",
    badge: "Del III",
    title: "Datainsamling och Kommunikation",
    subtitle: "Vår Tekniska Stack",
    description: [
      "Den här delen förklarar hur vi använder de enskilda plattformarna för att bygga en komplett, integrerad lösning.",
      "Från röstassistenter till kalendersystem – alla komponenter arbetar sömlöst tillsammans."
    ],
    icon: Database,
    image: "/images/expertise/telephony.jpg",
    subsections: [
      {
        title: "AI Röstsystem och Telefoni",
        description: "Naturlig röstupplevelse med minimal latens för mänsklig konversation.",
        items: [
          {
            name: "Vapi & Retell",
            description: "Voice API:er med SIP/WebRTC-konfiguration. Optimerad LLM-responstid inom röstloopen (<300ms latens).",
            logo: "/images/logos/vapi.png"
          },
          {
            name: "Telnyx & Twilio",
            description: "Telecom Carriers för SMS/samtal. Programmatisk routing-logik och IVR-system i skala.",
            logo: "/images/logos/telnyx.png"
          }
        ]
      },
      {
        title: "Data Enrichment",
        description: "Automated Data Science Pipeline för berikning av prospektdata.",
        items: [
          {
            name: "Apollo",
            description: "B2B prospektering och företagsinformation",
            logo: "/images/logos/apollo.png"
          },
          {
            name: "Apify",
            description: "Web scraping-bots för ostrukturerad data",
            logo: "/images/logos/apify.png"
          },
          {
            name: "Eniro",
            description: "Lokala data och svensk företagsinformation",
            logo: "/images/logos/eniro.png"
          },
          {
            name: "Explorium",
            description: "Firmografisk och teknografisk berikning",
            logo: "/images/logos/explorium.png"
          }
        ]
      },
      {
        title: "Kalenderkontroll",
        description: "Canonical Time Layer med bi-directional sync och conflict resolution.",
        highlights: [
          "Centraliserad Tillgänglighets-API",
          "Real-time synkronisering",
          "Konflikthantering via automatisering",
          "Integration med Google Calendar, Outlook, Calendly"
        ]
      }
    ]
  },
  {
    id: "phase-4",
    badge: "Del IV",
    title: "Konvergens och Skräddarsytt Gränssnitt",
    subtitle: "Custom Dashboard",
    description: [
      "Slutligen sammanförs alla dessa komponenter i en enda, unik upplevelse.",
      "Detta är den slutliga presentationen av vår tekniska bemästring – ett Single Pane of Glass som ger er total kontroll."
    ],
    icon: Layout,
    image: "/images/tools-background.jpg",
    subsections: [
      {
        title: "Lovable Development",
        description: "Skräddarsydd utveckling när standardverktyg inte räcker till.",
        highlights: [
          "Proprietära AI-modeller som mikrotjänster",
          "Specialiserad Lead Scoring",
          "Bildklassificering och Computer Vision",
          "API-exponering för automation"
        ]
      },
      {
        title: "Custom Dashboard",
        description: "Single Pane of Glass med realtidsdata från alla källor.",
        highlights: [
          "LLM Router Performance – modell, uppgift och kostnad",
          "Automation Health – status för kritiska workflows",
          "Real-time Lead Scoring – handlingsbara insikter",
          "Visuella widgets för KPI:er och ROI"
        ]
      }
    ]
  }
];
