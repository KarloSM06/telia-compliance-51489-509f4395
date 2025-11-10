import { AnimatedSection } from "@/components/shared/AnimatedSection";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";

const servicesData = [
  {
    id: 1,
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
      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
        {servicesData.map((service, index) => (
          <AnimatedSection key={service.id} delay={index * 100}>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-10 md:p-16 shadow-lg hover:shadow-xl transition-all">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${service.isReversed ? 'md:grid-flow-dense' : ''}`}>
                {/* Text side */}
                <div className={service.isReversed ? 'md:col-start-2' : ''}>
                  <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-gray-700">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4">
                    <button className="border border-gray-300 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors">
                      Request a demo
                    </button>
                  </div>
                </div>
                
                {/* Mockup side */}
                <div className={`bg-gray-50 rounded-2xl p-8 border border-gray-200 ${service.isReversed ? 'md:col-start-1' : ''}`}>
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
    </section>
  );
};
