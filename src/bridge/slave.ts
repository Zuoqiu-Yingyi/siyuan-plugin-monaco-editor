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

export type MasterMessageEvent = IMessageEditorMasterEventMap[keyof IMessageEditorMasterEventMap];
export type MessageEventListener<
    K extends keyof IMessageEditorMasterEventMap = keyof IMessageEditorMasterEventMap,
> = (messageEvent: IMessageEditorMasterEventMap[K]) => void;

export class EditorBridgeSlave {
    public port: MessagePort; // 消息通道端口
    protected readonly _listeners: Map<
        MessageEventListener,
        MessageEventListener
    > = new Map(); // 监听器 映射到 包装后的监听器

    constructor(
        protected oninited: (this: InstanceType<typeof EditorBridgeSlave>) => void = () => { },
    ) {
        switch (true) {
            case FLAG_ELECTRON: {
                /**
                 * 使用 ipcRenderer 获取 MessagePortMain
                 * REF: https://www.electronjs.org/zh/docs/latest/api/ipc-renderer
                 * REF: https://www.electronjs.org/zh/docs/latest/tutorial/ipc
                 * REF: https://www.electronjs.org/zh/docs/latest/api/message-channel-main
                 */
                const { ipcRenderer } = globalThis.require("electron") as { ipcRenderer: Electron.IpcRenderer };
                ipcRenderer.once(constants.INIT_CHANNEL_NAME, this.initEventListener);
                break;
            }
            case FLAG_IFRAME:
            case FLAG_POPUP:
            default:
                /**
                 * 使用 addEventListener("message") 获取 MessagePort
                 * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#the_dispatched_event
                 * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/MessagePort
                 * REF: https://github.com/mdn/dom-examples/blob/main/channel-messaging-basic/page2.html
                 */
                globalThis.addEventListener("message", this.initEventListener, { once: true });
                break;
        }
    }

    /* 初始化事件 */
    protected readonly initEventListener = (e: MessageEvent | Electron.IpcRendererEvent, dark?: boolean) => {
        // console.debug(e);
        // this.port.postMessage("editor-message");

        /* 设置回退的主题颜色 */
        if (e instanceof MessageEvent) {
            dark = e.data;
        }
        globalThis.document.documentElement.style.setProperty(
            "--vscode-editor-background",
            dark ? "#1f1f1f" : "#ffffff",
        );

        this.port = e.ports[0];
        this.port.start(); // 开始接受消息
        this.oninited();
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

    /**
     * 添加监听器
     * @param _channel: 通道名称
     * @param listener: 监听器回调函数
     * @return: 添加是否成功
     */
    public addEventListener<
        K extends keyof IMessageEditorMasterEventMap,
    >(
        channel: K,
        listener: MessageEventListener<K>,
        options?: Pick<AddEventListenerOptions, "once">,
    ): boolean {
        if (this._listeners.has(listener)) { // 监听器已经添加
            return false; // 监听器添加失败
        }
        else { // 添加新的监听器
            const listenerWrapper: MessageEventListener<K> = e => {
                if (e?.data?.channel === channel) {
                    if (options?.once) {
                        this.removeEventListener(
                            channel,
                            listener,
                        );
                    }
                    listener(e);
                }
            };
            this._listeners.set(listener, listenerWrapper);
            this.port.addEventListener(
                constants.MESSAGE_EVENT_NAME,
                listenerWrapper,
            );
            return true; // 监听器添加成功
        }
    }

    /**
     * 移除监听器
     * @param _channel: 通道名称
     * @param listener: 监听器回调函数
     * @return: 移除是否成功
     */
    public removeEventListener<
        K extends keyof IMessageEditorMasterEventMap = keyof IMessageEditorMasterEventMap,
    >(
        _channel: K,
        listener: MessageEventListener<K>,
    ): boolean {
        if (this._listeners.has(listener)) { // 监听器存在
            this.port.removeEventListener(
                constants.MESSAGE_EVENT_NAME,
                this._listeners.get(listener),
            );
            this._listeners.delete(listener);
            return true; // 监听器移除成功
        }
        else { // 无法移除不存在的监听器
            return false; // 监听器移除失败
        }
    }
}
