import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        // Optimisations de build
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Supprimer les console.log en production
                drop_debugger: true,
            },
        },
        // Code splitting manuel pour réduire la taille des chunks
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                carte: resolve(__dirname, 'carte.html')
            },
            output: {
                manualChunks: {
                    // Vendor chunks - bibliothèques tierces
                    'vendor-maps': ['leaflet'],
                    'vendor-charts': ['chart.js'],
                    'vendor-pdf': ['jspdf'],

                    // Feature chunks - fonctionnalités par domaine
                    'features-gamification': [
                        '/gamification.js',
                        '/dashboard.js',
                    ],
                    'features-social': [
                        '/referral.js',
                        '/reviews.js',
                        '/chat.js',
                    ],
                    'features-booking': [
                        '/transport.js',
                        '/payment-wave.js',
                        '/notifications.js',
                    ],
                    'features-search': [
                        '/advanced-search.js',
                    ],
                    'features-pwa': [
                        '/pwa.js',
                        '/backend-sync.js',
                    ],
                },
                // Nommage optimisé des chunks
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        // Augmenter la limite d'avertissement
        chunkSizeWarningLimit: 600,
        // Optimisations CSS
        cssCodeSplit: true,
        // Source maps désactivées en production
        sourcemap: false,
    },
    // Optimisations de dépendances
    optimizeDeps: {
        include: ['leaflet', 'chart.js', 'jspdf'],
    },
});
