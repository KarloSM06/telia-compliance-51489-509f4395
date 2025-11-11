import { AnimatedSection } from "@/components/shared/AnimatedSection";

const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    subtitle: "För startups och små team",
    price: "Begär offert",
    features: [
      "1 AI-agent (röst eller chat)",
      "Grundläggande dashboard",
      "E-postsupport",
      "Implementeringshjälp",
      "Månatlig optimering"
    ],
    cta: "Begär offert",
    popular: false
  },
  {
    id: 2,
    name: "Professional",
    subtitle: "För växande företag",
    price: "Begär offert",
    features: [
      "3 AI-agenter",
      "Avancerad analys",
      "Prioriterad support",
      "Skräddarsydda integrationer",
      "Veckovisa optimeringssamtal",
      "Dedikerad account manager"
    ],
    cta: "Begär offert",
    popular: true
  },
  {
    id: 3,
    name: "Enterprise",
    subtitle: "För stora organisationer",
    price: "Anpassad",
    features: [
      "Obegränsat antal AI-agenter",
      "Enterprise dashboard",
      "24/7 VIP-support",
      "Full systemintegration",
      "On-premise deployment-möjlighet",
      "Dedikerad AI-konsult"
    ],
    cta: "Begär offert",
    popular: false
  }
];

export const PricingCards = () => {
  return (
    <section className="relative py-24 md:py-40 bg-white">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 md:px-8 py-12 md:py-16 border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Priser
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
              Bästa AI-Automation till Rätt Pris
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Välj en plan som passar era affärsbehov och börja automatisera med AI
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <AnimatedSection key={plan.id} delay={index * 100}>
              <div
              className={`
                relative
                ${plan.popular 
                  ? 'border-2 border-gray-900 bg-white/90 backdrop-blur-xl scale-105' 
                  : 'border border-gray-100 bg-white/80 backdrop-blur-xl'
                }
                rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300
              `}>
                {plan.popular && (
                  <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm inline-block mb-4 font-medium">
                    Populär
                  </div>
                )}
                
                <h3 className="text-2xl font-display font-normal text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.subtitle}
                </p>
                
                <div className="text-3xl font-display font-normal text-gray-900 mb-8">
                  {plan.price}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={plan.popular 
                  ? "w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-full transition-colors"
                  : "w-full border border-gray-300 text-gray-900 py-3 rounded-full hover:bg-gray-50 transition-colors"
                }>
                  {plan.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
