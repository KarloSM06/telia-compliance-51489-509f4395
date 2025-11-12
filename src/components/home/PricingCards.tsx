import { useState } from "react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ConsultationModal } from "@/components/ConsultationModal";

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
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Priser
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal text-gray-900 mb-6">
              Bästa AI-Automation till Rätt Pris
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Välj en plan som passar era affärsbehov och börja automatisera med AI
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.id}
              className={`animate-[fadeInUp_0.6s_ease-out] border-2 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden ${
                plan.popular ? 'border-gray-900 bg-white/10 lg:scale-105' : 'border-white/10 bg-white/5'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Gradient fade overlay - varies by plan */}
                <div className={`absolute top-0 ${
                  plan.id === 1 ? 'left-0 bg-gradient-to-br from-indigo-400/25 via-purple-400/15' : 
                  plan.id === 2 ? 'left-0 right-0 bg-gradient-to-b from-purple-500/30 via-indigo-500/18' : 
                  'right-0 bg-gradient-to-bl from-indigo-500/25 via-purple-500/15'
                } to-transparent h-48 pointer-events-none z-0`} />
                {plan.popular && (
                  <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm inline-block mb-4 font-medium relative z-10">
                    Populär
                  </div>
                )}
                
                <h3 className="text-2xl font-display font-normal text-gray-900 mb-2 relative z-10">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6 relative z-10">
                  {plan.subtitle}
                </p>
                
                <div className="text-3xl font-display font-normal text-gray-900 mb-8 relative z-10">
                  {plan.price}
                </div>
                
                <ul className="space-y-3 mb-8 relative z-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => setIsConsultationModalOpen(true)}
                  className={`relative z-10 ${plan.popular 
                    ? "w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-full transition-colors"
                    : "w-full border border-gray-300 text-gray-900 py-3.5 rounded-full hover:bg-gray-50 transition-colors"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        <ConsultationModal
          open={isConsultationModalOpen}
          onOpenChange={setIsConsultationModalOpen}
        />
      </section>
    );
  };
