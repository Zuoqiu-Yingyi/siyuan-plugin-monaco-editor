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
import type MonacoEditorPlugin from "@/index";
import { FileTreeNodeType, type IFileTreeNodeStores } from "@workspace/components/siyuan/tree/file";
import { get } from "svelte/store";
import { HandlerType } from "@/facades/facade";
import { FLAG_ELECTRON } from "@workspace/utils/env/front-end";
import { copyText } from "@workspace/utils/misc/copy";
import { isStaticWebFileServicePath, workspacePath2StaticPathname } from "@workspace/utils/siyuan/url";
import { ExplorerIcon } from "./icon";

/* 菜单项类型 */
export enum MenuItemType {
    Action, // 菜单项
    Submenu, // 子菜单
    Separator, // 分割线
}

/* 菜单项适用节点类型 */
export interface IMenuBase {
    type: MenuItemType; // 菜单项类型

    root: boolean; // 适用根节点
    folder: boolean; // 适用文件夹节点
    file: boolean; // 适用文件节点
}

/* 常规菜单项 */
export interface IMenuAction extends IMenuBase {
    type: MenuItemType.Action,
    options: siyuan.IMenuItemOption,
}

/* 多级菜单项 */
export interface IMenuSubmenu extends IMenuBase {
    type: MenuItemType.Submenu,
    options: siyuan.IMenuItemOption,
    submenu: IMenuItem[],
}

/* 菜单分割线 */
export interface IMenuSeparator extends IMenuBase {
    type: MenuItemType.Separator,
    index?: number,
}

/* 菜单项 */
export type IMenuItem = IMenuAction | IMenuSubmenu | IMenuSeparator;


export class ExplorerContextMenu {
    /* 按类型过滤节点 */
    protected static filter(
        items: IMenuItem[],
        type: FileTreeNodeType,
    ): IMenuItem[] {
        /* 按节点类型过滤 */
        items = (() => {
            switch (type) {
                case FileTreeNodeType.Root:
                    return items.filter(item => item.root);
                case FileTreeNodeType.Folder:
                    return items.filter(item => item.folder);
                case FileTreeNodeType.File:
                    return items.filter(item => item.file);
            }
        })();
        if (items.length === 0) return items;

        /* 过滤下级菜单 */
        items = items.filter(item => {
            if (item.type === MenuItemType.Submenu) {
                item.submenu = ExplorerContextMenu.filter(item.submenu, type);
                return item.submenu.length > 0
                    && item.submenu.some(item => item.type !== MenuItemType.Separator);
            }
            else return true;
        });
        if (items.length === 0) return items;

        /* 清理首尾两端的分割线 */
        items = items.slice(
            items.findIndex(item => item.type !== MenuItemType.Separator),
            items.findLastIndex(item => item.type !== MenuItemType.Separator) + 1,
        );
        if (items.length === 0) return items;

        /* 清理连续的分割线 */
        items = items.filter((item, index, items) => {
            if (item.type !== MenuItemType.Separator) return true;
            else return items[index - 1]?.type !== MenuItemType.Separator;
        });

        return items;
    };

    /* 构造含有下级菜单的菜单项 */
    public static makeSubmenuItem(item: IMenuSubmenu): siyuan.IMenuItemOption {
        item.options.submenu = item.submenu.map(item => {
            switch (item.type) {
                case MenuItemType.Action:
                    return item.options;
                case MenuItemType.Submenu:
                    return ExplorerContextMenu.makeSubmenuItem(item);
                case MenuItemType.Separator:
                    return { type: "separator" };
            }
        });
        return item.options;
    }

    protected readonly i18n: MonacoEditorPlugin["i18n"];

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
    ) {
        this.i18n = this.plugin.i18n;
    }

    /* 构造菜单 */
    public makeMenu(node: IFileTreeNodeStores): InstanceType<typeof siyuan.Menu> {
        const menu = new this.plugin.siyuan.Menu();
        const items = ExplorerContextMenu.filter(this.makeMenuItems(node), get(node.type));
        items.forEach(item => {
            switch (item.type) {
                case MenuItemType.Action:
                    menu.addItem(item.options);
                    break;
                case MenuItemType.Submenu:
                    menu.addItem(ExplorerContextMenu.makeSubmenuItem(item));
                    break;
                case MenuItemType.Separator:
                    menu.addSeparator(item.index);
                    break;
            }
        });
        return menu;
    }

    /* 构造菜单项列表 */
    public makeMenuItems(node: IFileTreeNodeStores): IMenuItem[] {
        const type = get(node.type);
        const name = get(node.name);
        const path = get(node.path);
        const relative = get(node.relative);

        const items: IMenuItem[] = [];

        // TODO: 刷新
        // TODO: 新建文件
        // TODO: 新建文件夹

        /* 打开文件 */
        items.push({
            type: MenuItemType.Action,
            options: {
                icon: "iconCode",
                label: this.i18n.menu.open.label,
                submenu: this.plugin.buildOpenSubmenu(
                    {
                        type: HandlerType.asset,
                        handler: {
                            path: get(node.relative),
                        },
                        breadcrumb: {
                            path: get(node.relative),
                        },
                    },
                    get(node.icon),
                    get(node.text),
                ),
            },
            root: false,
            folder: false,
            file: true,
        });

        if (FLAG_ELECTRON) {

            /**
             * 使用默认程序打开
             * REF: https://www.electronjs.org/zh/docs/latest/api/shell#shellopenpathpath
             */
            items.push({
                type: MenuItemType.Action,
                options: {
                    icon: "iconOpenWindow",
                    label: this.i18n.menu.openWithDefaultProgram.label,
                    click: () => {
                        if (type === FileTreeNodeType.File) {
                            globalThis
                                .require("electron")
                                .shell
                                .openPath(path);
                        }
                        else {
                            globalThis
                                .require("electron")
                                .shell
                                .showItemInFolder(
                                    globalThis
                                        .require("path")
                                        .normalize(path)
                                );
                        }
                    },
                },
                root: true,
                folder: true,
                file: true,
            });

            /**
             * 在文件资源管理器中显示
             * REF: https://www.electronjs.org/zh/docs/latest/api/shell#shellshowiteminfolderfullpath
             */
            items.push({
                type: MenuItemType.Action,
                options: {
                    icon: "iconFolder",
                    label: this.i18n.menu.revealInExplorer.label,
                    click: () => {
                        globalThis
                            .require("electron")
                            .shell
                            .showItemInFolder(
                                globalThis
                                    .require("path")
                                    .normalize(path)
                            );
                    },
                },
                root: true,
                folder: true,
                file: true,
            });
        }

        items.push({
            type: MenuItemType.Separator,
            root: true,
            folder: true,
            file: true,
        });

        /* 复制 */
        items.push({
            type: MenuItemType.Submenu,
            options: {
                icon: "iconCopy",
                label: this.i18n.menu.copy.label,
            },
            submenu: (() => {
                const submenu: IMenuItem[] = [
                    /* 复制名称 */
                    {
                        type: MenuItemType.Action,
                        options: {
                            icon: ExplorerIcon.makeDefaultNodeIcon(type),
                            label: this.i18n.menu.copyName.label,
                            accelerator: name,
                            click: () => {
                                copyText(name);
                            },
                        },
                        root: true,
                        folder: true,
                        file: true,
                    },
                    /* 复制相对路径 */
                    {
                        type: MenuItemType.Action,
                        options: {
                            icon: "iconCopy",
                            label: this.i18n.menu.copyRelativePath.label,
                            accelerator: relative,
                            click: () => {
                                copyText(relative);
                            },
                        },
                        root: true,
                        folder: true,
                        file: true,
                    },
                    /* 复制完整路径 */
                    {
                        type: MenuItemType.Action,
                        options: {
                            icon: "iconCopy",
                            label: this.i18n.menu.copyFullPath.label,
                            accelerator: path,
                            click: () => {
                                copyText(path);
                            },
                        },
                        root: true,
                        folder: true,
                        file: true,
                    },
                ];
                if (isStaticWebFileServicePath(relative)) {
                    const pathname = workspacePath2StaticPathname(relative);
                    const url = new URL(`${globalThis.document.baseURI}${pathname}`);
                    const link1 = `[${name}](<${pathname}>)`;
                    const link2 = `[${name}](<${url.href}>)`;
                    const link1_accelerator = `[${name}](&lt;${pathname}&gt;)`;
                    const link2_accelerator = `[${name}](&lt;${url.href}&gt;)`;
                    submenu.push(
                        /* 复制引用路径 */
                        {
                            type: MenuItemType.Action,
                            options: {
                                icon: "iconLink",
                                label: this.i18n.menu.copyReferencePath.label,
                                accelerator: pathname,
                                click: () => {
                                    copyText(pathname);
                                },
                            },
                            root: true,
                            folder: true,
                            file: true,
                        },
                        /* 复制 URL */
                        {
                            type: MenuItemType.Action,
                            options: {
                                icon: "iconLink",
                                label: this.i18n.menu.copyURL.label,
                                accelerator: url.href,
                                click: () => {
                                    copyText(url.href);
                                },
                            },
                            root: true,
                            folder: true,
                            file: true,
                        },
                        /* 复制 Markdown 超链接 */
                        {
                            type: MenuItemType.Action,
                            options: {
                                icon: "iconMarkdown",
                                label: this.i18n.menu.copyMarkdownHyperlink.label,
                                accelerator: link1_accelerator,
                                click: () => {
                                    copyText(link1);
                                },
                            },
                            root: true,
                            folder: true,
                            file: true,
                        },
                        {
                            type: MenuItemType.Action,
                            options: {
                                icon: "iconMarkdown",
                                label: this.i18n.menu.copyMarkdownHyperlink.label,
                                accelerator: link2_accelerator,
                                click: () => {
                                    copyText(link2);
                                },
                            },
                            root: true,
                            folder: true,
                            file: true,
                        },
                    );
                }
                return submenu;
            })(),
            root: true,
            folder: true,
            file: true,
        });

        items.push({
            type: MenuItemType.Separator,
            root: true,
            folder: true,
            file: true,
        });

        // TODO: 另存为

        // TODO: 下载

        // TODO: 上传

        // TODO: 重命名

        // TODO: 删除

        return items;
    }
}
