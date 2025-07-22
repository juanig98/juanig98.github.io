// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    server: {
        open: true
    },
    css: {
        
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'import',
                    'mixed-decls',
                    'color-functions',
                    'global-builtin',
                ],
            },

        },

    },
})
