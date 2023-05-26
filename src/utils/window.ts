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

/* 打开新窗口 */

import type { Electron } from "@workspace/types/electron";
import { isElectron } from "@workspace/utils/env/front-end";
import { merge } from "@workspace/utils/misc/merge";

import type { IWindowParams } from "./../types/config";
import { createMenuTemplate } from "../configs/menuTemplae";
import type WebviewPlugin from "..";


export interface IWebPreferences extends Electron.WebPreferences {
    defaultFontSize: number, // 默认字体大小
    defaultFontFamily: {
        standard: string, // 默认字体
    },
}

export interface IOverwrite extends Electron.BrowserWindowConstructorOptions {
    x: number, // 窗口横坐标
    y: number, // 窗口纵坐标
    title: string, // 窗口标题
    webPreferences?: IWebPreferences, // 页面配置
}

export function openNewWindow(
    url: URL, // 窗口地址
    windowParams: IWindowParams, // 窗口参数
    overwriteParams: IOverwrite, // 覆盖参数
    webPreferences: IWebPreferences, // 页面参数
    plugin: InstanceType<typeof WebviewPlugin>, // 插件对象
): Window | Electron.BrowserWindow {
    overwriteParams.webPreferences = merge(overwriteParams.webPreferences || {}, webPreferences) as IWebPreferences;
    const params = merge(windowParams, overwriteParams) as IOverwrite & IWindowParams;
    if (isElectron()) {
        const {
            BrowserWindow,
            Menu,
        } = globalThis.require("@electron/remote") as Electron.RemoteMainInterface;
        const window = new BrowserWindow(params);
        if (params.enableMenuBar) {
            const menu = Menu.buildFromTemplate(createMenuTemplate(globalThis.process.platform === "darwin", params.alwaysOnTop));
            window.setMenu(menu);
        }
        window.loadURL(
            url.href,
            {
                userAgent: plugin.useragent,
            },
        );
        return window;
    }
    else {
        return globalThis.open(
            url.href,
            url.href,
            [
                `popup = true`,
                `width = ${params.width}`,
                `height = ${params.height}`,
                `left = ${params.x}`,
                `top = ${params.y}`,
            ].join(","),
        );
    }
}
