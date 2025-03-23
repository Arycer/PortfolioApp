import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            return 'vendor';
          }
          
          // UI components chunk
          if (id.includes('/src/components/ui/')) {
            return 'ui';
          }
          
          // Forms chunk
          if (id.includes('/components/') && id.includes('Form')) {
            return 'forms';
          }
          
          // Cards chunk
          if (id.includes('/components/') && id.includes('Card')) {
            return 'cards';
          }

          // Pages chunk
          if (id.includes('/pages/')) {
            return 'pages';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    target: 'esnext',
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
