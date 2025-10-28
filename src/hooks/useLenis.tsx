import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Custom hook for Lenis smooth scroll with premium inertial effect
 * Similar to Ciklum.com scroll experience
 */
export const useLenis = () => {
  useEffect(() => {
    // Check if mobile device - use native scroll on mobile for better performance
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 0.8, // Faster response
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1, // Direct scroll feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Less aggressive
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
    });

    // Scroll state management to disable hover effects during scroll
    let scrollTimeout: NodeJS.Timeout;
    lenis.on('scroll', () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    });

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Store lenis instance globally for scrollTo functions
    (window as any).lenis = lenis;

    // Cleanup
    return () => {
      lenis.destroy();
      clearTimeout(scrollTimeout);
      delete (window as any).lenis;
    };
  }, []);
};
