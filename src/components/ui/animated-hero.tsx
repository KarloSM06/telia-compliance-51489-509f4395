import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
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
  return <div className="w-full min-h-screen relative">
      {/* Spline 3D Animation - Fixed position för full coverage */}
      <div className="fixed inset-0 w-screen h-screen z-[15]">
        <Spline 
          scene="https://prod.spline.design/dtyy9Rk8l8FAgcgA/scene.splinecode" 
          className="w-full h-full"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }} 
        />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto max-w-7xl px-6 relative z-20 min-h-screen flex items-center justify-center py-32">
        <div className="text-center space-y-8 max-w-4xl backdrop-blur-md bg-white/10 rounded-2xl p-12">
          {/* Animated Headline */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-black drop-shadow-lg">
              <motion.span key={titleNumber} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.5
            }} className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {titles[titleNumber]}
              </motion.span>
              <br />
              <span className="text-black">med AI-drivna lösningar</span>
            </h1>
            <p className="text-xl md:text-2xl text-black/90 drop-shadow-md max-w-3xl mx-auto">
              Automatisera kundkommunikation, öka försäljning och effektivisera er verksamhet med vår expertis inom AI, röstassistenter och intelligenta system.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {onBookDemo && <RainbowButton onClick={onBookDemo} className="w-full sm:w-auto text-lg px-8 py-6 drop-shadow-xl">
                <Calendar className="mr-2 h-5 w-5" />
                Boka en demo
              </RainbowButton>}
            {onViewPackages && <Button onClick={onViewPackages} variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-black/20 bg-white/80 backdrop-blur-sm text-black hover:bg-white hover:border-black/40 drop-shadow-xl">
                Se våra paket
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>}
          </motion.div>
        </div>
      </div>
    </div>;
}
export { AnimatedHero };