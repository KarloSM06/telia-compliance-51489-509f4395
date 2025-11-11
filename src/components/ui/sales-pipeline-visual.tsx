"use client"

import { motion } from "framer-motion"
import { Users, Target, TrendingUp, BarChart3, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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

  const [counts, setCounts] = useState({ leads: 0, qualified: 0, opportunity: 0, closed: 0 })

  useEffect(() => {
    // Animate counters on mount
    const targets = { leads: 100, qualified: 40, opportunity: 15, closed: 5 }
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      setCounts({
        leads: Math.floor(targets.leads * progress),
        qualified: Math.floor(targets.qualified * progress),
        opportunity: Math.floor(targets.opportunity * progress),
        closed: Math.floor(targets.closed * progress)
      })
      if (currentStep >= steps) {
        setCounts(targets)
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

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

        {/* SVG Curved Funnel with flowing dots and metrics */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 120" className="w-full h-full" style={{ maxWidth: '800px' }}>
            <defs>
              <linearGradient id="funnelGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(220, 90%, 60%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(220, 90%, 50%)" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="funnelGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(230, 85%, 55%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(230, 85%, 45%)" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="funnelGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(240, 80%, 50%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(240, 80%, 40%)" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="funnelGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(250, 75%, 45%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(250, 75%, 35%)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Curved funnel sections with metrics */}
            {/* Stage 1: Leads */}
            <path
              d="M 50 25 Q 50 25, 50 25 L 150 25 Q 150 25, 150 25 L 140 42 Q 100 43, 60 42 Z"
              fill="url(#funnelGradient1)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.6"
            />
            
            {/* Stage 2: Qualified */}
            <path
              d="M 60 42 Q 100 43, 140 42 L 130 59 Q 100 60, 70 59 Z"
              fill="url(#funnelGradient2)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.6"
            />
            
            {/* Stage 3: Opportunity */}
            <path
              d="M 70 59 Q 100 60, 130 59 L 120 76 Q 100 77, 80 76 Z"
              fill="url(#funnelGradient3)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.6"
            />
            
            {/* Stage 4: Closed */}
            <path
              d="M 80 76 Q 100 77, 120 76 L 110 93 Q 100 94, 90 93 Z"
              fill="url(#funnelGradient4)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.7"
            />
            
            {/* Stage icons and labels with metrics */}
            <g>
              <foreignObject x="85" y="28" width="30" height="10">
                <div className="flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary" />
                </div>
              </foreignObject>
              <text x="100" y="52" textAnchor="middle" className="text-xs font-medium fill-gray-900">
                {counts.leads}
              </text>
            </g>
            
            <g>
              <foreignObject x="85" y="45" width="30" height="10">
                <div className="flex items-center justify-center">
                  <Target className="w-3 h-3 text-primary" />
                </div>
              </foreignObject>
              <text x="100" y="69" textAnchor="middle" className="text-xs font-medium fill-gray-900">
                {counts.qualified}
              </text>
              <text x="100" y="78" textAnchor="middle" className="text-[8px] fill-gray-600">
                40%
              </text>
            </g>
            
            <g>
              <foreignObject x="85" y="62" width="30" height="10">
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-primary" />
                </div>
              </foreignObject>
              <text x="100" y="86" textAnchor="middle" className="text-xs font-medium fill-gray-900">
                {counts.opportunity}
              </text>
              <text x="100" y="95" textAnchor="middle" className="text-[8px] fill-gray-600">
                38%
              </text>
            </g>
            
            <g>
              <foreignObject x="85" y="79" width="30" height="10">
                <div className="flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-primary" />
                </div>
              </foreignObject>
              <text x="100" y="103" textAnchor="middle" className="text-xs font-medium fill-gray-900">
                {counts.closed}
              </text>
              <text x="100" y="112" textAnchor="middle" className="text-[8px] fill-gray-600">
                33%
              </text>
            </g>
            
            {/* Multiple animated dots flowing through funnel with random X positions */}
            {Array.from({ length: 20 }).map((_, index) => {
              const randomOffset = (Math.random() - 0.5) * 30
              const startDelay = index * 0.3
              const shouldDropOff = Math.random() > 0.7
              
              return (
                <motion.circle
                  key={index}
                  cx={100 + randomOffset * 0.3}
                  cy="25"
                  r="1.5"
                  fill={lightColor}
                  initial={{ cy: 25, cx: 100 + randomOffset * 0.3, opacity: 0.8 }}
                  animate={shouldDropOff ? {
                    cy: [25, 50, 50],
                    cx: [100 + randomOffset * 0.3, 100 + randomOffset * 0.6, 100 + randomOffset * 0.6 + 30],
                    opacity: [0.8, 0.6, 0]
                  } : {
                    cy: 93,
                    cx: 100 + randomOffset * 0.8,
                    opacity: [0.8, 0.6, 0.4, 0.2]
                  }}
                  transition={{
                    duration: shouldDropOff ? 2 : 3.5,
                    repeat: Infinity,
                    delay: startDelay,
                    ease: "easeInOut"
                  }}
                />
              )
            })}
          </svg>
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
