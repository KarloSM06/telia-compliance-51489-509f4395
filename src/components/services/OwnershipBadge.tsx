import { motion } from "framer-motion";
import { Shield, Code, HeadphonesIcon } from "lucide-react";

export const OwnershipBadge = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-elegant relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-gold shadow-glow mb-6"
              >
                <Shield className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Allt Kan Ägas Av Dig
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Ingen inlåsning. Full kontroll. Komplett transparens.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-6 rounded-3xl bg-white/10 backdrop-blur-sm"
              >
                <Code className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-lg font-semibold mb-2">Full Källkod</h3>
                <p className="text-white/80 text-sm">
                  Du äger all kod och kan modifiera den när du vill
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center p-6 rounded-3xl bg-white/10 backdrop-blur-sm"
              >
                <Shield className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-lg font-semibold mb-2">Din Data</h3>
                <p className="text-white/80 text-sm">
                  All data lagras i dina system. Ingen tredjepartsåtkomst
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center p-6 rounded-3xl bg-white/10 backdrop-blur-sm"
              >
                <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-lg font-semibold mb-2">Svensk Support</h3>
                <p className="text-white/80 text-sm">
                  Vi finns här för underhåll, support och vidareutveckling
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
