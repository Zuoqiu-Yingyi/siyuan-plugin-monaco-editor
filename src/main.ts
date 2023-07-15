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

/* 界面入口 */
import Main from "./components/Main.svelte";
import constants from "./constants";
import "./styles/main.less";

import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
} from "@workspace/utils/env/front-end";

import type { Electron } from "@workspace/types/electron";

/* 通道端口 */
var port: MessagePort;

/**
 * 初始化监听器
 */
async function initListener(e: MessageEvent | Electron.IpcRendererEvent) {
    port = e.ports[0];
    port.onmessage = messageListener;
}

/**
 * 消息监听器
 */
async function messageListener(e: MessageEvent) {
    console.log(e);
}

switch (true) {
    case FLAG_ELECTRON: {
        /**
         * 使用 ipcRenderer 获取 MessagePortMain
         * REF: https://www.electronjs.org/zh/docs/latest/api/ipc-renderer
         * REF: https://www.electronjs.org/zh/docs/latest/tutorial/ipc
         * REF: https://www.electronjs.org/zh/docs/latest/api/message-channel-main
         */
        const { ipcRenderer } = globalThis.require("electron") as { ipcRenderer: Electron.IpcRenderer };
        ipcRenderer.once(constants.INIT_CHANNEL_NAME, initListener);
        break;
    }
    case FLAG_IFRAME: {
        /**
         * 使用 addEventListener("message") 获取 MessagePort
         * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#the_dispatched_event
         * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/MessagePort
         * REF: https://github.com/mdn/dom-examples/blob/main/channel-messaging-basic/page2.html
         */
        globalThis.addEventListener("message", initListener, { once: true });
        break;
    }
    default:
        break;
}

const main = new Main({
    target: globalThis.document.body,
    props: {
    },
});
