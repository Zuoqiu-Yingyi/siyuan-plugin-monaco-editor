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

import { TaskType } from "@/utils/enums";

/* 块菜单任务 */
export type Task = IEditTask | IToggleTask | iconFullscreen;

/* 块菜单任务 */
export interface ITask {
    type: TaskType, // 任务类型
    params: any, // 任务输入参数
}

/* 块菜单属性编辑任务 */
export interface IEditTask extends ITask {
    type: TaskType, // 任务类型
    params: { // 任务输入参数
        name: string, // 待编辑的块属性名称
    },
}

/* 块菜单属性 token 增删任务 */
export interface IToggleTask extends ITask {
    type: TaskType, // 任务类型
    params: { // 任务输入参数
        name: string, // 属性名
        token: string, // 需要增删的 token
    },
}

/* 全屏任务 */
export interface IFullscreenTask extends ITask {
    type: TaskType, // 任务类型
}
