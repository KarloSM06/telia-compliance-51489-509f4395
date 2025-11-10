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
  return <div className="w-full min-h-screen relative overflow-hidden">
      {/* Spline 3D Animation - Main Visual Focus */}
      <div className="absolute inset-0 z-[15]">
        <Spline scene="https://prod.spline.design/dtyy9Rk8l8FAgcgA/scene.splinecode" className="w-full h-full" style={{
        pointerEvents: 'none'
      }} />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto max-w-5xl px-6 relative z-20 min-h-screen flex items-center justify-center py-32">
        
      </div>
    </div>;
}
export { AnimatedHero };