import { useEffect, useRef, ReactNode } from "react";

interface OptimizedIndustryGridProps {
  children: ReactNode;
  className?: string;
  imagesReady?: boolean;
}

export const OptimizedIndustryGrid = ({ 
  children, 
  className = "", 
  imagesReady = true 
}: OptimizedIndustryGridProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const intersectedRef = useRef(false);
  const activatedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const activate = () => {
    if (activatedRef.current) return;
    activatedRef.current = true;
    const el = ref.current;
    if (!el) return;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add("is-visible");
        setTimeout(() => {
          const io = document.querySelector('IntersectionObserver') as any;
          io?.disconnect?.();
        }, 600);
      });
    });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectedRef.current = true;
            if (imagesReady) {
              activate();
            } else {
              // Fail-safe: activate after 1500ms even if images aren't ready
              if (timeoutRef.current === null) {
                timeoutRef.current = window.setTimeout(() => activate(), 1500);
              }
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: "300px 0px -50px 0px" }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [imagesReady]);

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
