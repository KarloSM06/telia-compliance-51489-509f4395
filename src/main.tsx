import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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

reportWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
