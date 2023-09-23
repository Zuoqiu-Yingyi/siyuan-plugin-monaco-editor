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

export interface IWindowParams extends Electron.BrowserWindowConstructorOptions {
    x: number, // 窗口横坐标
    y: number, // 窗口纵坐标
    width: number, // 窗口宽度
    height: number, // 窗口高度
}

export type TMessageEventMap = Record<string, MessageEvent>;
export type TMessageEventListener<
    K extends keyof EventMap,
    EventMap extends TMessageEventMap,
> = (messageEvent: EventMap[K]) => void;
export type TElectronMessageEventListener = (e: Electron.MessageEvent) => void;
