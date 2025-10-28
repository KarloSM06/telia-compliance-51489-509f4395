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
    rootMargin: '-50px', // Start animation slightly before entering viewport
  });

  const getTransformClasses = () => {
    if (direction === 'left') {
      return inView 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 -translate-x-12';
    }
    if (direction === 'right') {
      return inView 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 translate-x-12';
    }
    return inView 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getTransformClasses()} ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};
