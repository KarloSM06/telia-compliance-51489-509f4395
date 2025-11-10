import { motion } from "framer-motion";
import { Calendar, Settings, Rocket } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export function ProcessSteps() {
  const steps = [
    {
      icon: Calendar,
      title: "1. Boka demo",
      description: "Vi diskuterar era behov och visar hur AI kan transformera er verksamhet."
    },
    {
      icon: Settings,
      title: "2. Anpassad lösning",
      description: "Vi designar och konfigurerar ett skräddarsytt AI-ekosystem för just er."
    },
    {
      icon: Rocket,
      title: "3. Lansering",
      description: "Vi implementerar, testar och lanserar er lösning med full support."
    }
  ];

  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Så fungerar det
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Från första mötet till färdig lösning – vi guidar er hela vägen
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-5xl mx-auto">
          {/* Desktop: Horizontal layout with connecting lines */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-accent via-accent to-accent opacity-30" />
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm">
                    <Icon className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: Vertical layout */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
