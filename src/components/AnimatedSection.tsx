import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up';
}

export const AnimatedSection = ({ children, className = '', delay = 0, direction = 'up' }: AnimatedSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
      className={`transition-all duration-700 ${getTransformClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
