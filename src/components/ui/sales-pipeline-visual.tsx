"use client"

import { motion } from "framer-motion"
import { Users, Target, TrendingUp, BarChart3, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SalesPipelineVisualProps {
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

export const SalesPipelineVisual = ({
  className,
  circleText = "Sales",
  badgeTexts = {
    first: "Leads",
    second: "Qualify",
    third: "Forecast",
    fourth: "Pipeline"
  },
  badgeIcons = {
    first: Users,
    second: Target,
    third: TrendingUp,
    fourth: BarChart3
  },
  lightColor = "hsl(var(--primary))"
}: SalesPipelineVisualProps) => {
  const IconFirst = badgeIcons.first || Users
  const IconSecond = badgeIcons.second || Target
  const IconThird = badgeIcons.third || TrendingUp
  const IconFourth = badgeIcons.fourth || BarChart3

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

        {/* SVG Funnel with flowing dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 100" className="w-full h-full" style={{ maxWidth: '800px' }}>
            <defs>
              <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Funnel shape - trapezoid */}
            <path
              d="M 60 25 L 140 25 L 120 75 L 80 75 Z"
              fill="url(#funnelGradient)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.5"
            />
            
            {/* Stage dividers */}
            <line x1="65" y1="37.5" x2="135" y2="37.5" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.4" />
            <line x1="70" y1="50" x2="130" y2="50" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.4" />
            <line x1="75" y1="62.5" x2="125" y2="62.5" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.4" />
            
            {/* Animated dots flowing through funnel */}
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.circle
                key={index}
                cx="100"
                cy="25"
                r="2"
                fill={lightColor}
                initial={{ cy: 25, opacity: 0.8 }}
                animate={{ cy: 75, opacity: 0.2 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Stage labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none">
          <div className="text-xs font-medium text-gray-900 opacity-60">Leads</div>
          <div className="text-xs font-medium text-gray-900 opacity-60">Qualified</div>
          <div className="text-xs font-medium text-gray-900 opacity-60">Opportunity</div>
          <div className="text-xs font-medium text-gray-900 opacity-60">Closed</div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">AI Scoring</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur">
            <span className="text-sm font-medium text-gray-900">Auto Nurture</span>
          </div>
        </div>
      </div>
    </div>
  )
}
