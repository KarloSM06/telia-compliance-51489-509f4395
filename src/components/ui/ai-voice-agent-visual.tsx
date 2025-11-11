"use client";

import { motion } from "framer-motion";
import { SiriOrb } from "./siri-orb";
import { Mic, User } from "lucide-react";
interface AIVoiceAgentVisualProps {
  className?: string;
}
export const AIVoiceAgentVisual: React.FC<AIVoiceAgentVisualProps> = ({
  className = ""
}) => {
  const waveformBars = [0.3, 0.6, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.5];
  const conversation = [{
    type: "user",
    text: "Boka möte imorgon kl 14"
  }, {
    type: "ai",
    text: "✓ Möte bokat med Sara kl 14:00"
  }];
  return <div className={`h-[500px] w-full max-w-[900px] mx-auto flex items-center justify-center ${className}`}>
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left Side - SiriOrb */}
        <div className="flex flex-col items-center justify-center">
          <motion.div animate={{
          scale: [1, 1.05, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}>
            <SiriOrb size="280px" animationDuration={25} className="drop-shadow-2xl" />
          </motion.div>
        </div>

        {/* Right Side - Chat Window */}
        
      </div>
    </div>;
};