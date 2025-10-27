import { TrendingUp, Sparkles, Wrench, ShoppingCart, BarChart3, Award, type LucideIcon } from "lucide-react";

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
    description: 'Ett komplett försäljningssystem som hjälper dig att hitta rätt kunder och stänga fler affärer snabbare. Systemet kombinerar AI-driven lead-berikning med intelligent automatisering för att maximera din försäljningseffektivitet.',
    components: [
      'Lead Generator identifierar och berikar potentiella kunder automatiskt med värdefull företagsinformation. AI-scoring hjälper dig att prioritera de mest lönsamma affärsmöjligheterna.',
      'AI-receptionist hanterar inkommande förfrågningar dygnet runt och kvalificerar leads. Systemet bokar möten direkt i din kalender baserat på din tillgänglighet.',
      'CRM-systemet automatiserar follow-ups och håller koll på hela din försäljningspipeline. Visuella dashboards ger dig full översikt över alla pågående affärer och nästa steg.',
      'Avancerad sales forecasting använder AI för att förutsäga försäljning. KPI-analyser visar exakt vad som driver dina resultat och var du ska fokusera.'
    ],
    valueBullets: [
      'Säljcykeln förkortas dramatiskt genom automatisk lead-kvalificering och smart prioritering. Du fokuserar bara på de affärer som har störst chans att stängas.',
      'Lead-to-customer-konverteringen ökar markant när varje lead får rätt uppföljning vid rätt tidpunkt. AI:n säkerställer att ingen affärsmöjlighet missas.',
      'Du får total kontroll över hela säljflödet med realtidsöversikt och automatiska varningar. Beslut fattas baserat på data istället för magkänsla.'
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
      'AI skapar professionellt marknadsföringsmaterial för annonser, nyhetsbrev och sociala medier. Innehållet anpassas automatiskt för varje kanal och målgrupp.',
      'Kampanjer körs helt automatiskt med intelligent lead nurturing som värmer upp potentiella kunder. Systemet anpassar budskap baserat på kundens beteende och intresse.',
      'Leads får automatisk scoring och berikning direkt i ditt CRM-system. Du ser omedelbart vilka leads som är redo för försäljning och vilka som behöver mer nurturing.',
      'Interaktiva dashboards visar exakt ROI för varje marknadsinitiativ i realtid. Du ser tydligt vilka kampanjer som genererar mest värde och kan optimera kontinuerligt.'
    ],
    valueBullets: [
      'Kampanjer blir betydligt effektivare när AI optimerar budskap och timing. Varje krona du investerar i marknadsföring ger högre avkastning.',
      'Marknadsföring och försäljning arbetar sömlöst tillsammans med delad data och insikter. Inga leads faller mellan stolarna när hela kundresan är synkroniserad.',
      'Lead-flödet automatiseras helt från första kontakt till kvalificerad affärsmöjlighet. Ditt team kan fokusera på att avsluta affärer istället för administration.'
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
      'AI-receptionisten hanterar alla inkommande förfrågningar och bokar jobb automatiskt. Systemet svarar direkt på kundfrågor och ger prisuppgifter dygnet runt.',
      'Kunder får automatiska SMS- och e-postpåminnelser innan varje jobb. Systemet skickar även bekräftelser, uppföljningar och begär feedback automatiskt.',
      'Offerter genereras automatiskt baserat på jobbtyp och omfattning. Kunder kan signera digitalt direkt på sin mobil vilket påskyndar hela processen.',
      'CRM:et håller koll på all kundhistorik och schemalägger återkommande jobb automatiskt. Du ser tydligt vilka kunder som behöver service och kan planera proaktivt.'
    ],
    valueBullets: [
      'Inga jobb missas längre när AI:n hanterar alla förfrågningar direkt. Varje potentiell kund får omedelbar respons även utanför kontorstid.',
      'Administrationen minskar drastiskt när bokning, bekräftelser och uppföljning sker automatiskt. Ditt team kan fokusera på det de gör bäst - själva servicearbetet.',
      'Kundnöjdheten ökar när kommunikationen är snabb, tydlig och pålitlig. Professionell hantering genom hela kundresan bygger förtroende och lojalitet.'
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
      'AI analyserar kundbeteende och rekommenderar relevanta produkter för cross-sell och upsell. Rekommendationerna visas automatiskt i checkout och via personliga e-postmeddelanden.',
      'Hela orderflödet hanteras automatiskt från köp till leverans och uppföljning. Kundservice-ärenden sorteras och prioriteras automatiskt baserat på angelägenhetsgrad.',
      'AI identifierar kunder som riskerar att sluta handla och initierar räddningsåtgärder. Lojalitetsprogram anpassas automatiskt för att maximera återköp och livstidsvärde.',
      'CRM-systemet segmenterar kunder baserat på beteende, värde och potential. Automatisk insamling av feedback ger kontinuerliga insikter för förbättring.'
    ],
    valueBullets: [
      'Försäljningen per kund ökar kraftigt när AI föreslår rätt produkter vid rätt tillfälle. Genomsnittligt ordervärde växer utan extra marknadsföringskostnader.',
      'Kundretentionen förbättras markant genom proaktiv churn prevention och personliga erbjudanden. Återköpsfrekvensen ökar när varje kund känner sig värdefull.',
      'Manuellt arbete elimineras när order, kundservice och marknadsföring automatiseras. Teamet kan fokusera på strategi och tillväxt istället för administration.'
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
      'Data samlas in automatiskt från alla källor och berikas med extern information. Systemet rensar och strukturerar data för att säkerställa högsta kvalitet.',
      'AI analyserar kunddata, leads och marknadstrender för att hitta dolda mönster. Insikterna presenteras tydligt med konkreta rekommendationer för handling.',
      'Dashboards uppdateras automatiskt med relevanta nyckeltal och trendanalyser. Rapporter genereras och distribueras enligt schema utan manuellt arbete.',
      'Predictive analytics förutser framtida utveckling baserat på historisk data och aktuella trender. Du får konkreta prognoser som stöd för strategiska beslut.'
    ],
    valueBullets: [
      'Beslut fattas snabbare och med högre träffsäkerhet när AI processerar all tillgänglig data. Du slipper gissa och kan agera med självförtroende.',
      'Nya affärsmöjligheter identifieras automatiskt genom mönsterigenkänning i data. Du ser möjligheter som konkurrenterna missar.',
      'Arbetet blir proaktivt när AI varnar för problem innan de uppstår. Du hinner agera i tid istället för att släcka bränder.'
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
      'Ett komplett AI-ekosystem byggs från grunden utifrån era unika affärsprocesser. Lösningen är fullständigt skalbar och växer med er organisation.',
      'Sömlös integration med alla era befintliga system inkluderat ERP, CRM och e-handel. Data flödar fritt mellan systemen för maximal effektivitet.',
      'Samtliga AI-komponenter som receptionist, lead generation och automatisering ingår. Analyser och rapporter anpassas efter era specifika KPI:er och målsättningar.',
      'Branschspecifika lösningar utvecklas för er sektor med djup förståelse för regelverk. Vi har expertis inom finans, hälsa, fastighet och andra reglerade branscher.'
    ],
    valueBullets: [
      'Effektivitet och skalbarhet maximeras när hela verksamheten optimeras som en helhet. Systemet växer smidigt när organisationen expanderar.',
      'Lösningen skräddarsys exakt efter era behov och arbetssätt. Ni får funktionalitet som passar er verksamhet perfekt utan kompromisser.',
      'ROI syns omedelbart genom minskade kostnader och ökad produktivitet. Samtidigt bygger ni en grund för långsiktig digital transformation.'
    ],
    pricing: {
      starter: 'Från 49 995 kr/mån',
      growth: 'Från 99 995 kr/mån',
      enterprise: 'Skräddarsydd offert'
    }
  }
];
