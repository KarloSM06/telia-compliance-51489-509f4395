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
    <div className={cn("h-[500px] w-full max-w-[900px] mx-auto p-8", className)}>
      <div className="relative h-full w-full overflow-visible">
        
        {/* Top Badges Row */}
        <div className="flex justify-center gap-4 mb-12 pt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <IconFirst className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.first}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <IconSecond className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.second}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <IconThird className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.third}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <IconFourth className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">{badgeTexts.fourth}</span>
          </div>
        </div>

        {/* SVG Circular Flow with multiple animated lights and stage indicators */}
        <div className="absolute inset-0 flex items-center justify-center py-8">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ maxWidth: '700px' }}>
            {/* SVG Filters */}
            <defs>
              {/* Drop Shadow Filter */}
              <filter id="autoDropShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.1" />
              </linearGradient>
              
              {/* Glow Gradient */}
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
            
            {/* Stage Indicators with enhanced depth and pulsing animation */}
            {stages.map((stage, index) => {
              const x = 100 + 60 * Math.cos((stage.angle - 90) * Math.PI / 180)
              const y = 100 + 60 * Math.sin((stage.angle - 90) * Math.PI / 180)
              
              return (
                <g key={index}>
                  {/* Outer glow ring */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="10" 
                    fill="url(#glowGradient)" 
                    opacity="0.4"
                  />
                  
                  {/* White background circle for contrast */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="8" 
                    fill="white" 
                    opacity="0.9"
                    filter="url(#autoDropShadow)"
                  />
                  
                  {/* Pulsing inner circle */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={lightColor}
                    opacity="0.7"
                    filter="url(#autoDropShadow)"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ 
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.5, 0.9, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
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
            {/* Central Automation Engine Box - Rendered inside SVG with foreignObject */}
            <g>
              {/* Pulsing concentric rings */}
              {[0, 1, 2, 3].map((index) => (
                <motion.circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={40 + index * 12}
                  fill="none"
                  stroke={lightColor}
                  strokeWidth="2"
                  opacity="0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0, 0.6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.7,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Central box with foreignObject */}
              <foreignObject x="75" y="75" width="50" height="50">
                <div className="w-full h-full flex items-center justify-center border-2 border-primary/40 bg-primary/20 backdrop-blur-xl rounded-2xl shadow-xl pointer-events-auto relative">
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
                  <span className="relative text-xs font-medium text-gray-900 text-center px-2">{circleText}</span>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <span className="text-sm font-medium text-gray-900">24/7 Active</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <span className="text-sm font-medium text-gray-900">Zero Downtime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
