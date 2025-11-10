import { AnimatedSection } from "@/components/shared/AnimatedSection";

const benefits = [
  {
    id: 1,
    title: "Increased Productivity",
    description: "Automatisera repetitiva uppgifter och frigör tid för strategiskt arbete. Teamet fokuserar på värdeskapande aktiviteter."
  },
  {
    id: 2,
    title: "Better Customer Experience",
    description: "24/7 tillgänglighet via AI-agenter. Snabbare svar, bättre service och nöjdare kunder."
  },
  {
    id: 3,
    title: "24/7 Availability",
    description: "AI:n sover aldrig. Hantera samtal, bokningar och ärenden dygnet runt utan extra personalkostnader."
  },
  {
    id: 4,
    title: "Cost Reduction",
    description: "Minska operational overhead med upp till 60%. AI gör mer med mindre resurser."
  },
  {
    id: 5,
    title: "Data-Driven Insights",
    description: "Få live-insikter och prognoser som driver bättre beslut. Data blir actionable intelligence."
  },
  {
    id: 6,
    title: "Scalability & Growth",
    description: "Väx utan att anställa fler. AI-system skalar med din verksamhet utan extra kostnader."
  }
];

export const BenefitsGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-sm text-purple-600 uppercase tracking-wider mb-2">Benefits</p>
            <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
              AI isn't just a tool — it's the new infrastructure of business
            </h2>
            <p className="text-lg text-gray-600">
              The future of work is AI-enhanced, not AI-replaced
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={benefit.id} delay={index * 100}>
              <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-display font-normal text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
