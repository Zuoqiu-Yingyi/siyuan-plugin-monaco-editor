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
import { ResourceOption, isResourceOperable } from "@/utils/permission";
import { FileTree, type IFile } from "./filetree";
import { trimSuffix } from "@workspace/utils/misc/string";
import { isStaticWebFileServicePath, workspacePath2StaticPathname } from "@workspace/utils/siyuan/url";
import type ExplorerDock from "@/components/ExplorerDock.svelte";
import { FLAG_BROWSER } from "@workspace/utils/env/front-end";

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
    | "draggable"
    | "toggleIcon"
    | "toggleAriaLabel"
    | "menuIcon"
    | "menuAriaLabel"
    | "symlinkIcon"
    | "symlinkAriaLabel"
    | "countAriaLabel"
>>;

/* 重要资源类型 */
export enum ProtectedResourceType {
    None, // 不重要
    Data, // 数据
    Repo, // 快照仓库
    Lock, // 工作区锁标志
}

/* 文件资源管理器侧边栏事件 */
export interface IExplorerEvent {
    /* 拖拽入窗口 */
    dragEnterWindow: {
        e: DragEvent;
    };

    /* 拖拽出窗口 */
    dragLeaveWindow: {
        e: DragEvent;
    };
}

/* 文件资源管理器 */
export class Explorer implements ITree {
    public static isProtected(relative: string): ProtectedResourceType {
        switch (true) {
            case relative === "data":
                return ProtectedResourceType.Data;
            case relative === "repo":
            case relative.startsWith("repo/"):
                return ProtectedResourceType.Repo;
            case relative === ".lock":
                return ProtectedResourceType.Lock;
            default:
                return ProtectedResourceType.None;
        }
    }

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

    /* 是否拖拽出窗口 */
    protected outer: boolean = false;

    /* 拖拽进入用定时器 */
    protected timer;

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
            // dragging: undefined,
            draggable: true,
            // hideActions: undefined,

            // dragoverTop: undefined,
            // dragover: undefined,
            // dragoverBottom: undefined,

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
                draggable: false,

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
            this.select.one(node);

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
                    const name = get(node.name);
                    const relative = get(node.relative);
                    const icon = get(node.icon);
                    const text = get(node.text);

                    const ext = extname(name); // 文件扩展名

                    /* 是否可更改 */
                    const updatable = isResourceOperable(
                        this.plugin.config.dock.explorer.safe,
                        Explorer.isProtected(relative) !== ProtectedResourceType.None,
                        this.plugin.config.dock.explorer.permission.protected,
                        ResourceOption.edit,
                    );

                    if (isBinaryExt(ext)) {
                        this.plugin.siyuan.confirm(
                            fn__code(name), // 标题
                            [
                                fn__code(relative),
                                "",
                                this.plugin.i18n.message.binaryError,
                                "",
                                ft__primary(this.plugin.i18n.message.openAnyway),
                            ].join("<br />"), // 文本
                            () => {
                                this.plugin.openWorkspaceFile(relative, text, icon, false);
                            }, // 确认按钮回调
                        );
                    }
                    else {
                        this.plugin.openWorkspaceFile(relative, text, icon, updatable);
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

    /* 拖拽入窗口 */
    public readonly dragEnterWindow = async (e: DragEvent) => {
        this.outer = false;
    }

    /* 拖拽出窗口 */
    public readonly dragLeaveWindow = async (e: DragEvent) => {
        this.outer = true;
    }

    /* 拖拽开始 */
    public readonly dragstart = async (e: ComponentEvents<Node>["dragstart"]) => {
        // this.plugin.logger.debug(e);
        try {
            const node = e.detail.props;
            this.outer = false; // 重置拖拽出窗口状态
            // this.select.one(node);

            switch (get(node.type)) {
                case FileTreeNodeType.Folder:
                case FileTreeNodeType.File: {
                    node.dragging.set(true); // 设置为正在拖拽状态

                    const dataTransfer = e.detail.e.dataTransfer; // 拖拽数据传输对象
                    const name = get(node.name); // 文件名/文件夹名
                    const relative = get(node.relative); // 相对于工作空间目录的相对路径
                    if (isStaticWebFileServicePath(relative)) { // 静态文件服务路径
                        const pathname = workspacePath2StaticPathname(relative); // 获取该文件/文件夹的静态资源引用路径
                        // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
                        dataTransfer.setData("text/plain", pathname);
                        dataTransfer.setData("text/uri-list", pathname);
                        dataTransfer.setData("text/markdown", `[${name}](<${pathname}>)`);
                        dataTransfer.setData("text/html", `<a href="${globalThis.encodeURI(pathname)}">${name}</a>`);

                    }
                    /* 设置相关数据, 用于移动节点 */
                    dataTransfer.setData("text/type", get(node.type));
                    dataTransfer.setData("text/name", get(node.name));
                    dataTransfer.setData("text/path", get(node.path));
                    dataTransfer.setData("text/relative", get(node.relative));
                    dataTransfer.setData("text/directory", get(node.directory));
                    break;
                }
                case FileTreeNodeType.Root: // 根目录无法拖拽
                default:
                    break;
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 拖拽结束 */
    public readonly dragend = async (e: ComponentEvents<Node>["dragend"]) => {
        // this.plugin.logger.debug(e);
        try {
            const node = e.detail.props;

            switch (get(node.type)) {
                case FileTreeNodeType.Folder:
                case FileTreeNodeType.File:
                    node.dragging.set(false);
                    if (FLAG_BROWSER && this.outer) { // 在浏览器中启用拖拽至窗口外部时下载
                        this.outer = false;

                        const type = get(node.type);
                        const name = get(node.name);
                        const relative = get(node.relative);
                        await this.contextMenu.download(relative, name, type);
                    }
                    break;
                case FileTreeNodeType.Root: // 根目录无法拖拽下载
                default:
                    break;
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 拖拽进入 */
    public readonly dragenter = async (e: ComponentEvents<Node>["dragenter"]) => {
        // this.plugin.logger.debug(e);
        try {
            const node = e.detail.props;

            switch (get(node.type)) {
                case FileTreeNodeType.Root:
                case FileTreeNodeType.Folder:
                    node.dragover.set(true);

                    if (get(node.folded)) {
                        /**
                         * 设置展开定时器
                         * 避免被其他元素的拖拽离开事件移除
                         */
                        setTimeout(() => {
                            this.timer = setTimeout(() => {
                                this.timer = undefined;
                                this.expandNode(node);
                            }, 500);
                        });
                    }
                    break;
                case FileTreeNodeType.File: // 文件所在目录
                    const parent = this.path2node(get(node.directory));
                    if (parent) {
                        /**
                         * 本文件的进入事件会在同目录下其他文件的离开事件前派遣
                         * 同目录下其他文件的离开事件会覆盖本文件进入事件的效果
                         */
                        setTimeout(() => {
                            parent.dragover.set(true);
                        });
                    }
                default:
                    break;
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 拖拽悬浮 */
    public readonly dragover = async (e: ComponentEvents<Node>["dragover"]) => {
        // this.plugin.logger.debug(e);
        try {
            const node = e.detail.props;
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 拖拽离开 */
    public readonly dragleave = async (e: ComponentEvents<Node>["dragleave"]) => {
        // this.plugin.logger.debug(e);
        try {
            const node = e.detail.props;

            switch (get(node.type)) {
                case FileTreeNodeType.Root:
                case FileTreeNodeType.Folder:
                    node.dragover.set(false);

                    /* 移除定时器 */
                    clearTimeout(this.timer);
                    this.timer = undefined;
                    break;
                case FileTreeNodeType.File: // 文件所在目录
                    const parent = this.path2node(get(node.directory));
                    if (parent) {
                        parent.dragover.set(false);
                    }
                default:
                    break;
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

    /* 拖拽放置 */
    public readonly drop = async (e: ComponentEvents<Node>["drop"]) => {
        // this.plugin.logger.debug(e);
        try {
            const node = e.detail.props;
            const directory = get(node.type) === FileTreeNodeType.File
                ? this.map.get(get(node.directory))
                : node; // 放置的目录
            directory.dragover.set(false); // 取消拖拽悬浮效果

            /**
             * 拖拽上传文件夹
             * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
             * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/File_System_Access_API
             * REF: https://juejin.cn/post/6844904029349216269
             */
            const items = Array.from(e.detail.e.dataTransfer.items);
            const file_items = items.filter(item => item.kind === "file");
            if (file_items.length > 0 && directory) { // 存在拖拽的文件/文件夹
                const path = get(directory.relative); // 待上传到的目录的路径

                // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransferItem/getAsFile
                const file = file_items[0].getAsFile() as IFile; // 其中一个文件/文件夹
                const prefix = trimSuffix(file.path, file.name); // 获取文件/文件夹的路径前缀

                // REF: https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
                const entries = file_items.map(item => item.webkitGetAsEntry()); // 将文件/文件夹列表转换为资源列表
                const files = (await Promise.all(entries.map(FileTree.flat))).flat(); // 将资源列表转换为文件列表
                this.plugin.logger.debug(prefix, files);
                await this.contextMenu.upload(path, files, prefix); // 显示文件列表并上传

                await this.updateNode(directory); // 刷新目录
                return;
            }

            /* 拖拽移动资源 */
            const path = get(directory.path);
            const relative = get(directory.relative);
            const protected_type = Explorer.isProtected(relative); // 受保护类型
            const protect = protected_type !== ProtectedResourceType.None; // 是否为被保护的资源
            if (isResourceOperable(
                this.plugin.config.dock.explorer.safe,
                protect,
                this.plugin.config.dock.explorer.permission.protected,
                ResourceOption.move,
            )) { // 允许操作
                const dataTransfer = e.detail.e.dataTransfer; // 拖拽数据传输对象
                const source_name = dataTransfer.getData("text/name"); // 源名称
                const source_path = dataTransfer.getData("text/path"); // 源路径
                const source_relative = dataTransfer.getData("text/relative"); // 源相对路径
                const source_directory = dataTransfer.getData("text/directory"); // 源目录路径

                if (!(source_name && source_path && source_relative)) return; // 无效的拖拽数据

                /* 目录不允许移动到其本身或下级目录中 */
                if (path.startsWith(source_path) || path === source_directory) return;

                if (protect) { // 受保护的资源
                    const confirm = await this.contextMenu.confirm(
                        path,
                        relative,
                    );
                    if (!confirm) return; // 不允许继续操作
                }

                /* 二次确认 */
                const destination_path = join(path, source_name); // 目标路径
                const destination_relative = join(relative, source_name); // 目标路径
                const confirm = await this.plugin.confirm(
                    this.plugin.i18n.menu.move.title
                        .replaceAll("${1}", fn__code(source_name)),
                    this.plugin.i18n.menu.move.text
                        .replaceAll("${1}", fn__code(source_relative))
                        .replaceAll("${2}", fn__code(source_path))
                        .replaceAll("${3}", fn__code(destination_path)),
                );
                if (!confirm) return;

                /* 移动资源 */
                await this.plugin.client.renameFile({
                    path: source_relative,
                    newPath: destination_relative,
                });

                /* 刷新原目录与目标目录 */
                await this.updateNode(directory);
                await this.updateNode(this.map.get(source_directory));
                return;
            }
        }
        catch (error) {
            this.plugin.catch(error);
        }
    }

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
                iconPopoverID: this.icon.getPopoverID(FileTreeNodeType.Folder, item.relative),

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
                iconPopoverID: this.icon.getPopoverID(FileTreeNodeType.File, item.relative),

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
     * @return - 是否成功更新节点
     */
    public async updateNode(
        node?: IFileTreeNodeStores,
        recursive: boolean = false,
    ): Promise<boolean> {
        if (!node) return false;
        if (get(node.type) === FileTreeNodeType.File) return false;

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
            node.countAriaLabel.set(
                `${this.plugin.i18n.explorer.folder.ariaLabel
                }: ${resources.folders.length
                }  ${this.plugin.i18n.explorer.file.ariaLabel
                }: ${resources.files.length
                }`
            ); // 设置资源数量提示标签
            node.children.set(children); // 设置下级资源节点
        }
        return true;
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
