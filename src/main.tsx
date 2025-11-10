import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Web Vitals tracking for performance monitoring
const reportWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Core Web Vitals with enhanced metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metricName = entry.name;
        const metricValue = ('value' in entry ? entry.value : entry.startTime) as number;
        
        // Log metrics in development
        if (import.meta.env.DEV) {
          console.log(`[Web Vitals] ${metricName}:`, {
            value: metricValue,
            rating: metricValue < 2500 ? 'good' : metricValue < 4000 ? 'needs-improvement' : 'poor'
          });
        }
        
        // In production, send to analytics
        if (import.meta.env.PROD && (window as any).fbq) {
          (window as any).fbq('trackCustom', 'WebVital', {
            metric: metricName,
            value: metricValue,
            page: window.location.pathname
          });
        }
      }
    });

    // Observe Core Web Vitals
    try {
      observer.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] 
      });
      
      // Track Time to First Byte (TTFB)
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
        if (import.meta.env.DEV) {
          console.log('[Web Vitals] TTFB:', ttfb, 'ms');
        }
      }
    } catch (e) {
      console.warn('Performance observer not fully supported:', e);
    }
  }
};

reportWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
