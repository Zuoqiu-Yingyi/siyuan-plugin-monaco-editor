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

/* 快照项处理器 */
import { Handler, type IBaseHandlerOptions, type IHandler } from "./handler";

import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";

export interface ISnapshotHandler extends IHandler {
    original: IEditorModel; // 原始编辑器模式
    modified: IEditorModel; // 变更编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
}

export interface ISnapshotHandlerOptions extends IBaseHandlerOptions {
    kramdown: boolean; // 是否使用 kramdown
    old: string; // 较早版本的快照对象 ID
    new: string; // 较晚版本的快照对象 ID
}

export class SnapshotHandler extends Handler {
    protected customTabSize: number; // 用户定义的缩进大小,

    constructor(
        plugin,
    ) {
        super(plugin);
        this.customTabSize = this.plugin.config.editor.options.tabSize;
    }

    /* 判断快照内容是否为块的 DOM */
    public isBlockDOM(content: string): boolean {
        return content.startsWith("<") && content.endsWith(">");
    }

    /* 清洗文档快照内容 */
    public washDocumentSnapshot(content: string): string {
        return content.replaceAll(`contenteditable="false"`, `contenteditable="true"`);
    }

    /**
     * 生产一个快照处理器
     */
    public async makeHandler(options: ISnapshotHandlerOptions): Promise<ISnapshotHandler> {
        /* 获取两个版本的快照对象对应的文件 */
        const [response_old, response_new] = await Promise.all([
            this.client.openRepoSnapshotDoc({
                id: options.old,
            }),
            this.client.openRepoSnapshotDoc({
                id: options.new,
            }),
        ]);

        const old_content = this.washDocumentSnapshot(response_old.data.content);
        const new_content = this.washDocumentSnapshot(response_new.data.content);

        /* 生成的处理器 */
        const handler: ISnapshotHandler = {
            original: {
                value: response_old.data.isProtyleDoc // 是否为原始内容
                    ? response_old.data.content
                    : options.kramdown
                        ? this.plugin.lute.BlockDOM2Md(old_content)
                        : this.plugin.lute.BlockDOM2StdMd(old_content),
                language: this.isBlockDOM(response_old.data.content)
                    ? "markdown"
                    : "json",
            },
            modified: {
                value: response_new.data.isProtyleDoc // 是否为原始内容
                    ? response_new.data.content
                    : options.kramdown
                        ? this.plugin.lute.BlockDOM2Md(new_content)
                        : this.plugin.lute.BlockDOM2StdMd(new_content),
                language: this.isBlockDOM(response_new.data.content)
                    ? "markdown"
                    : "json",
            },
            options: {
                tabSize: (this.isBlockDOM(response_old.data.content) && this.isBlockDOM(response_new.data.content))
                    ? 2
                    : this.customTabSize,
            },
        };

        return handler;
    }
}
