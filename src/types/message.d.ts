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
    IEditorEvents,
    IEditorModel,
    IEditorProps,
    IEditorFunction,
    IEditorOptions,
} from "./editor";
import type {
    IVditorProps,
    IVditorEvents,
} from "./vditor";
import type { IMonacoEditorOptions } from "./config";

/* 传输的消息 */
export interface IMessage {
    channel: string; // 通道
    data: any; // 数据
}

/* 来自主机的消息 */
export interface IMessageEditorMasterEventMap extends Record<string, MessageEvent> {
    "editor-init": MessageEvent<IMessageEditorInit>;
    "editor-set": MessageEvent<IMessageEditorSet>;
}

export interface IMessageVditorMasterEventMap extends Record<string, MessageEvent> {
    "vditor-init": MessageEvent<IMessageVditorInit>;
    "vditor-set": MessageEvent<IMessageVditorSet>;
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

export interface IMessageVditorInit extends IMessage {
    channel: "vditor-init";
    data: {
        name: string; // 插件名称
        i18n: I18N; // 插件国际化字段

        path?: IVditorProps["path"];
        vditorID?: IVditorProps["vditorID"];
        assetsDirPath?: IVditorProps["assetsDirPath"];
        assetsUploadMode?: IVditorProps["assetsUploadMode"];
        options?: IVditorProps["options"];
        value?: IVditorProps["value"];
        theme?: IVditorProps["theme"];
        codeBlockThemeLight?: IVditorProps["codeBlockThemeLight"];
        codeBlockThemeDark?: IVditorProps["codeBlockThemeDark"];
        updatable?: IVditorProps["updatable"];
        changable?: IVditorProps["changable"];
        debug?: IVditorProps["debug"];
    };
}

/* 设置编辑器设置项 */
export interface IMessageEditorSet extends IMessage {
    channel: "editor-set";
    data: Partial<IEditorFunction> & Partial<IEditorOptions>;
}

export interface IMessageVditorSet extends IMessage {
    channel: "vditor-set";
    data: Partial<IVditorProps>;
}

/* 来自从机的消息 */
export interface IMessageEditorSlaveEventMap extends Record<string, MessageEvent> {
    "editor-ready": MessageEvent<IMessageEditorReady>;
    "editor-changed": MessageEvent<IMessageEditorChanged>;
    "editor-save": MessageEvent<IMessageEditorSave>;
    "editor-hover-siyuan": MessageEvent<IMessageEditorHoverSiyuan>;
    "editor-open-siyuan": MessageEvent<IMessageEditorOpenSiyuan>;
    // [key: string]: MessageEvent<IMessage>;
}

export interface IMessageVditorSlaveEventMap extends Record<string, MessageEvent> {
    "vditor-ready": MessageEvent<IMessageVditorReady>;
    "vditor-changed": MessageEvent<IMessageVditorChanged>;
    "vditor-save": MessageEvent<IMessageVditorSave>;
    "vditor-open-link": MessageEvent<IMessageVditorOpenLink>;
    // [key: string]: MessageEvent<IMessage>;
}

/* 编辑器就绪 */
export interface IMessageEditorReady extends IMessage {
    channel: "editor-ready";
    data: {
        status: boolean;
    };
}
export interface IMessageVditorReady extends IMessage {
    channel: "vditor-ready";
    data: {
        status: boolean;
    };
}

/* 编辑器内容更改事件 */
export interface IMessageEditorChanged extends IMessage {
    channel: "editor-changed";
    data: IEditorEvents["changed"];
}

export interface IMessageVditorChanged extends IMessage {
    channel: "vditor-changed";
    data: IVditorEvents["changed"];
}

/* 保存事件 */
export interface IMessageEditorSave extends IMessage {
    channel: "editor-save";
    data: IEditorEvents["save"];
}

export interface IMessageVditorSave extends IMessage {
    channel: "vditor-save";
    data: IVditorEvents["save"];
}

/* 鼠标悬浮事件 */
export interface IMessageEditorHoverSiyuan extends IMessage {
    channel: "editor-hover-siyuan";
    data: IEditorEvents["hover"];
}

/* 打开链接事件 */
export interface IMessageEditorOpenSiyuan extends IMessage {
    channel: "editor-open-siyuan";
    data: IEditorEvents["open"];
}

export interface IMessageVditorOpenLink extends IMessage {
    channel: "vditor-open-link";
    data: IVditorEvents["open-link"];
}
