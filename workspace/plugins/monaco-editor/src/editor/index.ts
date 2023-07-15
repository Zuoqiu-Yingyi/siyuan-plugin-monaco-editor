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
import constants from "@/constants";

import { isElectron } from "@workspace/utils/env/front-end";
import MonacoEditorPlugin from "@/index";

import type { Electron } from "@workspace/types/electron";

export class Editor {
    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
        public readonly channel: MessageChannel | Electron.MessageChannelMain, // 消息通道
        public readonly url: URL = new URL(`${globalThis.document.baseURI}plugins/${plugin.name}/iframes/editor.html`), // 编辑器 URL
    ) { }

    /**
     * 编辑器加载完成监听器
     */
    protected loadListener = () => {

    }

    /**
     * 在新窗口中打开编辑器
    */
    public openEditorInWindow(
        params: Electron.BrowserWindowConstructorOptions,
    ) {
        if (isElectron()) {
            try {
                const { BrowserWindow } = globalThis.require("@electron/remote") as Electron.RemoteMainInterface;
                const window = new BrowserWindow(params);

                /* 启用 Electron 环境 */
                globalThis
                    .require('@electron/remote')
                    .require('@electron/remote/main')
                    .enable(window.webContents);

                /* 加载 URL */
                window.loadURL(this.url.href);

                /**
                 * 编辑器加载完成
                 * REF: https://www.electronjs.org/zh/docs/latest/api/web-contents#event-did-finish-load
                 */
                window.webContents.once("did-finish-load", () => {
                    /**
                     * 向窗口发送消息以建立消息通道
                     * REF: https://www.electronjs.org/zh/docs/latest/api/web-contents#contentspostmessagechannel-message-transfer
                     */
                    window.webContents.postMessage(
                        constants.INIT_CHANNEL_NAME,
                        undefined,
                        [this.channel.port2 as Electron.MessagePortMain],
                    );
                });

                return window;
            } catch (err) {
                this.plugin.logger.warn(err);
            }
        }
        else {
            const window = globalThis.open(
                this.url,
                this.url.href,
                [
                    `popup = true`,
                    `width = ${params.width}`,
                    `height = ${params.height}`,
                    `left = ${params.x}`,
                    `top = ${params.y}`,
                ].join(","),
            );
            window.addEventListener("load", () => {
                /**
                 * 向窗口发送消息以建立消息通道
                 * REF: https://zh.javascript.info/cross-window-communication#iframe-cuo-wu-wen-dang-xian-jing
                 * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage
                 */
                window.postMessage(
                    undefined,
                    "*",
                    [this.channel.port2 as MessagePort],
                );
            });
            return window;
        }
    }

    /**
     * 在 iframe 中打开
     */
    public openEditorInIframe(
        iframe: HTMLIFrameElement = globalThis.document.createElement("iframe"),
    ): HTMLIFrameElement {
        iframe.src = this.url.href;
        iframe.addEventListener("load", () => {
            /**
             * 向 iframe 发送消息以建立消息通道
             * REF: https://github.com/mdn/dom-examples/blob/main/channel-messaging-basic/index.html
             */
            iframe.contentWindow.postMessage(
                undefined,
                "*",
                [this.channel.port2 as MessagePort],
            );
        });
        return iframe;
    }
}
