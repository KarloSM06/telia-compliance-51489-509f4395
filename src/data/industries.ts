import { Briefcase, Wrench, ShoppingCart, DollarSign, Heart, Building, ChefHat, Store, LucideIcon } from "lucide-react";

export interface Industry {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  relevantPackages: string[];
}

export const industries: Industry[] = [
  {
    id: 'b2b',
    name: 'B2B',
    icon: Briefcase,
    description: 'Skräddarsydda AI-lösningar för B2B-företag som vill effektivisera försäljning och kundkommunikation',
    relevantPackages: ['growth-sales', 'marketing-automation', 'data-insight']
  },
  {
    id: 'service-hantverk',
    name: 'Service & Hantverk',
    icon: Wrench,
    description: 'Automatisera bokningar, offerter och kundkommunikation för serviceföretag',
    relevantPackages: ['service-operations', 'growth-sales']
  },
  {
    id: 'ecommerce',
    name: 'E-handel',
    icon: ShoppingCart,
    description: 'Öka försäljning med AI-drivna rekommendationer och automatiserad kundvård',
    relevantPackages: ['ecommerce-retail', 'marketing-automation', 'data-insight']
  },
  {
    id: 'finans',
    name: 'Finans',
    icon: DollarSign,
    description: 'Datadriven analys och automatiserad kundkommunikation för finansbranschen',
    relevantPackages: ['data-insight', 'growth-sales', 'enterprise-custom']
  },
  {
    id: 'halsa',
    name: 'Hälsa',
    icon: Heart,
    description: 'Automatisera bokningar och patientkommunikation med GDPR-säkra lösningar',
    relevantPackages: ['service-operations', 'enterprise-custom']
  },
  {
    id: 'fastighet',
    name: 'Fastighet',
    icon: Building,
    description: 'AI-driven lead-hantering och automatiserad kundkommunikation för fastighetsbolag',
    relevantPackages: ['growth-sales', 'service-operations', 'data-insight']
  },
  {
    id: 'restaurang',
    name: 'Restaurang',
    icon: ChefHat,
    description: 'Automatisera bokningar och kundkommunikation för restauranger och catering',
    relevantPackages: ['service-operations', 'ecommerce-retail']
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: Store,
    description: 'Optimera butiksdrift och kundupplevelse med AI-driven analys',
    relevantPackages: ['ecommerce-retail', 'data-insight', 'marketing-automation']
  }
];
