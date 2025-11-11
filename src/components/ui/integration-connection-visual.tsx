import { motion } from "framer-motion";
import { Layers } from "lucide-react";

export const IntegrationConnectionVisual = () => {
  return (
    <div className="relative h-[280px] w-full flex items-center justify-center gap-16 px-8 bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg">
      {/* Left: Animated Orb - "Our Solution" */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-[80px] h-[80px]">
          {/* Outer expanding rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-indigo-400"
            animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400"
            animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-violet-400"
            animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1 }}
          />

          {/* Main orb with gradient and rotation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(99, 102, 241, 1) 30%, rgba(139, 92, 246, 1) 60%, rgba(109, 40, 217, 1))",
            }}
          />

          {/* Inner glow - pulsating */}
          <motion.div
            className="absolute inset-[20px] rounded-full bg-white/40"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900">Our Solution</span>
      </div>

      {/* Connecting beams with animated particles */}
      <div className="relative flex-1 h-full flex items-center">
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
          {/* Top curved path */}
          <motion.path
            d="M 0 80 Q 120 40, 240 80"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 5"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -10 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle straight path */}
          <motion.path
            d="M 0 140 L 240 140"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 4"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -12 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Bottom curved path */}
          <motion.path
            d="M 0 200 Q 120 240, 240 200"
            stroke="url(#gradient3)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 5"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -10 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />

          {/* Gradients for beams */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.6)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.2)" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.3)" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.6)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.2)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated particles on paths */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-indigo-500"
          animate={{ x: [0, 240], y: [80, 40, 80] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-purple-500"
          animate={{ x: [0, 240] }}
          style={{ top: "140px" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-violet-500"
          animate={{ x: [0, 240], y: [200, 240, 200] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Right: Tech Stack Icon */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-[80px] h-[80px] rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Layers className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
        </motion.div>
        <span className="text-sm font-medium text-gray-900">Your Stack</span>
      </div>
    </div>
  );
};

export default IntegrationConnectionVisual;
