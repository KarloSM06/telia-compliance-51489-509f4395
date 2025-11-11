"use client"

import { motion } from "framer-motion";
import { MessageSquare, Workflow, BarChart, Check, ArrowUp, CheckCircle2 } from "lucide-react";

export const SystemScalingVisual = () => {
  const scalingChecklist = [
    { label: "Performance Monitoring", completed: true },
    { label: "Load Balancing", completed: true },
    { label: "Resource Allocation", completed: true },
    { label: "Error Tracking", completed: false },
    { label: "System Optimization", completed: false },
  ];

  const systems = [
    {
      icon: MessageSquare,
      label: "AI Assistant",
      status: "Efficiency +25%",
      indicator: "progress" as const,
      progress: 75,
    },
    {
      icon: Workflow,
      label: "Workflow Engine",
      status: "Update available",
      indicator: "arrow" as const,
    },
    {
      icon: BarChart,
      label: "Analytics System",
      status: "Real-time active",
      indicator: "check" as const,
    },
  ];

  return (
    <div className="h-[500px] w-full max-w-[900px] mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg p-8">
      <div className="grid grid-cols-[1fr_2fr] gap-8 h-full">
        {/* Left Sidebar - Scaling Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
            Scaling Tasks
          </h3>
          {scalingChecklist.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="flex items-center gap-3 group cursor-pointer hover:bg-white/60 rounded-lg p-2 transition-all"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                item.completed 
                  ? 'border-2 border-gray-400' 
                  : 'border-2 border-gray-300'
              }`}>
                {item.completed && (
                  <CheckCircle2 className="w-3 h-3 text-foreground/75" strokeWidth={1.5} />
                )}
              </div>
              <span className={`text-sm ${item.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right Side - Central System Animation */}
        <div className="relative flex flex-col items-center justify-center">
          {/* System Cards with Vertical Flow */}
          <div className="relative h-full w-full flex flex-col items-center justify-center gap-6">
            {systems.map((system, idx) => (
              <motion.div
                key={system.label}
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                  y: [0, 20, 0],
                  opacity: 1 
                }}
                transition={{
                  y: {
                    duration: 3,
                    delay: idx * 0.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut"
                  },
                  opacity: {
                    duration: 0.5,
                    delay: idx * 0.5
                  }
                }}
                className="relative bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-lg w-64"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/60 border border-gray-200">
                    <system.icon className="size-8 text-foreground/75" strokeWidth={1} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{system.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {system.indicator === "progress" && (
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              className="text-gray-200"
                            />
                            <motion.circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round"
                              className="text-gray-900"
                              initial={{ strokeDasharray: "0 125.6" }}
                              animate={{
                                strokeDasharray: `${(system.progress / 100) * 125.6} 125.6`,
                              }}
                              transition={{ 
                                duration: 1.5, 
                                type: "spring",
                                stiffness: 100,
                                damping: 10
                              }}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                            {system.progress}%
                          </span>
                        </div>
                      )}

                      {system.indicator === "arrow" && (
                        <motion.div
                          className="w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center"
                          animate={{
                            y: [0, -6, 0],
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        >
                          <ArrowUp className="w-5 h-5 text-foreground/75" strokeWidth={1} />
                        </motion.div>
                      )}

                      {system.indicator === "check" && (
                        <motion.div
                          className="w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center"
                          initial={{ scale: 0, opacity: 0, rotate: 0 }}
                          animate={{ scale: 1, opacity: 1, rotate: 360 }}
                          transition={{ 
                            delay: 0.5, 
                            type: "spring", 
                            stiffness: 200,
                            damping: 15
                          }}
                        >
                          <Check className="w-5 h-5 text-foreground/75" strokeWidth={1} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
              <motion.path
                d="M 200 150 L 200 250 L 200 350"
                stroke="url(#scaling-gradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 1,
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
          <div className="absolute bottom-0 flex gap-2">
            <motion.span 
              className="text-xs px-3 py-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-purple-600/10 text-gray-700 border border-gray-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              System Monitoring
            </motion.span>
            <motion.span 
              className="text-xs px-3 py-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-purple-600/10 text-gray-700 border border-gray-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
            >
              Auto-scaling Active
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemScalingVisual;
