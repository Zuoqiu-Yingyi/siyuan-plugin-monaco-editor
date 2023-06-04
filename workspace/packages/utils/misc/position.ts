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
    const screenX = (globalThis as any).mozInnerScreenX ?? globalThis.screenX;
    const screenY = (globalThis as any).mozInnerscreenY ?? globalThis.screenY;

    return {
        x: screenX + rect.x,
        y: screenY + rect.y,

        centerX: screenX + rect.x + Math.round(rect.width / 2),
        centerY: screenY + rect.y + Math.round(rect.height / 2),

        left: screenX + rect.left,
        right: screenX + rect.right,

        top: screenY + rect.top,
        bottom: screenY + rect.bottom,
    };
}
