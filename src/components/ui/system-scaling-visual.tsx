import { motion } from "framer-motion";
import { MessageSquare, Workflow, BarChart, Check, ArrowUp } from "lucide-react";

export const SystemScalingVisual = () => {
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
    <div className="relative h-full w-full flex flex-col justify-center gap-3 md:gap-4 lg:gap-6 px-4 md:px-6 lg:px-8 bg-white/50 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg">
      {systems.map((system, index) => (
        <motion.div
          key={system.label}
          className="flex items-center justify-between p-3 md:p-4 lg:p-6 min-h-[60px] md:min-h-[70px] bg-white/80 backdrop-blur-xl border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:rotate-[0.5deg]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: [0, -2, 0]
          }}
          transition={{ 
            delay: index * 0.15,
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Left side: Icon + Text */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            {/* Icon - standard style matching homepage */}
            <system.icon className="size-6 md:size-8 lg:size-10 text-foreground/75" strokeWidth={1} />

            {/* Text */}
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-gray-900">{system.label}</span>
              <span className="text-xs md:text-sm text-gray-700">{system.status}</span>
            </div>
          </div>

          {/* Right side: Indicator - RESPONSIVE */}
          <div className="flex-shrink-0">
            {system.indicator === "progress" && (
              <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" style={{ filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))" }}>
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Animated progress circle with elastic bounce */}
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="text-indigo-600"
                    initial={{ strokeDasharray: "0 175.84" }}
                    animate={{
                      strokeDasharray: `${(system.progress / 100) * 175.84} 175.84`,
                    }}
                    transition={{ 
                      duration: 1.5, 
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                  />
                </svg>
                {/* Percentage text */}
                <span className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-indigo-600">
                  {system.progress}%
                </span>
              </div>
            )}

            {system.indicator === "arrow" && (
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                style={{ filter: "drop-shadow(0 0 12px rgba(249, 115, 22, 0.4))" }}
              >
                <motion.div
                  animate={{
                    opacity: [1, 0.6, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowUp className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-orange-600" strokeWidth={2.5} />
                </motion.div>
              </motion.div>
            )}

            {system.indicator === "check" && (
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                transition={{ 
                  delay: 0.5, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15
                }}
                style={{ filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 0.4))" }}
              >
                <Check className="w-6 h-6 md:w-7 md:h-7 text-green-600" strokeWidth={2.5} />
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemScalingVisual;
