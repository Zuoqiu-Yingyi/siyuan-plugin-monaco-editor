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
import { viteStaticCopy } from "vite-plugin-static-copy";

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
        viteStaticCopy({
            targets: [
                /* @siyuan-community/vditor */
                {
                    src: "./node_modules/@siyuan-community/vditor/LICENSE",
                    dest: "./libs/vditor/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/package.json",
                    dest: "./libs/vditor/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/README.md",
                    dest: "./libs/vditor/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/css/content-theme/",
                    dest: "./libs/vditor/css/content-theme/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/index.css",
                    dest: "./libs/vditor/css/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/js/i18n/",
                    dest: "./libs/vditor/js/i18n/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/js/icons",
                    dest: "./libs/vditor/js/icons/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/images/logo.png",
                    dest: "./libs/vditor/images/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/js/mathjax/",
                    dest: "./libs/vditor/js/mathjax/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/js/highlight.js/",
                    dest: "./libs/vditor/js/highlight.js/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/@siyuan-community/vditor/dist/method.min.js",
                    dest: "./libs/vditor/js/",
                    rename: { stripBase: true },
                },
                /* monaco-editor */
                {
                    src: "./node_modules/monaco-editor/LICENSE",
                    dest: "./libs/monaco-editor/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/monaco-editor/package.json",
                    dest: "./libs/monaco-editor/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/monaco-editor/README.md",
                    dest: "./libs/monaco-editor/",
                    rename: { stripBase: true },
                },
                // 不再使用 AMD loader 动态加载资源, 而是直接将 monaco-editor 资源打包到构建产物中
                // {
                //     src: "./node_modules/monaco-editor/min/",
                //     dest: "./libs/monaco-editor/min/",
                //     rename: { stripBase: 3 },
                // },
                /* streamsaver */
                {
                    src: "./node_modules/streamsaver/LICENSE",
                    dest: "./libs/streamsaver/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/streamsaver/package.json",
                    dest: "./libs/streamsaver/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/streamsaver/README.md",
                    dest: "./libs/streamsaver/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/streamsaver/mitm.html",
                    dest: "./libs/streamsaver/",
                    rename: { stripBase: true },
                },
                {
                    src: "./node_modules/streamsaver/sw.js",
                    dest: "./libs/streamsaver/",
                    rename: { stripBase: true },
                },
            ],
        }),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        minify: true,
        // sourcemap: "inline",
        emptyOutDir: true,
        copyPublicDir: true,
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            fileName: "index",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: [
                "siyuan",
                /^@electron\/.*$/,
            ],
            input: {
                index: resolve(import.meta.dirname, "src/index.ts"),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    // console.log(chunkInfo);
                    switch (chunkInfo.name) {
                        case "index":
                            return "[name].js";

                        default:
                            return "assets/[name]-[hash].js";
                    }
                },
                assetFileNames: (assetInfo) => {
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
