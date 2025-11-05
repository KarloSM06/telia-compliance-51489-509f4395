import { motion } from "framer-motion";
import { UseCase } from "@/data/services";
import { Briefcase } from "lucide-react";

interface UseCasesProps {
  useCases: UseCase[];
}

export const UseCases = ({ useCases }: UseCasesProps) => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-gold shadow-button mb-6">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perfekt För
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Användningsområden där denna lösning gör störst skillnad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl border border-border bg-card hover:shadow-elegant transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-3 text-primary">
                {useCase.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
