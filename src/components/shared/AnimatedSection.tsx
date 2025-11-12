import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fade' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale';
  duration?: number;
  threshold?: number;
}

const animationClasses = {
  fade: {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  fadeUp: {
    initial: 'opacity-0 translate-y-8',
    animate: 'opacity-100 translate-y-0',
  },
  fadeDown: {
    initial: 'opacity-0 -translate-y-8',
    animate: 'opacity-100 translate-y-0',
  },
  fadeLeft: {
    initial: 'opacity-0 -translate-x-8',
    animate: 'opacity-100 translate-x-0',
  },
  fadeRight: {
    initial: 'opacity-0 translate-x-8',
    animate: 'opacity-100 translate-x-0',
  },
  scale: {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
  },
};

export const AnimatedSection = ({ 
  children, 
  delay = 0, 
  className,
  animation = 'fadeUp',
  duration = 700,
  threshold = 0.1,
}: AnimatedSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin: '-50px 0px',
  });

  const classes = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        inView ? classes.animate : classes.initial,
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity, transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden' as const,
      }}
    >
      {children}
    </div>
  );
};
