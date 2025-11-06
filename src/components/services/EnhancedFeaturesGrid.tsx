import { motion } from "framer-motion";
import { ServiceFeature } from "@/data/services";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Sparkles } from "lucide-react";

interface EnhancedFeaturesGridProps {
  features: ServiceFeature[];
}

export const EnhancedFeaturesGrid = ({ features }: EnhancedFeaturesGridProps) => {
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
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Nyckelfunktioner
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Allt du behöver för att lyckas, inbyggt från start
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CardSpotlight className="h-full bg-card/20 backdrop-blur-md border border-border/30 hover:bg-card/30 hover:border-primary/30 transition-all duration-300 p-8 rounded-3xl">
                <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 mb-6">
                  <Sparkles className="m-auto size-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};