import { useState, useCallback, useRef, useEffect } from 'react';

interface PointerPosition {
  x: number;
  y: number;
  clientY: number;
}

export const usePointerTracking = () => {
  const [currentPointer, setCurrentPointer] = useState<PointerPosition | null>(null);
  const rafRef = useRef<number>();
  const lastPositionRef = useRef<PointerPosition | null>(null);

  const updatePointer = useCallback((e: PointerEvent) => {
    const newPosition = {
      x: e.clientX,
      y: e.clientY,
      clientY: e.clientY,
    };
    
    lastPositionRef.current = newPosition;
    
    // Use requestAnimationFrame for smooth 60fps updates
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (lastPositionRef.current) {
        setCurrentPointer(lastPositionRef.current);
      }
    });
  }, []);

  const startTracking = useCallback(() => {
    window.addEventListener('pointermove', updatePointer);
  }, [updatePointer]);

  const stopTracking = useCallback(() => {
    window.removeEventListener('pointermove', updatePointer);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setCurrentPointer(null);
    lastPositionRef.current = null;
  }, [updatePointer]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('pointermove', updatePointer);
    };
  }, [updatePointer]);

  return {
    currentPointer,
    startTracking,
    stopTracking,
  };
};
