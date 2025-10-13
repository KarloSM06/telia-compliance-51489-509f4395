import { Phone, UtensilsCrossed, Users, Target, Award } from "lucide-react";
import { ReactNode } from "react";

export interface PackageTier {
  name: 'pro' | 'business' | 'enterprise';
  price: number | string;
  features: string[];
  stripePriceId?: string;
}

export interface PackageData {
  id: string;
  name: string;
  fullName: string;
  category: 'customer-service' | 'sales-growth' | 'hr';
  tagline: string;
  description: string;
  detailedDescription: string;
  features: string[];
  topFeatures: string[];
  icon: ReactNode;
  iconName: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  isPopular?: boolean;
  badge?: 'POPULÄR' | 'NY';
  startingPrice: number | string;
  
  // Tier-baserad prissättning
  tiers?: PackageTier[];
  
  // Minut-baserad prissättning (för Krono & Gastro)
  hasMinutes?: boolean;
  minutePricing?: Record<number, {
    pro: number;
    business: number;
    enterprise: string;
  }>;
  
  // Stripe Price IDs för minut-baserad prissättning
  stripePriceIds?: {
    pro?: Record<number, string>;
    business?: Record<number, string>;
  };
  
  // För enkla paket utan tiers (legacy support)
  price?: number;
  stripePriceId?: string;
}

export const availablePackages: PackageData[] = [
  {
    id: "krono",
    name: "AI Receptionist",
    fullName: "Hiems Krono – AI Receptionist",
    category: "customer-service",
    tagline: "Dygnet-runt-kommunikation som aldrig missar ett samtal",
    description: "Hanterar samtal, SMS & mejl dygnet runt",
    detailedDescription: "Hanterar samtal, SMS & mejl dygnet runt. Hiems Krono är din digitala receptionist som aldrig tar paus.",
    startingPrice: 899,
    topFeatures: [
      "Hanterar samtal & SMS 24/7",
      "Bokning & avbokning direkt i kalendern",
      "Svarar på svenska & engelska"
    ],
    features: [
      "Hanterar samtal & SMS 24/7",
      "Bokning & avbokning",
      "Enkel röstprofil",
      "Integration med Google Kalender"
    ],
    icon: <Phone className="h-6 w-6" />,
    iconName: "Phone",
    color: "bg-blue-500/10",
    gradientFrom: "from-blue-500/20",
    gradientTo: "to-cyan-500/20",
    hasMinutes: true,
    minutePricing: {
      100: { pro: 899, business: 1499, enterprise: "Offert" },
      250: { pro: 1999, business: 3499, enterprise: "Offert" },
      500: { pro: 3799, business: 6499, enterprise: "Offert" },
      1000: { pro: 6999, business: 11999, enterprise: "Offert" }
    },
    stripePriceIds: {
      pro: {
        100: "price_1SHjyXEAFWei6whjXkkf2iN8",
        250: "price_1SHjyXEAFWei6whjlONwxZFs",
        500: "price_1SHjz7EAFWei6whj4gd9Cqts",
        1000: "price_1SHk00EAFWei6whj3tl7nqUg"
      },
      business: {
        100: "price_1SHk4VEAFWei6whj7QONlp0T",
        250: "price_1SHk4VEAFWei6whjdfYhqL4E",
        500: "price_1SHk4VEAFWei6whj1SKZQCzH",
        1000: "price_1SHk4VEAFWei6whjq324ZyHQ"
      }
    },
    tiers: [
      {
        name: 'pro',
        price: "Från 899 kr",
        features: [
          "Hanterar samtal & SMS 24/7",
          "Bokning & avbokning",
          "Enkel röstprofil",
          "Grundläggande rapportering",
          "Integration med Google Kalender"
        ]
      },
      {
        name: 'business',
        price: "Från 1 499 kr",
        features: [
          "Allt i Pro +",
          "Flera röstprofiler",
          "Anpassat samtalsflöde",
          "Samtalsanalys & transkribering",
          "Sammanfattning via mejl",
          "CRM-integration (HubSpot, Pipedrive etc.)"
        ]
      },
      {
        name: 'enterprise',
        price: "Offert",
        features: [
          "Allt i Business +",
          "Fler språk & avancerad NLP",
          "Egen AI-modellträning",
          "Skräddarsydd dashboard",
          "Obegränsad trafik & prioriterad support"
        ]
      }
    ]
  },
  {
    id: "gastro",
    name: "Restaurang & Café",
    fullName: "Hiems Krono Gastro – AI Restaurang & Café",
    category: "customer-service",
    tagline: "Perfekt bordshantering för restauranger och caféer",
    description: "Hanterar bokningar, beställningar & menyfrågor",
    detailedDescription: "Specialiserad AI för restaurang- och caféverksamhet. Hanterar bokningar, beställningar och kundförfrågningar.",
    startingPrice: 899,
    topFeatures: [
      "Tar emot bokningar via telefon & SMS",
      "Bekräftar, ändrar & avbokar automatiskt",
      "Integreras med kassasystem"
    ],
    features: [
      "Tar emot bokningar via telefon & SMS",
      "Bekräftar, ändrar & avbokar",
      "Enkel menyhantering",
      "Daglig sammanställning via mejl"
    ],
    icon: <UtensilsCrossed className="h-6 w-6" />,
    iconName: "UtensilsCrossed",
    color: "bg-green-500/10",
    gradientFrom: "from-green-500/20",
    gradientTo: "to-emerald-500/20",
    hasMinutes: true,
    minutePricing: {
      100: { pro: 899, business: 1499, enterprise: "Offert" },
      250: { pro: 1999, business: 3499, enterprise: "Offert" },
      500: { pro: 3799, business: 6499, enterprise: "Offert" },
      1000: { pro: 6999, business: 11999, enterprise: "Offert" }
    },
    stripePriceIds: {
      pro: {
        100: "price_1SHk7aEAFWei6whj2YGivPJw",
        250: "price_1SHk7aEAFWei6whjIsPZrvzB",
        500: "price_1SHk7ZEAFWei6whjLgrbEtOZ",
        1000: "price_1SHk7ZEAFWei6whjWDDppm9f"
      },
      business: {
        100: "price_1SHkCGEAFWei6whjadEcSlVS",
        250: "price_1SHkCGEAFWei6whjKTfcf0or",
        500: "price_1SHkCGEAFWei6whjddDwrgPl",
        1000: "price_1SHkCGEAFWei6whjAyLgW8Lg"
      }
    },
    tiers: [
      {
        name: 'pro',
        price: "Från 899 kr",
        features: [
          "Tar emot bokningar via telefon & SMS",
          "Bekräftar, ändrar & avbokar",
          "Enkel menyhantering",
          "Daglig sammanställning via mejl"
        ]
      },
      {
        name: 'business',
        price: "Från 1 499 kr",
        features: [
          "Allt i Pro +",
          "Integration med kassasystem (t.ex. Trivec)",
          "Hanterar takeaway & leverans",
          "Kundfeedback-analys",
          "Statistik över toppbokningar & återkommande gäster"
        ]
      },
      {
        name: 'enterprise',
        price: "Offert",
        features: [
          "Allt i Business +",
          "Fler språk",
          "Egen röstprofil per restaurang",
          "Avancerad menyoptimering & upsell-funktion"
        ]
      }
    ]
  },
  {
    id: "talent",
    name: "AI Rekrytering",
    fullName: "Hiems Hermes Talent – AI Rekrytering",
    category: "hr",
    tagline: "Hitta rätt talang snabbare med AI-driven screening",
    description: "Screening, kandidatidentifiering & matchning",
    detailedDescription: "AI Rekrytering effektiviserar hela rekryteringsprocessen. Systemet screener kandidater automatiskt och identifierar de bäst lämpade.",
    startingPrice: 2999,
    topFeatures: [
      "Automatisk screening av CV & ansökningar",
      "AI-driven kandidatrankning",
      "Genererar shortlist automatiskt"
    ],
    features: [
      "Automatisk screening av CV & ansökningar",
      "Enkel rankning",
      "Genererar shortlist",
      "Rapport via e-post"
    ],
    icon: <Users className="h-6 w-6" />,
    iconName: "Users",
    color: "bg-purple-500/10",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-pink-500/20",
    tiers: [
      {
        name: 'pro',
        price: 2999,
        features: [
          "Automatisk screening av CV & ansökningar",
          "Enkel rankning",
          "Genererar shortlist",
          "Rapport via e-post"
        ],
        stripePriceId: "price_1SHkDkEAFWei6whjuljypz19"
      },
      {
        name: 'business',
        price: 5499,
        features: [
          "Allt i Pro +",
          "Automatisk kandidat-sökning på LinkedIn",
          "Intervju-sammanfattningar",
          "Integration med rekryteringssystem (Teamtailor etc.)"
        ],
        stripePriceId: "price_1SHkEtEAFWei6whjJORuM53G"
      },
      {
        name: 'enterprise',
        price: "Offert",
        features: [
          "Allt i Business +",
          "Skräddarsydd AI för branschspecifika roller",
          "Prediktiv matchning baserat på kultur & värderingar"
        ]
      }
    ]
  },
  {
    id: "lead",
    name: "AI Prospektering",
    fullName: "Hiems Hermes Lead – AI Prospektering",
    category: "sales-growth",
    tagline: "Automatisk prospektering som genererar kvalificerade leads",
    description: "Identifierar, kvalificerar & följer upp leads automatiskt",
    detailedDescription: "AI Prospektering identifierar potentiella kunder och skickar automatiska, personliga mejl. Systemet följer upp leads och integreras med ditt CRM.",
    startingPrice: 3999,
    topFeatures: [
      "Identifierar potentiella kunder automatiskt",
      "AI-genererade personliga mejl",
      "Automatisk uppföljning till svar"
    ],
    features: [
      "Identifierar potentiella kunder",
      "Skapar kontaktlistor",
      "Skickar automatiska mejl & uppföljningar"
    ],
    icon: <Target className="h-6 w-6" />,
    iconName: "Target",
    color: "bg-green-500/10",
    gradientFrom: "from-green-500/20",
    gradientTo: "to-emerald-500/20",
    tiers: [
      {
        name: 'pro',
        price: 3999,
        features: [
          "Identifierar potentiella kunder",
          "Skapar kontaktlistor",
          "Skickar automatiska mejl & uppföljningar"
        ],
        stripePriceId: "price_1SHkGpEAFWei6whjyCR7OnvD"
      },
      {
        name: 'business',
        price: 7499,
        features: [
          "Allt i Pro +",
          "AI skriver personliga mejl",
          "CRM-integration",
          "Automatiska uppföljningar tills svar"
        ],
        stripePriceId: "price_1SHkHbEAFWei6whjHWTmqLox"
      },
      {
        name: 'enterprise',
        price: "Offert",
        features: [
          "Allt i Business +",
          "Full funnel automation (mejl → möte → close)",
          "Prediktiv lead scoring",
          "Anpassad lead dashboard"
        ]
      }
    ]
  },
  {
    id: "thor",
    name: "AI Compliance & Coaching",
    fullName: "Hiems Thor – AI Compliance & Coaching",
    category: "sales-growth",
    tagline: "Säkerställ regelefterlevnad och förbättra säljprestanda",
    description: "Analyserar säljsamtal, ger feedback & coaching",
    detailedDescription: "Den mest populära lösningen! AI Compliance & Coaching analyserar dina samtal i realtid och identifierar regelöverträdelser. Ger omedelbar feedback och personliga förbättringsförslag.",
    startingPrice: 499,
    badge: "POPULÄR",
    topFeatures: [
      "Automatisk samtalsgranskning i realtid",
      "AI-driven compliance-kontroll",
      "Personlig coaching per säljare"
    ],
    features: [
      "Automatisk samtalsgranskning",
      "Grundläggande feedback via e-post"
    ],
    icon: <Award className="h-6 w-6" />,
    iconName: "Award",
    color: "bg-yellow-500/10",
    gradientFrom: "from-yellow-500/20",
    gradientTo: "to-amber-500/20",
    isPopular: true,
    tiers: [
      {
        name: 'pro',
        price: 499,
        features: [
          "Automatisk samtalsgranskning",
          "Grundläggande feedback via e-post",
          "Per agent"
        ],
        stripePriceId: "price_1SHkJkEAFWei6whj3t1KRhSs"
      },
      {
        name: 'business',
        price: 699,
        features: [
          "Allt i Pro +",
          "AI-coach",
          "Anpassad rapport per säljare",
          "Dashboard & statistik",
          "Per agent"
        ],
        stripePriceId: "price_1SHkLFEAFWei6whj68Dbb5op"
      },
      {
        name: 'enterprise',
        price: "Offert",
        features: [
          "Allt i Business +",
          "Obegränsade användare",
          "Integration till CRM & samtalsplattformar"
        ]
      }
    ]
  }
];
