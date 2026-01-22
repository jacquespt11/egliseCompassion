// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  css: {
    postcss: './postcss.config.js'
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
    host: true,
    // Proxy pour éviter les problèmes CORS en développement
    proxy: {
      '/api': {
        target: 'https://api.mycompassionspace.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        // Headers supplémentaires si nécessaire
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
  // Optimisation pour Vercel
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
});