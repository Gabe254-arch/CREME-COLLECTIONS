// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // ✅ React Fast Refresh + JSX
  plugins: [react()],

  // ✅ Alias resolution for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Optional: You can add more aliases if needed
      // '@components': path.resolve(__dirname, './src/components'),
    },
  },

  // ✅ Fix for env usage in packages (like dotenv or older code)
  define: {
    'process.env': {},
  },

  // ✅ Dev server configuration
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 🔄 Proxy backend API requests
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Optional: Enable logging for debugging proxy issues
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`[Proxy] → ${req.method} ${req.url}`);
          });
        },
      },
      // 🔄 Serve uploaded images/files from backend
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ✅ Use relative base path for cPanel/shared hosting
  base: './',

  // ✅ Build settings
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // Set to true if debugging production code
  },

  // ✅ Dependency optimization
  optimizeDeps: {
    include: [
      // Add packages here if needed for pre-bundling
    ],
    exclude: [
      // Add packages here if causing issues
    ],
  },
});
