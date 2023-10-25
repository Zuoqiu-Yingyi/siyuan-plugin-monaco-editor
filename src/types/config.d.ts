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

export interface IBlockConfig {
    row: boolean; // 是否定位到行
}

export interface ITypewriter {
    enable: boolean; // 是否启用
    timeout: number; // 延时 (ms)
    code: IBlockConfig; // 代码块
    table: IBlockConfig; // 表格块
    view: IBlockConfig; // 属性视图块
}

export interface IFocus {
    enable: boolean; // 是否启用
}

export interface IConfig {
    typewriter: ITypewriter;
    focus: IFocus;
}
