// Copyright (C) 2023 Zuoqiu Yingyi
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { sveltePreprocess } from "svelte-preprocess";

import type { UserConfig } from "vite";

// https://vitejs.dev/config/
export default {
    base: `./`,
    plugins: [
        svelte({
            preprocess: [
                sveltePreprocess({
                    typescript: true,
                    less: true,
                }),
            ],
        }),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        minify: true,
        // sourcemap: "inline",
        emptyOutDir: false,
        copyPublicDir: false,
        rollupOptions: {
            input: {
                editor: resolve(import.meta.dirname, "./iframes/editor.html"),
                vditor: resolve(import.meta.dirname, "./iframes/vditor.html"),
            },
            output: {
                // REF: https://cn.rollupjs.org/configuration-options/#output-intro-output-outro
                // manualChunks: (id: string, { getModuleInfo, getModuleIds }) => {
                //     console.log(id);
                // },
                entryFileNames: (entryInfo) => {
                    // console.log(entryInfo);
                    switch (entryInfo.name) {
                        default:
                            return "assets/[name]-[hash].js";
                    }
                },
                chunkFileNames: (chunkInfo) => {
                    // console.log(chunkInfo);
                    switch (chunkInfo.name) {
                        default:
                            return "chunks/[name]-[hash].js";
                    }
                },
                assetFileNames: (assetInfo) => {
                    // console.log(chunkInfo);
                    switch (assetInfo.name) {
                        default:
                            return "assets/[name]-[hash][extname]";
                    }
                },
            },
        },
    },
} as UserConfig;
