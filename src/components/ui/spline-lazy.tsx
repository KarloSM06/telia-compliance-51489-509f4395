import { lazy, Suspense } from 'react';
import type { SplineProps } from '@splinetool/react-spline';

// Lazy load Spline för bättre LCP performance
const Spline = lazy(() => import('@splinetool/react-spline'));

interface LazySplineProps extends SplineProps {
  fallback?: React.ReactNode;
}

export const LazySpline = ({ fallback, ...props }: LazySplineProps) => {
  const defaultFallback = (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <Spline {...props} />
    </Suspense>
  );
};
