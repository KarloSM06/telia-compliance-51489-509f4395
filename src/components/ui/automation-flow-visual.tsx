"use client"

import { motion } from "framer-motion"
import { FileText, Mail, Calendar, FolderOpen, ArrowDown, Check, Zap, Send, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutomationFlowVisualProps {
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

export const AutomationFlowVisual = ({
  className,
  circleText = "Auto",
  badgeTexts = {
    first: "Invoice",
    second: "Email",
    third: "Calendar",
    fourth: "Docs"
  },
  badgeIcons = {
    first: FileText,
    second: Mail,
    third: Calendar,
    fourth: FolderOpen
  },
  lightColor = "hsl(var(--primary))"
}: AutomationFlowVisualProps) => {
  const IconFirst = badgeIcons.first || FileText
  const IconSecond = badgeIcons.second || Mail
  const IconThird = badgeIcons.third || Calendar
  const IconFourth = badgeIcons.fourth || FolderOpen

  // Stage positions on circular path (0°, 90°, 180°, 270°)
  const stages = [
    { angle: 0, icon: ArrowDown, label: "Input" },
    { angle: 90, icon: Zap, label: "Process" },
    { angle: 180, icon: Check, label: "Validate" },
    { angle: 270, icon: Send, label: "Output" }
  ]

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

        {/* SVG Circular Flow with multiple animated lights and stage indicators */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ maxWidth: '600px' }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.1" />
              </linearGradient>
              <radialGradient id="glowGradient">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Circular path */}
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              opacity="0.5"
            />
            
            {/* Stage indicator nodes on the path */}
            {stages.map((stage, index) => {
              const x = 100 + 60 * Math.cos((stage.angle - 90) * Math.PI / 180)
              const y = 100 + 60 * Math.sin((stage.angle - 90) * Math.PI / 180)
              
              return (
                <g key={index}>
                  {/* Pulsing circle */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={lightColor}
                    opacity="0.3"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={lightColor}
                    opacity="0.8"
                  />
                </g>
              )
            })}
            
            {/* Multiple animated lights moving along the path - clockwise */}
            {[0, 1, 2].map((index) => (
              <motion.circle
                key={`cw-${index}`}
                cx="160"
                cy="100"
                r="3"
                fill={lightColor}
                initial={{ rotate: index * 120 }}
                animate={{ rotate: index * 120 + 360 }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 1.2
                }}
                style={{
                  originX: "100px",
                  originY: "100px"
                }}
              />
            ))}
            
            {/* Counter-clockwise lights for bi-directional flow */}
            {[0, 1].map((index) => (
              <motion.circle
                key={`ccw-${index}`}
                cx="160"
                cy="100"
                r="2.5"
                fill={lightColor}
                opacity="0.6"
                initial={{ rotate: index * 180 }}
                animate={{ rotate: index * 180 - 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 2
                }}
                style={{
                  originX: "100px",
                  originY: "100px"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Central Automation Engine Box with concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Concentric pulsing rings */}
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="absolute rounded-full border-2 border-primary/20"
              style={{
                width: `${80 + index * 24}px`,
                height: `${80 + index * 24}px`
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
          
          {/* Central box with glow */}
          <div className="relative flex items-center justify-center w-24 h-24 border-2 border-primary/30 bg-primary/20 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
            <span className="relative text-sm font-medium text-gray-900 text-center px-2">{circleText}</span>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">24/7 Active</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">Zero Errors</span>
          </div>
        </div>
      </div>
    </div>
  )
}
