import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook för att lazy loada sektioner med Intersection Observer
 * Laddar innehåll endast när det närmar sig viewport (rootMargin)
 * 
 * @param rootMargin - Hur långt före viewport sektionen ska börja ladda (default: 200px)
 * @returns { ref, isVisible } - Ref att sätta på container och visibility state
 */
export const useLazySection = (rootMargin = '200px') => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect observer efter första synligheten (one-time load)
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isVisible };
};
