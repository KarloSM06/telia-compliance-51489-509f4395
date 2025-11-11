import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    let isScrolling = false;
    let scrollEndTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      // Throttle to 60fps for performance
      if (isScrolling) return;
      isScrolling = true;
      
      requestAnimationFrame(() => {
        // Exponential easing for gliding
        const delta = e.deltaY;
        const easedDelta = delta * 0.6; // Slow down for momentum
        
        window.scrollBy({
          top: easedDelta,
          behavior: 'smooth'
        });
        
        isScrolling = false;
      });
      
      // Continue gliding 300ms after scroll stop
      clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 300);
      
      document.documentElement.classList.add('is-scrolling');
    };
    
    // Only on desktop for better control
    if (window.innerWidth > 768) {
      window.addEventListener('wheel', handleWheel, { passive: true });
    }
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollEndTimeout);
    };
  }, []);
};
