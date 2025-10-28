import { Briefcase, Wrench, ShoppingCart, DollarSign, Heart, Building, UtensilsCrossed, Store, type LucideIcon } from "lucide-react";

export interface Industry {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  relevantPackages: string[];
  image?: string; // Path to industry image
}

export const industries: Industry[] = [
  {
    id: 'b2b',
    name: 'B2B',
    icon: Briefcase,
    description: 'Lösningar för företag som säljer till andra företag',
    relevantPackages: ['growth-sales', 'marketing-automation', 'data-insight'],
    image: '/images/industries/b2b.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'service-hantverk',
    name: 'Service & Hantverk',
    icon: Wrench,
    description: 'Perfekt för VVS, el, bygg och andra servicetjänster',
    relevantPackages: ['service-operations', 'growth-sales'],
    image: '/images/industries/service.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'e-handel',
    name: 'E-handel',
    icon: ShoppingCart,
    description: 'Öka försäljning och retention i din onlinebutik',
    relevantPackages: ['ecommerce-retail', 'marketing-automation'],
    image: '/images/industries/ecommerce.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'finans',
    name: 'Finans',
    icon: DollarSign,
    description: 'Banktjänster, försäkring och finansiell rådgivning',
    relevantPackages: ['enterprise-custom', 'data-insight'],
    image: '/images/industries/finance.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'halsa',
    name: 'Hälsa',
    icon: Heart,
    description: 'Vårdcentraler, kliniker och hälsoföretag',
    relevantPackages: ['service-operations', 'enterprise-custom'],
    image: '/images/industries/health.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'fastighet',
    name: 'Fastighet',
    icon: Building,
    description: 'Fastighetsmäklare, bostadsrättsföreningar och fastighetsförvaltning',
    relevantPackages: ['growth-sales', 'service-operations'],
    image: '/images/industries/real-estate.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'restaurang',
    name: 'Restaurang',
    icon: UtensilsCrossed,
    description: 'Restauranger, catering och livsmedelstjänster',
    relevantPackages: ['service-operations', 'ecommerce-retail'],
    image: '/images/industries/restaurant.jpg' // Placeholder - replace with actual image
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: Store,
    description: 'Fysiska butiker och detaljhandel',
    relevantPackages: ['ecommerce-retail', 'service-operations'],
    image: '/images/industries/retail.jpg' // Placeholder - replace with actual image
  }
];
