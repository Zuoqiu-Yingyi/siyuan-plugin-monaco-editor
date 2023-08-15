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

import type { Category } from "@/wakatime/heartbeats";

/* 活动 */
export interface IActivity {
    category: Category;
}

export interface IWakaTime {
    api_url: string; // API URL
    api_key: string; // API KEY
    timeout: number; // 请求超时时间 (单位: s)
    hide_branch_names: boolean; // 是否隐藏笔记本名 (使用笔记本 ID 代替)
    hide_file_names: boolean; // 是否隐藏文件路径 (使用文档 ID 代替)

    heartbeats: boolean; // 是否开启心跳连接
    project: string; // 项目名称
    language: string; // 语言名称
    interval: number; // 推送时间间隔 (单位: s)

    view: IActivity; // 查看活动
    edit: IActivity; // 编辑活动
}

export interface IConfig {
    wakatime: IWakaTime;
}
