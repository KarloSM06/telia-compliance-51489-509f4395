import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { expertiseCategories } from "@/data/expertise";

// Samla alla program-logotyper från expertise data
const ALL_PROGRAMS = expertiseCategories.flatMap(cat => cat.items.filter(item => item.logo).map(item => ({
  name: item.name,
  logo: item.logo!
})));
export const IntegrationConnectionVisual = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotera mellan olika integrationer var 3:e sekund
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ALL_PROGRAMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const currentProgram = ALL_PROGRAMS[currentIndex];
  return <div className="relative h-auto min-h-[200px] md:h-[280px] w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 lg:gap-16 px-2 md:px-6 lg:px-8 bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg overflow-hidden">
      {/* Left: Animated Orb - "Our Solution" */}
      <div className="flex flex-col items-center gap-2 md:gap-3 z-10">
        <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px]">
          {/* Outer expanding rings */}
          <motion.div className="absolute inset-0 rounded-full border-2 border-indigo-400" animate={{
          scale: [1, 1.5, 2],
          opacity: [0.6, 0.3, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut"
        }} />
          <motion.div className="absolute inset-0 rounded-full border-2 border-purple-400" animate={{
          scale: [1, 1.5, 2],
          opacity: [0.6, 0.3, 0]
        }} transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5
        }} />
          <motion.div className="absolute inset-0 rounded-full border-2 border-violet-400" animate={{
          scale: [1, 1.5, 2],
          opacity: [0.6, 0.3, 0]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1
        }} />

          {/* Main orb with gradient and rotation */}
          <motion.div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 shadow-lg" animate={{
          rotate: 360
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }} style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(99, 102, 241, 1) 30%, rgba(139, 92, 246, 1) 60%, rgba(109, 40, 217, 1))"
        }} />

          {/* Inner glow - pulsating */}
          <motion.div className="absolute inset-[15px] md:inset-[20px] rounded-full bg-white/40" animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
        </div>
        <span className="text-xs md:text-sm font-medium text-gray-900">Our Solution</span>
      </div>

      {/* Connecting beams - RESPONSIVE SVG WITH VIEWBOX */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 240 280" preserveAspectRatio="xMidYMid meet">
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

        {/* Top curved path - HIDDEN ON MOBILE */}
        <motion.path 
          className="hidden sm:block"
          d="M 0 80 Q 120 40, 240 80" 
          stroke="url(#gradient1)" 
          strokeWidth="1.5" 
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
          strokeWidth="2" 
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
          strokeWidth="1.5" 
          fill="none" 
          strokeDasharray="5 5" 
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -10 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
      </svg>

      {/* Right: Rotating Integration Logos */}
      <div className="flex flex-col items-center gap-2 md:gap-3 z-10">
        <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px]">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{
            opacity: 0,
            scale: 0.8,
            rotateY: -90
          }} animate={{
            opacity: 1,
            scale: 1,
            rotateY: 0
          }} exit={{
            opacity: 0,
            scale: 0.8,
            rotateY: 90
          }} transition={{
            duration: 0.5,
            ease: "easeInOut"
          }} className="absolute inset-0 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-lg p-2 md:p-3">
              <img src={currentProgram.logo} alt={currentProgram.name} className="w-full h-full object-contain" loading="lazy" decoding="async" />
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.span key={currentIndex} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} transition={{
          duration: 0.3
        }} className="text-xs md:text-sm font-medium text-gray-900">
            {currentProgram.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>;
};
export default IntegrationConnectionVisual;