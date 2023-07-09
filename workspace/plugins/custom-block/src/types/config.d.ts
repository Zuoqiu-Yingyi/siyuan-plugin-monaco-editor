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

import sdk from "@siyuan-community/siyuan-sdk";

import { MenuItemMode } from "@/utils/enums";
import { Task } from "./task";

/* 筛选器 */
export interface IFiltro {
    enable: boolean, // 是否启用
}

/* 类型过滤器 */
export type IFilter<T> = {
    default: IFiltro,
} & Partial<Record<T, IFiltro>>;


/* 块菜单功能配置 */
export interface IFeature {
    id: string, // 唯一标识 (i18n 的 key, 用于使用 :root 属性选择器启用的 key)
    enable: boolean, // 是否启用
    mode: MenuItemMode, // 菜单项模式
    multi: boolean, // 是否支持多选块
    style?: boolean, // 是否启用该样式
    token?: string, // 用于激活某个样式的令牌 (添加到 HTML 的属性中)
    icon?: string, // 图标引用 ID
    accelerator?: string, // 捷径提示
    type?: IFilter<sdk.siyuan.NodeType>, // 类型过滤器 (为空则表示所有类型)
    subtype?: IFilter<sdk.siyuan.BlockSubType>, // 子类型过滤器 (为空则表示所有类型)
    tasks?: Task[], // 任务列表
}

/* 主要配置 */
export interface IConfig {
    features: IFeature[],
}
