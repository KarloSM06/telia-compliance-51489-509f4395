import { AnimatedSection } from "@/components/shared/AnimatedSection";

const processSteps = [
  {
    id: 1,
    step: "Steg 1",
    title: "Smart Analysering",
    description: "Vi analyserar era arbetsflöden, upptäcker ineffektivitet och identifierar högvärdiga möjligheter för AI-automation."
  },
  {
    id: 2,
    step: "Steg 2",
    title: "AI-Utveckling",
    description: "Våra ingenjörer designar och implementerar skräddarsydda AI-system—agenter, automationer och datapipelines—byggda kring er verksamhet."
  },
  {
    id: 3,
    step: "Steg 3",
    title: "Integrering i Systemet",
    description: "Vi bäddar in automation direkt i er befintliga tech-stack utan störningar, och säkerställer att allt fungerar som ett enhetligt system."
  },
  {
    id: 4,
    step: "Steg 4",
    title: "Skalning som Lär sig med Er",
    description: "Vi övervakar, förfinar och utvecklar era automationer—analyserar prestationsdata för att säkerställa långsiktig effektivitet och sammansatt tillväxt."
  }
];

export const ProcessGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
              Vår Process
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
            Vår Enkla, Smarta och Skalbara Process
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Vi designar, utvecklar och implementerar automationsverktyg som hjälper er jobba smartare, inte hårdare
          </p>
        </div>
        
        {/* Process Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {processSteps.map((step, index) => (
            <AnimatedSection key={step.id} delay={index * 100}>
              <div className="border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-10 md:p-12 shadow-lg hover:shadow-xl transition-all">
                {/* Step Badge */}
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-3 py-1 rounded-full">
                    {step.step}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-normal text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-2">
                  {step.description}
                </p>
                
                {/* Visual Mockup Area */}
                <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl p-6 h-[280px] flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    [Illustration - {step.title}]
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
