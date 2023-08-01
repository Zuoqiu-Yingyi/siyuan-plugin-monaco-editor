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

import type { editor as Editor } from "monaco-editor";
import type { Electron } from "@workspace/types/electron";
import type { IMouseStatus } from "@workspace/utils/shortcut";
import type { IResourceOptionPermission } from "@/utils/permission";

export type IMonacoEditorOptions = Editor.IStandaloneEditorConstructionOptions & Editor.IStandaloneDiffEditorConstructionOptions;

/* 鼠标操作 */
export interface IMouseOperation {
    enable: boolean;
    mouse: IMouseStatus;
}

/* 上下文菜单配置 */
export interface IMenu {
    snippet: boolean; // 代码片段
    shorthand: boolean; // 收集箱速记
    history1: boolean; // 文件历史 (历史面板)
    history2: boolean; // 文档历史 (文档历史)
    snapshot: boolean; // 快照

    open: IMouseOperation; // 菜单打开操作
}

/* 支持的操作 */
export interface IOperates {
    menu: IMenu; // 上下文菜单
}

export interface IWindow {
    options: IWindowOptions; // 窗口设置
}

export interface IWindowOptions extends Electron.BrowserWindowConstructorOptions {
    width: number, // 窗口宽度
    height: number, // 窗口高度
    center: boolean, // 是否居中
}

export interface IEditor {
    options: IEditorOptions;
}

export interface IEditorOptions extends IMonacoEditorOptions {
    // autoClosingBrackets: 'languageDefined', // 是否自动添加后括号(包括中括号)
    // autoClosingDelete: 'languageDefined', // 是否自动删除后括号(包括中括号)
    // autoClosingQuotes: 'languageDefined', // 是否自动添加后单引号 双引号
    automaticLayout: IMonacoEditorOptions["automaticLayout"], // 是否自动布局
    bracketPairColorization: IMonacoEditorOptions["bracketPairColorization"], // 匹配括号颜色
    colorDecorators: IMonacoEditorOptions["colorDecorators"], // 是否渲染定义的颜色(CSS 中颜色值)
    // copyWithSyntaxHighlighting: false, // 是否复制为富文本
    // cursorSmoothCaretAnimation: true, // 光标平滑移动动画
    fontFamily: IMonacoEditorOptions["fontFamily"], // 字体
    fontLigatures: IMonacoEditorOptions["fontLigatures"], // 是否启用字体连字
    formatOnPaste: IMonacoEditorOptions["formatOnPaste"], // 是否格式化粘贴的内容
    // inDiffEditor: false, // 是启用对比功能
    mouseWheelZoom: IMonacoEditorOptions["mouseWheelZoom"], // 是否使用鼠标滚轮缩放
    readOnly: IMonacoEditorOptions["readOnly"], // 是否只读
    tabSize: number, // Tab 制表符缩进大小
    useShadowDOM: IMonacoEditorOptions["useShadowDOM"], // 是否使用 Shadow DOM
    // value: '', // 初始文本
    wordWrap: IMonacoEditorOptions["wordWrap"], // 是否自动换行 "on" | "off" | "wordWrapColumn" | "bounded"
}


/* 资源权限 */
export interface IPermission {
    protected: IResourceOptionPermission; // 受保护的目录/文件权限
}

/* 文件资源管理器面板设置项 */
export interface IExplorerDock {
    enable: boolean; // 是否开启文件资源管理器
    safe: boolean; // 是否开启安全模式 (受保护模式)
    permission: IPermission; // 权限
}

/* 编辑器面板设置项 */
export interface IEditorDock {
    enable: boolean; // 是否开启文件资源管理器
}

/* 侧边面板 */
export interface IDock {
    explorer: IExplorerDock;
    editor: IEditorDock;
}

export interface IConfig {
    operates: IOperates;
    window: IWindow;
    editor: IEditor;
    dock: IDock;
}
