import { motion } from "framer-motion";
import { UseCase } from "@/data/services";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Briefcase, CheckCircle } from "lucide-react";

interface UseCaseShowcaseProps {
  useCases: UseCase[];
}

export const UseCaseShowcase = ({ useCases }: UseCaseShowcaseProps) => {
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-gold shadow-button mb-6">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Perfekt För
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Användningsområden där denna lösning gör störst skillnad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CardSpotlight className="h-full bg-card/20 backdrop-blur-md border border-border/30 hover:bg-card/30 hover:border-primary/30 transition-all duration-300 p-8 rounded-3xl group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 flex-shrink-0">
                    <CheckCircle className="m-auto size-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    {useCase.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {useCase.description}
                </p>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};