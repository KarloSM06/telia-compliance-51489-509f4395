/**
 * Custom smooth scroll implementation with momentum and ice-like feel
 */

// Easing functions for smooth, gliding scroll
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
  easing?: 'easeOutQuart' | 'easeInOutCubic';
}

/**
 * Smoothly scrolls to a target position with momentum effect
 */
export const smoothScrollTo = (
  targetPosition: number, 
  options: SmoothScrollOptions = {}
): void => {
  const {
    duration = 1200, // Longer duration for ice-like feel
    offset = 0,
    easing = 'easeOutQuart'
  } = options;

  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition - offset;
  let startTime: number | null = null;

  const easingFunction = easing === 'easeInOutCubic' ? easeInOutCubic : easeOutQuart;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Apply easing for smooth, ice-like momentum
    const ease = easingFunction(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

/**
 * Smoothly scrolls to an element with momentum effect
 */
export const smoothScrollToElement = (
  elementId: string,
  options: SmoothScrollOptions = {}
): void => {
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const targetPosition = elementPosition + window.pageYOffset;
    
    smoothScrollTo(targetPosition, options);
  }
};
