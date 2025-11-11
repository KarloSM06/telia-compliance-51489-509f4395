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

        {/* SVG Curved Funnel with flowing dots and metrics */}
        <div className="absolute inset-0 flex items-center justify-center py-8">
          <svg viewBox="0 0 200 145" className="w-full h-full" style={{ maxWidth: '800px' }}>
            <defs>
              {/* Drop Shadow Filter */}
              <filter id="dropShadow">
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
              <linearGradient id="leadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.7" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="qualifyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="oppGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.5" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="closedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lightColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={lightColor} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Funnel Sections - Curved shapes with drop shadows */}
            {/* Stage 1: Leads */}
            <path
              d="M 50 20 Q 50 20, 50 20 L 150 20 Q 150 20, 150 20 L 140 45 Q 100 47, 60 45 Z"
              fill="url(#leadGradient)"
              stroke={lightColor}
              strokeWidth="1"
              strokeOpacity="0.3"
              filter="url(#dropShadow)"
            />
            
            {/* Stage 2: Qualified */}
            <path
              d="M 60 45 Q 100 47, 140 45 L 130 70 Q 100 72, 70 70 Z"
              fill="url(#qualifyGradient)"
              stroke={lightColor}
              strokeWidth="1"
              strokeOpacity="0.3"
              filter="url(#dropShadow)"
            />
            
            {/* Stage 3: Opportunity */}
            <path
              d="M 70 70 Q 100 72, 130 70 L 120 95 Q 100 97, 80 95 Z"
              fill="url(#oppGradient)"
              stroke={lightColor}
              strokeWidth="1"
              strokeOpacity="0.3"
              filter="url(#dropShadow)"
            />
            
            {/* Stage 4: Closed */}
            <path
              d="M 80 95 Q 100 97, 120 95 L 110 115 Q 100 116, 90 115 Z"
              fill="url(#closedGradient)"
              stroke={lightColor}
              strokeWidth="1"
              strokeOpacity="0.3"
              filter="url(#dropShadow)"
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
            
            {/* Animated Flowing Dots (Leads moving through stages) - Higher z-index layer */}
            <g style={{ zIndex: 10 }}>
              {[...Array(20)].map((_, i) => {
                const startY = 20
                const endY = 115
                const duration = 4 + (i % 3) * 0.5
                const delay = i * 0.3
                const baseX = 100
                const xVariation = (Math.sin(i * 0.5) * 15)
                
                return (
                  <motion.circle
                    key={i}
                    cx={baseX + xVariation}
                    cy={startY}
                    r="1.5"
                    fill={lightColor}
                    initial={{ cy: startY, opacity: 0.8 }}
                    animate={{
                      cy: endY,
                      opacity: [0.8, 1, 0.5, 0]
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      delay,
                      ease: "linear"
                    }}
                  />
                )
              })}
            </g>
          </svg>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <span className="text-sm font-medium text-gray-900">AI Scoring</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <span className="text-sm font-medium text-gray-900">Auto Nurture</span>
          </div>
        </div>
      </div>
    </div>
  )
}
