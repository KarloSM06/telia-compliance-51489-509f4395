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
    <div className="relative h-[280px] w-full flex flex-col justify-center gap-3 px-6 bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl">
      {systems.map((system, index) => (
        <motion.div
          key={system.label}
          className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
        >
          {/* Left side: Icon + Text */}
          <div className="flex items-center gap-3">
            {/* Icon container */}
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <system.icon className="w-5 h-5 text-indigo-600" strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{system.label}</span>
              <span className="text-xs text-gray-600">{system.status}</span>
            </div>
          </div>

          {/* Right side: Indicator */}
          <div className="flex-shrink-0">
            {system.indicator === "progress" && (
              <div className="relative w-12 h-12">
                {/* Background circle */}
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
                  {/* Animated progress circle */}
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="text-indigo-600"
                    initial={{ strokeDasharray: "0 125.6" }}
                    animate={{
                      strokeDasharray: `${(system.progress / 100) * 125.6} 125.6`,
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
                {/* Percentage text */}
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {system.progress}%
                </span>
              </div>
            )}

            {system.indicator === "arrow" && (
              <motion.div
                className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <ArrowUp className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
              </motion.div>
            )}

            {system.indicator === "check" && (
              <motion.div
                className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemScalingVisual;
