import { LucideIcon } from "lucide-react";
import { 
  Brain, 
  Zap, 
  Link2, 
  BarChart3, 
  Server,
  Workflow
} from "lucide-react";

export interface ExpertiseCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: ExpertiseItem[];
  color: string;
  image?: string; // Path to category image
}

export interface ExpertiseItem {
  name: string;
  type: 'tool' | 'platform' | 'model' | 'service';
  description?: string;
  logo?: string; // Path to PNG logo
}

export const expertiseCategories: ExpertiseCategory[] = [
  {
    id: "ai-llm",
    title: "AI Modeller (LLM)",
    description: "Vi använder de mest avancerade AI-modellerna för att skapa intelligenta lösningar som förstår och kommunicerar på svenska. Från textgenerering till avancerad analys.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    image: "/images/expertise/ai-models.jpg",
    items: [
      { name: "OpenAI GPT-5", type: "model", description: "Avancerad språkmodell", logo: "/images/logos/openai-new.png" },
      { name: "Claude 3.7", type: "model", description: "Anthropic AI-modell", logo: "/images/logos/claude.png" },
      { name: "Deepseek", type: "model", description: "Specialist AI-modell", logo: "/images/logos/deepseek.png" },
      { name: "Gemini", type: "model", description: "Google AI-modell", logo: "/images/logos/gemini.png" }
    ]
  },
  {
    id: "ai-voice",
    title: "AI Röstsystem",
    description: "Naturliga röstassistenter som hanterar samtal dygnet runt. Perfekt för kundservice, bokningar och försäljning med mänsklig konversationsförmåga.",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    image: "/images/expertise/voice-systems.jpg",
    items: [
      { name: "Vapi", type: "tool", description: "Voice AI agent", logo: "/images/logos/vapi.png" },
      { name: "Retell", type: "tool", description: "AI phone system", logo: "/images/logos/retell-backup.png" }
    ]
  },
  {
    id: "automation",
    title: "Automatiseringsplattformar",
    description: "Kraftfulla workflows som kopplar samman alla era system. Automatisera repetitiva uppgifter och frigör tid för det som verkligen skapar värde.",
    icon: Workflow,
    color: "from-green-500 to-emerald-500",
    image: "/images/n8n-workflow-background.png",
    items: [
      { name: "n8n", type: "platform", description: "Workflow automation", logo: "/images/logos/n8n.png" },
      { name: "Make.com", type: "platform", description: "Integration platform", logo: "/images/logos/make.png" },
      { name: "Lovable", type: "platform", description: "AI utveckling", logo: "/images/logos/lovable.png" }
    ]
  },
  {
    id: "telephony",
    title: "Telefoni & SMS",
    description: "Professionell telefoni och SMS-kommunikation i världsklass. Skicka meddelanden, ring samtal och hantera all kundkommunikation från en plattform.",
    icon: Server,
    color: "from-orange-500 to-red-500",
    image: "/images/expertise/telephony.jpg",
    items: [
      { name: "Telnyx", type: "service", description: "Global telefoni", logo: "/images/logos/telnyx.png" },
      { name: "Twilio", type: "service", description: "SMS & Voice API", logo: "/images/logos/twilio.png" }
    ]
  },
  {
    id: "calendars",
    title: "Kalenderintegrationer",
    description: "Synkronisera alla era kalendrar och bokningssystem. Automatiska bokningar, påminnelser och full kontroll över tillgänglighet i realtid.",
    icon: Link2,
    color: "from-pink-500 to-purple-500",
    image: "/images/expertise/calendar.jpg",
    items: [
      { name: "Google Calendar", type: "service", description: "Kalender & bokning", logo: "/images/logos/google-calendar.png" },
      { name: "Microsoft Outlook", type: "service", description: "Enterprise kalender", logo: "/images/logos/outlook.png" },
      { name: "Calendly", type: "service", description: "Bokningssystem", logo: "/images/logos/calendly.png" }
    ]
  },
  {
    id: "lead-generation",
    title: "Lead Generation & Berikning",
    description: "Hitta rätt kunder med AI-driven prospektering. Berika era leads med relevant data och bygg pipelines som konverterar.",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
    image: "/images/expertise/lead-generation.jpg",
    items: [
      { name: "Apollo", type: "platform", description: "B2B prospektering", logo: "/images/logos/apollo.png" },
      { name: "Apify", type: "platform", description: "Data extraction", logo: "/images/logos/apify.png" },
      { name: "LinkedIn", type: "platform", description: "Social selling" }
    ]
  }
];

export const techFlowSteps = [
  {
    id: 1,
    title: "AI-modeller",
    description: "Avancerade språk- och röstmodeller",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Automatisering",
    description: "Workflow orchestration och processer",
    icon: Workflow,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Integration",
    description: "Kalender, telefoni och CRM",
    icon: Link2,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "Dashboard & ROI",
    description: "Insikter och beslutsunderlag",
    icon: BarChart3,
    color: "from-orange-500 to-red-500"
  }
];
