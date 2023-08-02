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

/* CSS 片段 */
export interface ICSS {
    enable: boolean, // 是否启用
    code: string, // CSS 代码片段
}

/* 字体列表 */
export interface IFont {
    enable: boolean, // 是否启用
    list: string[], // 字体列表
}

/* 字体设置 */
export interface IFonts {
    base: IFont, // 基础字体列表
    code: IFont, // 代码字体列表
    graph: IFont, // 关系图字体列表
    math: IFont, // 数学公式字体列表
    emoji: IFont, // 表情符号字体列表
}

export interface IMenu {
    block: IFont, // 自定义块字体
}

export interface IConfig {
    css: ICSS, // css 代码片段
    fonts: IFonts, // 字体设置
    menu: IMenu, // 菜单设置
}
