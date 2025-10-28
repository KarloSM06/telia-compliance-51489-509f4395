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
    description: "Avancerade språkmodeller för intelligenta lösningar",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    items: [
      { name: "OpenAI GPT-5", type: "model", description: "Avancerad språkmodell", logo: "/images/logos/openai.png" },
      { name: "Claude 3.7", type: "model", description: "Anthropic AI-modell", logo: "/images/logos/claude.png" },
      { name: "Deepseek", type: "model", description: "Specialist AI-modell", logo: "/images/logos/deepseek.png" },
      { name: "Gemini", type: "model", description: "Google AI-modell", logo: "/images/logos/gemini.png" },
      { name: "Perplexity AI", type: "model", description: "Sökning & reasoning", logo: "/images/logos/perplexity.png" }
    ]
  },
  {
    id: "ai-voice",
    title: "AI Röstsystem",
    description: "Intelligenta röstassistenter och telefonisystem",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    items: [
      { name: "Vapi", type: "tool", description: "Voice AI agent", logo: "/images/logos/vapi.png" },
      { name: "Retell", type: "tool", description: "AI phone system", logo: "/images/logos/retell.svg" }
    ]
  },
  {
    id: "automation",
    title: "Automatiseringsplattformar",
    description: "Kraftfulla verktyg för workflow automation",
    icon: Workflow,
    color: "from-green-500 to-emerald-500",
    items: [
      { name: "n8n", type: "platform", description: "Automatiseringsplattform", logo: "/images/logos/n8n.png" },
      { name: "Make.com", type: "platform", description: "Workflow automation", logo: "/images/logos/make.png" },
      { name: "Lovable", type: "platform", description: "AI utvecklingsplattform", logo: "/images/logos/lovable.png" }
    ]
  },
  {
    id: "telephony",
    title: "Telefoni",
    description: "Professionella kommunikationslösningar",
    icon: Server,
    color: "from-orange-500 to-red-500",
    items: [
      { name: "Telnyx", type: "service", description: "Telefoni & SMS", logo: "/images/logos/telnyx.png" },
      { name: "Twilio", type: "service", description: "Kommunikationsplattform", logo: "/images/logos/twilio.png" }
    ]
  },
  {
    id: "calendars",
    title: "Kalendrar",
    description: "Integration med alla stora kalendertjänster",
    icon: Link2,
    color: "from-pink-500 to-purple-500",
    items: [
      { name: "Google Calendar", type: "service", description: "Kalenderintegration", logo: "/images/logos/google-calendar.png" },
      { name: "Microsoft Outlook", type: "service", description: "Kalenderintegration", logo: "/images/logos/outlook.png" },
      { name: "Calendly", type: "service", description: "Bokningssystem", logo: "/images/logos/calendly.png" }
    ]
  },
  {
    id: "lead-generation",
    title: "Lead Generation",
    description: "Avancerade verktyg för att hitta och berika leads",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
    items: [
      { name: "Apollo", type: "platform", description: "B2B lead database", logo: "/images/logos/apollo.png" },
      { name: "Apify", type: "platform", description: "Web scraping & automation", logo: "/images/logos/apify.png" },
      { name: "Explorium", type: "platform", description: "Data enrichment platform", logo: "/images/logos/explorium.png" }
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
