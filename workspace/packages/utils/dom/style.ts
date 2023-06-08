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

/* 样式标签管理 */

import { moveElementToHead } from ".";

/**
 * 更新样式标签 <style>
 * @params element: 样式标签 DOM 节点
 * @params css: CSS 代码
 */
export function updateStyle(element: HTMLStyleElement, css: string): void {
    element.textContent = css;
}

/**
 * 根据 ID 插入或更新样式标签 <style>
 * @params id: 标签 ID
 * @params css: CSS 代码
 * @return: 样式标签 DOM 节点
 */
export function updateStyleById(id: string, css: string): HTMLStyleElement {
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement("style");
        style.id = id;
        moveElementToHead(style);
    }
    updateStyle(style, css);
    return style;
}

