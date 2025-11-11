import { motion } from "framer-motion";
import { Check, AlertTriangle, Circle } from "lucide-react";
export const ScanningAnalysisVisual = () => {
  const checklist = [{
    label: "System check",
    status: "success"
  }, {
    label: "Process check",
    status: "success"
  }, {
    label: "Speed check",
    status: "warning"
  }, {
    label: "Manual work",
    status: "error"
  }, {
    label: "Repetitive task",
    status: "error"
  }];
  return <div className="relative h-auto min-h-[200px] md:h-[280px] w-full flex items-center justify-between gap-4 md:gap-8 px-4 md:px-10 bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg">
      {/* Left side: Circular radar scanner - LARGER */}
      <div className="relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] flex-shrink-0">
        {/* Concentric circles - 4 rings with thicker strokes */}
        <svg className="w-full h-full absolute inset-0">
          <circle cx="90" cy="90" r="85" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
          <circle cx="90" cy="90" r="65" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
          <circle cx="90" cy="90" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
          <circle cx="90" cy="90" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
        </svg>

        {/* Scanning beam - WIDER with gradient and glow */}
        <motion.div className="absolute inset-0" animate={{
        rotate: 360
      }} transition={{
        duration: 4,
        ease: "linear",
        repeat: Infinity
      }} style={{
        filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))"
      }}>
          <div className="absolute top-0 left-1/2 w-2 h-1/2 origin-bottom -translate-x-1/2" style={{
          background: "linear-gradient(180deg, rgba(99, 102, 241, 0) 0%, rgba(99, 102, 241, 1) 30%, rgba(139, 92, 246, 0.8) 60%, rgba(167, 139, 250, 0.3) 100%)"
        }} />
        </motion.div>

        {/* Center pulse - dual rings */}
        
        <motion.div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2" animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.4, 1]
      }} transition={{
        duration: 3,
        repeat: Infinity
      }} />
      </div>

      {/* Right side: Workflow checklist - IMPROVED SPACING */}
      <div className="flex-1 space-y-2 md:space-y-4">
        {checklist.map((item, index) => <motion.div key={item.label} className="flex items-center gap-4 transition-transform duration-200 hover:scale-105" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: index * 0.15
      }}>
            {/* Status icon - LARGER */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.status === "success" ? "bg-green-500/20 text-green-600" : item.status === "warning" ? "bg-orange-500/20 text-orange-600" : "bg-red-500/20 text-red-600"}`}>
              {item.status === "success" && <Check className="w-5 h-5" strokeWidth={2.5} />}
              {item.status === "warning" && <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />}
              {item.status === "error" && <Circle className="w-5 h-5" fill="currentColor" />}
            </div>

            {/* Label - LARGER TEXT */}
            <span className="text-base font-semibold text-gray-900">{item.label}</span>
          </motion.div>)}
      </div>
    </div>;
};
export default ScanningAnalysisVisual;