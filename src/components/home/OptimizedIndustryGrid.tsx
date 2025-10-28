import { useEffect, useRef, ReactNode } from "react";

interface OptimizedIndustryGridProps {
  children: ReactNode;
  className?: string;
  imagesReady?: boolean;
  maxWaitMs?: number;
}

export const OptimizedIndustryGrid = ({ 
  children, 
  className = "", 
  imagesReady = true, 
  maxWaitMs = 1500 
}: OptimizedIndustryGridProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const intersectedRef = useRef(false);
  const activatedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  const activate = () => {
    if (activatedRef.current) return;
    activatedRef.current = true;
    const el = ref.current;
    if (!el) return;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add("is-visible");
        setTimeout(() => ioRef.current?.disconnect?.(), 800);
      });
    });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const maybeActivate = () => {
      if (intersectedRef.current && imagesReady) {
        activate();
      }
    };

    ioRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectedRef.current = true;
            // Fail-safe if images take too long
            if (timeoutRef.current == null) {
              timeoutRef.current = window.setTimeout(() => activate(), maxWaitMs);
            }
            maybeActivate();
          }
        });
      },
      { threshold: 0.05, rootMargin: "300px 0px -50px 0px" }
    );

    ioRef.current.observe(el);
    return () => {
      ioRef.current?.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [maxWaitMs]);

  useEffect(() => {
    if (intersectedRef.current && imagesReady) {
      activate();
    }
  }, [imagesReady]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
