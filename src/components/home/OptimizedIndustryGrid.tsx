import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface OptimizedIndustryGridProps {
  children: ReactNode;
}

export const OptimizedIndustryGrid = ({ children }: OptimizedIndustryGridProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-30px',
  });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 ${
        inView ? 'industry-grid-visible' : 'industry-grid-hidden'
      }`}
      style={{
        contain: 'layout style paint',
      }}
    >
      {children}
    </div>
  );
};
