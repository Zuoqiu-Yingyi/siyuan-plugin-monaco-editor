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

/// <reference types="@siyuan-community/vditor/dist/types" />
import type MonacoEditorPlugin from "@/index";
import type { AssetsUploadMode } from "@/vditor/asset";
export {
    IOptions,
}

export type IPlugin = Pick<
    MonacoEditorPlugin,
    "name" | "i18n" | "logger" | "client",
>;

/* Vditor 组件配置项 */
export interface IVditorProps {
    plugin: IPlugin; // 插件接口
    src2url: Map<string, string>; // src -> blob URL
    baseURL: string; // vditor 静态资源文件目录
    rootURL: string; // 思源服务根目录

    path: string; // 当前文件相对于思源工作空间根目录的路径 (无末尾的 /)
    vditorID: string; // ID
    assetsDirPath: string; // 资源文件上传地址
    assetsUploadMode: AssetsUploadMode; // 资源文件上传模式
    options: IOptions; // 配置选项
    value: string; // 编辑器内容
    theme: boolean; // 主题模式 (true: light; false: dark)
    codeBlockThemeLight: string; // 代码主题模式 (明亮)
    codeBlockThemeDark: string; // 代码主题模式 (黑暗)
    debug: boolean; // 是否开启调试模式
}

/* Vditor 组件事件 */
export interface IVditorEvents {
    "open-link": {
        href: string; // 超链接
        title?: string; // 超链接标题
        target?: string; // 超链接打开方式
        anchor?: string; // 超链接锚文本
    };
    "changed": {
        markdown: string; // Markdown 文本
    };
    "save": {
        markdown: string; // Markdown 文本
    };
}
