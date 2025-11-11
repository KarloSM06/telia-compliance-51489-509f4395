import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { TrendingUp, Heart, Clock, DollarSign, BarChart3, Rocket } from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Ökad Produktivitet",
    description: "Automatisera repetitiva uppgifter och frigör tid för strategiskt arbete. Teamet fokuserar på värdeskapande aktiviteter."
  },
  {
    id: 2,
    icon: Heart,
    title: "Bättre Kundupplevelse",
    description: "24/7 tillgänglighet via AI-agenter. Snabbare svar, bättre service och nöjdare kunder."
  },
  {
    id: 3,
    icon: Clock,
    title: "24/7 Tillgänglighet",
    description: "AI:n sover aldrig. Hantera samtal, bokningar och ärenden dygnet runt utan extra personalkostnader."
  },
  {
    id: 4,
    icon: DollarSign,
    title: "Kostnadsminskning",
    description: "Minska operational overhead med upp till 60%. AI gör mer med mindre resurser."
  },
  {
    id: 5,
    icon: BarChart3,
    title: "Datadrivna Insikter",
    description: "Få live-insikter och prognoser som driver bättre beslut. Data blir actionable intelligence."
  },
  {
    id: 6,
    icon: Rocket,
    title: "Skalbarhet & Tillväxt",
    description: "Väx utan att anställa fler. AI-system skalar med din verksamhet utan extra kostnader."
  }
];

export const BenefitsGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Fördelar
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
              AI är inte bara ett verktyg — det är den nya infrastrukturen för företag
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Vi hjälper er att utnyttja det för att röra sig snabbare, tänka smartare och skala bortom gränser
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.id}
                className="animate-[fadeInUp_0.6s_ease-out] border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all h-[280px] flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                  <div className="mb-4">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-gray-900 stroke-[1]" />
                  </div>
                  <h3 className="text-xl font-display font-normal text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
      </div>
    </section>
  );
};
