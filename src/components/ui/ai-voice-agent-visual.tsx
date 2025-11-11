"use client"

import { motion } from "framer-motion";
import { SiriOrb } from "./siri-orb";
import { Mic, User } from "lucide-react";

interface AIVoiceAgentVisualProps {
  className?: string;
}

export const AIVoiceAgentVisual: React.FC<AIVoiceAgentVisualProps> = ({ className = "" }) => {
  const waveformBars = [0.3, 0.6, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.5];

  const conversation = [
    { type: "user", text: "Boka möte imorgon kl 14" },
    { type: "ai", text: "✓ Möte bokat med Sara kl 14:00" }
  ];

  return (
    <div className={`h-[500px] w-full max-w-[900px] mx-auto flex items-center justify-center ${className}`}>
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left Side - SiriOrb with Waveform */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* SiriOrb */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SiriOrb 
              size="280px"
              animationDuration={25}
              className="drop-shadow-2xl"
            />
          </motion.div>

          {/* Microphone Icon in Center (overlay) */}
          <div className="absolute">
            <motion.div
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Mic className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Waveform Bars */}
          <div className="flex items-end justify-center gap-1.5 h-16">
            {waveformBars.map((height, idx) => (
              <motion.div
                key={idx}
                className="w-2 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-full"
                animate={{
                  height: [`${height * 40}%`, `${height * 100}%`, `${height * 40}%`]
                }}
                transition={{
                  duration: 1,
                  delay: idx * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ minHeight: '8px' }}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="space-y-4">
          <h3 className="text-xl font-display font-normal text-gray-900 mb-6">
            Live Conversation
          </h3>

          {/* Conversation Bubbles */}
          <div className="space-y-4">
            {conversation.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.8 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gray-200' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.8 + 0.2 }}
                    className={`px-5 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm font-medium">{message.text}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex items-center gap-2 mt-6 text-sm text-gray-600"
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>AI Agent is listening...</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
