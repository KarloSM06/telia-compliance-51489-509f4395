import { useEffect, useRef, useState, ReactNode } from 'react';

interface OptimizedAnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up';
}

// Global Intersection Observer instance for better performance
let globalObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, (isIntersecting: boolean) => void>();

const getGlobalObserver = () => {
  if (!globalObserver && typeof window !== 'undefined') {
    globalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observedElements.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '200px',
      }
    );
  }
  return globalObserver;
};

export const OptimizedAnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up' 
}: OptimizedAnimatedSectionProps) => {
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getGlobalObserver();
    if (!observer) return;

    const callback = (isIntersecting: boolean) => {
      if (isIntersecting && !hasAnimated) {
        setInView(true);
        setHasAnimated(true);
      }
    };

    observedElements.set(element, callback);
    observer.observe(element);

    return () => {
      observedElements.delete(element);
      observer.unobserve(element);
    };
  }, [hasAnimated]);

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
    return inView 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-10';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-400 will-change-[transform,opacity] ${getTransformClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
