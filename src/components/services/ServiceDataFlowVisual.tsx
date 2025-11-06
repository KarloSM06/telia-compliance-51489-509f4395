import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ArrowRight, LucideIcon } from "lucide-react";

interface FlowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceDataFlowVisualProps {
  steps: FlowStep[];
}

export const ServiceDataFlowVisual = ({ steps }: ServiceDataFlowVisualProps) => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Så Fungerar Dataflödet
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En intelligent process från input till resultat
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Desktop arrows */}
            <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-0">
              <div className="flex-1" />
              <ArrowRight className="w-8 h-8 text-primary/30 mx-4" />
              <div className="flex-1" />
              <ArrowRight className="w-8 h-8 text-primary/30 mx-4" />
              <div className="flex-1" />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative z-10"
                >
                  <CardSpotlight className="h-full bg-card/20 backdrop-blur-md border border-border/30 hover:bg-card/30 hover:border-primary/30 transition-all duration-300 p-6 rounded-2xl">
                    <div className="relative flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 mb-6">
                      <Icon className="m-auto size-8 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardSpotlight>

                  {/* Mobile arrow */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-primary/30 rotate-90" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};