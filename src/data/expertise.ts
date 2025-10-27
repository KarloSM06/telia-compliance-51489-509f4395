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
}

export const expertiseCategories: ExpertiseCategory[] = [
  {
    id: "ai-automation",
    title: "AI & Automatisering",
    description: "Skräddarsydda AI-lösningar för alla processer i ditt företag",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    items: [
      { name: "n8n", type: "platform", description: "Automatiseringsplattform" },
      { name: "Make.com", type: "platform", description: "Workflow automation" },
      { name: "Vapi", type: "tool", description: "Voice AI agent" },
      { name: "Retell", type: "tool", description: "AI phone system" },
      { name: "OpenAI GPT-5", type: "model", description: "Avancerad språkmodell" },
      { name: "Claude 3.7", type: "model", description: "Anthropic AI-modell" },
      { name: "Deepseek", type: "model", description: "Specialist AI-modell" },
      { name: "Gemini", type: "model", description: "Google AI-modell" }
    ]
  },
  {
    id: "integration",
    title: "Full integration av tjänster",
    description: "Kalenderintegration med alla stora tjänster → inga dubbelbokningar, full kontroll",
    icon: Link2,
    color: "from-blue-500 to-cyan-500",
    items: [
      { name: "Google Calendar", type: "service", description: "Kalenderintegration" },
      { name: "Microsoft Outlook", type: "service", description: "Kalenderintegration" },
      { name: "Calendly", type: "service", description: "Bokningssystem" },
      { name: "Telnyx", type: "service", description: "Telefoni & SMS" },
      { name: "Twilio", type: "service", description: "Kommunikationsplattform" },
      { name: "Unified Dashboard", type: "platform", description: "Allt sammankopplat på ett ställe" }
    ]
  },
  {
    id: "dashboard",
    title: "Dashboard & Insikter",
    description: "Realtidsstatistik över kunder, leads och bokningar",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    items: [
      { name: "Realtidsstatistik", type: "tool", description: "Live data om kunder och leads" },
      { name: "Automatiska påminnelser", type: "tool", description: "Smart notification system" },
      { name: "ROI-beräkning", type: "tool", description: "Per process och kampanj" },
      { name: "Full transparens", type: "tool", description: "Allt du behöver veta på ett ställe" }
    ]
  },
  {
    id: "implementation",
    title: "Implementation & Support",
    description: "Systemen sätts upp på kundens hårdvara eller molnlösning",
    icon: Server,
    color: "from-orange-500 to-red-500",
    items: [
      { name: "Kundens hårdvara", type: "platform", description: "Setup på er egen infrastruktur" },
      { name: "Molnlösning", type: "platform", description: "Flexibel cloud deployment" },
      { name: "Kompletta integrationer", type: "service", description: "End-to-end setup" },
      { name: "Personalutbildning", type: "service", description: "Omfattande training program" },
      { name: "Svensk support", type: "service", description: "24/7 tillgänglighet" }
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
