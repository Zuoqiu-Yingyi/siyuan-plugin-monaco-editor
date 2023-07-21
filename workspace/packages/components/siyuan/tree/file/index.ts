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

import type { createEventDispatcher } from "svelte";
import type { Writable } from "svelte/store";

/* 文档树项类型 */
export enum FileTreeNodeType {
    Root = "navigation-root", // 根节点
    File = "navigation-file", // 文件节点
    Folder = "navigation-folder", // 文件夹节点
}

/* 树数据结构 */
export interface ITree {
    appendNode: (node: IFileTreeNodeStores) => void; // 添加节点
    removeNode: (node: IFileTreeNodeStores) => void; // 移除节点
}

/* 文档树派遣的事件载荷 */
export interface IFileTreeEventDetails {
    e: MouseEvent; // 鼠标事件
    props: IFileTreeNodeStores; // 组件响应式状态变量
    dispatcher: ReturnType<typeof createEventDispatcher<IFileTreeEvent>>; // 组件事件派遣器
}

/* 文档树派遣的事件 */
export interface IFileTreeEvent {
    create: {}, // 创建文件/文件夹
    delete: {}, // 删除文件/文件夹
    copy: {}, // 复制文件/文件夹
    move: {}, // 移动文件/文件夹
    rename: {}, // 重命名文件/文件夹
    refresh: {}, // 刷新文件夹

    open: IFileTreeEventDetails, // 打开文件
    menu: IFileTreeEventDetails, // 打开菜单
    fold: IFileTreeEventDetails, // 折叠文件夹
    unfold: IFileTreeEventDetails // 展开文件夹
}

/* 文档树节点 */
export interface IFileTreeNode {
    type: FileTreeNodeType; // 节点类型
    name: string; // 节点名称 (文件名/文件夹名)
    path: string; // 节点完整路径 (作为 ID)
    root: string; // 根节点路径
    depth?: number; // 深度, root 节点为 0
    indent?: string; // 缩进单位
    relative: string; // 节点相对于根节点的路径
    directory: string; // 节点所在目录完整路径 (作为上级节点的 ID)

    focus?: boolean; // 是否聚焦
    folded?: boolean; // 是否折叠
    draggable?: boolean; // 是否可拖拽
    hideActions?: boolean; // 是否显隐藏功能按钮

    title?: string; // 节点标题 (完整路径)
    children?: IFileTreeNode[]; // 下级节点

    toggleIcon?: string; // 展开/折叠图标
    toggleAriaLabel?: string; // 展开/折叠提示文本

    icon?: string; // 图标
    iconAriaLabel?: string; // 图标提示文本 (目录备注)

    text: string; // 文本
    textAriaLabel: string; // 文本提示文本 (相对路径)

    menuIcon?: string; // 菜单图标
    menuAriaLabel?: string; // 菜单提示文本

    count?: number; // 数量标志
    countAriaLabel?: string; // 数量标志提示文本
}

/* 响应式状态变量 */
export type IFileTreeNodeStores = {
    [P in keyof IFileTreeNode]: Writable<IFileTreeNode[P]>
}

/* 根节点 */
export interface IFileTreeRootNode extends IFileTreeFolderNode {
    type: FileTreeNodeType.Root;
    depth: 0;
}

/* 文件夹节点 */
export interface IFileTreeFolderNode extends IFileTreeNode {
    type: FileTreeNodeType.Folder | FileTreeNodeType.Root;
    folded: boolean;
}

/* 文件节点 */
export interface IFileTreeFileNode extends IFileTreeNode {
    type: FileTreeNodeType.File;
}
