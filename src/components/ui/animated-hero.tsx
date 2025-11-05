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
    <div className="w-full py-32 lg:py-48">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="flex gap-6 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl max-w-4xl tracking-tight text-center font-bold leading-tight">
              <span className="text-foreground dark:text-white block mb-2">
                Skala din verksamhet
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-2 md:pt-1 min-h-[1.2em]">
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

            <p className="text-base md:text-lg leading-relaxed text-foreground/80 dark:text-neutral-300 max-w-2xl text-center font-normal mt-4">
              Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
              försäljning, bokningar, administration och dataanalys.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button 
              className="group relative bg-gradient-gold text-primary hover:shadow-glow shadow-button transition-all duration-300 font-bold rounded-xl hover:scale-105 overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%]" 
              onClick={onViewPackages}
            >
              <span className="relative z-10 flex items-center gap-2">
                Se våra paket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="group hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 font-bold rounded-xl hover:scale-105" 
              onClick={onBookDemo}
            >
              <span className="flex items-center gap-2">
                Boka demo <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
