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

/* 将 heightlight.js 的语言映射为 monaco 支持的语言 */
export function heightlight2monaco(language: string): string {
    switch (language) {
        case "mindmap":
            return "markdown";
        case "echarts":
            return "json";

        case "c#":
            return "csharp";
        case "js":
            return "javascript";
        case "ts":
            return "typescript";
        case "objectivec":
            return "objective-c";
        case "solidity":
            return "sol";
        case "vbscript":
            return "vb";
        default:
            return language;
    }
}
