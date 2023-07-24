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

import type siyuan from "siyuan";

import type { ComponentEvents } from "svelte";
import { get } from "svelte/store";

import Node from "@workspace/components/siyuan/tree/file/Node.svelte";
import {
    FileTreeNodeType,
    type ITree,
    type IFileTreeNode,
    type IFileTreeNodeStores,
    type IFileTreeRootNode,
} from "@workspace/components/siyuan/tree/file";
import { normalize } from "@workspace/utils/path/normalize";
import {
    join,
    dirname,
    basename,
    extname,
} from "@workspace/utils/path/browserify";
import { isBinaryExt } from "@workspace/utils/file/binary";
import { fn__code, ft__primary } from "@workspace/utils/siyuan/text/span";

import type MonacoEditorPlugin from "@/index";
import { Select } from "./select";
import { ExplorerIcon } from "./icon";
import { ExplorerTooltip } from "./tooltip";
import { ExplorerContextMenu } from "./menu";

/* 资源 */
export interface IItem {
    name: string; // 文件名/文件夹名
    path: string; // 绝对路径
    relative: string; // 相对于工作空间目录的相对路径
    isFile: boolean; // 是否为文件
    isFolder: boolean; // 是否为文件夹
    isSymlink: boolean; // 是否为符号链接
}

/* 下级资源列表 */
export interface IResources {
    count: number;
    files: IItem[];
    folders: IItem[];
    directory: string;
}

export type DefaultNodeProps = Required<Pick<
    IFileTreeNode,
    "root"
    | "indent"
    | "toggleIcon"
    | "toggleAriaLabel"
    | "menuIcon"
    | "menuAriaLabel"
    | "symlinkIcon"
    | "symlinkAriaLabel"
    | "countAriaLabel"
>>;

/* 文件资源管理器 */
export class Explorer implements ITree {
    /* 管理工具 */
    protected readonly icon: InstanceType<typeof ExplorerIcon>; // 图标管理
    protected readonly tooltip: InstanceType<typeof ExplorerTooltip>; // 提示文本管理
    protected readonly contextMenu: InstanceType<typeof ExplorerContextMenu>; // 提示文本管理

    /* 树节点集合 */
    protected readonly set = new Set<IFileTreeNodeStores>();
    /* 路径->节点 */
    protected readonly map = new Map<IFileTreeNode["path"], IFileTreeNodeStores>();
    /* 节点选中状态 */
    protected readonly select = new Select();

    /* 根节点列表 */
    protected roots: IFileTreeRootNode[];

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
        public readonly workspace: string, // 工作空间目录
        public readonly defaultNodeProps: DefaultNodeProps = { // 节点的默认属性
            // type: undefined,
            // name: undefined,
            // path: undefined,
            root: workspace,
            // depth: undefined,
            indent: "1em",
            // relative: undefined,
            // directory: undefined,

            // focus: undefined,
            // folded: undefined,
            // draggable: undefined,
            // hideActions: undefined,

            // title: undefined,
            // children: undefined,

            toggleIcon: "#iconRight",
            toggleAriaLabel: plugin.i18n.explorer.toggle.ariaLabel,

            // icon: undefined,
            // iconAriaLabel: undefined,

            // text: undefined,
            // textAriaLabel: undefined,

            menuIcon: "#iconMore",
            menuAriaLabel: plugin.i18n.explorer.menu.ariaLabel,

            symlinkIcon: "#iconLink",
            symlinkAriaLabel: plugin.i18n.explorer.symlink.ariaLabel,

            // count: undefined,
            countAriaLabel: plugin.i18n.explorer.count.ariaLabel,
        },
    ) {
        this.icon = new ExplorerIcon(this.plugin);
        this.tooltip = new ExplorerTooltip(this.plugin);
        this.contextMenu = new ExplorerContextMenu(this.plugin, this);
    }

    /* 根据完整路径查找节点 */
    public path2node(path: string): IFileTreeNodeStores | undefined {
        return this.map.get(path);
    }

    /* 创建根节点 */
    public createRootNodes(): IFileTreeRootNode[] {
        this.roots = [
            {
                ...this.defaultNodeProps,
                type: FileTreeNodeType.Root,
                name: basename(this.workspace),
                path: this.workspace,
                depth: 0,
                relative: "./",
                directory: dirname(this.workspace),

                folded: true,

                title: this.workspace,

                icon: this.icon.make(FileTreeNodeType.Root, "./"),
                iconAriaLabel: this.tooltip.make(FileTreeNodeType.Root, "./"),

                text: this.plugin.i18n.explorer.workspace.name,
                textAriaLabel: "./",
            },
        ];
        return this.roots;
    }

    /* 添加节点 */
    public readonly appendNode = (node: IFileTreeNodeStores) => {
        this.call(
            node,
            node => {
                const id = get(node.path);
                this.map.set(id, node); // 覆盖对应 ID 的节点
                this.set.add(node); // 添加节点对象
            },
            true,
        );
    }

    /* 移除节点 */
    public readonly removeNode = (node: IFileTreeNodeStores) => {
        this.call(
            node,
            node => {
                const id = get(node.path);
                if (this.map.has(id)) { // 移除节点
                    this.map.delete(id);
                    get(node.children)
                        ?.map(node => this.map.get(node.path))
                        .filter(node => node)
                        .forEach(this.removeNode);
                }
                this.set.delete(node);
            },
            true,
        );
    }

    /* 菜单事件 */
    public readonly menu = (e: ComponentEvents<Node>["menu"]) => {
        try {
            const node = e.detail.props;
            const menu = this.contextMenu.makeMenu(node);

            const event = e.detail.e;
            menu.open({
                x: event.clientX,
                y: event.clientY,
                isLeft: false,
            });
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 文件打开事件 */
    public readonly open = (e: ComponentEvents<Node>["open"]) => {
        // plugin.logger.debug(e);
        try {
            const node = e.detail.props;
            this.select.one(node);

            switch (get(node.type)) {
                case FileTreeNodeType.File: {  // 打开文件
                    const path = get(node.relative);
                    const icon = get(node.icon);
                    const text = get(node.text);
                    const ext = extname(path); // 文件扩展名
                    if (isBinaryExt(ext)) {
                        this.plugin.siyuan.confirm(
                            fn__code(path), // 标题
                            [
                                this.plugin.i18n.message.binaryError,
                                "",
                                ft__primary(this.plugin.i18n.message.openAnyway),
                            ].join("<br />"), // 文本
                            async () => {
                                this.plugin.openWorkspaceFile(path, text, icon);
                            }, // 确认按钮回调
                        );
                    }
                    else {
                        this.plugin.openWorkspaceFile(path, text, icon);
                    }
                    break;
                }
                case FileTreeNodeType.Root:
                case FileTreeNodeType.Folder:
                default:
                    this.plugin.logger.warn(`Unexpected node ${get(node.path)} dispatch open event`);
                    break;
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 折叠文件夹 */
    public readonly fold = (e: ComponentEvents<Node>["fold"]) => {
        // plugin.logger.debug(e);
        try {
            const node = e.detail.props;
            this.select.one(node);

            this.collapseNode(node);
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 展开文件夹 */
    public readonly unfold = async (e: ComponentEvents<Node>["unfold"]) => {
        // plugin.logger.debug(e);
        try {
            const node = e.detail.props;
            this.select.one(node);

            switch (get(node.type)) {
                case FileTreeNodeType.File: // 文件无需加载下级内容
                    break;
                case FileTreeNodeType.Root:
                case FileTreeNodeType.Folder:
                default: {
                    this.expandNode(node);
                    break;
                }
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /**
     * 动态生成文件图标
     */

    /**
     * 列出指定目录下的资源
     * @param relative: 相对于工作空间目录的路径
     */
    protected async ls(relative: string): Promise<IResources> {
        relative = normalize(relative);
        const directory = join(this.workspace, relative);

        /* 获取下级资源列表 */
        const response = await this.plugin.client.readDir({
            path: relative,
        });

        const resources: IResources = {
            count: response.data.length,
            files: [],
            folders: [],
            directory,
        };

        /* 资源分类 */
        response.data.forEach(item => {
            if (item.isDir) {
                resources.folders.push({
                    name: item.name,
                    path: join(directory, item.name),
                    relative: join(relative, item.name),
                    isFile: false,
                    isFolder: true,
                    isSymlink: item.isSymlink,
                });
            }
            else {
                resources.files.push({
                    name: item.name,
                    path: join(directory, item.name),
                    relative: join(relative, item.name),                    // relative: `${relative}/${item.name}`,
                    isFile: true,
                    isFolder: false,
                    isSymlink: item.isSymlink,
                });
            }
        });
        return resources;
    }

    /**
     * 将资源列表转换为节点列表
     */
    protected resources2nodes(resources: IResources): IFileTreeNode[] {
        const nodes: IFileTreeNode[] = [];

        /* 文件夹节点 */
        resources.folders.forEach(item => {
            nodes.push({
                ...this.defaultNodeProps,
                type: FileTreeNodeType.Folder,
                name: item.name,
                path: item.path,
                root: this.workspace,
                relative: item.relative,
                directory: resources.directory,

                folded: true,
                symlink: item.isSymlink,

                title: item.path,

                icon: this.icon.make(FileTreeNodeType.Folder, item.relative),
                iconAriaLabel: this.tooltip.make(FileTreeNodeType.Folder, item.relative),

                text: item.name,
                textAriaLabel: item.relative,
            });
        });

        /* 文件节点 */
        resources.files.forEach(item => {
            nodes.push({
                ...this.defaultNodeProps,
                type: FileTreeNodeType.File,
                name: item.name,
                path: item.path,
                root: this.workspace,
                relative: item.relative,
                directory: resources.directory,

                title: item.path,
                symlink: item.isSymlink,

                icon: this.icon.make(FileTreeNodeType.File, item.relative),
                iconAriaLabel: this.tooltip.make(FileTreeNodeType.File, item.relative),

                text: item.name,
                textAriaLabel: item.relative,
            });
        });

        return nodes;
    }

    /**
     * 更新节点状态
     * @param node - 节点
     * @param recursive - 递归遍历更新节点状态
     */
    public async updateNode(
        node: IFileTreeNodeStores,
        recursive: boolean = false,
    ): Promise<void> {
        if (get(node.type) === FileTreeNodeType.File) return;

        if (recursive) {
            this.call(
                node,
                async node => {
                    if (get(node.children) === undefined) return; // 忽略未加载的节点
                    this.updateNode(node);
                },
                true,
            );
        }
        else {
            const resources = await this.ls(get(node.relative));
            const children = this.resources2nodes(resources);

            node.count.set(resources.count); // 设置资源数量
            node.children.set(children); // 设置下级资源节点
        }
    }

    /* 展开节点 */
    protected async expandNode(
        node: IFileTreeNodeStores,
    ) {
        /* 若未加载, 先查询资源 */
        if (!get(node.children)) {
            await this.updateNode(node);
        }

        /* 展开并更新图标 */
        node.folded.set(false);
        this.icon.expand(node);
    }

    /**
     * 收缩节点
     * @param node: 节点
     * @param recursive: 是否递归收缩
     */
    public readonly collapseNode = (
        node: IFileTreeNodeStores,
        recursive: boolean = false,
    ) => {
        this.call(
            node,
            node => {
                /* 折叠节点并更新图标 */
                node.folded.set(true);
                this.icon.collapse(node);
            },
            recursive,
        );
    }

    /**
     * 递归遍历节点
     * @param node: 节点
     * @param callback: 回调函数
     * @param recursive: 是否递归遍历
     */
    public call(
        node: IFileTreeNodeStores,
        callback: (node: IFileTreeNodeStores) => void,
        recursive: boolean,
    ): void {
        if (recursive) {
            const nodes = [node];
            while (nodes.length) {
                const node = nodes.shift();
                if (node) {
                    callback(node);
                    const children = get(node.children)
                        ?.map(node => this.map.get(node.path))
                        .filter(node => !!node);
                    if (children) nodes.push(...children);
                }
            }
        }
        else {
            callback(node);
        }
    }
}
