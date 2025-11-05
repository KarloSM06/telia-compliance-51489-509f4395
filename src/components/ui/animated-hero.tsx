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
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex gap-8 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-5xl tracking-tight text-center font-bold leading-tight">
              <span className="text-foreground dark:text-white block mb-2">
                Skala din verksamhet
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 min-h-[1.2em]">
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
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-foreground/90 dark:text-neutral-200 max-w-4xl text-center font-light mt-6">
              Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
              försäljning, bokningar, administration och dataanalys.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-bold text-xl px-12 py-8 h-auto gap-3" 
              onClick={onViewPackages}
            >
              Se våra paket <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-foreground dark:border-white text-foreground dark:text-white bg-background/10 dark:bg-white/10 hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all duration-300 font-bold text-xl px-12 py-8 h-auto gap-3" 
              onClick={onBookDemo}
            >
              Boka demo <Calendar className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
