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

import { FLAG_ELECTRON, FLAG_IFRAME } from "@workspace/utils/env/native-front-end";

/* 打开类型 */
export enum OpenScheme {
    Editor = "editor",
    Vditor = "vditor",
    Preview = "preview",
}

/* 打开方案 */
export enum OpenMode {
    Tab = "tab",
    TabBackground = "tab-background",
    TabRight = "tab-right",
    TabBottom = "tab-bottom",
    Window = "window",
}

/**
 * 获取 monaco-editor 资源路径
 * @param embed - 是否嵌入到思源内部
 * @param workspacePath - 思源工作空间路径
 * @param pluginName - 插件名称
 * @returns monaco-editor 资源路径
 * REF:
 */
export function getMonacoEditorResourcePath(embed: boolean, workspacePath: string, pluginName: string): string {
    switch (true) {
        case import.meta.env.DEV: // 开发模式
            return "node_modules/monaco-editor/min/vs";

        case import.meta.env.PROD: // 生产环境
        default:
            if (embed) {
                // 嵌入到思源内部
                switch (true) {
                    case FLAG_ELECTRON: {
                        // Electron 环境
                        return globalThis.require("node:path").resolve(window.siyuan.config!.system.workspaceDir, `./data/plugins/${pluginName}/libs/monaco-editor/min/vs`);
                        // return `${window.siyuan.system.workspaceDir}/data/plugins/${pluginName}/libs/monaco-editor/min/vs`;
                    }
                    default: {
                        // 浏览器环境
                        const url = new URL(`${globalThis.document.baseURI}plugins/${pluginName}/libs/monaco-editor/min/vs`);
                        return url.pathname;
                    }
                }
            }
            else {
                // 通过 iframe/BrowserWindow 加载
                switch (true) {
                    case FLAG_ELECTRON: // Electron BrowserWindow 环境
                        return globalThis.require("node:path").resolve(workspacePath, `./data/plugins/${pluginName}/libs/monaco-editor/min/vs`);
                    case FLAG_IFRAME: // iframe 环境
                    default: {
                        const url = new URL(`./../libs/monaco-editor/min/vs`, globalThis.document.baseURI);
                        return url.pathname;
                    }
                }
            }
    }
}
