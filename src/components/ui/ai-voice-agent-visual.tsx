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
        <div className="space-y-4">

          {/* Conversation Bubbles */}
          <div className="space-y-4">
            {conversation.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: message.type === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.5 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  message.type === "user" 
                    ? "bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900" 
                    : "bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 text-white"
                }`}>
                  {message.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Status Indicator */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 2
        }} className="flex items-center gap-2 mt-6 text-sm text-gray-600">
            <motion.div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" animate={{
            opacity: [1, 0.3, 1]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }} />
            <span>AI Agent is listening...</span>
          </motion.div>
        </div>
      </div>
    </div>;
};