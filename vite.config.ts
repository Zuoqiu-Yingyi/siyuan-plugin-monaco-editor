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

import { defineConfig } from "vite";
import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { less } from "svelte-preprocess-less";

// https://vitejs.dev/config/
export default defineConfig({
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
            "~": resolve(__dirname, "./"),
            "@": resolve(__dirname, "./src"),
        }
    },
    build: {
        minify: true,
        // sourcemap: "inline",
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            fileName: "index",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: [
                "siyuan",
                /^@electron\/.*$/,
            ],
            output: {
                entryFileNames: chunkInfo => {
                    // console.log(chunkInfo);
                    switch (chunkInfo.name) {
                        case "index":
                            return "[name].js";

                        default:
                            return "assets/[name]-[hash].js";
                    }
                },
                assetFileNames: assetInfo => {
                    // console.log(chunkInfo);
                    switch (assetInfo.name) {
                        case "style.css":
                        case "index.css":
                            return "index.css";

                        default:
                            return "assets/[name]-[hash][extname]";
                    }
                },
            },
        },
    },
});
