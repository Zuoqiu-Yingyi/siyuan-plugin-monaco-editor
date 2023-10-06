/**
 * Copyright (C) 2023 Zuoqiu Yingyi
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { UserConfig } from "vite";
import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { less } from "svelte-preprocess-less";

// https://vitejs.dev/config/
export default {
    base: `./`,
    plugins: [
        svelte({
            preprocess: {
                style: less(),
            },
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "~": resolve(__dirname, "./"),
        },
    },
    build: {
        minify: true,
        // sourcemap: "inline",
        emptyOutDir: false,
        copyPublicDir: false,
        rollupOptions: {
            external: [
                "siyuan",
                /^@electron\/.*$/,
            ],
            output: {
                // REF: https://cn.rollupjs.org/configuration-options/#output-intro-output-outro
                // manualChunks: (id: string, { getModuleInfo, getModuleIds }) => {
                //     console.log(id);
                // },
                entryFileNames: chunkInfo => {
                    // console.log(chunkInfo);
                    switch (chunkInfo.name) {
                        default:
                            return "assets/[name]-[hash].js";
                    }
                },
                chunkFileNames: chunkInfo => {
                    // console.log(chunkInfo);
                    switch (chunkInfo.name) {
                        default:
                            return "chunks/[name]-[hash].js";
                    }
                },
                assetFileNames: assetInfo => {
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
