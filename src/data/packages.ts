import { TrendingUp, Sparkles, Wrench, ShoppingCart, BarChart3, Award, type LucideIcon } from "lucide-react";

export interface Package {
  id: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  targetAudience: string;
  components: string[];
  valueBullets: string[];
  image?: string;
  pricing: {
    starter: string;
    growth: string;
    enterprise: string;
  };
}

export const aiPackages: Package[] = [
  {
    id: 'growth-sales',
    name: 'Growth & Sales Accelerator',
    icon: TrendingUp,
    tagline: 'Accelerera din försäljning med AI',
    targetAudience: 'Företag som vill öka försäljning och leads',
    image: '/src/assets/growth-sales-presentation.png',
    components: [
      'Lead Generator med AI-berikning och scoring',
      'AI-receptionist för kvalificering och mötesbokning',
      'CRM med automatiserade follow-ups och pipeline dashboards',
      'Sales forecasting & KPI-analys'
    ],
    valueBullets: [
      'Kortare säljcykel',
      'Högre lead-to-customer-konvertering',
      'Full kontroll över säljflödet'
    ],
    pricing: {
      starter: 'Från 9 995 kr/mån',
      growth: 'Från 19 995 kr/mån',
      enterprise: 'Kontakta oss'
    }
  },
  {
    id: 'marketing-automation',
    name: 'Marketing Automation & AI',
    icon: Sparkles,
    tagline: 'Automatisera din marknadsföring',
    targetAudience: 'Företag som vill integrera marknadsföring med försäljning',
    components: [
      'AI-driven content creation (annonser, nyhetsbrev, sociala medier)',
      'Automatiserade kampanjer med lead nurturing',
      'Lead scoring och berikning i CRM',
      'Dashboard för ROI på marknadsinitiativ'
    ],
    valueBullets: [
      'Effektivare kampanjer',
      'Sömlös koppling mellan marknadsföring och försäljning',
      'Automatiserat lead-flöde'
    ],
    pricing: {
      starter: 'Från 12 995 kr/mån',
      growth: 'Från 24 995 kr/mån',
      enterprise: 'Kontakta oss'
    }
  },
  {
    id: 'service-operations',
    name: 'Service & Operations Optimizer',
    icon: Wrench,
    tagline: 'Optimera din serviceverksamhet',
    targetAudience: 'Serviceföretag, hantverk, B2C-tjänster',
    components: [
      'AI-receptionist för bokningar och kundservice',
      'Automatiserade SMS & e-mail-notifieringar',
      'Offertgenerering och signering automatiserad',
      'CRM med återkommande jobb och kundhistorik'
    ],
    valueBullets: [
      'Färre missade jobb',
      'Mindre administrativt arbete',
      'Högre kundnöjdhet'
    ],
    pricing: {
      starter: 'Från 7 995 kr/mån',
      growth: 'Från 14 995 kr/mån',
      enterprise: 'Kontakta oss'
    }
  },
  {
    id: 'ecommerce-retail',
    name: 'E-commerce & Retail Booster',
    icon: ShoppingCart,
    tagline: 'Öka din e-handelsförsäljning',
    targetAudience: 'Onlinebutiker och retail',
    components: [
      'AI-rekommendationer för kunder (cross-sell, upsell)',
      'Automatiserad order- och kundhantering',
      'Churn prevention och lojalitetsprogram med AI',
      'Integrerat CRM med kundsegmentering och feedback'
    ],
    valueBullets: [
      'Ökad försäljning per kund',
      'Bättre retention',
      'Automatiserad hantering → mindre manuellt arbete'
    ],
    pricing: {
      starter: 'Från 11 995 kr/mån',
      growth: 'Från 21 995 kr/mån',
      enterprise: 'Kontakta oss'
    }
  },
  {
    id: 'data-insight',
    name: 'Data & Insight Engine',
    icon: BarChart3,
    tagline: 'Fatta beslut baserat på data',
    targetAudience: 'Företag som vill fatta beslut baserat på data',
    components: [
      'Datainsamling, berikning och rengöring',
      'AI-driven analys av kunddata, leads och marknad',
      'Automatiserade dashboards & rapporter',
      'Predictive analytics för beslut & prognoser'
    ],
    valueBullets: [
      'Snabbare och bättre beslut',
      'Identifiera nya affärsmöjligheter',
      'Proaktivt istället för reaktivt arbete'
    ],
    pricing: {
      starter: 'Från 13 995 kr/mån',
      growth: 'Från 25 995 kr/mån',
      enterprise: 'Kontakta oss'
    }
  },
  {
    id: 'enterprise-custom',
    name: 'Enterprise AI & Custom Ecosystem',
    icon: Award,
    tagline: 'Skräddarsytt för stora företag',
    targetAudience: 'Stora företag och branschspecifika lösningar',
    components: [
      'Fullständigt skräddarsytt AI-ekosystem',
      'Integration med interna system, ERP, CRM, e-handel',
      'AI-receptionist, Lead Generator, automatisering och analyser',
      'Branschspecifika lösningar (finans, hälsa, fastighet)'
    ],
    valueBullets: [
      'Maximal effektivitet och skalbarhet',
      'Skräddarsytt för varje kunds behov',
      'Direkt ROI och långsiktig transformation'
    ],
    pricing: {
      starter: 'Från 49 995 kr/mån',
      growth: 'Från 99 995 kr/mån',
      enterprise: 'Skräddarsydd offert'
    }
  }
];
