import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }
          // Charts
          if (id.includes('node_modules/recharts')) {
            return 'chart-vendor';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // React Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }
          // Lucide icons - separate chunk for tree-shaking
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'date-utils';
          }
          // Split large components
          if (id.includes('src/components/dashboard') && !id.includes('src/components/dashboard/DashboardLayout')) {
            return 'dashboard-components';
          }
          if (id.includes('src/components/calendar')) {
            return 'calendar-components';
          }
          if (id.includes('src/components/lead')) {
            return 'lead-components';
          }
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    sourcemap: mode === 'development',
    target: 'esnext',
    cssMinify: true,
  },
}));
