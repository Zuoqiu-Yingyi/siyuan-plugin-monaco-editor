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

/* 元素方位计算 */

/* 计算 DOM 元素相对于屏幕原点方位 */
export function getElementScreenPosition(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return {
        x: globalThis.screenX + rect.x,
        y: globalThis.screenY + rect.y,

        centerX: globalThis.screenX + rect.x + Math.round(rect.width / 2),
        centerY: globalThis.screenY + rect.y + Math.round(rect.height / 2),

        left: globalThis.screenX + rect.left,
        right: globalThis.screenX + rect.right,

        top: globalThis.screenY + rect.top,
        bottom: globalThis.screenY + rect.bottom,
    };
}
