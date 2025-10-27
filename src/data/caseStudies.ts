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
    id: 'vvs-case',
    company: 'VVS Aktiv Stockholm',
    industry: 'Service & Hantverk',
    packageUsed: 'service-operations',
    problem: 'Missade 30% av inkommande samtal och tappade potentiella kunder. Personalen spenderade för mycket tid på administrativt arbete.',
    solution: 'Implementerade Krono AI-receptionist med automatiska bokningar och SMS-notifieringar. Integrerade med befintligt CRM-system.',
    results: [
      {
        metric: 'Missade samtal',
        value: '0%'
      },
      {
        metric: 'Fler bokade jobb',
        value: '+45%'
      },
      {
        metric: 'Tidsbesparig/vecka',
        value: '12 timmar'
      },
      {
        metric: 'ROI',
        value: '2 månader'
      }
    ],
    testimonial: {
      text: 'Vi förlorar inte längre kunder till konkurrenter på grund av missade samtal. Systemet betalar för sig själv flera gånger om.',
      author: 'Anders Svensson',
      role: 'VD, VVS Aktiv'
    }
  },
  {
    id: 'ecommerce-case',
    company: 'Nordic Fashion Online',
    industry: 'E-handel',
    packageUsed: 'ecommerce-retail',
    problem: 'Låg konvertering och hög churn. Svårt att förstå kundbeteende och personalisera shoppingupplevelsen.',
    solution: 'Implementerade AI-drivna produktrekommendationer, automatisk kundsegmentering och churn prevention-system.',
    results: [
      {
        metric: 'Ökad konvertering',
        value: '+38%'
      },
      {
        metric: 'Högre kundvärde',
        value: '+52%'
      },
      {
        metric: 'Minskad churn',
        value: '-28%'
      },
      {
        metric: 'ROI',
        value: '3 månader'
      }
    ],
    testimonial: {
      text: 'AI-rekommendationerna har transformerat vår försäljning. Kunderna hittar rätt produkter snabbare och köper mer.',
      author: 'Maria Karlsson',
      role: 'E-commerce Manager'
    }
  },
  {
    id: 'b2b-sales-case',
    company: 'TechSolutions AB',
    industry: 'B2B',
    packageUsed: 'growth-sales',
    problem: 'Lång säljcykel och svårt att kvalificera leads. Säljteamet spenderade för mycket tid på felaktiga leads.',
    solution: 'Implementerade Lead Generator med AI-driven lead scoring, automatisk uppföljning och CRM-integration.',
    results: [
      {
        metric: 'Kortare säljcykel',
        value: '-35%'
      },
      {
        metric: 'Högre konvertering',
        value: '+58%'
      },
      {
        metric: 'Kvalificerade leads',
        value: '+127%'
      },
      {
        metric: 'ROI',
        value: '1.5 månader'
      }
    ],
    testimonial: {
      text: 'Vi fokuserar nu på rätt leads från dag ett. Systemet har mer än fördubblat vår pipeline av kvalificerade möjligheter.',
      author: 'Johan Bergström',
      role: 'Säljchef'
    }
  }
];
