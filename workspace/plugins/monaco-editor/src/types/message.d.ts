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
    IEditorEvent,
    IEditorModel,
    IEditorProps,
    IEditorFunction,
    IEditorOptions,
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

        path?: IEditorProps["path"];

        diff: IEditorProps["diff"];
        locale: IEditorProps["locale"];

        savable?: IEditorFunction["savable"];
        changable?: IEditorFunction["changable"];

        original?: IEditorOptions["original"];
        modified?: IEditorOptions["modified"];
        options?: IEditorOptions["options"];
        originalOptions?: IEditorOptions["originalOptions"];
        modifiedOptions?: IEditorOptions["modifiedOptions"];
        diffOptions?: IEditorOptions["diffOptions"];
    };
}

/* 设置编辑器设置项 */
export interface IMessageEditorSet extends IMessage {
    channel: "editor-set";
    data: Partial<IEditorFunction> & Partial<IEditorOptions>;
}

/* 来自从机的消息 */
export interface IMessageEditorSlaveEventMap {
    "editor-ready": MessageEvent<IMessageEditorReady>;
    "editor-changed": MessageEvent<IMessageEditorChanged>;
    "editor-save": MessageEvent<IMessageEditorSave>;
    "editor-hover-siyuan": MessageEvent<IMessageEditorHoverSiyuan>;
    "editor-open-siyuan": MessageEvent<IMessageEditorOpenSiyuan>;
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

/* 鼠标悬浮事件 */
export interface IMessageEditorHoverSiyuan extends IMessage {
    channel: "editor-hover-siyuan";
    data: IEditorEvent["hover"];
}

/* 打开链接事件 */
export interface IMessageEditorOpenSiyuan extends IMessage {
    channel: "editor-open-siyuan";
    data: IEditorEvent["open"];
}
