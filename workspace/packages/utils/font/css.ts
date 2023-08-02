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

import parseFont from "mapbox-to-css-font";
export { parseFont };

import type { FontData } from "@workspace/types/misc/browser";


/**
 * 将字体样式转换为对应的 CSS 样式
 * @param font 字体信息
 * @param size 字号
 * @returns CSS `font` 属性 样式
 */
export function fontData2CssFontStyle(
    font: FontData,
    size: number = 16,
): string {
    return parseFont(`${font.family} ${font.style}`, size);
}

