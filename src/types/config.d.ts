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

import type { Electron } from "@workspace/types/electron";
import { EditorType } from "@workspace/utils/siyuan";
import { IMouseStatus, type IKeyboardStatus } from "@workspace/utils/shortcut";

/* 常规设置 */
export interface IGeneral {
    useragent: string, // 用户代理
    background: string, // 背景颜色/图片
}

/* 打开的目标类型 */
export interface ITargets {
    hyperlink: { // 超链接
        editor: { // 编辑区的链接
            enable: boolean,
        },
        other: { // 其他链接
            enable: boolean,
        },
    }
}

export interface IProtocols {
    [key: string]: {
        enable: boolean, // 是否支持
        prefix: string, // 用于判断的协议前缀
    };
}

export interface IOpen {
    mouse: IMouseStatus, // 用于打开的鼠标按键
    targets: ITargets, // 打开的目标类型
    protocols: IProtocols, // 支持的协议
}


export interface IWindowParams extends Electron.BrowserWindowConstructorOptions {
    width: number, // 窗口宽度
    height: number, // 窗口高度
    frame: boolean, // 窗口边框
    alwaysOnTop: boolean, // 是否置顶
    autoHideMenuBar: boolean, // 是否自动隐藏菜单栏

    enableMenuBar: boolean, // 是否启用菜单栏
}

export interface ISiyuanWindow {
    enable: boolean, // 是否打开思源编辑窗口
    focus: boolean, // 打开的思源编辑窗口是否默认聚焦
    editorType: EditorType.desktop | EditorType.mobile, // 打开的思源编辑器类型
}

export interface IConfig {
    /* 常规设置 */
    general: IGeneral,

    /* 标签页打开 */
    tab: {
        enable: boolean, // 是否启用
        open: IOpen, // 打开相关配置
    },

    /* 窗口打开 */
    window: {
        enable: boolean, // 是否启用
        open: IOpen, // 打开相关配置
        params: IWindowParams, // 窗口参数
        siyuan: ISiyuanWindow, // 思源窗口参数
    }
}
