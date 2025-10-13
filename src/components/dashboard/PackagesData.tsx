import { Phone, UtensilsCrossed, Users, Target, Award, Globe } from "lucide-react";
import { PackageData } from "./PackageCard";

export const availablePackages: PackageData[] = [
  {
    id: "ai-receptionist",
    name: "AI Receptionist",
    description: "Hantera samtal, SMS, mejl och bokningar automatiskt",
    features: [
      "Automatisk hantering av samtal 24/7",
      "SMS & mejl-hantering",
      "Bokning & avbokning",
      "Enkel röstprofil anpassad efter ditt företag",
      "Integration med befintliga system",
    ],
    icon: <Phone className="h-6 w-6 text-primary" />,
    color: "bg-primary/10",
    detailedDescription:
      "AI Receptionist är din digitala receptionist som aldrig tar paus. Systemet hanterar inkommande samtal, SMS och mejl professionellt, bokar möten, och kan besvara vanliga frågor. Perfekt för företag som vill ge bästa service dygnet runt.",
    stripePriceId: "price_REPLACE_WITH_YOUR_PRICE_ID_1",
    price: 2999,
  },
  {
    id: "restaurant-cafe",
    name: "Restaurang & Café",
    description: "Komplett lösning för restauranger och caféer",
    features: [
      "Automatisk bordsbokning",
      "Hantering av beställningar",
      "Svar på menyfrågor och allergier",
      "Dagliga rapporter om bokningar",
      "Integration med bokningssystem",
    ],
    icon: <UtensilsCrossed className="h-6 w-6 text-primary" />,
    color: "bg-secondary/10",
    detailedDescription:
      "Specialiserad AI för restaurang- och caféverksamhet. Hanterar bokningar, beställningar och kundförfrågningar om menyer och allergier. Ger dagliga rapporter och insikter om din verksamhet.",
    stripePriceId: "price_REPLACE_WITH_YOUR_PRICE_ID_2",
    price: 1999,
  },
  {
    id: "ai-recruitment",
    name: "AI Rekrytering",
    description: "Automatisera din rekryteringsprocess",
    features: [
      "Automatisk screening av kandidater",
      "Intelligent kandidatidentifiering",
      "Automatisk shortlist av kvalificerade sökande",
      "Detaljerade rapporter och rekommendationer",
      "Tidsbesparing på upp till 70%",
    ],
    icon: <Users className="h-6 w-6 text-primary" />,
    color: "bg-accent/10",
    detailedDescription:
      "AI Rekrytering effektiviserar hela rekryteringsprocessen. Systemet screener kandidater automatiskt, identifierar de bäst lämpade och skapar shortlists. Spara tid och hitta rätt talang snabbare.",
    stripePriceId: "price_REPLACE_WITH_YOUR_PRICE_ID_3",
    price: 3999,
  },
  {
    id: "ai-prospecting",
    name: "AI Prospektering",
    description: "Automatisk leadgenerering och outreach",
    features: [
      "Intelligent leadidentifiering",
      "Automatiska personliga mejl",
      "Uppföljning och lead nurturing",
      "CRM-integration",
      "Detaljerad rapportering och analytics",
    ],
    icon: <Target className="h-6 w-6 text-primary" />,
    color: "bg-primary/10",
    detailedDescription:
      "AI Prospektering identifierar potentiella kunder och skickar automatiska, personliga mejl. Systemet följer upp leads och integreras med ditt CRM för en sömlös säljprocess.",
    stripePriceId: "price_REPLACE_WITH_YOUR_PRICE_ID_4",
    price: 4999,
  },
  {
    id: "ai-compliance",
    name: "AI Compliance & Coaching",
    description: "Analysera samtal och ge feedback",
    features: [
      "Automatisk samtalsanalys enligt regelverk",
      "Identifiering av regelöverträdelser",
      "Personlig feedback och coaching",
      "Trendanalys och förbättringsförslag",
      "GDPR-kompatibel hantering",
    ],
    isPopular: true,
    icon: <Award className="h-6 w-6 text-primary" />,
    color: "bg-gradient-gold",
    detailedDescription:
      "Den mest populära lösningen! AI Compliance & Coaching analyserar dina samtal i realtid och identifierar regelöverträdelser. Ger omedelbar feedback och personliga förbättringsförslag till dina säljare. Perfekt för att säkerställa kvalitet och compliance.",
    stripePriceId: "price_REPLACE_WITH_YOUR_PRICE_ID_5",
    price: 5999,
  },
  {
    id: "ai-website-optimization",
    name: "AI Hemsideoptimering",
    description: "Förstå kundbeteende och optimera konvertering",
    features: [
      "Analys av kundbeteende på hemsidan",
      "Produktprioritering baserat på intresse",
      "A/B-testing rekommendationer",
      "Detaljerade rapporter och insights",
      "Konverteringsoptimering",
    ],
    icon: <Globe className="h-6 w-6 text-primary" />,
    color: "bg-secondary/10",
    detailedDescription:
      "AI Hemsideoptimering analyserar hur besökare interagerar med din hemsida och ger rekommendationer för att öka konverteringar. Få insikter om vilka produkter som intresserar dina kunder mest.",
    stripePriceId: "price_REPLACE_WITH_YOUR_PRICE_ID_6",
    price: 2499,
  },
];
