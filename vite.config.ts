import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && viteCompression({ algorithm: 'brotliCompress' }),
    mode === "production" && viteCompression({ algorithm: 'gzip' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-radix-dialogs': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-popover',
          ],
          'ui-radix-forms': [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dropdown-menu',
          ],
          'ui-radix-display': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          'charts': ['recharts'],
          'forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'supabase': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          'animations': ['framer-motion'],
          'spline': ['@splinetool/react-spline', '@splinetool/runtime'],
        },
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    sourcemap: mode === 'development',
    reportCompressedSize: false,
  },
}));
