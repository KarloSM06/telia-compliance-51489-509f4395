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
    id: "ai-automation",
    title: "AI & Automatisering",
    description: "Skräddarsydda AI-lösningar för alla processer i ditt företag",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    items: [
      { name: "n8n", type: "platform", description: "Automatiseringsplattform", logo: "/images/logos/n8n.png" },
      { name: "Make.com", type: "platform", description: "Workflow automation", logo: "/images/logos/make.png" },
      { name: "Vapi", type: "tool", description: "Voice AI agent", logo: "/images/logos/vapi.png" },
      { name: "Retell", type: "tool", description: "AI phone system", logo: "/images/logos/retell.svg" },
      { name: "OpenAI GPT-5", type: "model", description: "Avancerad språkmodell", logo: "/images/logos/openai.png" },
      { name: "Claude 3.7", type: "model", description: "Anthropic AI-modell", logo: "/images/logos/claude.png" },
      { name: "Deepseek", type: "model", description: "Specialist AI-modell", logo: "/images/logos/deepseek.png" },
      { name: "Gemini", type: "model", description: "Google AI-modell", logo: "/images/logos/gemini.png" },
      { name: "Lovable", type: "platform", description: "AI utvecklingsplattform", logo: "/images/logos/lovable.png" }
    ]
  },
  {
    id: "integration",
    title: "Full integration av tjänster",
    description: "Kalenderintegration med alla stora tjänster → inga dubbelbokningar, full kontroll",
    icon: Link2,
    color: "from-blue-500 to-cyan-500",
    items: [
      { name: "Google Calendar", type: "service", description: "Kalenderintegration", logo: "/images/logos/google-calendar.png" },
      { name: "Microsoft Outlook", type: "service", description: "Kalenderintegration", logo: "/images/logos/outlook.png" },
      { name: "Calendly", type: "service", description: "Bokningssystem", logo: "/images/logos/calendly.png" },
      { name: "Telnyx", type: "service", description: "Telefoni & SMS", logo: "/images/logos/telnyx.png" },
      { name: "Twilio", type: "service", description: "Kommunikationsplattform", logo: "/images/logos/twilio.png" },
      { name: "Hostinger", type: "platform", description: "Webbhotell & hosting", logo: "/images/logos/hostinger.png" },
      { name: "Unified Dashboard", type: "platform", description: "Allt sammankopplat på ett ställe", logo: "/images/logos/unified.png" }
    ]
  },
  {
    id: "dashboard",
    title: "Dashboard & Insikter",
    description: "Realtidsstatistik över kunder, leads och bokningar",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    items: [
      { name: "Realtidsstatistik", type: "tool", description: "Live data om kunder och leads", logo: "/images/logos/analytics.png" },
      { name: "Automatiska påminnelser", type: "tool", description: "Smart notification system", logo: "/images/logos/notifications.png" },
      { name: "ROI-beräkning", type: "tool", description: "Per process och kampanj", logo: "/images/logos/roi.png" },
      { name: "Full transparens", type: "tool", description: "Allt du behöver veta på ett ställe", logo: "/images/logos/dashboard.png" }
    ]
  },
  {
    id: "implementation",
    title: "Implementation & Support",
    description: "Systemen sätts upp på kundens hårdvara eller molnlösning",
    icon: Server,
    color: "from-orange-500 to-red-500",
    items: [
      { name: "Kundens hårdvara", type: "platform", description: "Setup på er egen infrastruktur", logo: "/images/logos/hardware.png" },
      { name: "Molnlösning", type: "platform", description: "Flexibel cloud deployment", logo: "/images/logos/cloud.png" },
      { name: "Kompletta integrationer", type: "service", description: "End-to-end setup", logo: "/images/logos/integration.png" },
      { name: "Personalutbildning", type: "service", description: "Omfattande training program", logo: "/images/logos/training.png" },
      { name: "Svensk support", type: "service", description: "24/7 tillgänglighet", logo: "/images/logos/support.png" }
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
