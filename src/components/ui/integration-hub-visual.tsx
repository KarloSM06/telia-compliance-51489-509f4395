"use client"

import { motion } from "framer-motion"
import { Puzzle, Link2, Workflow, ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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

  // 8 radial angles for hub-and-spoke
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <div className={cn("h-[500px] w-full max-w-[900px] mx-auto", className)}>
      <div className="relative h-full w-full border-2 border-primary/20 bg-primary/5 backdrop-blur rounded-3xl p-8 shadow-lg overflow-hidden">
        
        {/* Top Badges Row */}
        <div className="flex justify-center gap-4 mb-8">
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

        {/* SVG Hub-and-Spoke with slow rotation */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 200 100" className="w-full h-full" style={{ maxWidth: '800px' }}>
            <defs>
              <linearGradient id="spokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0" />
                <stop offset="50%" stopColor={lightColor} stopOpacity="1" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
              </linearGradient>
              
              {/* Masks for each spoke with alternating directions */}
              {angles.map((angle, index) => {
                const radian = (angle * Math.PI) / 180
                const endX = 100 + Math.cos(radian) * 40
                const endY = 50 + Math.sin(radian) * 40
                
                return (
                  <mask key={`mask-${angle}`} id={`spokeMask${angle}`}>
                    <rect width="200" height="100" fill="black" />
                    <motion.circle
                      cx={index % 2 === 0 ? 100 : endX}
                      cy={index % 2 === 0 ? 50 : endY}
                      r="2"
                      fill="white"
                      animate={
                        index % 2 === 0
                          ? { cx: endX, cy: endY }
                          : { cx: 100, cy: 50 }
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.25,
                        ease: "easeInOut"
                      }}
                    />
                  </mask>
                )
              })}
            </defs>
            
            {/* 8 Radial spokes with animated lights */}
            {angles.map((angle) => {
              const radian = (angle * Math.PI) / 180
              const endX = 100 + Math.cos(radian) * 40
              const endY = 50 + Math.sin(radian) * 40
              
              return (
                <g key={angle}>
                  {/* Static spoke line */}
                  <line
                    x1="100"
                    y1="50"
                    x2={endX}
                    y2={endY}
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  
                  {/* Animated light on spoke */}
                  <line
                    x1="100"
                    y1="50"
                    x2={endX}
                    y2={endY}
                    stroke="url(#spokeGradient)"
                    strokeWidth="1"
                    mask={`url(#spokeMask${angle})`}
                  />
                  
                  {/* Peripheral node with pulse */}
                  <motion.circle
                    cx={endX}
                    cy={endY}
                    r="3"
                    fill={lightColor}
                    opacity="0.6"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0.9, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: angle / 45 * 0.25,
                      ease: "easeInOut"
                    }}
                  />
                </g>
              )
            })}
          </svg>
        </motion.div>

        {/* Central Hub - non-rotating */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              style={{
                width: '100px',
                height: '100px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Central box */}
            <div className="relative z-10 w-24 h-24 flex items-center justify-center border-2 border-primary/30 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
              <span className="text-2xl font-display font-normal text-gray-900">{circleText}</span>
            </div>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">Smart Router</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">Auto Scale</span>
          </div>
        </div>
      </div>
    </div>
  )
}
