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

import { FLAG_ELECTRON } from "@workspace/utils/env/front-end";
import { merge } from "@workspace/utils/misc/merge";

import type { Electron } from "@workspace/types/electron";

import MonacoEditorPlugin from "@/index";
import type {
    IMessageEditorSlaveEventMap,
    IMessageEditorInit,
    IMessageEditorSet,
} from "@/types/message";

export type SlaveMessageEvent = IMessageEditorSlaveEventMap[keyof IMessageEditorSlaveEventMap];
export type MessageEventListener<
    K extends keyof IMessageEditorSlaveEventMap = keyof IMessageEditorSlaveEventMap,
> = (messageEvent: IMessageEditorSlaveEventMap[K]) => void;
export type ElectronMessageEventListener = (e: Electron.MessageEvent) => void;

export interface IWindowParams extends Electron.BrowserWindowConstructorOptions {
    x: number, // 窗口横坐标
    y: number, // 窗口纵坐标
    width: number, // 窗口宽度
    height: number, // 窗口高度
}

export class EditorBridgeMaster {
    /* 创建消息通道 */
    public static createChannel(iframe: boolean = false) {
        if (FLAG_ELECTRON && !iframe) {
            // REF: https://www.electronjs.org/zh/docs/latest/api/message-channel-main#class-messagechannelmain
            const { MessageChannelMain } = globalThis.require("@electron/remote") as Electron.RemoteMainInterface;
            return new MessageChannelMain();
        }
        else {
            // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel
            return new MessageChannel();
        }
    }

    /* 窗口默认设置 */
    public static readonly BROWSER_WINDOW_DEFAULT_OPTIONS: Electron.BrowserWindowConstructorOptions = {
        title: "Monaco Editor",
        alwaysOnTop: true,
        autoHideMenuBar: false,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            webSecurity: false,
            contextIsolation: false,
        },
    } as const;

    protected readonly _listeners: Map<
        MessageEventListener,
        MessageEventListener | ElectronMessageEventListener
    > = new Map(); // 监听器 映射到 包装后的监听器

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
        public channel: MessageChannel | Electron.MessageChannelMain, // 消息通道
        public readonly url: URL = new URL(`${globalThis.document.baseURI}plugins/${plugin.name}/iframes/editor.html`), // 编辑器 URL
    ) {
        /* 错误消息/关闭消息 */
        if (this.channel instanceof MessageChannel) {
            this.channel.port1.addEventListener(
                "messageerror",
                e => this.plugin.logger.warn("message error", e),
            );
        }
        else {
            this.channel.port1.addListener(
                "close",
                _e => {
                    // this.plugin.logger.info("browser window close");
                    // this.destroy();
                },
            );
        }
    }

    /* 手动销毁资源 */
    public destroy() {
        this.channel.port1.close();
        this.channel.port2.close();
    }

    /**
     * 创建新窗口形态的编辑器
     */
    public createEditorWindow(
        options: IWindowParams,
    ): Window | Electron.BrowserWindow {
        const params = merge(
            EditorBridgeMaster.BROWSER_WINDOW_DEFAULT_OPTIONS,
            options,
        );
        // this.plugin.logger.debug(params);

        if (FLAG_ELECTRON) {
            try {
                const { BrowserWindow } = globalThis.require("@electron/remote") as Electron.RemoteMainInterface;
                const browser = new BrowserWindow(params);
                // browser.removeMenu();

                /* 启用 Electron 环境 */
                globalThis
                    .require('@electron/remote')
                    .require('@electron/remote/main')
                    .enable(browser.webContents);

                /* 加载 URL */
                browser.loadURL(this.url.href);

                /**
                 * 编辑器加载完成
                 * REF: https://www.electronjs.org/zh/docs/latest/api/web-contents#event-did-finish-load
                 */
                browser.webContents.once("did-finish-load", _e => {
                    // this.plugin.logger.debug(_e);
                    this.channel.port1.start(); // 开始接受消息

                    /**
                     * 向窗口发送消息以建立消息通道
                     * REF: https://www.electronjs.org/zh/docs/latest/api/web-contents#contentspostmessagechannel-message-transfer
                     * REF: https://www.electronjs.org/zh/docs/latest/tutorial/message-ports
                     */
                    browser.webContents.mainFrame.postMessage(
                        constants.INIT_CHANNEL_NAME,
                        undefined,
                        [this.channel.port2 as Electron.MessagePortMain],
                    );
                });

                return browser;
            } catch (err) {
                this.plugin.logger.warn(err);
            }
        }
        else {
            const popup = globalThis.open(
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
            // 可能会被浏览器阻止弹窗
            popup?.addEventListener("load", _e => {
                // this.plugin.logger.debug(_e);
                this.channel.port1.start(); // 开始接受消息

                /**
                 * 向窗口发送消息以建立消息通道
                 * REF: https://zh.javascript.info/cross-window-communication#iframe-cuo-wu-wen-dang-xian-jing
                 * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage
                 */
                popup?.postMessage(
                    undefined,
                    "*",
                    [this.channel.port2 as MessagePort],
                );
            });
            return popup;
        }
    }

    /**
     * 创建 iframe 形态的编辑器
     */
    public createEditorIframe(
        iframe: HTMLIFrameElement = globalThis.document.createElement("iframe"),
    ): HTMLIFrameElement {
        iframe.src = this.url.href;
        iframe.addEventListener("load", _e => {
            // this.plugin.logger.debug(_e);

            try {
                this.channel.port1.start(); // 开始接受消息

                /**
                 * 向 iframe 发送消息以建立消息通道
                 * REF: https://github.com/mdn/dom-examples/blob/main/channel-messaging-basic/index.html
                 */
                iframe.contentWindow.postMessage(
                    undefined,
                    "*",
                    [this.channel.port2 as MessagePort],
                );
            } catch (error) {
                /**
                 * Uncaught DOMException: Failed to execute 'postMessage' on 'Window': Port at index 0 is already neutered.
                 * 拖动页签分屏时出现
                 * 需要重建建立一个 channel
                 */
                this.destroy();
                this.rebuildChannel();
                this.channel.port1.start();
                iframe.contentWindow.postMessage(
                    undefined,
                    "*",
                    [this.channel.port2 as MessagePort],
                );
            }

        });
        return iframe;
    }

    /* 重建消息通道 */
    public rebuildChannel() {
        if (this.channel instanceof MessageChannel) {
            this.channel = new MessageChannel();
            for (const listener of this._listeners.values()) {
                this.channel.port1.addEventListener(
                    constants.MESSAGE_EVENT_NAME,
                    listener as MessageEventListener,
                );
            }
        }
        else {
            const { MessageChannelMain } = globalThis.require("@electron/remote") as Electron.RemoteMainInterface;
            this.channel = new MessageChannelMain();
            for (const listener of this._listeners.values()) {
                this.channel.port1.addListener(
                    constants.MESSAGE_EVENT_NAME,
                    listener as ElectronMessageEventListener,
                );
            }
        }
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

    /**
     * 添加监听器
     * @param _channel: 通道名称
     * @param listener: 监听器回调函数
     * @return: 添加是否成功
     */
    public addEventListener<
        K extends keyof IMessageEditorSlaveEventMap,
    >(
        channel: K,
        listener: MessageEventListener<K>,
        options?: Pick<AddEventListenerOptions, "once">,
    ): boolean {
        if (this._listeners.has(listener)) { // 监听器已经添加
            return false; // 监听器添加失败
        }
        else { // 添加新的监听器
            /* 包装监听器 (以实现 once 功能) */
            const listenerWrapper: MessageEventListener<K> = e => {
                // this.plugin.logger.debug(e);
                if (e?.data?.channel === channel) {
                    if (options?.once) {
                        this.removeEventListener(channel, listener);
                    }
                    listener(e);
                }
            };

            /* 建立 原始监听器 到 包装后监听器 的映射 */
            this._listeners.set(listener, listenerWrapper);

            /* 添加包装后的监听器 */
            if (this.channel instanceof MessageChannel) {
                this.channel.port1.addEventListener(
                    constants.MESSAGE_EVENT_NAME,
                    listenerWrapper,
                );
            }
            else {
                this.channel.port1.addListener(
                    constants.MESSAGE_EVENT_NAME,
                    listenerWrapper as unknown as ElectronMessageEventListener,
                );
            }
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
        K extends keyof IMessageEditorSlaveEventMap = keyof IMessageEditorSlaveEventMap,
    >(
        _channel: K,
        listener: MessageEventListener<K>,
    ): boolean {
        if (this._listeners.has(listener)) { // 监听器存在
            if (this.channel instanceof MessageChannel) {
                this.channel.port1.removeEventListener(
                    constants.MESSAGE_EVENT_NAME,
                    this._listeners.get(listener) as MessageEventListener,
                );
            }
            else {
                this.channel.port1.removeListener(
                    constants.MESSAGE_EVENT_NAME,
                    this._listeners.get(listener) as ElectronMessageEventListener,
                );
            }
            this._listeners.delete(listener);
            return true; // 监听器移除成功
        }
        else { // 无法移除不存在的监听器
            return false; // 监听器移除失败
        }
    }
}
