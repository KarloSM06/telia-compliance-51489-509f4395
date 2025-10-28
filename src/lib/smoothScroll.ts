/**
 * Smooth scroll implementation using Lenis for premium inertial scroll
 * Falls back to native smooth scroll if Lenis is not available
 */

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
}

/**
 * Smoothly scrolls to a target position using Lenis
 */
export const smoothScrollTo = (
  targetPosition: number, 
  options: SmoothScrollOptions = {}
): void => {
  const { offset = 0, duration = 1.2 } = options;
  const lenis = (window as any).lenis;

  if (lenis) {
    // Use Lenis for buttery smooth scroll
    lenis.scrollTo(targetPosition - offset, {
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    // Fallback to native smooth scroll
    window.scrollTo({
      top: targetPosition - offset,
      behavior: 'smooth'
    });
  }
};

/**
 * Smoothly scrolls to an element using Lenis
 */
export const smoothScrollToElement = (
  elementId: string,
  options: SmoothScrollOptions = {}
): void => {
  const element = document.getElementById(elementId);
  const lenis = (window as any).lenis;
  
  if (element) {
    if (lenis) {
      // Use Lenis scrollTo with element
      lenis.scrollTo(element, {
        duration: options.duration || 1.2,
        offset: -(options.offset || 0),
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Fallback
      const elementPosition = element.getBoundingClientRect().top;
      const targetPosition = elementPosition + window.pageYOffset;
      smoothScrollTo(targetPosition, options);
    }
  }
};
