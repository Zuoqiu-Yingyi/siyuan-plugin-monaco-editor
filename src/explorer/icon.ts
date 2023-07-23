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

/* 图标管理 */
export class Icon {
    public static ICONS = {
        file: "#iconFile",
        filetree: "#icon-monaco-editor-file-tree",
        folder_closed: "#icon-monaco-editor-folder-closed",
        folder_opend: "#icon-monaco-editor-folder-opend",
        siyuan: "#iconSiYuan",
        workspace: "#iconWorkspace",
    } as const;

    protected readonly i18n: MonacoEditorPlugin["i18n"];
    protected readonly map: Map<string, string>; // 路径 -> 图标 ID 映射表

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
    ) {
        this.i18n = this.plugin.i18n;
        this.map = new Map();
    }

    /* 展开节点 */
    public expand(node: IFileTreeNodeStores): void {
        if (get(node.type) === FileTreeNodeType.Folder) {
            node.icon.set(Icon.ICONS.folder_opend);
        }
    }

    /* 收缩节点 */
    public collapse(node: IFileTreeNodeStores): void {
        if (get(node.type) === FileTreeNodeType.Folder) {
            node.icon.set(Icon.ICONS.folder_closed);
        }
    }

    /* 根据节点信息生成图标 ID */
    public make(type: FileTreeNodeType, path: string): string {
        /* 若映射表中存在对应的图标, 则直接使用 */
        const icon = this.map.get(path);
        if (icon) return icon;

        switch (type) {
            case FileTreeNodeType.Root:
                return Icon.ICONS.workspace;
            case FileTreeNodeType.Folder:
                return Icon.ICONS.folder_closed;
            case FileTreeNodeType.File: {
                const info = parse(path); // 节点路径信息
                switch (true) {
                    case info.ext === ".sy": // 思源文件
                        return Icon.ICONS.siyuan;
                    default:
                        return Icon.ICONS.file;
                }
            }
        }
    }
}
