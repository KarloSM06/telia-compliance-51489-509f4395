import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HowItWorksTimelineProps {
  steps: string[];
}

export const HowItWorksTimeline = ({ steps }: HowItWorksTimelineProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hur Det Fungerar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Från första kontakt till fullt fungerande lösning
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line - desktop */}
            <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-gradient-gold flex items-center justify-center font-bold text-xl text-primary shadow-button group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {index + 1}
                  </div>
                  <div className="flex-1 p-6 rounded-3xl border border-border bg-card group-hover:shadow-card transition-all duration-300">
                    <p className="text-lg font-medium">
                      {step}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block text-muted-foreground mt-8 flex-shrink-0 group-hover:text-secondary transition-colors" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
