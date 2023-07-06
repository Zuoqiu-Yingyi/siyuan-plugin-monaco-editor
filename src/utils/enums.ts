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

/* 块菜单项模式 */
export enum MenuItemMode {
    input, // 输入框
    button, // 按钮
    separator, // 分割线
}

/* 任务类型 */
export enum TaskType {
    edit, // 编辑块属性

    update, // 更新块属性 (覆盖整个块属性)
    delete, // 删除块属性 (删除整个块属性)
    switch, // 切换块属性 (切换整个块属性)

    insert, // 插入块属性 (在块属性中插入一个 Token)
    remove, // 移除块属性 (在块属性中移除一个 Token)
    toggle, // 切换块属性 (在块属性中增删一个 Token)
    replace, // 替换块属性 (在块属性中替换一个 Token)

    fullscreen, // 全屏
}
