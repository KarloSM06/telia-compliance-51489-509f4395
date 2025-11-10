import { AnimatedSection } from "@/components/shared/AnimatedSection";

const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    subtitle: "For startups and small teams",
    price: "Request for pricing",
    features: [
      "1 AI agent (voice eller chat)",
      "Basic dashboard",
      "Email support",
      "Setup assistance",
      "Monthly optimization"
    ],
    cta: "Request for pricing",
    popular: false
  },
  {
    id: 2,
    name: "Professional",
    subtitle: "For growing businesses",
    price: "Request for pricing",
    features: [
      "3 AI agents",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Weekly optimization calls",
      "Dedicated account manager"
    ],
    cta: "Request for pricing",
    popular: true
  },
  {
    id: 3,
    name: "Enterprise",
    subtitle: "For large organizations",
    price: "Custom",
    features: [
      "Unlimited AI agents",
      "Enterprise dashboard",
      "24/7 VIP support",
      "Full system integration",
      "On-premise deployment option",
      "Dedicated AI consultant"
    ],
    cta: "Request for pricing",
    popular: false
  }
];

export const PricingCards = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-sm text-gray-900 uppercase tracking-wider mb-2 font-medium">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
              The Best AI Automation, at the Right Price
            </h2>
            <p className="text-lg text-gray-600">
              Choose a plan that fits your needs. All plans include support and continuous optimization.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <AnimatedSection key={plan.id} delay={index * 100}>
              <div className={`bg-white/80 backdrop-blur-xl border rounded-2xl p-8 shadow-lg transition-all ${
                plan.popular ? 'border-gray-900 scale-105' : 'border-gray-100'
              }`}>
                {plan.popular && (
                  <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm inline-block mb-4 font-medium">
                    Popular
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
