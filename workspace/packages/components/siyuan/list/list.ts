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

/* 列表项 */
export interface IListItem {
    text: string, // 内容
    icon?: string, // 图标 (Unicode 字符 / svg ID)
    src?: string, // 图标 (图片 URL)
    meta?: string, // 元信息
    style?: string, // 样式

    narrow?: boolean, // 是否为紧凑布局
    border?: boolean, // 是否显示下级列表边框

    fold?: boolean, // 是否折叠
    children?: IListItem[], // 下级列表
    indent?: string, // 下级列表缩进
}
