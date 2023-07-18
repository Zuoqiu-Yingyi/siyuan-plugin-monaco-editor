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
import type { IMonacoEditorOptions } from "@/types/config";
import type MonacoEditorPlugin from "@/index";

export type IStandaloneEditorOptions = Editor.IEditorOptions & Editor.IGlobalEditorOptions;

/* 编辑器功能开关 */
export interface IEditorFunction {
    savable: boolean; // 是否可保存 (保存按钮+派生保存事件)
    changable: boolean; // 是否可更改 (派生更改事件)
}

/* 编辑器配置项 */
export interface IEditorOptions {
    original: IEditorModel; // 编辑器原始内容
    modified: IEditorModel; // 编辑器内容 (差异对比模式下的变更内容)
    options: IMonacoEditorOptions; // 编辑器配置 (编辑器初始化 & 常规模式更新)
    originalOptions: IStandaloneEditorOptions; // 编辑器配置 (更新原始编辑器内容)
    modifiedOptions: IStandaloneEditorOptions; // 编辑器配置 (更新变更编辑器内容)
    diffOptions: Editor.IDiffEditorOptions; // 对比编辑器配置 (仅用于差异对比模式更新)
}

/* 编辑器参数 */
export interface IEditorProps extends IEditorFunction, IEditorOptions {
    /* 上下文 */
    plugin: IPlugin; // 插件接口

    /* 编辑器样式 */
    embed: boolean; // 是否为嵌入模式 (嵌入在思源页面中)
    diff: boolean; // 是否为差异对比模式
    locale: string; // 界面语言
}

/* 编辑器模态 */
export interface IEditorModel {
    value: string; // 编辑器内容
    language?: string; // 编辑器语言模式
    uri?: Editor.Uri; // 通过 URI 推断编辑器语言模式
}

/* 侧边栏编辑器 */
export interface IDockEditor {
    modified: IEditorModel,
    options: IMonacoEditorOptions,
}

/* 插件接口 */
export type IPlugin = Pick<
    MonacoEditorPlugin,
    "name" | "i18n" | "logger",
>;

export interface IEditorEvent {
    changed: {
        value: string;
        event: Editor.IModelContentChangedEvent;
    }; // 内容更改事件
    save: { value: string }; // 保存事件
}
