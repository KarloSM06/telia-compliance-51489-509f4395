import { Phone, Brain, Mic, Workflow, BarChart, FileText, Sparkles, Database, Network } from "lucide-react";

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Technology {
  name: string;
  category: string;
}

export interface UseCase {
  title: string;
  description: string;
}

export interface ServiceData {
  id: string;
  slug: string;
  icon: any;
  title: string;
  shortDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  features: ServiceFeature[];
  technologies: Technology[];
  useCases: UseCase[];
  howItWorks?: string[];
}

export const servicesData: ServiceData[] = [
  {
    id: "ai-receptionist",
    slug: "ai-receptionist",
    icon: Phone,
    title: "AI Receptionist & Kommunikation",
    shortDescription: "24/7 AI-driven kommunikation via telefon, SMS och e-post",
    heroTitle: "AI Receptionist & Kommunikationsassistenter",
    heroSubtitle: "Vår AI Receptionist svarar på samtal, bokar möten, hanterar kundärenden och uppdaterar CRM i realtid. Den arbetar via telefon, SMS, e-post eller chatt – dygnet runt, utan väntetider.",
    features: [
      { title: "Tar emot och vidarekopplar samtal", description: "Intelligent samtalshantering med naturlig svenska" },
      { title: "Bokar möten automatiskt", description: "Integreras med din kalender och skickar bekräftelser" },
      { title: "Svarar på vanliga frågor", description: "Tränad på din verksamhets information" },
      { title: "Skickar bekräftelser och uppföljningar", description: "Automatiska e-post och SMS-notifikationer" },
      { title: "24/7 tillgänglighet", description: "Arbetar dygnet runt utan väntetider" },
      { title: "CRM-integration", description: "Uppdaterar kunddata i realtid" }
    ],
    technologies: [
      { name: "Vapi", category: "AI Voice Agent" },
      { name: "Retell", category: "AI Phone System" },
      { name: "Telnyx", category: "Telefoni" },
      { name: "Twilio", category: "SMS & Messaging" },
      { name: "OpenAI GPT-5", category: "AI Model" },
      { name: "Claude 3.7", category: "AI Model" }
    ],
    useCases: [
      { title: "Kundservice för e-handel", description: "Hantera beställningar, returer och produktfrågor automatiskt" },
      { title: "Bokningssystem för kliniker", description: "Boka, omboka och bekräfta tider dygnet runt" },
      { title: "Fastighetsmäklare", description: "Boka visningar och svara på objektfrågor direkt" },
      { title: "Konsultföretag", description: "Kvalificera inkommande leads och boka möten" }
    ],
    howItWorks: [
      "Kund ringer eller skickar meddelande",
      "AI-receptionist svarar på svenska inom sekunder",
      "Samlar information och bokar möte om behövs",
      "Uppdaterar CRM automatiskt",
      "Skickar bekräftelse till kund och intern team"
    ]
  },
  {
    id: "ai-models",
    slug: "ai-modeller",
    icon: Brain,
    title: "AI Modeller (LLM)",
    shortDescription: "GPT-5, Claude 3.7, Deepseek, Gemini - för textgenerering och analys",
    heroTitle: "AI Modeller (LLM)",
    heroSubtitle: "Vi använder de mest avancerade språkmodellerna för att skapa skräddarsydda AI-lösningar som förstår, skriver och analyserar på svenska. Från textgenerering och kundkommunikation till dataanalys och beslutsstöd.",
    features: [
      { title: "Textgenerering på svenska", description: "Professionell text anpassad efter er ton och stil" },
      { title: "Dataanalys och beslutsstöd", description: "AI-driven insiktsanalys av er affärsdata" },
      { title: "Kundinteraktioner", description: "Naturliga konversationer som förstår kontext" },
      { title: "Multilingual support", description: "Stöd för över 50 språk" },
      { title: "Custom fine-tuning", description: "Tränade på er specifika data och domän" },
      { title: "Systemintegration", description: "Sömlös integration med era befintliga system" }
    ],
    technologies: [
      { name: "OpenAI GPT-5", category: "Avancerad språkmodell" },
      { name: "Claude 3.7", category: "Anthropic AI för förståelse" },
      { name: "Deepseek", category: "Specialistmodell" },
      { name: "Gemini", category: "Google Multimodal AI" }
    ],
    useCases: [
      { title: "Kundsupportchatbots", description: "Automatisera 70% av kundförfrågningar med AI" },
      { title: "Innehållsgenerering", description: "Skapa produktbeskrivningar och marknadsföringsmaterial" },
      { title: "Dokumentanalys", description: "Extrahera insikter från kontrakt och rapporter" },
      { title: "Sentiment analys", description: "Analysera kundrecensioner och feedback automatiskt" }
    ]
  },
  {
    id: "ai-voice",
    slug: "ai-rostsystem",
    icon: Mic,
    title: "AI Röstsystem",
    shortDescription: "Naturliga röstassistenter med Vapi och Retell",
    heroTitle: "AI Röstsystem",
    heroSubtitle: "Skapa naturliga, konversationsbaserade röstassistenter som kan hantera samtal precis som en människa. Perfekt för kundtjänst, försäljning eller bokningar.",
    features: [
      { title: "Mänsklig röstkvalitet", description: "Naturligt tal med korrekt intonation och pauser" },
      { title: "Kontext-medveten", description: "Kommer ihåg tidigare i samtalet och anpassar sig" },
      { title: "CRM-integration", description: "Uppdaterar kunddata under samtalet" },
      { title: "Automatisk bokning", description: "Bokar möten direkt i din kalender" },
      { title: "Multi-språkstöd", description: "Stöd för svenska, engelska och fler språk" },
      { title: "Real-time transkription", description: "Alla samtal dokumenteras automatiskt" }
    ],
    technologies: [
      { name: "Vapi", category: "AI Voice Agent" },
      { name: "Retell", category: "AI Phone System" },
      { name: "Telnyx", category: "VoIP infrastructure" },
      { name: "ElevenLabs", category: "Voice synthesis" }
    ],
    useCases: [
      { title: "Inbound sales calls", description: "Kvalificera leads och boka möten automatiskt" },
      { title: "Kundtjänst", description: "Besvara vanliga frågor och lösa problem" },
      { title: "Bokningar", description: "Hantera reservationer för restauranger och kliniker" },
      { title: "Uppföljningssamtal", description: "Automatiska påminnelser och feedback-samtal" }
    ],
    howItWorks: [
      "Samtal inkommer till ditt AI-system",
      "AI identifierar ärendet och söker relevant information",
      "Svarar naturligt och ställer följdfrågor",
      "Bokar möte eller hanterar ärende direkt",
      "Dokumenterar allt i CRM"
    ]
  },
  {
    id: "automations",
    slug: "automatisering",
    icon: Workflow,
    title: "Automatisering & Integration",
    shortDescription: "n8n, Make.com workflows som kopplar ihop alla era system",
    heroTitle: "Automatisering & Integration",
    heroSubtitle: "Vi kopplar ihop alla dina system – CRM, ekonomi, e-post, webb, telefoni – till en sömlös helhet. Med smarta workflows kan du automatisera repetitiva uppgifter och frigöra tid till verkligt värdeskapande.",
    features: [
      { title: "Workflow automation", description: "Automatisera processer från lead till faktura" },
      { title: "API-integrationer", description: "Koppla samman alla era verktyg och system" },
      { title: "Data synkronisering", description: "Håll data uppdaterad över alla plattformar" },
      { title: "Triggerbaserade processer", description: "Automatiska åtgärder baserat på händelser" },
      { title: "Felhantering och logging", description: "Robust felhantering med notifikationer" },
      { title: "Skalbar arkitektur", description: "Växer med ditt företag" }
    ],
    technologies: [
      { name: "n8n", category: "Avancerad workflow-automation" },
      { name: "Make.com", category: "Integrationsplattform" },
      { name: "Lovable", category: "AI-utveckling" },
      { name: "Zapier", category: "Quick integrations" }
    ],
    useCases: [
      { title: "Lead-routing till CRM", description: "Automatisk lead-hantering från formulär till säljteam" },
      { title: "Automatisk fakturering", description: "Från avslutad affär till skickad faktura" },
      { title: "E-postworkflows", description: "Automatiska sekvenser baserat på kundbeteende" },
      { title: "Rapportgenerering", description: "Dagliga/veckovisa rapporter skickas automatiskt" }
    ],
    howItWorks: [
      "Kartläggning av era nuvarande processer",
      "Design av automatiserade workflows",
      "Integration med befintliga system",
      "Testning och validering",
      "Driftsättning och övervakning"
    ]
  },
  {
    id: "crm-analytics",
    slug: "crm-analytics",
    icon: BarChart,
    title: "CRM, Dashboards & ROI",
    shortDescription: "Eget CRM eller custom dashboards med full dataägande",
    heroTitle: "CRM, Dashboards & ROI-Analys",
    heroSubtitle: "Vi erbjuder både vårt eget AI-drivna CRM och möjligheten att integrera med befintliga system. Få total överblick över leads, säljflöden och resultat – i realtid.",
    features: [
      { title: "Lead tracking & management", description: "Följ varje lead från första kontakt till avslut" },
      { title: "ROI-spårning i realtid", description: "Se direkt vilka kanaler och aktiviteter som konverterar" },
      { title: "Affärsanalys och rapporter", description: "Djupgående insikter i er försäljning" },
      { title: "Anpassade dashboards", description: "Bygg exakt de vyer ni behöver" },
      { title: "Full dataägande", description: "All data är er - ingen inlåsning" },
      { title: "Flexibel integration", description: "Jobba med befintlig CRM eller bygg nytt" }
    ],
    technologies: [
      { name: "React + TypeScript", category: "Frontend" },
      { name: "Supabase", category: "Database" },
      { name: "Recharts", category: "Visualisering" },
      { name: "Power BI", category: "Business Intelligence" },
      { name: "HubSpot", category: "CRM Integration" },
      { name: "Pipedrive", category: "CRM Integration" }
    ],
    useCases: [
      { title: "Säljteam dashboard", description: "Real-time översikt över pipeline och prognoser" },
      { title: "Marketing ROI tracking", description: "Mät exakt avkastning på varje kampanj" },
      { title: "Customer lifecycle analytics", description: "Förstå kundresan från lead till återköp" },
      { title: "AI-drivna prognoser", description: "Förutse säljmönster och identifiera risker" }
    ]
  },
  {
    id: "quote-invoice",
    slug: "offert-faktura",
    icon: FileText,
    title: "Offert & Faktura AI",
    shortDescription: "Automatiserad offert- och fakturagenerering med AI",
    heroTitle: "Offert & Faktura Automatisering",
    heroSubtitle: "Automatiserad offert- och fakturagenerering som sparar timmar varje dag. Från förfrågan till färdig offert på minuter.",
    features: [
      { title: "Automatisk offertgenerering", description: "AI analyserar behov och skapar professionella offerter" },
      { title: "AI-driven prisberäkning", description: "Intelligent prissättning baserat på historik" },
      { title: "Ekonomisystem-integration", description: "Synkar med Fortnox, Visma och andra" },
      { title: "Automatisk fakturering", description: "Från godkänd offert till skickad faktura" },
      { title: "Påminnelser", description: "Automatiska betalningspåminnelser" },
      { title: "PDF-generering", description: "Professionella dokument med ert varumärke" }
    ],
    technologies: [
      { name: "OpenAI GPT-5", category: "Textgenerering" },
      { name: "n8n", category: "Automation" },
      { name: "Fortnox", category: "Ekonomisystem" },
      { name: "Visma", category: "Ekonomisystem" }
    ],
    useCases: [
      { title: "Konsultföretag", description: "Automatisera offerthantering för uppdrag" },
      { title: "Byggbranschen", description: "Generera offerter baserat på ritningar och specifikationer" },
      { title: "IT-tjänster", description: "Skapa paketerade offerter för olika tjänster" },
      { title: "Kreativa byråer", description: "Snabba offerter för kreativa projekt" }
    ],
    howItWorks: [
      "Kund skickar förfrågan via e-post eller formulär",
      "AI analyserar behov och historisk data",
      "Genererar offert med rätt prissättning",
      "Offert skickas automatiskt till kund",
      "Vid godkännande → Faktura genereras och skickas"
    ]
  },
  {
    id: "prompt-engineering",
    slug: "prompt-engineering",
    icon: Sparkles,
    title: "Prompt Engineering & Custom GPT",
    shortDescription: "Skräddarsydda språkmodeller tränade på er data",
    heroTitle: "Prompt Engineering & Custom GPT",
    heroSubtitle: "Vi bygger egna språkmodeller (GPT) och tränar dem på ditt företags data, så att AI:n förstår ert varumärke, kan svara på kundfrågor korrekt, skriver i er ton och automatiserar interna processer.",
    features: [
      { title: "Custom GPT fine-tuning", description: "Träning på era specifika data och use cases" },
      { title: "Brand voice training", description: "AI som kommunicerar exakt som ert varumärke" },
      { title: "Domain-specific knowledge", description: "Expertis inom er bransch och produkter" },
      { title: "Prompt optimization", description: "Maximal precision och relevans i svaren" },
      { title: "Testing and validation", description: "Omfattande testning innan driftsättning" },
      { title: "Continuous improvement", description: "Löpande förbättringar baserat på användning" }
    ],
    technologies: [
      { name: "OpenAI Fine-tuning API", category: "Custom Models" },
      { name: "Anthropic Claude", category: "Customization" },
      { name: "Vector databases", category: "Context storage" },
      { name: "LangChain", category: "Orchestration" }
    ],
    useCases: [
      { title: "Brand-specific chatbots", description: "Chatbot som pratar exakt som ert företag" },
      { title: "Produktbeskrivningsgenerator", description: "Generera SEO-optimerade produkttexter" },
      { title: "Intern kunskapsbas", description: "AI-assistent för era medarbetare" },
      { title: "Sales email generator", description: "Personliga säljmail baserat på lead-data" }
    ]
  },
  {
    id: "rag-agents",
    slug: "rag-agenter",
    icon: Database,
    title: "RAG & Data-agenter",
    shortDescription: "Chatta med din CRM och databas med AI-agenter",
    heroTitle: "RAG & Data-drivna Agenter",
    heroSubtitle: "Med RAG (Retrieval-Augmented Generation) kan du låta AI:n prata direkt med din interna data. Ställ frågor till CRM, kunddatabas eller dokument – och få korrekta, kontextuella svar på sekunder.",
    features: [
      { title: "Chatta med CRM-data", description: "Ställ frågor om kunder, leads och affärer i naturligt språk" },
      { title: "Dokumentsökning", description: "Hitta information i tusentals dokument direkt" },
      { title: "Säljdata-analys", description: "AI analyserar trends och ger rekommendationer" },
      { title: "Kundförfrågningar", description: "Besvara frågor baserat på er kunddatabas" },
      { title: "Automatiska insikter", description: "AI hittar mönster ni inte visste fanns" },
      { title: "Kontextuella svar", description: "Alltid relevanta svar baserat på er specifika data" }
    ],
    technologies: [
      { name: "OpenAI Embeddings", category: "Vector Search" },
      { name: "Pinecone", category: "Vector Database" },
      { name: "Qdrant", category: "Vector Database" },
      { name: "LangChain", category: "RAG Pipeline" },
      { name: "Supabase", category: "Data Storage" }
    ],
    useCases: [
      { title: "Intern kunskapsbas", description: "Låt medarbetare chatta med företagsdokument" },
      { title: "Kundsupport", description: "AI hittar svar i produktdokumentation" },
      { title: "Sales intelligence", description: "Ställ frågor om kunder och affärsmöjligheter" },
      { title: "Compliance", description: "Sök i policydokument och riktlinjer" }
    ],
    howItWorks: [
      "Dina dokument och data indexeras",
      "Vektordatabas skapas för snabb sökning",
      "AI hämtar relevant kontext vid varje fråga",
      "Genererar korrekta svar baserat på din data",
      "Uppdateras automatiskt med ny information"
    ]
  },
  {
    id: "ecosystems",
    slug: "ekosystem",
    icon: Network,
    title: "Totala Ekosystem",
    shortDescription: "Komplett digital överhaul och intelligenta ekosystem",
    heroTitle: "Totala Ekosystem & Digital Överhaul",
    heroSubtitle: "Vi kartlägger hela din verksamhet – från kommunikation till backend – och bygger ett smart, automatiserat ekosystem där allt fungerar tillsammans. Resultatet? Ett företag som skalar, säljer och levererar med kraften av AI.",
    features: [
      { title: "Kartläggning", description: "Djupanalys av nuvarande system och flöden" },
      { title: "Helhetslösning", description: "Design av komplett ekosystem med AI och automation" },
      { title: "Custom utveckling", description: "Bygger lösningar ni äger helt" },
      { title: "Systemintegration", description: "Kopplar samman ALLA era system" },
      { title: "Utbildning", description: "Kompetensutveckling för ert team" },
      { title: "Löpande support", description: "Vi finns här när ni behöver oss" }
    ],
    technologies: [
      { name: "ALL technologies", category: "Complete Stack" }
    ],
    useCases: [
      { title: "Växande företag", description: "Skala utan att anställa mer personal" },
      { title: "Fragmenterade system", description: "Ena alla era verktyg till en plattform" },
      { title: "Digital transformation", description: "Modernisera hela verksamheten" },
      { title: "Legacy modernisering", description: "Uppgradera gamla system" }
    ],
    howItWorks: [
      "Kartläggning av hela verksamheten",
      "Design av smart ekosystem",
      "Utveckling av custom lösningar",
      "Integration med befintliga system",
      "Driftsättning och utbildning",
      "Löpande support och vidareutveckling"
    ]
  }
];
