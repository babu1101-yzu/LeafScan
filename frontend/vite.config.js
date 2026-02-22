import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      'react-hot-toast',
      'lucide-react',
      'recharts',
      'react-dropzone',
      'date-fns',
      'clsx',
    ],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'framer-motion': ['framer-motion'],
          // Charts
          'recharts': ['recharts'],
          // Icons
          'lucide-react': ['lucide-react'],
          // Axios + toast
          'utils': ['axios', 'react-hot-toast'],
        },
      },
    },
  },
})
