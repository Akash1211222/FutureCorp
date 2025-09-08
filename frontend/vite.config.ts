import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [reactSwc()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'three'],
    include: ['react-player', 'socket.io-client']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui': ['framer-motion', 'react-player'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});