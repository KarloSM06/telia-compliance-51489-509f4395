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
    <div className="w-full py-24 lg:py-40">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex gap-12 items-center justify-center flex-col">
          <div className="flex gap-8 flex-col items-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl max-w-6xl tracking-tight text-center font-extrabold leading-[1.1]">
              <span className="text-foreground dark:text-white block mb-4 drop-shadow-2xl">
                Skala din verksamhet
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-6 md:pt-2 min-h-[1.3em]">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-black bg-gradient-gold bg-clip-text text-transparent drop-shadow-xl"
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

            <p className="text-2xl md:text-3xl lg:text-4xl leading-[1.6] tracking-normal text-foreground/90 dark:text-neutral-200 max-w-5xl text-center font-light mt-8 px-4">
              Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
              försäljning, bokningar, administration och dataanalys.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mt-12">
            <Button 
              size="lg" 
              className="group relative bg-gradient-gold text-primary hover:shadow-glow shadow-button transition-all duration-500 font-black text-2xl px-14 py-10 h-auto gap-4 rounded-2xl hover:scale-105 overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%]" 
              onClick={onViewPackages}
            >
              <span className="relative z-10 flex items-center gap-4">
                Se våra paket <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-[3px] border-foreground/20 dark:border-white/30 text-foreground dark:text-white bg-background/20 dark:bg-white/5 backdrop-blur-sm hover:bg-gradient-gold hover:text-primary hover:border-primary/30 transition-all duration-500 font-black text-2xl px-14 py-10 h-auto gap-4 rounded-2xl hover:scale-105 hover:shadow-glow" 
              onClick={onBookDemo}
            >
              <span className="flex items-center gap-4">
                Boka demo <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
