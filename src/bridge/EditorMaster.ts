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

import MonacoEditorPlugin from "@/index";

import type { Electron } from "@workspace/types/electron";
import type {
    IMessageEditorSlaveEventMap,
    IMessageEditorInit,
    IMessageEditorSet,
} from "@/types/message";
import { BridgeMaster } from "./master";

export type SlaveMessageEvent = IMessageEditorSlaveEventMap[keyof IMessageEditorSlaveEventMap];
export type MessageEventListener<
    K extends keyof IMessageEditorSlaveEventMap = keyof IMessageEditorSlaveEventMap,
> = (messageEvent: IMessageEditorSlaveEventMap[K]) => void;
export type ElectronMessageEventListener = (e: Electron.MessageEvent) => void;

export class EditorBridgeMaster extends BridgeMaster<IMessageEditorSlaveEventMap> {
    protected readonly _listeners: Map<
        MessageEventListener,
        MessageEventListener | ElectronMessageEventListener
    > = new Map(); // 监听器 映射到 包装后的监听器

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
        public channel: MessageChannel | Electron.MessageChannelMain, // 消息通道
        public readonly url: URL = new URL(`${globalThis.document.baseURI}plugins/${plugin.name}/iframes/editor.html`), // 编辑器 URL
    ) {
        super(plugin, channel, url);
    }

    /* 初始化 */
    public init(data: IMessageEditorInit["data"]) {
        /* 组装消息 */
        const message: IMessageEditorInit = {
            channel: "editor-init",
            data,
        };

        /* 发送消息 */
        this.channel.port1.postMessage(message);
    }

    /* 初始化 */
    public set(data: IMessageEditorSet["data"]) {
        /* 组装消息 */
        const message: IMessageEditorSet = {
            channel: "editor-set",
            data,
        };

        /* 发送消息 */
        this.channel.port1.postMessage(message);
    }
}
