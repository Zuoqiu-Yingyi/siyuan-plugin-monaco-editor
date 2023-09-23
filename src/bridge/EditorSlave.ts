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

import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
    FLAG_POPUP,
} from "@workspace/utils/env/native-front-end";

import constants from "@/constants";
import "@/styles/editor.less";

import type { Electron } from "@workspace/types/electron";
import type {
    IMessageEditorMasterEventMap,
    IMessageEditorReady,
    IMessageEditorChanged,
    IMessageEditorSave,
    IMessageEditorHoverSiyuan,
    IMessageEditorOpenSiyuan,
} from "@/types/message";
import { BridgeSlave } from "./slave";

export type MasterMessageEvent = IMessageEditorMasterEventMap[keyof IMessageEditorMasterEventMap];
export type MessageEventListener<
    K extends keyof IMessageEditorMasterEventMap = keyof IMessageEditorMasterEventMap,
> = (messageEvent: IMessageEditorMasterEventMap[K]) => void;

export class EditorBridgeSlave extends BridgeSlave<boolean, IMessageEditorMasterEventMap> {
    constructor(
        protected oninited: (this: InstanceType<typeof EditorBridgeSlave>) => any = () => { },
    ) {
        super(dark => {
            /* 设置回退的主题颜色 */
            globalThis.document.documentElement.style.setProperty(
                "--vscode-editor-background",
                dark ? "#1f1f1f" : "#ffffff",
            );
            this.oninited();
        });
    }

    /* 就绪 */
    public ready(data: IMessageEditorReady["data"] = { status: true }) {
        /* 组装消息 */
        const message: IMessageEditorReady = {
            channel: "editor-ready",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器内容更改 */
    public changed(data: IMessageEditorChanged["data"]) {
        /* 组装消息 */
        const message: IMessageEditorChanged = {
            channel: "editor-changed",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器保存 */
    public save(data: IMessageEditorSave["data"]) {
        /* 组装消息 */
        const message: IMessageEditorSave = {
            channel: "editor-save",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器悬浮思源字段 */
    public hover(data: IMessageEditorHoverSiyuan["data"]) {
        /* 组装消息 */
        const message: IMessageEditorHoverSiyuan = {
            channel: "editor-hover-siyuan",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器打开思源字段 */
    public open(data: IMessageEditorOpenSiyuan["data"]) {
        /* 组装消息 */
        const message: IMessageEditorOpenSiyuan = {
            channel: "editor-open-siyuan",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }
}
