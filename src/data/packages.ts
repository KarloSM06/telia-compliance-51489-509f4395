import { TrendingUp, Sparkles, Wrench, ShoppingCart, BarChart3, Award, type LucideIcon } from "lucide-react";
import marketingAutomationImage from "@/assets/marketing-automation-ai-wide.jpg";
import serviceOperationsImage from "@/assets/service-operations.jpg";
import ecommerceRetailImage from "@/assets/ecommerce-retail.jpg";
import dataInsightImage from "@/assets/data-insight.jpg";
import growthSalesImage from "@/assets/growth-sales-accelerator.jpg";
import enterpriseAiImage from "@/assets/enterprise-ai.jpg";

export interface Package {
  id: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  targetAudience: string;
  description?: string;
  components: string[];
  valueBullets: string[];
  image?: string;
  startingPrice: string;
  isPopular?: boolean;
}

export const aiPackages: Package[] = [
  {
    id: 'growth-sales',
    name: 'Growth & Sales Accelerator',
    icon: TrendingUp,
    tagline: 'Accelerera din försäljning med AI',
    targetAudience: 'Företag som vill öka försäljning och leads',
    image: growthSalesImage,
    description: 'Hitta rätt kunder och stäng affärer snabbare',
    components: [
      'Lead Generator med AI-berikning',
      'AI-receptionist för mötesbokning',
      'CRM med automatiserade follow-ups',
      'Sales forecasting & KPI-analys'
    ],
    valueBullets: [
      'Kortare säljcykel',
      'Högre konvertering',
      'Full kontroll över säljflödet'
    ],
    startingPrice: 'Från 9 995 kr/mån',
    isPopular: true
  },
  {
    id: 'marketing-automation',
    name: 'Marketing Automation & AI',
    icon: Sparkles,
    tagline: 'Automatisera din marknadsföring',
    targetAudience: 'Företag som vill integrera marknadsföring med försäljning',
    image: marketingAutomationImage,
    components: [
      'AI-driven content creation',
      'Automatiserade kampanjer',
      'Lead scoring i CRM',
      'ROI-dashboard för marknadsföring'
    ],
    valueBullets: [
      'Effektivare kampanjer',
      'Sömlös integration',
      'Automatiserat lead-flöde'
    ],
    startingPrice: 'Från 12 995 kr/mån'
  },
  {
    id: 'service-operations',
    name: 'Service & Operations Optimizer',
    icon: Wrench,
    tagline: 'Optimera din serviceverksamhet',
    targetAudience: 'Serviceföretag, hantverk, B2C-tjänster',
    image: serviceOperationsImage,
    components: [
      'AI-receptionist för bokningar',
      'Automatiserade notifieringar',
      'Automatisk offertgenerering',
      'CRM med kundhistorik'
    ],
    valueBullets: [
      'Färre missade jobb',
      'Mindre administration',
      'Högre kundnöjdhet'
    ],
    startingPrice: 'Från 7 995 kr/mån',
    isPopular: true
  },
  {
    id: 'ecommerce-retail',
    name: 'E-commerce & Retail Booster',
    icon: ShoppingCart,
    tagline: 'Öka din e-handelsförsäljning',
    targetAudience: 'Onlinebutiker och retail',
    image: ecommerceRetailImage,
    components: [
      'AI-rekommendationer (cross-sell, upsell)',
      'Automatiserad orderhantering',
      'Churn prevention med AI',
      'CRM med kundsegmentering'
    ],
    valueBullets: [
      'Ökad försäljning per kund',
      'Bättre retention',
      'Mindre manuellt arbete'
    ],
    startingPrice: 'Från 11 995 kr/mån'
  },
  {
    id: 'data-insight',
    name: 'Data & Insight Engine',
    icon: BarChart3,
    tagline: 'Fatta beslut baserat på data',
    targetAudience: 'Företag som vill fatta beslut baserat på data',
    image: dataInsightImage,
    components: [
      'Datainsamling och berikning',
      'AI-driven analys av kunddata',
      'Automatiserade dashboards',
      'Predictive analytics'
    ],
    valueBullets: [
      'Snabbare beslut',
      'Nya affärsmöjligheter',
      'Proaktivt arbete'
    ],
    startingPrice: 'Från 13 995 kr/mån'
  },
  {
    id: 'enterprise-custom',
    name: 'Enterprise AI & Custom Ecosystem',
    icon: Award,
    tagline: 'Skräddarsytt för stora företag',
    targetAudience: 'Stora företag och branschspecifika lösningar',
    image: enterpriseAiImage,
    components: [
      'Skräddarsytt AI-ekosystem',
      'Integration med ERP, CRM, e-handel',
      'AI-receptionist och automatisering',
      'Branschspecifika lösningar'
    ],
    valueBullets: [
      'Maximal effektivitet',
      'Skräddarsytt för dina behov',
      'Direkt ROI'
    ],
    startingPrice: 'Från 49 995 kr/mån'
  }
];
