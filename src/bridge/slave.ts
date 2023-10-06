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
    TMessageEventMap,
    TMessageEventListener,
} from ".";

type TInitMessageEventListener<M> = (e: MessageEvent<M>) => void;
type TInitEventMessageEventListener<M> = (e: Electron.IpcRendererEvent, message: M) => void;
type TInitEventListener<M> = TInitMessageEventListener<M>
    | TInitEventMessageEventListener<M>;

export class BridgeSlave<
    M,
    MessageMasterEventMap extends TMessageEventMap,
    MessageEventListener extends TMessageEventListener<keyof MessageMasterEventMap, MessageMasterEventMap> = TMessageEventListener<keyof MessageMasterEventMap, MessageMasterEventMap>,
> {
    public port: MessagePort; // 消息通道端口
    protected readonly _listeners: Map<
        MessageEventListener,
        MessageEventListener
    > = new Map(); // 监听器 映射到 包装后的监听器

    constructor(
        protected oninited: (msg: M) => any = () => { },
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
                ipcRenderer.once(
                    constants.INIT_CHANNEL_NAME,
                    this.initEventListener as TInitEventMessageEventListener<M>,
                );
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
                globalThis.addEventListener(
                    "message",
                    this.initEventListener as TInitMessageEventListener<M>,
                    { once: true },
                );
                break;
        }
    }

    /* 初始化事件 */
    protected readonly initEventListener: TInitEventListener<M> = (e, msg) => {
        // console.debug(e);

        this.port = e.ports[0];
        this.port.start(); // 开始接受消息

        if (e instanceof MessageEvent) {
            this.oninited(e.data);
        }
        else {
            this.oninited(msg);
        }
    }

    /**
     * 添加监听器
     * @param _channel: 通道名称
     * @param listener: 监听器回调函数
     * @return: 添加是否成功
     */
    public addEventListener<
        K extends keyof MessageMasterEventMap,
    >(
        channel: K,
        listener: TMessageEventListener<K, MessageMasterEventMap>,
        options?: Pick<AddEventListenerOptions, "once">,
    ): boolean {
        if (this._listeners.has(listener as MessageEventListener)) { // 监听器已经添加
            return false; // 监听器添加失败
        }
        else { // 添加新的监听器
            const listenerWrapper: TMessageEventListener<K, MessageMasterEventMap> = e => {
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
            this._listeners.set(listener as MessageEventListener, listenerWrapper as MessageEventListener);
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
        K extends keyof MessageMasterEventMap = keyof MessageMasterEventMap,
    >(
        _channel: K,
        listener: TMessageEventListener<K, MessageMasterEventMap>,
    ): boolean {
        if (this._listeners.has(listener as MessageEventListener)) { // 监听器存在
            this.port.removeEventListener(
                constants.MESSAGE_EVENT_NAME,
                this._listeners.get(listener as MessageEventListener),
            );
            this._listeners.delete(listener as MessageEventListener);
            return true; // 监听器移除成功
        }
        else { // 无法移除不存在的监听器
            return false; // 监听器移除失败
        }
    }
}
