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

import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default {
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "./node_modules/monaco-editor/min",
                    dest: "./libs/monaco-editor",
                    rename: "min",
                },
                {
                    src: "./node_modules/streamsaver/sw.js",
                    dest: "./libs/streamsaver",
                    rename: "sw.js",
                },
            ],
        }),
    ],
    build: {
        emptyOutDir: true,
        copyPublicDir: true,
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            fileName: "index",
            formats: ["cjs"],
        },
        rollupOptions: {
            input: {
                index: resolve(__dirname, "src/index.ts"),
            },
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
} as UserConfig;
