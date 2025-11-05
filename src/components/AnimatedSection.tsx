import { useInView } from 'react-intersection-observer';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  scrollDriven?: boolean;
  reducedMotion?: boolean;
}

export const AnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  scrollDriven = false,
  reducedMotion = false
}: AnimatedSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: !scrollDriven,
    threshold: 0.1,
  });
  
  const elementRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check for user's motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const shouldAnimate = !prefersReducedMotion && !reducedMotion;

  useEffect(() => {
    if (!scrollDriven || !elementRef.current) return;

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress (0 when entering viewport bottom, 1 when leaving top)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDriven]);

  const getTransformClasses = () => {
    if (direction === 'left') {
      return inView 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 -translate-x-24';
    }
    if (direction === 'right') {
      return inView 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 translate-x-24';
    }
    if (direction === 'down') {
      return inView 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 -translate-y-10';
    }
    return inView 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-10';
  };

  const getScrollDrivenStyle = () => {
    if (!scrollDriven) return {};
    
    const opacity = Math.max(0.3, Math.min(1, scrollProgress * 1.5));
    const translateY = (1 - scrollProgress) * 30;
    
    return {
      opacity,
      transform: `translate3d(0, ${translateY}px, 0)`,
    };
  };

  // If animations disabled, render without effects
  if (!shouldAnimate) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div
      ref={(node) => {
        ref(node);
        if (elementRef) elementRef.current = node;
      }}
      className={cn(
        'transition-all duration-700 transform-gpu will-change-transform',
        !scrollDriven ? getTransformClasses() : '',
        className
      )}
      style={
        scrollDriven 
          ? { ...getScrollDrivenStyle(), contain: 'layout style paint' } 
          : { transitionDelay: `${delay}ms`, contain: 'layout style paint' }
      }
    >
      {children}
    </div>
  );
};
