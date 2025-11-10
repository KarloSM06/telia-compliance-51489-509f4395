import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import Spline from '@splinetool/react-spline';
interface AnimatedHeroProps {
  onBookDemo?: () => void;
  onViewPackages?: () => void;
}
function AnimatedHero({
  onBookDemo,
  onViewPackages
}: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["Öka omsättningen", "Spara tid", "Skala verksamheten", "Minska bekymmer", "Automatisera arbetet"], []);
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
  return <div className="w-full py-32 lg:py-48 relative">
      {/* Spline 3D Animation - Behind text but in front of aurora */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <Spline
          scene="https://prod.spline.design/41WHROOhXoLPl4L2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        <div className="flex gap-8 items-center justify-center flex-col">
          <div className="flex gap-6 flex-col items-center">
            {/* Main Heading */}
            <AnimatedSection>
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} className="text-4xl md:text-6xl lg:text-7xl max-w-6xl tracking-tight text-center font-bold leading-[1.15]">
                <span className={cn("block mb-3", "bg-clip-text text-transparent", "bg-[linear-gradient(180deg,_hsl(var(--foreground))_0%,_hsl(var(--foreground)/0.8)_100%)]", "dark:bg-[linear-gradient(180deg,_hsl(var(--foreground))_0%,_hsl(var(--foreground)/0.6)_100%)]")}>Skala din verksamhet med AI</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center pb-2 min-h-[1.2em]">
                  {titles.map((title, index) => <motion.span key={index} className="absolute font-extrabold bg-gradient-gold bg-clip-text text-transparent" initial={{
                  opacity: 0,
                  y: -100
                }} transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 20
                }} animate={titleNumber === index ? {
                  y: 0,
                  opacity: 1
                } : {
                  y: titleNumber > index ? -150 : 150,
                  opacity: 0
                }}>
                      {title}
                    </motion.span>)}
                </span>
              </motion.h1>
            </AnimatedSection>

            {/* Description */}
            <AnimatedSection delay={100}>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl text-center font-normal mt-2">
                Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
                försäljning, bokningar, administration och dataanalys.
              </motion.p>
            </AnimatedSection>
          </div>
          
          {/* CTA Buttons */}
          <AnimatedSection delay={200}>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button variant="outline" className="group hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 font-bold rounded-xl hover:scale-105" onClick={onViewPackages}>
                <span className="flex items-center gap-2">
                  Se våra paket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              <RainbowButton 
                onClick={onBookDemo}
                className="group font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Boka demo <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </RainbowButton>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </div>;
}
export { AnimatedHero };