import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    base: `./`,
    plugins: [
        vue(),
    ],
    build: {
        // sourcemap: "inline",
        outDir: "dist",
        rollupOptions: {
            // REF https://rollupjs.org/guide/en/#big-list-of-options
            output: [
                {
                    assetFileNames: "assets/[name]-[hash][extname]",
                    entryFileNames: "assets/[name]-[hash].js",
                },
            ],
            plugins: [,
            ],
        },
    },
});
