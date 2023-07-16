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

import type { default as Monaco, editor as Editor } from "monaco-editor";

import type { I18N } from "@/utils/i18n";
import type {
    IEditorModel,
    IEditorEvent,
} from "./editor";
import type { IMonacoEditorOptions } from "./config";

/* 传输的消息 */
export interface IMessage {
    channel: string; // 通道
    data: any; // 数据
}

/* 来自主机的消息 */
export interface IMessageEditorMasterEventMap {
    "editor-init": MessageEvent<IMessageEditorInit>;
    "editor-set": MessageEvent<IMessageEditorSet>;
}

/* 初始化编辑器 */
export interface IMessageEditorInit extends IMessage {
    channel: "editor-init";
    data: {
        name: string; // 插件名称
        i18n: I18N; // 插件国际化字段

        locale: string; // 编辑器界面语言
        diff: boolean; // 是否为差异对比模式
        savable: boolean; // 是否可保存 (是否显示保存按钮+是否派生保存事件)
        changable: boolean; // 是否可更改 (是否派生更改事件)
        original?: IEditorModel; // 编辑器原始内容 (仅差异对比模式)
        modified: IEditorModel; // 编辑器变更内容
        options: IMonacoEditorOptions; // 编辑器配置
    };
}

/* 设置编辑器设置项 */
export interface IMessageEditorSet extends IMessage {
    channel: "editor-set";
    data: {
        savable?: boolean; // 是否可保存 (保存按钮+派生保存事件)
        changable?: boolean; // 是否可更改 (派生更改事件)

        original?: IEditorModel; // 编辑器原始内容 (仅差异对比模式)
        modified?: IEditorModel; // 编辑器变更内容
        options?: Editor.IEditorOptions & Editor.IGlobalEditorOptions; // 编辑器配置
        diffOptions?: Editor.IDiffEditorOptions; // 差异对比编辑器配置
    };
}

/* 来自从机的消息 */
export interface IMessageEditorSlaveEventMap {
    "editor-ready": MessageEvent<IMessageEditorReady>;
    "editor-changed": MessageEvent<IMessageEditorChanged>;
    "editor-save": MessageEvent<IMessageEditorSave>;
    // [key: string]: MessageEvent<IMessage>;
}

/* 编辑器就绪 */
export interface IMessageEditorReady extends IMessage {
    channel: "editor-ready";
    data: {
        status: boolean;
    };
}

/* 编辑器内容更改事件 */
export interface IMessageEditorChanged extends IMessage {
    channel: "editor-changed";
    data: IEditorEvent["changed"];
}

/* 保存事件 */
export interface IMessageEditorSave extends IMessage {
    channel: "editor-save";
    data: IEditorEvent["save"];
}
