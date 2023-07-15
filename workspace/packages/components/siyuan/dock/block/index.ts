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

import type { TooltipsDirection } from "../../misc/tooltips";

export interface IIcon {
    icon: string; // 图标 ID
    type?: string; // data-type 属性值
    active?: boolean; // 是否激活
    ariaLabel?: string; // 提示标签内容
    tooltipsDirection?: TooltipsDirection; // 提示标签方向
    onClick?: (element: HTMLElement, e: MouseEvent) => void; // 按钮点击回调函数
}

export interface IBar {
    logo: string; // svg 图标引用 ID
    title: string; // 标题
    icons: IIcon[]; // 按钮列表
}
