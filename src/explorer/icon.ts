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

import type MonacoEditorPlugin from "@/index";
import { FileTreeNodeType, type IFileTreeNodeStores } from "@workspace/components/siyuan/tree/file";
import { parse } from "@workspace/utils/path/browserify";
import { get } from "svelte/store";
import { FLAG_LIGHT } from "@workspace/utils/env/native-front-end";
import type { ParsedPath } from "path";

import file_icon from "@/assets/entries/file-icon.json";
import file_extension_icon from "@/assets/entries/file-extension-icon.json";
import folder_icon from "@/assets/entries/folder-icon.json";
import folder_expanded_icon from "@/assets/entries/folder-expanded-icon.json";

import file_icon_light from "@/assets/entries/light/file-icon.json";
import file_extension_icon_light from "@/assets/entries/light/file-extension-icon.json";
import folder_icon_light from "@/assets/entries/light/folder-icon.json";
import folder_expanded_icon_light from "@/assets/entries/light/folder-expanded-icon.json";

export type IEntries = [string, string][];

/* 图标管理 */
export class Icon {
    public static ICONS = {
        file: "#iconFile",
        filetree: "#icon-monaco-editor-file-tree",
        folder_closed: "#icon-monaco-editor-folder-closed",
        folder_opend: "#icon-monaco-editor-folder-opend",
        siyuan: "#iconSiYuan",
        workspace: "#iconWorkspace",

        material: {
            file: "#icon-monaco-editor-material-file",

            folder: "#icon-monaco-editor-material-folder",
            folderExpanded: "#icon-monaco-editor-material-folder-open",

            rootFolder: "#icon-monaco-editor-material-folder-root",
            rootFolderExpanded: "#icon-monaco-editor-material-folder-root-open",
        } as const,
    } as const;

    protected readonly i18n: MonacoEditorPlugin["i18n"];
    protected readonly map: Map<string, string>; // 路径 -> 图标 ID 映射表
    protected readonly material = {
        fileNames: new Map(file_icon as IEntries),
        fileExtensions: new Map(file_extension_icon as IEntries),
        folderNames: new Map(folder_icon as IEntries),
        folderNamesExpanded: new Map(folder_expanded_icon as IEntries),

        fileNamesLight: new Map(file_icon_light as IEntries),
        fileExtensionsLight: new Map(file_extension_icon_light as IEntries),
        folderNamesLight: new Map(folder_icon_light as IEntries),
        folderNamesExpandedLight: new Map(folder_expanded_icon_light as IEntries),
    } as const;

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
    ) {
        this.i18n = this.plugin.i18n;
        this.map = new Map();
    }

    /* 展开节点 */
    public expand(node: IFileTreeNodeStores): void {
        node.icon.set(this.make(get(node.type), get(node.relative), true));
    }

    /* 收缩节点 */
    public collapse(node: IFileTreeNodeStores): void {
        node.icon.set(this.make(get(node.type), get(node.relative), false));
    }

    /* 根据节点信息生成图标 ID */
    public make(
        type: FileTreeNodeType,
        path: string,
        expanded: boolean = false,
        light: boolean = FLAG_LIGHT,
    ): string {
        /* 若映射表中存在对应的图标, 则直接使用 */
        const icon = this.map.get(path);
        if (icon) return icon;

        const info = parse(path); // 节点路径信息

        switch (type) {
            case FileTreeNodeType.Root: // 根目录节点
                return this.makeRootNodeIcon(expanded, light);
            case FileTreeNodeType.Folder:
                return this.makeFolderNodeIcon(info, expanded, light);
            case FileTreeNodeType.File: {
                return this.makeFileodeIcon(info, light);
            }
        }
    }

    makeRootNodeIcon(
        expanded: boolean = false,
        light: boolean = FLAG_LIGHT,
    ): string {
        return expanded ? Icon.ICONS.material.rootFolderExpanded : Icon.ICONS.material.rootFolder;
    }

    makeFolderNodeIcon(
        info: ParsedPath,
        expanded: boolean = false,
        light: boolean = FLAG_LIGHT,
    ): string {
        return (light
            ? (expanded
                ? this.material.folderNamesExpandedLight // 文件夹名称->浅色展开图标
                : this.material.folderNamesLight // 文件夹名称->浅色图标
            ).get(info.base)
            : undefined)
            ?? (expanded
                ? this.material.folderNamesExpanded // 文件夹名称->展开图标
                : this.material.folderNames // 文件夹名称->图标
            ).get(info.base) // 文件夹名称->图标
            ?? (expanded
                ? Icon.ICONS.material.folderExpanded // 默认文件夹展开图标
                : Icon.ICONS.material.folder // 默认文件夹图标
            );
    }

    makeFileodeIcon(
        info: ParsedPath,
        light: boolean = FLAG_LIGHT,
    ): string {
        return (light ? (
            this.material.fileNamesLight.get(info.base) // 文件名称->浅色图标
            ?? this.material.fileExtensionsLight.get(info.ext) // 文件扩展名->浅色图标
        ) : undefined)
            ?? this.material.fileNames.get(info.base) // 文件名称->图标
            ?? this.material.fileExtensions.get(info.ext) // 文件扩展名->图标
            ?? Icon.ICONS.material.file; // 默认文件图标
    }
}
