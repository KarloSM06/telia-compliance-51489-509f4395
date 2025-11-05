'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        style={{ 
          width: '100%', 
          height: '100%',
          minWidth: '1920px',
          minHeight: '1080px'
        }}
      />
    </Suspense>
  )
}
