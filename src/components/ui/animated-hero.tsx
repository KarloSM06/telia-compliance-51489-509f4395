import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Spline from '@splinetool/react-spline';

interface AnimatedHeroProps {
  onBookDemo?: () => void;
  onViewPackages?: () => void;
}

function AnimatedHero({
  onBookDemo,
}: AnimatedHeroProps) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Spline 3D Animation - Behind content but in front of Aurora */}
      <div className="absolute inset-0 w-screen h-screen z-5">
        <Spline
          scene="https://prod.spline.design/dtyy9Rk8l8FAgcgA/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.8,
          }}
        />
      </div>

      {/* Hero Content - On top of everything */}
      <div className="relative z-20 container mx-auto max-w-4xl px-6 py-32 lg:py-48">
        <div className="flex flex-col items-center justify-center gap-6 lg:gap-8 text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-primary/80 bg-clip-text text-transparent">
              Skala din verksamhet med AI
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed"
          >
            Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
            försäljning, bokningar, administration och dataanalys.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-4"
          >
            <RainbowButton 
              onClick={onBookDemo}
              className="group font-bold rounded-xl text-lg px-10 py-6 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Boka Demo
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </RainbowButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
