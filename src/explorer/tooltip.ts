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
import { FileTreeNodeType } from "@workspace/components/siyuan/tree/file";
import { parse } from "@workspace/utils/path/browserify";

/* 提示信息管理 */
export class ExplorerTooltip {
    protected readonly i18n: MonacoEditorPlugin["i18n"];
    protected readonly map: Map<string, string>; // 路径 -> 提示文本 映射表

    constructor(
        public readonly plugin: InstanceType<typeof MonacoEditorPlugin>, // 插件对象
    ) {
        this.i18n = this.plugin.i18n;
        this.map = new Map(this.i18n.explorer.tooltips.paths as [string, string][]);
    }

    /* 根据节点信息生成提示信息 */
    public make(type: FileTreeNodeType, path: string): string {
        /* 若映射表中存在对应的提示信息, 则直接使用 */
        const tooltip = this.map.get(path);
        if (tooltip) return tooltip;

        switch (type) {
            case FileTreeNodeType.Root:
                return this.i18n.explorer.workspace.name;
            case FileTreeNodeType.Folder:
                $default: switch (true) {
                    case path.startsWith("data/"): // 数据目录
                        switch (true) {
                            case /^data\/\d{14}-[0-9a-z]{7}$/.test(path): // 笔记本目录
                                return this.i18n.explorer.tooltips.siyuanNotebook;
                            case /^data\/\d{14}-[0-9a-z]{7}\//.test(path): // 笔记本目录下的目录
                                switch (true) {
                                    case /\/\d{14}-[0-9a-z]{7}$/.test(path): // 思源文档目录
                                        return this.i18n.explorer.tooltips.siyuanDocDir;
                                    case path.endsWith(".siyuan"): // 笔记本元数据目录
                                        return this.i18n.explorer.tooltips.siyuanNotebookMetadataDir;
                                    case path.endsWith(".siyuan/conf.json"): // 笔记本配置文件
                                        return this.i18n.explorer.tooltips.siyuanNotebookConfig;
                                    case path.endsWith(".siyuan/sort.json"): // 文档自定义排序序号
                                        return this.i18n.explorer.tooltips.siyuanDocCustomSort;
                                    default:
                                        break $default;
                                }
                            default:
                                break $default;
                        }
                    default:
                        break $default;
                }
                return this.i18n.explorer.folder.ariaLabel;
            case FileTreeNodeType.File: {
                const info = parse(path); // 节点路径信息
                switch (true) {
                    case info.ext === ".sy": // 思源文件
                        return this.i18n.explorer.tooltips.siyuanDoc;
                    default:
                        return this.i18n.explorer.file.ariaLabel;
                }
            }
        }
    }
}
