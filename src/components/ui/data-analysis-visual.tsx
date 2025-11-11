import { useRef, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; size?: number }
>(({ className, size = 12 }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-30 flex items-center justify-center rounded-full border-2 shadow-lg",
        `size-${size}`,
        className
      )}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
});

Circle.displayName = "Circle";

export default function DataAnalysisVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scatter nodes (left) - raw data
  const scatter1Ref = useRef<HTMLDivElement>(null);
  const scatter2Ref = useRef<HTMLDivElement>(null);
  const scatter3Ref = useRef<HTMLDivElement>(null);
  const scatter4Ref = useRef<HTMLDivElement>(null);
  
  // Center node - AI analysis engine
  const centerRef = useRef<HTMLDivElement>(null);
  
  // Insight nodes (right) - identified opportunities
  const insight1Ref = useRef<HTMLDivElement>(null);
  const insight2Ref = useRef<HTMLDivElement>(null);
  const insight3Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200 p-6"
    >
      {/* Scatter nodes - raw data (left side) */}
      <div className="absolute left-[15%] top-[20%]">
        <Circle ref={scatter1Ref} size={8} className="bg-blue-400/20 border-blue-400" />
      </div>
      <div className="absolute left-[18%] top-[45%]">
        <Circle ref={scatter2Ref} size={8} className="bg-blue-400/20 border-blue-400" />
      </div>
      <div className="absolute left-[12%] top-[65%]">
        <Circle ref={scatter3Ref} size={8} className="bg-blue-400/20 border-blue-400" />
      </div>
      <div className="absolute left-[20%] top-[80%]">
        <Circle ref={scatter4Ref} size={8} className="bg-blue-400/20 border-blue-400" />
      </div>

      {/* Center node - AI analysis engine (pulsing) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Circle ref={centerRef} size={16} className="bg-purple-500/30 border-purple-500 shadow-xl shadow-purple-500/50" />
        </motion.div>
        {/* Concentric rings */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-[-20%] rounded-full border border-purple-400/20"
            animate={{ opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-[-40%] rounded-full border border-purple-400/10"
            animate={{ opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Insight nodes - opportunities (right side, pyramid) */}
      <div className="absolute right-[20%] top-[25%]">
        <Circle ref={insight1Ref} size={12} className="bg-indigo-600/20 border-indigo-600" />
      </div>
      <div className="absolute right-[15%] top-[55%]">
        <Circle ref={insight2Ref} size={12} className="bg-indigo-600/20 border-indigo-600" />
      </div>
      <div className="absolute right-[25%] top-[55%]">
        <Circle ref={insight3Ref} size={12} className="bg-indigo-600/20 border-indigo-600" />
      </div>

      {/* Animated Beams: scatter → center */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={scatter1Ref}
        toRef={centerRef}
        curvature={-50}
        duration={3}
        gradientStartColor="#60a5fa"
        gradientStopColor="#a855f7"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={scatter2Ref}
        toRef={centerRef}
        curvature={-20}
        duration={3.5}
        gradientStartColor="#60a5fa"
        gradientStopColor="#a855f7"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={scatter3Ref}
        toRef={centerRef}
        curvature={20}
        duration={3.2}
        gradientStartColor="#60a5fa"
        gradientStopColor="#a855f7"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={scatter4Ref}
        toRef={centerRef}
        curvature={50}
        duration={3.8}
        gradientStartColor="#60a5fa"
        gradientStopColor="#a855f7"
      />

      {/* Animated Beams: center → insights */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={insight1Ref}
        curvature={-40}
        duration={4}
        gradientStartColor="#a855f7"
        gradientStopColor="#4f46e5"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={insight2Ref}
        curvature={0}
        duration={3.5}
        gradientStartColor="#a855f7"
        gradientStopColor="#4f46e5"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={insight3Ref}
        curvature={40}
        duration={4.2}
        gradientStartColor="#a855f7"
        gradientStopColor="#4f46e5"
      />
    </div>
  );
}
