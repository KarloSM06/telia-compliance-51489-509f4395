"use client"

import { motion } from "framer-motion"
import { Puzzle, Link2, Workflow, ArrowUpRight, Database, Cloud, Zap, Server, GitBranch, Globe, Box, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef } from "react"
import { AnimatedBeam } from "@/components/magicui/animated-beam"

interface IntegrationHubVisualProps {
  className?: string
  circleText?: string
  badgeTexts?: {
    first?: string
    second?: string
    third?: string
    fourth?: string
  }
  badgeIcons?: {
    first?: LucideIcon
    second?: LucideIcon
    third?: LucideIcon
    fourth?: LucideIcon
  }
  lightColor?: string
}

export const IntegrationHubVisual = ({
  className,
  circleText = "Hub",
  badgeTexts = {
    first: "Custom",
    second: "API",
    third: "Workflow",
    fourth: "Scale"
  },
  badgeIcons = {
    first: Puzzle,
    second: Link2,
    third: Workflow,
    fourth: ArrowUpRight
  },
  lightColor = "hsl(var(--primary))"
}: IntegrationHubVisualProps) => {
  const IconFirst = badgeIcons.first || Puzzle
  const IconSecond = badgeIcons.second || Link2
  const IconThird = badgeIcons.third || Workflow
  const IconFourth = badgeIcons.fourth || ArrowUpRight

  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  
  // Refs for 8 peripheral nodes
  const node1Ref = useRef<HTMLDivElement>(null)
  const node2Ref = useRef<HTMLDivElement>(null)
  const node3Ref = useRef<HTMLDivElement>(null)
  const node4Ref = useRef<HTMLDivElement>(null)
  const node5Ref = useRef<HTMLDivElement>(null)
  const node6Ref = useRef<HTMLDivElement>(null)
  const node7Ref = useRef<HTMLDivElement>(null)
  const node8Ref = useRef<HTMLDivElement>(null)

  const nodeRefs = [node1Ref, node2Ref, node3Ref, node4Ref, node5Ref, node6Ref, node7Ref, node8Ref]
  const nodeIcons = [Database, Cloud, Workflow, Zap, Server, GitBranch, Globe, Box]
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <div className={cn("h-[500px] w-full max-w-[900px] mx-auto", className)}>
      <div className="relative h-full w-full overflow-hidden">
        
        {/* Top Badges Row */}
        <div className="flex justify-center gap-4 mb-8 pt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <IconFirst className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.first}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <IconSecond className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.second}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <IconThird className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.third}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <IconFourth className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.fourth}</span>
          </div>
        </div>

        {/* Hub and Spoke Layout with AnimatedBeam */}
        <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[600px] h-[600px] max-w-full">
            
            {/* Peripheral nodes positioned in a circle */}
            {nodeRefs.map((ref, index) => {
              const angle = angles[index]
              const radius = 45 // percentage from center
              const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180)
              const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180)
              const NodeIcon = nodeIcons[index]
              
              return (
                <div
                  key={index}
                  ref={ref}
                  className="absolute flex items-center justify-center w-16 h-16 border-2 border-primary/30 bg-primary/10 backdrop-blur-md rounded-xl shadow-lg"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <NodeIcon className="w-6 h-6 text-primary" />
                </div>
              )
            })}

            {/* Central Hub with concentric circles */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {/* Pulsing concentric rings */}
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/20"
                  style={{
                    width: `${112 + index * 32}px`,
                    height: `${112 + index * 32}px`
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.7,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              <div
                ref={centerRef}
                className="relative flex items-center justify-center w-28 h-28 border-2 border-primary/30 bg-primary/20 backdrop-blur-md rounded-2xl shadow-lg pointer-events-auto"
              >
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
                <span className="relative text-sm font-medium text-gray-900 text-center px-2">{circleText}</span>
              </div>
            </div>

            {/* AnimatedBeams connecting peripheral nodes to center */}
            {nodeRefs.map((ref, index) => (
              <AnimatedBeam
                key={index}
                containerRef={containerRef}
                fromRef={index < 4 ? ref : centerRef}
                toRef={index < 4 ? centerRef : ref}
                curvature={index % 2 === 0 ? 50 : -50}
                duration={3 + (index % 3)}
                pathColor="hsl(var(--primary))"
                gradientStartColor={lightColor}
                gradientStopColor={lightColor}
                pathOpacity={0.3}
                reverse={index >= 4}
              />
            ))}
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">Real-time Sync</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">API First</span>
          </div>
        </div>
      </div>
    </div>
  )
}
