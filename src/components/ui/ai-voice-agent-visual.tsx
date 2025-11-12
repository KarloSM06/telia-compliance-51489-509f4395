"use client";

import { motion } from "framer-motion";
import { SiriOrb } from "./siri-orb";
import { Mic, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIVoiceAgentVisualProps {
  className?: string;
}
export const AIVoiceAgentVisual: React.FC<AIVoiceAgentVisualProps> = ({
  className = ""
}) => {
  const isMobile = useIsMobile();
  const waveformBars = [0.3, 0.6, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.5];
  const conversation = [{
    type: "user",
    text: "Boka möte imorgon kl 14"
  }, {
    type: "ai",
    text: "✓ Möte bokat med Sara kl 14:00"
  }];
  return <div className={`h-[280px] md:h-[350px] w-full max-w-[400px] mx-auto flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div animate={{
        scale: [1, 1.05, 1]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
        <SiriOrb 
          size="220px" 
          animationDuration={25} 
          className="drop-shadow-2xl" 
        />
      </motion.div>
    </div>;
};