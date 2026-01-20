import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, 'src/components'),
            '@stores': resolve(__dirname, 'src/stores'),
            '@modules': resolve(__dirname, 'src/modules'),
        },
    },

    // Build configuration for PHP integration
    build: {
        outDir: 'dist',
        manifest: true,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/main.ts'),
                auth: resolve(__dirname, 'src/modules/auth/index.ts'),
                dashboard: resolve(__dirname, 'src/modules/dashboard/index.ts'),
                wallet: resolve(__dirname, 'src/modules/wallet/index.ts'),
                profile: resolve(__dirname, 'src/modules/profile/index.ts'),
                chat: resolve(__dirname, 'src/modules/chat/index.ts'),
                posts: resolve(__dirname, 'src/modules/posts/index.ts'),
            },
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },

    // Dev server
    server: {
        port: 5173,
        cors: true,
        origin: 'http://localhost:5173',
    },

    // Vitest configuration
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,ts}'],
    },
})
