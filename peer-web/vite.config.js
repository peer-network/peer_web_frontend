import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // aliases for imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@api': resolve(__dirname, 'src/api'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@base': resolve(__dirname, 'src/components/base'),
      '@common': resolve(__dirname, 'src/components/common'),
      '@features': resolve(__dirname, 'src/components/features'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@helpers': resolve(__dirname, 'src/helpers'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@plugins': resolve(__dirname, 'src/plugins'),
      '@router': resolve(__dirname, 'src/router'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@styles': resolve(__dirname, 'src/assets/styles'),
    },
  },

  // Proxy API requests to PHP backend during development
  server: {
    port: 5173,
    proxy: {
      // Proxy GraphQL requests to XAMPP PHP backend
      '/graphql': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => `/peer_web_frontend${path}`,
      },
      // Proxy media requests
      '/media': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => `/peer_web_frontend${path}`,
      },
      // Proxy image assets
      '/img': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => `/peer_web_frontend${path}`,
      },
      '/svg': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => `/peer_web_frontend${path}`,
      },
    },
  },

  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
