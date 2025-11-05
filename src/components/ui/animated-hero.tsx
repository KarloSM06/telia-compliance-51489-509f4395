import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimatedHeroProps {
  onBookDemo?: () => void;
  onViewPackages?: () => void;
}

function AnimatedHero({ onBookDemo, onViewPackages }: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "Öka omsättningen",
      "Spara tid",
      "Skala verksamheten",
      "Minska bekymmer",
      "Automatisera arbetet"
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              AI-automation för tillväxt
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="relative flex flex-col overflow-hidden min-h-[1.3em] mb-3">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-extrabold bg-gradient-gold bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-foreground dark:text-white">
                med AI-automation
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 dark:text-neutral-300 max-w-2xl font-light leading-relaxed">
              Låt AI hantera administration, kundkommunikation och repetitiva uppgifter 
              medan du fokuserar på att växa ditt företag.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button 
                size="lg" 
                className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-bold text-lg px-10 py-6 h-auto gap-3 group" 
                onClick={onBookDemo}
              >
                Boka gratis demo 
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Calendar className="w-5 h-5" />
                </motion.span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-foreground/20 dark:border-white/20 text-foreground dark:text-white hover:border-foreground dark:hover:border-white hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300 font-semibold text-lg px-10 py-6 h-auto gap-2" 
                onClick={onViewPackages}
              >
                Se paket 
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right side - Visual element */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-elegant">
              {/* Placeholder for hero image or visual */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-muted-foreground">AI-driven automation</p>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border/50 rounded-2xl p-4 shadow-card backdrop-blur-sm">
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Tidsbesparing</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card border border-border/50 rounded-2xl p-4 shadow-card backdrop-blur-sm">
              <div className="text-2xl font-bold text-foreground">3x</div>
              <div className="text-sm text-muted-foreground">Snabbare tillväxt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
