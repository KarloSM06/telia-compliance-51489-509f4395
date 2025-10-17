import { Phone, UtensilsCrossed, Users, Target, Award, Globe, Star } from "lucide-react";
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
  description: string;
  detailedDescription: string;
  features: string[];
  icon: ReactNode;
  color: string;
  isPopular?: boolean;
  
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
    description: "Hanterar samtal, SMS & mejl dygnet runt",
    detailedDescription: "Hanterar samtal, SMS & mejl dygnet runt. Hiems Krono är din digitala receptionist som aldrig tar paus.",
    features: [
      "Hanterar samtal & SMS 24/7",
      "Bokning & avbokning",
      "Enkel röstprofil",
      "Integration med Google Kalender"
    ],
    icon: <Phone className="h-6 w-6 text-primary" />,
    color: "bg-primary/10",
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
    description: "Hanterar bokningar, beställningar & menyfrågor",
    detailedDescription: "Specialiserad AI för restaurang- och caféverksamhet. Hanterar bokningar, beställningar och kundförfrågningar.",
    features: [
      "Tar emot bokningar via telefon & SMS",
      "Bekräftar, ändrar & avbokar",
      "Enkel menyhantering",
      "Daglig sammanställning via mejl"
    ],
    icon: <UtensilsCrossed className="h-6 w-6 text-primary" />,
    color: "bg-secondary/10",
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
    description: "Screening, kandidatidentifiering & matchning",
    detailedDescription: "AI Rekrytering effektiviserar hela rekryteringsprocessen. Systemet screener kandidater automatiskt och identifierar de bäst lämpade.",
    features: [
      "Automatisk screening av CV & ansökningar",
      "Enkel rankning",
      "Genererar shortlist",
      "Rapport via e-post"
    ],
    icon: <Users className="h-6 w-6 text-primary" />,
    color: "bg-accent/10",
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
    description: "Identifierar, kvalificerar & följer upp leads automatiskt",
    detailedDescription: "AI Prospektering identifierar potentiella kunder och skickar automatiska, personliga mejl. Systemet följer upp leads och integreras med ditt CRM.",
    features: [
      "Identifierar potentiella kunder",
      "Skapar kontaktlistor",
      "Skickar automatiska mejl & uppföljningar"
    ],
    icon: <Target className="h-6 w-6 text-primary" />,
    color: "bg-primary/10",
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
    description: "Analyserar säljsamtal, ger feedback & coaching",
    detailedDescription: "Den mest populära lösningen! AI Compliance & Coaching analyserar dina samtal i realtid och identifierar regelöverträdelser. Ger omedelbar feedback och personliga förbättringsförslag.",
    features: [
      "Automatisk samtalsgranskning",
      "Grundläggande feedback via e-post"
    ],
    icon: <Award className="h-6 w-6 text-primary" />,
    color: "bg-gradient-gold",
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
  },
  {
    id: "eko",
    name: "AI Omdömen",
    fullName: "Hiems Eko – AI Omdömeshantering",
    description: "Samlar, analyserar & agerar på kundomdömen",
    detailedDescription: "AI Omdömeshantering samlar in, analyserar och hjälper dig agera på kundrecensioner från alla plattformar. Förvandla feedback till förbättringar och stärk ditt varumärke.",
    features: [
      "Samlar omdömen från alla plattformar",
      "AI-analys av sentiments & trender",
      "Automatiska svar på recensioner",
      "Rapporter & insikter"
    ],
    icon: <Star className="h-6 w-6 text-primary" />,
    color: "bg-accent/10",
    tiers: [
      {
        name: 'pro',
        price: 1999,
        features: [
          "Samlar omdömen från Google, Facebook & TripAdvisor",
          "AI-analys av sentiments & nyckelord",
          "Automatiska svar på positiva recensioner",
          "Veckorapport via e-post"
        ],
        stripePriceId: "price_eko_pro_placeholder"
      },
      {
        name: 'business',
        price: 3999,
        features: [
          "Allt i Pro +",
          "Svar på alla recensioner (inklusive negativa)",
          "Trendanalys & konkurrensjämförelse",
          "Integration med CRM & notifieringar vid negativa omdömen",
          "Anpassade AI-svar baserat på varumärke"
        ],
        stripePriceId: "price_eko_business_placeholder"
      },
      {
        name: 'enterprise',
        price: "Offert",
        features: [
          "Allt i Business +",
          "Multi-location hantering",
          "Prediktiv analys & varningar",
          "White-label dashboard",
          "API-integration för egna system"
        ]
      }
    ]
  }
];
