import { motion } from "framer-motion";
import { Technology } from "@/data/services";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Code2 } from "lucide-react";

interface TechStackGridProps {
  technologies: Technology[];
}

export const TechStackGrid = ({ technologies }: TechStackGridProps) => {
  // Group technologies by category
  const categorizedTechs = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-gold shadow-button mb-6">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Teknologistack
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Moderna verktyg och plattformar för optimal prestanda
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          {Object.entries(categorizedTechs).map(([category, techs], catIndex) => (
            <div key={category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="text-xl font-semibold text-primary mb-6"
              >
                {category}
              </motion.h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {techs.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <CardSpotlight className="h-full bg-card/20 backdrop-blur-md border border-border/30 hover:bg-card/30 hover:border-primary/30 transition-all duration-300 p-4 rounded-xl text-center">
                      <div className="font-medium text-foreground">
                        {tech.name}
                      </div>
                    </CardSpotlight>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};