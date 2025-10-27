import { Briefcase, Wrench, ShoppingCart, DollarSign, Heart, Building, UtensilsCrossed, Store, type LucideIcon } from "lucide-react";

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
    description: 'Lösningar för företag som säljer till andra företag',
    relevantPackages: ['growth-sales', 'marketing-automation', 'data-insight']
  },
  {
    id: 'service-hantverk',
    name: 'Service & Hantverk',
    icon: Wrench,
    description: 'Perfekt för VVS, el, bygg och andra servicetjänster',
    relevantPackages: ['service-operations', 'growth-sales']
  },
  {
    id: 'e-handel',
    name: 'E-handel',
    icon: ShoppingCart,
    description: 'Öka försäljning och retention i din onlinebutik',
    relevantPackages: ['ecommerce-retail', 'marketing-automation']
  },
  {
    id: 'finans',
    name: 'Finans',
    icon: DollarSign,
    description: 'Banktjänster, försäkring och finansiell rådgivning',
    relevantPackages: ['enterprise-custom', 'data-insight']
  },
  {
    id: 'halsa',
    name: 'Hälsa',
    icon: Heart,
    description: 'Vårdcentraler, kliniker och hälsoföretag',
    relevantPackages: ['service-operations', 'enterprise-custom']
  },
  {
    id: 'fastighet',
    name: 'Fastighet',
    icon: Building,
    description: 'Fastighetsmäklare, bostadsrättsföreningar och fastighetsförvaltning',
    relevantPackages: ['growth-sales', 'service-operations']
  },
  {
    id: 'restaurang',
    name: 'Restaurang',
    icon: UtensilsCrossed,
    description: 'Restauranger, catering och livsmedelstjänster',
    relevantPackages: ['service-operations', 'ecommerce-retail']
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: Store,
    description: 'Fysiska butiker och detaljhandel',
    relevantPackages: ['ecommerce-retail', 'service-operations']
  }
];
