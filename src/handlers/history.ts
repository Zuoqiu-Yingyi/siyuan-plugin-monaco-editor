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

/* 历史项处理器 */
import { Handler, type IBaseHandlerOptions, type IHandler } from "./handler";

import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";
import type { BlockID, HistoryCreated } from "@workspace/types/siyuan";

export interface IHistoryHandler extends IHandler {
    original: IEditorModel; // 原始编辑器模式
    modified: IEditorModel; // 变更编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => Promise<string>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export type IHistoryHandlerOptions = IHistoryHandlerOptions1 | IHistoryHandlerOptions2;

export interface IHistoryBaseHandlerOptions extends IBaseHandlerOptions {
    kramdown: boolean; // 是否使用 kramdown
    path?: string; // 历史附件绝对路径
    id?: BlockID; // 文档块 ID
    created?: HistoryCreated; // 文档块历史创建时间
}

/* 文件历史面板的入口 (Alt + H) */
export interface IHistoryHandlerOptions1 extends IHistoryBaseHandlerOptions {
    path: string;
    id?: never;
    created?: never;
}

/* 文档历史面板的入口 (文档树右键 > 文件历史) */
export interface IHistoryHandlerOptions2 extends IHistoryBaseHandlerOptions {
    path?: never;
    id: BlockID;
    created: HistoryCreated;
}

export class HistoryHandler extends Handler {
    constructor(
        plugin,
    ) {
        super(plugin);
    }

    /* 构造一个更新函数 */
    protected createUpdateFunction(
        id: BlockID, // 块 ID
    ): (value: string) => Promise<string> {
        return async (value: string) => {
            await this.plugin.client.updateBlock({
                id,
                dataType: "markdown",
                data: value,
            });
            return value;
        };
    }

    /**
     * 生产一个块处理器
     */
    public async makeHandler(options: IHistoryHandlerOptions): Promise<IHistoryHandler> {
        if (options.id && options.created) { // 查询历史文档文件
            const response = await this.client.getHistoryItems({
                query: options.id,
                created: options.created,
                type: 3,
            });
            if (response.data.items.length > 0) {
                options.path = response.data.items[0].path;
            }
            else {
                throw new Error(`Can't find document history item with id ${options.id} and created time ${options.created}`);
            }
        }
        else { // 获取文档 ID
            options.id = options.path.slice(-25, -3);
        }

        /* 获取该文档项 */
        const responses = await Promise.all([
            this.client.getDocHistoryContent({
                historyPath: options.path,
            }),
            this.client.getDoc({
                id: options.id,
            }),
        ]);

        /* 生成的处理器 */
        const handler: IHistoryHandler = {
            original: {
                value: "",
                language: "markdown",
            },
            modified: {
                value: "",
                language: "markdown",
            },
            options: {
                tabSize: 2,
            },
        };

        if (responses[0].data.isLargeDoc) { // 大文档, 内容为 markdown
            handler.original.value = responses[0].data.content;
            handler.modified.value = this.plugin.lute.BlockDOM2StdMd(responses[1].data.content);
        }
        else { // 小文档, 内容为块 DOM
            // 清洗数据, 避免使用 BlockDOM2StdMd 时导致显示 <div contenteditable="false" spellcheck="false">
            responses[0].data.content = responses[0].data.content.replaceAll(`contenteditable="false"`, `contenteditable="true"`);

            if (options.kramdown) { // 编辑 kramdown 内容
                handler.original.value = this.plugin.lute.BlockDOM2Md(responses[0].data.content);
                handler.modified.value = this.plugin.lute.BlockDOM2Md(responses[1].data.content);
                handler.update = this.createUpdateFunction(options.id);
            }
            else { // 查看 markdow 内容
                handler.original.value = this.plugin.lute.BlockDOM2StdMd(responses[0].data.content);
                handler.modified.value = this.plugin.lute.BlockDOM2StdMd(responses[1].data.content);
            }
        }

        return handler;
    }
}
