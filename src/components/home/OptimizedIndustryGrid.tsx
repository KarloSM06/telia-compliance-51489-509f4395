import { useEffect, useRef, ReactNode } from "react";

interface OptimizedIndustryGridProps {
  children: ReactNode;
  className?: string;
}

export const OptimizedIndustryGrid = ({ children, className = "" }: OptimizedIndustryGridProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "-60px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
