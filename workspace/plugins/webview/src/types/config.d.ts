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

import { IMouseStatus, type IKeyboardStatus } from "@workspace/utils/shortcut";

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

export interface IConfig {
    /* 标签页打开 */
    tab: {
        enable: boolean, // 是否启用
        open: IOpen, // 打开相关配置
    },

    /* 窗口打开 */
    window: {
        enable: boolean, // 是否启用
        open: IOpen, // 打开相关配置
    }
}
