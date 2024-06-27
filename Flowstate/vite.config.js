import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias Node.js modules to browser-compatible alternatives
      path: 'path-browserify',
      http: 'stream-http',
      buffer: 'buffer/',
    }
  },
  define: {
    // Polyfill for global
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['express'], // Prevent Vite from trying to bundle Express
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})