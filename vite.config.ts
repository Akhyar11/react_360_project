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
        manualChunks: {
          // Heavy 3D/WebGL viewer — load separately
          'vendor-psv': [
            '@photo-sphere-viewer/core',
            '@photo-sphere-viewer/markers-plugin',
            '@photo-sphere-viewer/virtual-tour-plugin',
          ],
          // React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Icons (tree-shaken but still sizable)
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
  },
})
