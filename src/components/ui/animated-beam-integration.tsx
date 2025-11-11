import { forwardRef, useRef } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/magicui/animated-beam"
import { Database, Cloud, Workflow, Zap, Server, GitBranch } from "lucide-react"

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-3 shadow-md",
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

Circle.displayName = "Circle"

export default function AnimatedBeamIntegration() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-lg bg-white/40 p-6"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Database className="size-5 text-gray-700" />
          </Circle>
          <Circle ref={div5Ref}>
            <Cloud className="size-5 text-gray-700" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Workflow className="size-5 text-gray-700" />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <Server className="size-7 text-gray-900" />
          </Circle>
          <Circle ref={div6Ref}>
            <Zap className="size-5 text-gray-700" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <GitBranch className="size-5 text-gray-700" />
          </Circle>
          <Circle ref={div7Ref}>
            <Server className="size-5 text-gray-700" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam 
        containerRef={containerRef} 
        fromRef={div1Ref} 
        toRef={div4Ref} 
        curvature={-75} 
        endYOffset={-10}
        gradientStartColor="#6366f1"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam 
        containerRef={containerRef} 
        fromRef={div2Ref} 
        toRef={div4Ref}
        gradientStartColor="#6366f1"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam 
        containerRef={containerRef} 
        fromRef={div3Ref} 
        toRef={div4Ref} 
        curvature={75} 
        endYOffset={10}
        gradientStartColor="#6366f1"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
        gradientStartColor="#6366f1"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam 
        containerRef={containerRef} 
        fromRef={div6Ref} 
        toRef={div4Ref} 
        reverse
        gradientStartColor="#6366f1"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
        gradientStartColor="#6366f1"
        gradientStopColor="#8b5cf6"
      />
    </div>
  )
}
