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

    // Initialize Lenis with premium settings
    const lenis = new Lenis({
      duration: 1.2, // Smooth duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium easing curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Adjust wheel sensitivity
      touchMultiplier: 2,
      infinite: false,
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
      delete (window as any).lenis;
    };
  }, []);
};
