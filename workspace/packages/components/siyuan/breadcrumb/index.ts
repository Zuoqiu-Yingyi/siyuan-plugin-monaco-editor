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

export interface IEventIcon {
    click: {
        event: MouseEvent,
        element: HTMLElement,
    };
}

export type IBreadcrumbElement = IBreadcrumbItem | IBreadcrumbArrow;

export interface IBreadcrumbItem {
    type: "item";
    itemId?: string; // 块 ID (item 点击跳转)

    iconId?: string; // 块 ID (svg 悬浮预览)
    icon?: string; // svg 图标引用

    text?: string; // 文本
    textTitle?: string; // 文本标题
    textEllipsis?: boolean; // 文本收缩

    active?: boolean; // 是否为激活状态
}

export interface IBreadcrumbArrow {
    type: "arrow";
    icon?: string; // svg 图标引用
}

