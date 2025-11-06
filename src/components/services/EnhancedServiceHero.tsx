import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ReactNode } from "react";

interface EnhancedServiceHeroProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onBookDemo?: () => void;
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div 
    aria-hidden 
    className="relative mx-auto size-32 md:size-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div className="absolute inset-0 flex items-center justify-center">
      {children}
    </div>
  </div>
);

export const EnhancedServiceHero = ({ icon: Icon, title, subtitle, onBookDemo }: EnhancedServiceHeroProps) => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <CardSpotlight className="relative bg-card/20 backdrop-blur-md border border-border/30 hover:bg-card/30 transition-all duration-500 p-12 md:p-16 rounded-3xl">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CardDecorator>
                  <Icon className="w-16 h-16 md:w-20 md:h-20 text-primary" strokeWidth={1.5} />
                </CardDecorator>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              >
                {title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
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
            </div>
          </CardSpotlight>
        </motion.div>
      </div>
    </section>
  );
};