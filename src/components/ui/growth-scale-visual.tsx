import { useRef, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; size?: number; pulse?: boolean; delay?: number }
>(({ className, size = 10, pulse = false, delay = 0 }, ref) => {
  const Component = pulse ? motion.div : "div";
  const props = pulse
    ? {
        animate: { scale: [1, 1.15, 1] },
        transition: { duration: 2, repeat: Infinity, delay },
      }
    : {};

  return (
    <Component
      ref={ref}
      {...props}
      className={cn(
        "z-30 flex items-center justify-center rounded-full border-2 shadow-lg",
        className
      )}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
});

Circle.displayName = "Circle";

export default function GrowthScaleVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Center node - initial system
  const centerRef = useRef<HTMLDivElement>(null);
  
  // Inner ring (4 nodes) - first scaling phase
  const inner1Ref = useRef<HTMLDivElement>(null);
  const inner2Ref = useRef<HTMLDivElement>(null);
  const inner3Ref = useRef<HTMLDivElement>(null);
  const inner4Ref = useRef<HTMLDivElement>(null);
  
  // Outer ring (8 nodes) - expanded network
  const outer1Ref = useRef<HTMLDivElement>(null);
  const outer2Ref = useRef<HTMLDivElement>(null);
  const outer3Ref = useRef<HTMLDivElement>(null);
  const outer4Ref = useRef<HTMLDivElement>(null);
  const outer5Ref = useRef<HTMLDivElement>(null);
  const outer6Ref = useRef<HTMLDivElement>(null);
  const outer7Ref = useRef<HTMLDivElement>(null);
  const outer8Ref = useRef<HTMLDivElement>(null);

  const innerNodes = [inner1Ref, inner2Ref, inner3Ref, inner4Ref];
  const outerNodes = [outer1Ref, outer2Ref, outer3Ref, outer4Ref, outer5Ref, outer6Ref, outer7Ref, outer8Ref];

  // Positions for inner ring (cross formation)
  const innerPositions = [
    { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }, // 12 o'clock
    { top: '50%', left: '80%', transform: 'translate(-50%, -50%)' }, // 3 o'clock
    { top: '80%', left: '50%', transform: 'translate(-50%, -50%)' }, // 6 o'clock
    { top: '50%', left: '20%', transform: 'translate(-50%, -50%)' }, // 9 o'clock
  ];

  // Positions for outer ring (8 directions)
  const outerPositions = [
    { top: '8%', left: '50%', transform: 'translate(-50%, -50%)' },    // N
    { top: '20%', left: '80%', transform: 'translate(-50%, -50%)' },   // NE
    { top: '50%', left: '92%', transform: 'translate(-50%, -50%)' },   // E
    { top: '80%', left: '80%', transform: 'translate(-50%, -50%)' },   // SE
    { top: '92%', left: '50%', transform: 'translate(-50%, -50%)' },   // S
    { top: '80%', left: '20%', transform: 'translate(-50%, -50%)' },   // SW
    { top: '50%', left: '8%', transform: 'translate(-50%, -50%)' },    // W
    { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' },   // NW
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200 p-6"
    >
      {/* Center node - initial system */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Circle ref={centerRef} size={14} className="bg-green-400/25 border-green-400 shadow-xl shadow-green-400/30" />
      </div>

      {/* Inner ring nodes - first scaling phase */}
      {innerNodes.map((ref, i) => (
        <div key={`inner-${i}`} className="absolute" style={innerPositions[i]}>
          <Circle ref={ref} size={9} className="bg-emerald-500/20 border-emerald-500" />
        </div>
      ))}

      {/* Outer ring nodes - expanded network */}
      {outerNodes.map((ref, i) => (
        <motion.div
          key={`outer-${i}`}
          className="absolute"
          style={outerPositions[i]}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 + i * 0.2 }}
        >
          <Circle ref={ref} size={8} pulse className="bg-teal-600/20 border-teal-600" delay={i * 0.2} />
        </motion.div>
      ))}

      {/* Animated Beams: Center → Inner ring */}
      {innerNodes.map((innerRef, i) => (
        <AnimatedBeam
          key={`center-inner-${i}`}
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={innerRef}
          curvature={0}
          duration={4}
          gradientStartColor="#4ade80"
          gradientStopColor="#10b981"
        />
      ))}

      {/* Animated Beams: Inner ring → Outer ring (chained growth) */}
      {innerNodes.map((innerRef, i) => {
        // Each inner node connects to 2 outer nodes
        const outerIndex1 = i * 2;
        const outerIndex2 = i * 2 + 1;
        
        return (
          <>
            <AnimatedBeam
              key={`inner-${i}-outer-${outerIndex1}`}
              containerRef={containerRef}
              fromRef={innerRef}
              toRef={outerNodes[outerIndex1]}
              curvature={0}
              duration={5}
              gradientStartColor="#10b981"
              gradientStopColor="#0d9488"
            />
            <AnimatedBeam
              key={`inner-${i}-outer-${outerIndex2}`}
              containerRef={containerRef}
              fromRef={innerRef}
              toRef={outerNodes[outerIndex2]}
              curvature={0}
              duration={4.5}
              gradientStartColor="#10b981"
              gradientStopColor="#0d9488"
            />
          </>
        );
      })}
    </div>
  );
}
