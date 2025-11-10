import { AnimatedSection } from "@/components/shared/AnimatedSection";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";

const servicesData = [
  {
    id: 1,
    category: "Our Services",
    title: "Dashboards & Decision Intelligence",
    description: "Live CRM insights, forecasts, automated reporting med AI. Gör data actionable så att teamet kan agera direkt.",
    bullets: [
      "Real-time KPI dashboards",
      "Predictive analytics",
      "Automated reporting",
      "Custom data integrations"
    ],
    mockup: dashboardScreenshot,
    isReversed: false
  },
  {
    id: 2,
    category: "Workflow Automation",
    title: "Automate repetitive tasks",
    description: "Låt AI hantera fakturering, mejl-uppföljning, rapportering och mer. Släpp administrationen och fokusera på tillväxt.",
    bullets: [
      "Invoice automation",
      "Email follow-ups",
      "Calendar management",
      "Document processing"
    ],
    mockup: dashboardScreenshot,
    isReversed: true
  },
  {
    id: 3,
    category: "AI Assistant",
    title: "AI Voice Agents",
    description: "Virtuella receptionister som svarar, bokar möten och följer upp 24/7. Missa aldrig ett samtal igen.",
    bullets: [
      "24/7 phone reception",
      "Automatic meeting booking",
      "Call transcription & analysis",
      "Multi-language support"
    ],
    mockup: dashboardScreenshot,
    isReversed: false
  },
  {
    id: 4,
    category: "Sales & Marketing",
    title: "Accelerate Sales Growth",
    description: "AI-driven lead generation, qualification och nurturing. Kortare säljcykler och högre conversion rates.",
    bullets: [
      "Lead enrichment",
      "Auto qualification",
      "Sales forecasting",
      "Pipeline analytics"
    ],
    mockup: dashboardScreenshot,
    isReversed: true
  },
  {
    id: 5,
    category: "Custom Projects",
    title: "Build Smarter Systems",
    description: "Custom AI-lösningar som integreras med era befintliga system. Skalbar automation som växer med er.",
    bullets: [
      "Custom integrations",
      "API connections",
      "Workflow optimization",
      "System scalability"
    ],
    mockup: dashboardScreenshot,
    isReversed: false
  }
];

export const AlternatingServicesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
            AI-Lösningar som Levererar
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Live KPI-tavlor, prognoser och tydliga handlingsrekommendationer—så teamet agerar, inte gissar.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
        {servicesData.map((service, index) => (
          <AnimatedSection key={service.id} delay={index * 100}>
            <div className="border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-lg hover:shadow-xl transition-all">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${service.isReversed ? 'md:grid-flow-dense' : ''}`}>
                {/* Text side */}
                <div className={service.isReversed ? 'md:col-start-2' : ''}>
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  {/* Pill-formade tags istället för bullets */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.bullets.map((bullet, idx) => (
                      <span key={idx} className="text-sm text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                        {bullet}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="border border-gray-300 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-colors">
                      Request a demo
                    </button>
                  </div>
                </div>
                
                {/* Mockup side - Glassmorphism container */}
                <div className={`bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-8 shadow-lg ${service.isReversed ? 'md:col-start-1' : ''}`}>
                  <img 
                    src={service.mockup} 
                    alt={service.title} 
                    className="w-full rounded-lg"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
        </div>
      </div>
    </section>
  );
};
