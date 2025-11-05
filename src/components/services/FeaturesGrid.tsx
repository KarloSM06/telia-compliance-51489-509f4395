import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { ServiceFeature } from "@/data/services";

interface FeaturesGridProps {
  features: ServiceFeature[];
}

export const FeaturesGrid = ({ features }: FeaturesGridProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Funktioner
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Allt du behöver för att automatisera och effektivisera
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
              whileHover={{ y: -5 }}
              className="group p-6 rounded-3xl border border-border bg-card hover:shadow-elegant transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
