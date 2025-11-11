import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { servicesData } from "@/data/services";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
import { EvervaultCard } from "@/components/ui/evervault-card";

const AnimatedContainer = ({ 
  className, 
  delay = 0.1, 
  children 
}: { 
  className?: string; 
  delay?: number; 
  children: React.ReactNode 
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ServicesGrid = () => {
  return (
    <section className="relative py-24 md:py-40 bg-white">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 md:px-8 py-12 md:py-16 border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <AnimatedContainer className="mx-auto max-w-full text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold text-gray-900">
            Våra Tjänster & Teknologier
          </h2>
          <p className="text-gray-600 mt-4 text-sm tracking-wide text-balance md:text-base">
            Vi bygger intelligenta ekosystem som kopplar samman AI, automation och affärsdata – 
            för att göra ditt företag snabbare, smartare och mer lönsamt.
            <br />
            <span className="font-semibold text-gray-900">Allt vi skapar kan ägas av dig, helt utan beroenden.</span>
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
        >
          {servicesData.map((service) => (
            <Link 
              key={service.id}
              to={`/tjanster/${service.slug}`}
              className="block"
            >
              <EvervaultCard className="aspect-auto">
                <FeatureCard 
                  feature={{
                    title: service.title,
                    icon: service.icon,
                    description: service.shortDescription
                  }}
                />
              </EvervaultCard>
            </Link>
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
};
