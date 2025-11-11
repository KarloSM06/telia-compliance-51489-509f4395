"use client"

import { motion } from "framer-motion"
import { FileText, Mail, Calendar, FolderOpen, type LucideIcon } from "lucide-react"
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

        {/* SVG Circular Flow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 100" className="w-full h-full" style={{ maxWidth: '800px' }}>
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0" />
                <stop offset="50%" stopColor={lightColor} stopOpacity="1" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
              </linearGradient>
              <mask id="flowMask">
                <rect width="200" height="100" fill="black" />
                <motion.circle
                  cx="0"
                  cy="0"
                  r="3"
                  fill="white"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ offsetPath: "path('M 60 30 Q 100 20, 140 30 Q 160 40, 160 50 Q 160 60, 140 70 Q 100 80, 60 70 Q 40 60, 40 50 Q 40 40, 60 30')" }}
                />
              </mask>
            </defs>
            
            {/* Circular path */}
            <path
              d="M 60 30 Q 100 20, 140 30 Q 160 40, 160 50 Q 160 60, 140 70 Q 100 80, 60 70 Q 40 60, 40 50 Q 40 40, 60 30"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.3"
            />
            
            {/* Animated light */}
            <path
              d="M 60 30 Q 100 20, 140 30 Q 160 40, 160 50 Q 160 60, 140 70 Q 100 80, 60 70 Q 40 60, 40 50 Q 40 40, 60 30"
              fill="none"
              stroke="url(#flowGradient)"
              strokeWidth="1"
              mask="url(#flowMask)"
            />
          </svg>
        </div>

        {/* Central Circle with Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulsing concentric circles */}
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                style={{
                  width: '80px',
                  height: '80px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.75,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Central box */}
            <div className="relative z-10 w-24 h-24 flex items-center justify-center border-2 border-primary/30 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
              <span className="text-2xl font-display font-normal text-gray-900">{circleText}</span>
            </div>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">AI Engine</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">Auto Trigger</span>
          </div>
        </div>
      </div>
    </div>
  )
}
