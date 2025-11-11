"use client"

import { motion } from "framer-motion";
import { CheckCircle2, Circle, FileText, Mail, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkflowChecklistVisualProps {
  className?: string;
}

export const WorkflowChecklistVisual: React.FC<WorkflowChecklistVisualProps> = ({ className = "" }) => {
  const isMobile = useIsMobile();
  const workflowItems = [
    { label: "Smart Analysering", completed: true },
    { label: "Lead Generation", completed: true },
    { label: "Payment Reminder", completed: true },
    { label: "Reporting", completed: false },
    { label: "Payroll Update", completed: false },
  ];

  const workflowCards = [
    { icon: FileText, label: "Invoice Processing" },
    { icon: Mail, label: "Email Follow-up" },
    { icon: Send, label: "Complete" },
  ];

  return (
    <div className={`h-auto min-h-[300px] md:h-[500px] w-full max-w-[900px] mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg p-6 md:p-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 md:gap-8 h-full">
        {/* Left Sidebar - Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
            Workflow Tasks
          </h3>
          {workflowItems.map((item, idx) => (
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

        {/* Right Side - Central Workflow Animation */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Workflow Cards with Vertical Flow */}
          <div className="relative h-full w-full flex flex-col items-center justify-center gap-4 md:gap-6">
            {workflowCards.map((card, idx) => (
              <motion.div
                key={idx}
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
                    <card.icon className="size-8 text-foreground/75" strokeWidth={1} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {idx === 2 ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-foreground/75" strokeWidth={1.5} />
                          <span className="text-xs text-gray-600">Complete</span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-xs text-gray-600">Processing...</span>
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
                d="M 200 150 L 200 250 L 200 350"
                stroke="url(#workflow-gradient)"
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
                <linearGradient id="workflow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
              Auto-triggered
            </motion.span>
            <motion.span 
              className="text-xs px-3 py-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-purple-600/10 text-gray-700 border border-gray-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
            >
              AI Processing
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};
