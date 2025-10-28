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
    rootMargin: '-30px',
  });

  const getTransformClasses = () => {
    if (direction === 'left') {
      return inView 
        ? 'opacity-100' 
        : 'opacity-0';
    }
    if (direction === 'right') {
      return inView 
        ? 'opacity-100' 
        : 'opacity-0';
    }
    return inView 
      ? 'opacity-100' 
      : 'opacity-0';
  };

  const getTransformStyle = () => {
    if (!inView) {
      if (direction === 'left') return 'translate3d(-30px, 0, 0)';
      if (direction === 'right') return 'translate3d(30px, 0, 0)';
      return 'translate3d(0, 20px, 0)';
    }
    return 'translate3d(0, 0, 0)';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out ${getTransformClasses()} ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        transform: getTransformStyle(),
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};
