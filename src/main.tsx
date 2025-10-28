import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload hero image for faster LCP
  const heroImage = new Image();
  heroImage.src = '/src/assets/hero-background.jpg';
  
  // Preload font if applicable
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.googleapis.com';
  document.head.appendChild(link);
};

// Web Vitals tracking for performance monitoring
const reportWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log metrics in development, send to analytics in production
        if (import.meta.env.DEV) {
          console.log(`[Web Vitals] ${entry.name}:`, entry);
        }
        // In production, you could send to analytics service:
        // analytics.track(entry.name, { value: entry.value });
      }
    });

    // Observe paint timings, layout shifts, and input delays
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (e) {
      // Some metrics might not be supported in all browsers
      console.warn('Performance observer not fully supported:', e);
    }
  }
};

// Initialize performance optimizations
preloadCriticalResources();
reportWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
