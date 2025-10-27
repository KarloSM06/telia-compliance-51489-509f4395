export interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  packageUsed: string;
  problem: string;
  solution: string;
  results: {
    metric: string;
    value: string;
  }[];
  testimonial: {
    text: string;
    author: string;
    role: string;
  };
  image?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'vvs-foretag',
    company: 'Nordisk VVS AB',
    industry: 'Service & Hantverk',
    packageUsed: 'Service & Operations Optimizer',
    problem: 'Missade 30% av inkommande samtal och tappade värdefulla leads. Mycket tid gick åt till att ringa upp kunder och boka tider manuellt.',
    solution: 'Vi implementerade Krono AI-receptionist som tar emot alla samtal 24/7, bokar tider automatiskt och skickar bekräftelser via SMS.',
    results: [
      { metric: 'Missade samtal', value: '0%' },
      { metric: 'Fler bokade jobb', value: '+45%' },
      { metric: 'Tid sparad per vecka', value: '12 timmar' },
      { metric: 'ROI efter', value: '2 månader' }
    ],
    testimonial: {
      text: 'Hiems AI-lösning har transformerat vår verksamhet. Vi missar inga jobb längre och har mer tid för det vi är bra på - VVS-arbete.',
      author: 'Anders Svensson',
      role: 'VD, Nordisk VVS AB'
    }
  },
  {
    id: 'e-handel-mode',
    company: 'StyleHub Online',
    industry: 'E-handel',
    packageUsed: 'E-commerce & Retail Booster',
    problem: 'Låg återköpsfrekvens och svårt att identifiera vilka produkter som passar olika kundsegment. Många engångsköpare.',
    solution: 'AI-rekommendationssystem som analyserar köpbeteende och skickar personaliserade produktförslag. Automatiserad kundsegmentering och targeted kampanjer.',
    results: [
      { metric: 'Genomsnittlig ordervärde', value: '+38%' },
      { metric: 'Retention rate', value: '+52%' },
      { metric: 'Customer lifetime value', value: '+67%' },
      { metric: 'Tid sparad på kampanjer', value: '20h/månad' }
    ],
    testimonial: {
      text: 'AI-rekommendationerna har dramatiskt ökat vår försäljning. Kunderna älskar de personaliserade förslagen och vi ser betydligt fler återköp.',
      author: 'Linda Eriksson',
      role: 'E-handelschef, StyleHub Online'
    }
  },
  {
    id: 'b2b-saas',
    company: 'TechFlow Solutions',
    industry: 'B2B SaaS',
    packageUsed: 'Growth & Sales Accelerator',
    problem: 'Lång och komplex säljcykel med många leads som inte kvalificerades korrekt. Svårt att få överblick över pipeline och prognoser.',
    solution: 'Implementerade Lead Generator med AI-scoring, automatiserad lead-kvalificering och CRM med sales forecasting. AI-receptionist bokar demos automatiskt.',
    results: [
      { metric: 'Säljcykel', value: '-40%' },
      { metric: 'Lead-to-customer conversion', value: '+55%' },
      { metric: 'Pipeline visibility', value: '100%' },
      { metric: 'Fler demos per månad', value: '+73%' }
    ],
    testimonial: {
      text: 'Vi har aldrig haft så bra koll på vår pipeline. AI:n kvalificerar leads perfekt och våra säljare kan fokusera på att stänga affärer.',
      author: 'Johan Bergström',
      role: 'VP Sales, TechFlow Solutions'
    }
  }
];
