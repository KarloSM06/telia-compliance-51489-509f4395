"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
}
export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 24,
  demoMode = true,
  demoInterval = 3000,
  className
}: AIVoiceInputProps) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Intersection Observer to pause animations when not visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (submitted) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else {
      onStop?.(time);
      setTime(0);
    }
    return () => clearInterval(intervalId);
  }, [submitted, time, onStart, onStop]);
  useEffect(() => {
    if (!demoMode) return;
    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };
    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [demoMode, demoInterval]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return <div ref={containerRef} className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        

        <span className="font-mono text-sm text-gray-700">
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => <div key={i} className="w-0.5 rounded-full transition-all duration-300 bg-gray-900/50 animate-pulse" style={isClient ? {
          height: `${20 + Math.random() * 80}%`,
          animationDelay: `${i * 0.05}s`,
          animationPlayState: isVisible ? 'running' : 'paused',
          willChange: isVisible ? 'height' : 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        } : undefined} />)}
        </div>

        <p className="h-4 text-xs text-gray-700">
          Listening...
        </p>
      </div>
    </div>;
}