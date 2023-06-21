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

import { Parser } from "@/utils/export"

export interface IRow {
    key: string; // 属性名
    activate: boolean; // 是否导出
    _key?: string; // 导出的属性名
    parser?: Parser; // 自定义属性使用的解析器
}

export interface IConfig {
    rows: IRow[]; // 表格行状态
    retain: boolean; // 是否在导出时保留
}
