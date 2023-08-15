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

import type { IListItem } from "@workspace/components/siyuan/list/list";
import type MonacoEditorPlugin from "@/index";
import { ExplorerIcon } from "./icon";
import { parse } from "@workspace/utils/path/browserify";
import { formatFileSize } from "@workspace/utils/misc/byte";
import { trimPrefix } from "@workspace/utils/misc/string";
import { normalize } from "@workspace/utils/path/normalize";

export enum NodeType {
    File,
    Folder,
}

export type INode = IFileNode | IFolderNode;

/* ReturnType<DataTransferItem.getAsFile> */
export interface IFile extends File {
    path?: string; // 文件完整路径
}

export interface IBaseNode {
    type: NodeType; // 节点类型
    path: string; // 作为 ID 的完整路径
    paths: string[]; // 从根节点到该节点的路径列表 (path.split("/"))
}

export interface IFileNode extends IBaseNode {
    type: NodeType.File;
    file: File; // 文件对象
}

export interface IFolderNode extends IBaseNode {
    type: NodeType.Folder;
    nodes: IFileNode[]; // 下级文件节点列表
    files: IFileNode[]; // 文件节点列表
    folders: IFolderNode[]; // 文件夹节点列表
}

export interface IFileTree {
    map: Map<string, File>; // 文件路径 -> 文件对象
    root: IFolderNode; // 根节点
}

export class FileTree {

    public static makeSort(depth: number): (n1: INode, n2: INode) => number {
        return (node1: INode, node2: INode) => {
            if (node1.type !== node2.type) { // 类型不一致, 文件夹在前
                switch (true) {
                    case node1.type === NodeType.Folder:
                        return -1;
                    case node2.type === NodeType.Folder:
                        return 1;
                }
            }
            else { // 类型一致, 比较指定层级
                const name1 = node1.paths[depth].toLowerCase();
                const name2 = node2.paths[depth].toLowerCase();
                switch (true) {
                    case name1 > name2: // 名称大的在后
                        return 1;
                    case name1 < name2: // 名称小的在前
                        return -1;
                    case name1 === name2: // 名称一致, 不变
                        return 0;
                }
            }
        }
    }

    public static async readEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
        return new Promise((resolve, reject) => {
            reader.readEntries(resolve, reject);
        });
    }

    public static async file(entry: FileSystemFileEntry): Promise<File> {
        return new Promise((resolve, reject) => {
            entry.file(resolve, reject);
        });
    }

    /* flat FileSystemEntry  */
    public static async flat(entry: FileSystemEntry): Promise<File[]> {
        const files: File[] = [];
        switch (true) {
            case entry.isFile: {
                const file_entry = entry as FileSystemFileEntry;
                const file = await FileTree.file(file_entry);
                files.push(file);
                return files;
            }
            case entry.isDirectory: {
                const directory = entry as FileSystemDirectoryEntry;
                const entries = await FileTree.readEntries(directory.createReader())
                files.push(...(await Promise.all(entries.map(entry => FileTree.flat(entry)))).flat());
            }
            default:
                return files;
        }
    }

    public readonly icon: InstanceType<typeof ExplorerIcon>; // 图标管理
    public readonly map: Map<string, INode>; // 节点路径 -> 节点
    public readonly files: IFile[]; // 文件列表
    public readonly nodes: IFileNode[]; // 文件节点列表
    public readonly root: IFolderNode; // 根节点

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
        public readonly fileList: FileList | File[], // 文件列表
        public readonly prefix: string = "/", // 路径前缀
    ) {
        this.icon = new ExplorerIcon(this.plugin);
        this.files = Array.from(fileList);
        this.nodes = this.files.map((file: IFile) => {

            const path = (() => {
                if (file.webkitRelativePath) return file.webkitRelativePath; // <input>
                else if (file.path) return normalize(trimPrefix(
                    file.path,
                    this.prefix,
                )); // DataTransferItem.getAsFile() | FileSystemFileEntry.file()
                else return file.name;
            })();
            return {
                type: NodeType.File,
                path,
                paths: path.split("/"),
                file,
            };
        });
        this.map = new Map(this.nodes.map(node => [
            node.path,
            node,
        ]));
        this.root = {
            type: NodeType.Folder,
            path: "",
            paths: [],
            nodes: this.nodes,
            files: [],
            folders: [],
        }
        this.build();
    }

    /* 构建节点树 */
    public build(): void {
        const pending = [this.root]; // 待处理节点列表
        while (pending.length) {
            const node = pending.pop()!;
            this.sortFolderNode(node);
            pending.push(...node.folders);
        }
    }

    /* 排序文件夹下的内容 */
    public sortFolderNode(node: IFolderNode): void {
        const depth = node.paths.length + 1; // 文件夹下节点深度

        // node.files = node.nodes.filter(n => n.paths.length === depth);
        node.files = node.nodes.filter(n => n.paths.length === depth).toSorted(FileTree.makeSort(depth - 1));

        // const children = node.nodes.filter(n => n.paths.length > depth); // 下级文件列表
        const children = node.nodes.filter(n => n.paths.length > depth).toSorted(FileTree.makeSort(depth - 1)); // 下级文件列表

        const folder_name_set = new Set<string>(children.map(n => n.paths[depth - 1])); // 下级文件夹名称集合
        const folder_name_list = [...folder_name_set]; // 下级文件夹名称列表 (保留排序)

        /* 文件夹名称 -> 文件夹节点 */
        const folder_map_name_folder = new Map<string, IFolderNode>(folder_name_list.map(name => {
            const paths = [...node.paths, name];
            return [name, {
                type: NodeType.Folder,
                path: paths.join("/"),
                paths,
                nodes: [],
                files: [],
                folders: [],
            }];
        }));

        /* 通过文件夹名称为每个文件夹分配下级节点 */
        children.forEach(child => {
            const name = child.paths[depth - 1];
            const folder = folder_map_name_folder.get(name);
            if (folder) folder.nodes.push(child);
        });

        /* 排序后的文件夹节点列表 */
        node.folders = folder_name_list.map(name => folder_map_name_folder.get(name));
    }

    /* 生成列表 */
    public toList(
        fold: boolean,
        node: IFolderNode = this.root,
        indent: string = "1em",
    ): IListItem[] {
        const list: IListItem[] = [];
        list.push(...node.folders.map(folder => ({
            text: folder.paths[folder.paths.length - 1],
            icon: this.icon.makeFolderNodeIcon(
                parse(folder.path),
            ),
            fold,
            children: this.toList(fold, folder),
            indent,
        })));
        list.push(...node.files.map(file => ({
            text: file.file.name,
            icon: this.icon.makeFileNodeIcon(
                parse(file.path),
            ),
            meta: formatFileSize(file.file.size),
        })));
        return list;
    }
}
