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
      "Öka din omsättning",
      "Spara värdefull tid",
      "Skala din verksamhet",
      "Minska dina bekymmer",
      "Automatisera ditt arbete"
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
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex gap-12 items-center justify-center flex-col">
          <div className="flex gap-6 flex-col items-center max-w-5xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tight text-center font-bold leading-[1.1]">
              <span className="relative flex w-full justify-center overflow-hidden text-center min-h-[1.3em] mb-4">
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

            <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed text-foreground/80 dark:text-neutral-300 max-w-4xl text-center font-light">
              Låt AI hantera administration, kundkommunikation och repetitiva uppgifter 
              medan du fokuserar på att växa ditt företag.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <Button 
              size="lg" 
              className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-bold text-2xl px-16 py-10 h-auto gap-3" 
              onClick={onBookDemo}
            >
              Boka gratis demo <Calendar className="w-6 h-6" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white transition-all duration-300 font-medium text-sm gap-2 underline underline-offset-4" 
              onClick={onViewPackages}
            >
              Se paket <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
