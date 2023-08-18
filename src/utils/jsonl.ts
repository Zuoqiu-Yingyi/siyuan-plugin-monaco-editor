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

/**
 * jsonlines 解析
 * @param text 文本
 * @returns 解析结果
 */
export function parse<T>(text: string): T[] {
    return text.split("\n")
        .filter(line => line.trim().length > 0)
        .map(line => JSON.parse(line));
}

/**
 * jsonlines 序列化
 * @param data 数据
 * @returns 序列化结果
 */
export function stringify<T>(data: T[]): string {
    return data.map((item) => JSON.stringify(item)).join("\n");
}

export default {
    parse,
    stringify,
}
