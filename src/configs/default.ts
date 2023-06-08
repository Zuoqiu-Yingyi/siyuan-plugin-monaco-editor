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

import type { IConfig } from "@/types/config";
import manifest from "~/public/plugin.json";

/* 默认配置选项 */
export const DEFAULT_CONFIG: IConfig = {
    css: {
        enable: true,
        code: `/* Twemoji Mozilla: https://github.com/mozilla/twemoji-colr */
@font-face {
    font-family: "Twemoji Mozilla";
    font-style: normal;
    src: url("plugins/${manifest.name}/static/fonts/Twemoji.Mozilla/Twemoji.Mozilla-0.7.0.ttf");
}
`,
    },
    fonts: {
        base: {
            enable: false,
            list: [
                "Helvetica Neue",
                "Luxi Sans",
                "DejaVu Sans",
                "Hiragino Sans GB",
                "Microsoft Yahei",
                "sans-serif",

                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Noto Color Emoji",
                "Segoe UI Symbol",
                "Android Emoji",
                "EmojiSymbols",
            ],
        },
        code: {
            enable: false,
            list: [
                "JetBrainsMono-Regular",
                "mononoki",
                "Consolas",
                "Liberation Mono",
                "Menlo",
                "Courier",
                "monospace",

                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Noto Color Emoji",
                "Segoe UI Symbol",
                "Android Emoji",
                "EmojiSymbols",
            ],
        },
        graph: {
            enable: false,
            list: [
                "mononoki",
            ],
        },
        math: {
            enable: false,
            list: [
                "KaTeX_Math",
                "KaTeX_Main",

                // "KaTeX_AMS",
                // "KaTeX_Caligraphic",
                // "KaTeX_Fraktur",
                // "KaTeX_SansSerif",
                // "KaTeX_Script",
                // "KaTeX_Size1",
                // "KaTeX_Size2",
                // "KaTeX_Size3",
                // "KaTeX_Size4",
                // "KaTeX_Typewriter",
            ],
        },
        emoji: {
            enable: true,
            list: [
                "Twemoji Mozilla",

                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Segoe UI",
                "Apple Color Emoji",
                "Noto Color Emoji",
                "Android Emoji",
            ],
        },
    },
};
