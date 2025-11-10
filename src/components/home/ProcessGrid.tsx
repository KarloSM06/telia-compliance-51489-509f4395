import { AnimatedSection } from "@/components/shared/AnimatedSection";

const processSteps = [
  {
    id: 1,
    title: "Smart Analytics",
    description: "Vi analyserar dina flöden, identifierar flaskhalsar och kartlägger AI-potential. Data-driven från dag ett."
  },
  {
    id: 2,
    title: "AI Development",
    description: "Våra ingenjörer bygger skräddarsydda AI-agenter och automationer som passar just era processer."
  },
  {
    id: 3,
    title: "Go To Power Up",
    description: "Vi integrerar AI:n med era befintliga verktyg och system. Seamless deployment utan störningar."
  },
  {
    id: 4,
    title: "Scale That Grows With You",
    description: "Kontinuerlig optimering och expansion. AI:n lär sig och förbättras med er verksamhet."
  }
];

export const ProcessGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-display font-normal text-gray-900 mb-4">
              Our Simple, Smart, and Scalable Process
            </h2>
            <p className="text-lg text-gray-600">
              From consultation to AI-powered automation in 4 steps
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-6">
          {processSteps.map((step, index) => (
            <AnimatedSection key={step.id} delay={index * 100}>
              <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-2xl md:text-3xl font-display font-normal text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
