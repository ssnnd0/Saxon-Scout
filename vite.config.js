import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      // Fix for Lucide icons loading issues in development
      'lucide-react/icons': fileURLToPath(new URL('./node_modules/lucide-react/dist/esm/icons', import.meta.url)),
      
      // Regular extensions
      extensions: ['.js', '.jsx', '.json']
    }
  },
  optimizeDeps: {
    include: ['lucide-react']
  }
})
