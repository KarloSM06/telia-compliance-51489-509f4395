import { useRef, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; size?: number; delay?: number }
>(({ className, size = 10, delay = 0 }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "z-30 flex items-center justify-center rounded-full border-2 shadow-lg",
        className
      )}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
});

Circle.displayName = "Circle";

export default function AIBuildVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Input layer (3 nodes)
  const input1Ref = useRef<HTMLDivElement>(null);
  const input2Ref = useRef<HTMLDivElement>(null);
  const input3Ref = useRef<HTMLDivElement>(null);
  
  // Hidden layer (4 nodes)
  const hidden1Ref = useRef<HTMLDivElement>(null);
  const hidden2Ref = useRef<HTMLDivElement>(null);
  const hidden3Ref = useRef<HTMLDivElement>(null);
  const hidden4Ref = useRef<HTMLDivElement>(null);
  
  // Output layer (3 nodes)
  const output1Ref = useRef<HTMLDivElement>(null);
  const output2Ref = useRef<HTMLDivElement>(null);
  const output3Ref = useRef<HTMLDivElement>(null);

  const inputNodes = [input1Ref, input2Ref, input3Ref];
  const hiddenNodes = [hidden1Ref, hidden2Ref, hidden3Ref, hidden4Ref];
  const outputNodes = [output1Ref, output2Ref, output3Ref];

  return (
    <div
      ref={containerRef}
      className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200 p-6"
    >
      {/* Input Layer - Design inputs */}
      <div className="absolute left-[20%] top-1/2 -translate-y-1/2 flex flex-col gap-12">
        <Circle ref={input1Ref} size={10} delay={0} className="bg-teal-400/20 border-teal-400" />
        <Circle ref={input2Ref} size={10} delay={0.15} className="bg-teal-400/20 border-teal-400" />
        <Circle ref={input3Ref} size={10} delay={0.3} className="bg-teal-400/20 border-teal-400" />
      </div>

      {/* Hidden Layer - Processing core */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-8">
        <Circle ref={hidden1Ref} size={10} delay={0.45} className="bg-cyan-500/25 border-cyan-500" />
        <Circle ref={hidden2Ref} size={10} delay={0.6} className="bg-cyan-500/25 border-cyan-500" />
        <Circle ref={hidden3Ref} size={10} delay={0.75} className="bg-cyan-500/25 border-cyan-500" />
        <Circle ref={hidden4Ref} size={10} delay={0.9} className="bg-cyan-500/25 border-cyan-500" />
      </div>

      {/* Output Layer - Deployed systems */}
      <div className="absolute right-[20%] top-1/2 -translate-y-1/2 flex flex-col gap-12">
        <Circle ref={output1Ref} size={10} delay={1.05} className="bg-blue-600/20 border-blue-600" />
        <Circle ref={output2Ref} size={10} delay={1.2} className="bg-blue-600/20 border-blue-600" />
        <Circle ref={output3Ref} size={10} delay={1.35} className="bg-blue-600/20 border-blue-600" />
      </div>

      {/* Animated Beams: Input → Hidden (full mesh) */}
      {inputNodes.map((inputRef, i) =>
        hiddenNodes.map((hiddenRef, j) => (
          <AnimatedBeam
            key={`input-${i}-hidden-${j}`}
            containerRef={containerRef}
            fromRef={inputRef}
            toRef={hiddenRef}
            curvature={-60 + (i + j) * 15}
            duration={3.5 + (i + j) * 0.1}
            gradientStartColor="#2dd4bf"
            gradientStopColor="#06b6d4"
            pathOpacity={0.15}
          />
        ))
      )}

      {/* Animated Beams: Hidden → Output (full mesh) */}
      {hiddenNodes.map((hiddenRef, i) =>
        outputNodes.map((outputRef, j) => (
          <AnimatedBeam
            key={`hidden-${i}-output-${j}`}
            containerRef={containerRef}
            fromRef={hiddenRef}
            toRef={outputRef}
            curvature={-50 + (i + j) * 12}
            duration={4 + (i + j) * 0.1}
            gradientStartColor="#06b6d4"
            gradientStopColor="#2563eb"
            pathOpacity={0.15}
          />
        ))
      )}
    </div>
  );
}
