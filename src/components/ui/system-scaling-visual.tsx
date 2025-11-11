"use client"

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Zap, Users } from "lucide-react";

export const SystemScalingVisual = () => {
  const scalingItems = [
    { label: "Performance Optimization", completed: true },
    { label: "Load Balancing", completed: true },
    { label: "Auto-Scaling", completed: true },
    { label: "Resource Allocation", completed: false },
    { label: "Capacity Planning", completed: false },
  ];

  const scalingCards = [
    { icon: TrendingUp, label: "Growth Analytics" },
    { icon: Zap, label: "Speed Optimization" },
    { icon: Users, label: "Scale Complete" },
  ];

  return (
    <div className="h-[280px] w-full bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-[1fr_2fr] gap-6 h-full">
        {/* Left Sidebar - Checklist */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">
            Scaling Tasks
          </h3>
          {scalingItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex items-center gap-2 group cursor-pointer hover:bg-white/60 rounded-lg p-1.5 transition-all"
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                item.completed 
                  ? 'border-2 border-gray-400' 
                  : 'border-2 border-gray-300'
              }`}>
                {item.completed && (
                  <CheckCircle2 className="w-2.5 h-2.5 text-foreground/75" strokeWidth={1.5} />
                )}
              </div>
              <span className={`text-xs ${item.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right Side - Central Workflow Animation */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Workflow Cards with Vertical Flow */}
          <div className="relative h-full w-full flex flex-col items-center justify-center gap-3">
            {scalingCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ y: -50, opacity: 0 }}
                animate={{ 
                  y: [0, 10, 0],
                  opacity: 1 
                }}
                transition={{
                  y: {
                    duration: 2.5,
                    delay: idx * 0.4,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  },
                  opacity: {
                    duration: 0.4,
                    delay: idx * 0.4
                  }
                }}
                className="relative bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg p-3 shadow-lg w-44"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/60 border border-gray-200">
                    <card.icon className="size-6 text-foreground/75" strokeWidth={1} aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{card.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {idx === 2 ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 text-foreground/75" strokeWidth={1.5} />
                          <span className="text-[10px] text-gray-600">Complete</span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          <span className="text-[10px] text-gray-600">Processing...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
              <motion.path
                d="M 120 60 L 120 130 L 120 200"
                stroke="url(#scaling-gradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity,
                  repeatDelay: 0.8,
                  ease: "linear" 
                }}
              />
              <defs>
                <linearGradient id="scaling-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" />
                  <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                  <stop offset="100%" stopColor="rgb(34, 197, 94)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Status Badges at Bottom */}
          <div className="absolute bottom-0 flex gap-1.5">
            <motion.span 
              className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-purple-600/10 text-gray-700 border border-gray-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              Auto-scaling
            </motion.span>
            <motion.span 
              className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-purple-600/10 text-gray-700 border border-gray-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, delay: 0.4, repeat: Infinity }}
            >
              AI Optimizing
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemScalingVisual;
