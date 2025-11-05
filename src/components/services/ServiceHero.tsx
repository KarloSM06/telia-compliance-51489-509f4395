import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceHeroProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onBookDemo?: () => void;
}

export const ServiceHero = ({ icon: Icon, title, subtitle, onBookDemo }: ServiceHeroProps) => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-gold shadow-button mb-8"
          >
            <Icon className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
          
          {onBookDemo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={onBookDemo}
                className="bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
              >
                Boka demo
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
