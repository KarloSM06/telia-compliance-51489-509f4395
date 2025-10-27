import { TrendingUp, Sparkles, Wrench, ShoppingCart, BarChart3, Crown, LucideIcon } from "lucide-react";

export interface Package {
  id: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  targetAudience: string;
  components: string[];
  valueBullets: string[];
  color: string;
  pricing: {
    starter: number;
    growth: number;
    enterprise: 'custom';
  };
}

export const aiPackages: Package[] = [
  {
    id: 'growth-sales',
    name: 'Growth & Sales Accelerator',
    icon: TrendingUp,
    tagline: 'Öka försäljning och generera fler leads',
    targetAudience: 'Företag som vill öka försäljning och leads',
    components: [
      'Lead Generator',
      'AI-receptionist',
      'CRM-integration',
      'Sales forecasting',
      'Automatisk uppföljning'
    ],
    valueBullets: [
      'Kortare säljcykel',
      'Högre konvertering',
      'Full kontroll över leads',
      'Automatiserad pipeline'
    ],
    color: 'hsl(var(--primary))',
    pricing: {
      starter: 4990,
      growth: 9990,
      enterprise: 'custom'
    }
  },
  {
    id: 'marketing-automation',
    name: 'Marketing Automation & AI',
    icon: Sparkles,
    tagline: 'Integrera marknadsföring med försäljning',
    targetAudience: 'Företag som vill automatisera marknadsföring',
    components: [
      'AI content creation',
      'Automatiserade kampanjer',
      'Lead scoring',
      'ROI dashboard',
      'Email automation'
    ],
    valueBullets: [
      'Effektivare kampanjer',
      'Sömlös integration',
      'Automatiserat lead-flöde',
      'Mätbara resultat'
    ],
    color: 'hsl(210, 100%, 50%)',
    pricing: {
      starter: 5990,
      growth: 11990,
      enterprise: 'custom'
    }
  },
  {
    id: 'service-operations',
    name: 'Service & Operations Optimizer',
    icon: Wrench,
    tagline: 'Optimera service och drift',
    targetAudience: 'Serviceföretag, hantverk, B2C-tjänster',
    components: [
      'AI-receptionist',
      'SMS/Email-notifieringar',
      'Offertgenerering',
      'CRM med kundhistorik',
      'Bokningshantering'
    ],
    valueBullets: [
      'Färre missade jobb',
      'Mindre administration',
      'Högre kundnöjdhet',
      'Automatiserad kommunikation'
    ],
    color: 'hsl(142, 71%, 45%)',
    pricing: {
      starter: 3990,
      growth: 7990,
      enterprise: 'custom'
    }
  },
  {
    id: 'ecommerce-retail',
    name: 'E-commerce & Retail Booster',
    icon: ShoppingCart,
    tagline: 'Öka försäljning per kund',
    targetAudience: 'Onlinebutiker och retail',
    components: [
      'AI-rekommendationer',
      'Order-hantering',
      'Churn prevention',
      'Kundsegmentering',
      'Inventory optimization'
    ],
    valueBullets: [
      'Ökad försäljning per kund',
      'Bättre retention',
      'Automatiserad hantering',
      'Personaliserad shopping'
    ],
    color: 'hsl(280, 65%, 55%)',
    pricing: {
      starter: 4990,
      growth: 9990,
      enterprise: 'custom'
    }
  },
  {
    id: 'data-insight',
    name: 'Data & Insight Engine',
    icon: BarChart3,
    tagline: 'Fatta databeslut snabbare',
    targetAudience: 'Företag som vill fatta databeslut',
    components: [
      'Datainsamling',
      'AI-analys',
      'Dashboards',
      'Predictive analytics',
      'Custom rapporter'
    ],
    valueBullets: [
      'Snabbare beslut',
      'Nya affärsmöjligheter',
      'Proaktivt arbete',
      'Insiktsdrivna strategier'
    ],
    color: 'hsl(24, 95%, 53%)',
    pricing: {
      starter: 5990,
      growth: 11990,
      enterprise: 'custom'
    }
  },
  {
    id: 'enterprise-custom',
    name: 'Enterprise AI & Custom Ecosystem',
    icon: Crown,
    tagline: 'Skräddarsytt AI-ekosystem',
    targetAudience: 'Stora företag och branschspecifika lösningar',
    components: [
      'Skräddarsytt ekosystem',
      'Full integration',
      'Alla AI-funktioner',
      'Dedikerad support',
      'Custom utveckling'
    ],
    valueBullets: [
      'Maximal effektivitet',
      'Skräddarsytt efter behov',
      'Direkt ROI',
      'Enterprise support'
    ],
    color: 'hsl(45, 93%, 47%)',
    pricing: {
      starter: 15990,
      growth: 29990,
      enterprise: 'custom'
    }
  }
];
