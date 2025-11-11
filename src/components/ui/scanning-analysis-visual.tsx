import { motion } from "framer-motion";
import { Check, AlertTriangle, Circle } from "lucide-react";

export const ScanningAnalysisVisual = () => {
  const checklist = [
    { label: "System check", status: "success" as const },
    { label: "Process check", status: "success" as const },
    { label: "Speed check", status: "warning" as const },
    { label: "Manual work", status: "error" as const },
    { label: "Repetitive task", status: "error" as const },
  ];

  return (
    <div className="relative h-[280px] w-full flex items-center justify-between gap-8 px-8 bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl">
      {/* Left side: Circular Radar Scanner */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-[150px] h-[150px]">
          {/* Concentric circles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 150 150">
            <circle
              cx="75"
              cy="75"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300"
              opacity="0.3"
            />
            <circle
              cx="75"
              cy="75"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300"
              opacity="0.3"
            />
            <circle
              cx="75"
              cy="75"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300"
              opacity="0.3"
            />
            
            {/* Animated scanning beam */}
            <motion.line
              x1="75"
              y1="75"
              x2="75"
              y2="5"
              stroke="url(#radarGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity,
              }}
              style={{ transformOrigin: "75px 75px" }}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full">
            <motion.div
              className="absolute inset-0 bg-indigo-400 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>
        </div>

        {/* Status text */}
        <p className="mt-4 text-sm text-gray-600 font-medium">Analyzing workflows...</p>
      </div>

      {/* Right side: Workflow Checklist */}
      <div className="flex-1 space-y-3">
        {checklist.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Status icon */}
            <div className="flex-shrink-0">
              {item.status === "success" && (
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                </div>
              )}
              {item.status === "warning" && (
                <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                </div>
              )}
              {item.status === "error" && (
                <motion.div
                  className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <Circle className="w-3 h-3 text-red-600 fill-red-600" />
                </motion.div>
              )}
            </div>

            {/* Label */}
            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScanningAnalysisVisual;
