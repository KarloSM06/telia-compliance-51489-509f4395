import { useState, useEffect, useRef, ReactNode } from 'react';

interface StickyScrollRevealProps {
  children: ReactNode;
  className?: string;
}

// Custom Hook for Scroll Animation
export const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

export function StickyScrollReveal({ children, className = '' }: StickyScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
