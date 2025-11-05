import { motion } from "framer-motion";
import { Technology } from "@/data/services";
import { Layers } from "lucide-react";

interface TechnologyStackProps {
  technologies: Technology[];
}

export const TechnologyStack = ({ technologies }: TechnologyStackProps) => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-gold shadow-button mb-6">
            <Layers className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Teknologier Vi Använder
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beprövade verktyg och plattformar för maximal effektivitet
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-3xl border border-border bg-card hover:shadow-card transition-all duration-300 text-center group"
            >
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {tech.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tech.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
