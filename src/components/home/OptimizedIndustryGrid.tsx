import { useInView } from 'react-intersection-observer';
import { IndustryCard } from "./IndustryCard";
import type { Industry } from "@/data/industries";

interface OptimizedIndustryGridProps {
  industries: Industry[];
  onIndustryClick: (industryId: string) => void;
}

export const OptimizedIndustryGrid = ({ industries, onIndustryClick }: OptimizedIndustryGridProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '0px',
  });

  return (
    <div 
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      style={{ 
        contain: 'layout style paint',
      }}
    >
      {industries.map((industry, index) => (
        <div
          key={industry.id}
          className={`industry-card-wrapper ${inView ? 'animate-in' : ''}`}
          style={{
            '--stagger-delay': `${index * 60}ms`,
          } as React.CSSProperties}
        >
          <IndustryCard 
            industry={industry} 
            onClick={() => onIndustryClick(industry.id)} 
          />
        </div>
      ))}
    </div>
  );
};
