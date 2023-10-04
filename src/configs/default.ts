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

import type { IConfig, IMonacoEditorOptions } from "@/types/config";
import { OpenScheme } from "@/utils/url";
import { AssetsUploadMode } from "@/vditor/asset";
import { MouseButton } from "@workspace/utils/shortcut";
// import type { editor as Editor } from "monaco-editor";

export function getCodeFontFamily(
    element: HTMLElement = document.documentElement,
    property: string = "--b3-font-family-code"
): string {
    return globalThis.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 将思源的设置转换为编辑器设置
 */
export function siyuanConfig2EditorOptions(config = globalThis.siyuan.config): IMonacoEditorOptions {
    return {
        /**
         * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
         * REF: https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties#javascript_%E4%B8%AD%E7%9A%84%E5%80%BC
         */
        fontFamily: getCodeFontFamily(),
        fontLigatures: config.editor.codeLigatures,
        mouseWheelZoom: config.editor.fontSizeScrollZoom,
        readOnly: config.editor.readOnly,
        tabSize: config.editor.codeTabSpaces,
        wordWrap: config.editor.wordWrap ? "on" : "off",
        theme: config.appearance.mode === 0 ? "vs" : "vs-dark",
    };
}

export const DEFAULT_CONFIG: IConfig = {
    operates: {
        menu: {
            snippet: true,
            shorthand: true,
            history1: true,
            history2: true,
            snapshot: true,
            open: {
                enable: true,
                mouse: {
                    /* 右键菜单 */
                    type: "contextmenu",
                    button: MouseButton.Right,

                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                },
            }
        },
    },
    window: {
        options: {
            width: 800, // 窗口宽度
            height: 600, // 窗口高度
            center: false, // 是否居中
        },
    },
    editor: {
        options: {
            // autoClosingBrackets: 'languageDefined', // 是否自动添加后括号(包括中括号)
            // autoClosingDelete: 'languageDefined', // 是否自动删除后括号(包括中括号)
            // autoClosingQuotes: 'languageDefined', // 是否自动添加后单引号 双引号
            automaticLayout: true, // 是否自动布局
            bracketPairColorization: { // 匹配括号颜色
                enabled: true,
            },
            colorDecorators: true, // 是否渲染定义的颜色(CSS 中颜色值)
            copyWithSyntaxHighlighting: false, // 是否复制为富文本
            // cursorSmoothCaretAnimation: true, // 光标平滑移动动画
            fontFamily: '"JetBrainsMono-Regular", mononoki, Consolas, "Liberation Mono", Menlo, Courier, monospace, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols"', // 字体
            fontLigatures: true, // 是否启用字体连字
            formatOnPaste: true, // 是否格式化粘贴的内容
            // inDiffEditor: false, // 是启用对比功能
            mouseWheelZoom: true, // 是否使用鼠标滚轮缩放
            readOnly: false, // 是否只读
            tabSize: 4, // Tab 制表符缩进大小
            useShadowDOM: true, // 是否使用 Shadow DOM
            wordWrap: 'off', // 是否自动换行 "on" | "off" | "wordWrapColumn" | "bounded"
        },
    },
    vditor: {
        options: {},
        assetsDirPath: "/assets/vditor/",
        assetsUploadMode: AssetsUploadMode.assets,
    },
    dock: {
        editor: {
            enable: true,
        },
        explorer: {
            enable: true,
            safe: true,
            permission: {
                protected: {
                    enable: true,

                    read: true,
                    write: true,

                    new: true,
                    view: false,
                    edit: false,
                    move: false,
                    copy: true,
                    rename: false,
                    delete: false,
                },
            },
        },
    },
    open: {
        markdown: OpenScheme.Vditor,
        default: OpenScheme.Editor,
    },
};
