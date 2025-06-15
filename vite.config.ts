
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.zoom.us; style-src 'self' 'unsafe-inline' https://*.zoom.us; img-src 'self' data: https://lovable.dev https://*.zoom.us; connect-src 'self' wss://*.supabase.co https://*.supabase.co https://*.zoom.us wss://*.zoom.us; frame-src 'self' https://*.zoom.us; frame-ancestors 'self' https://*.zoom.us; object-src 'none'; base-uri 'self';"
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
