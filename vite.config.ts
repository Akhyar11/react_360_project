import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// In dev mode Vite runs as Express middleware (no separate port).
// In production Express serves the built dist/ folder statically.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Required for Vite middleware mode (server/index.js integrates Vite)
  appType: 'custom',
  server: {
    // No standalone server config needed — Express controls the port.
    middlewareMode: true,
  },
  build: {
    // Raise warning threshold slightly since photo-sphere-viewer is inherently large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@photo-sphere-viewer')) {
            return 'vendor-psv';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
        },
      },
    },
  },
})
