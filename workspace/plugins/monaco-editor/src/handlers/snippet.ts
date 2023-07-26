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

/* 块处理器 */
import { Handler, type IBaseHandlerOptions, type IHandler } from "./handler";

import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";

export interface ISnippetHandler extends IHandler {
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => ReturnType<typeof this.client.getSnippet>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export interface ISnippetHandlerOptions extends IBaseHandlerOptions {
    id: string; // 代码片段 ID
}


export class SnippetHandler extends Handler {
    protected customTabSize: number; // 用户定义的缩进大小,

    constructor(
        plugin,
    ) {
        super(plugin);
        this.customTabSize = this.plugin.config.editor.options.tabSize;
    }

    /* 构造一个更新函数 */
    protected createUpdateFunction(
        info: {
            id: string, // 代码片段 ID
            name: string, // 代码片段名称
            type: "js" | "css", // 代码片段类型
            enabled: boolean, // 是否启用
        }, // 代码片段信息
    ): (value: string) => ReturnType<typeof this.client.getSnippet> {
        return async (value: string) => {
            /* 获取所有代码片段 */
            const response = await this.client.getSnippet({
                type: "all",
                enabled: 2,
            });

            /* 查询 ID 对应的代码片段 */
            const snippets = response.data.snippets;
            const snippet = snippets.find((snippet) => snippet.id === info.id);
            if (snippet) { // 若查询到对应的片段, 覆盖
                snippet.id = info.id;
                snippet.name = info.name;
                snippet.type = info.type;
                snippet.enabled = info.enabled;
                snippet.content = value;
            }
            else { // 插入一个新的片段
                snippets.push({
                    ...info,
                    memo: "",
                    content: value,
                });
            }

            /* 更新代码片段 */
            await this.client.setSnippet({
                snippets,
            });
            return response;
        };
    }

    /**
     * 生产一个块处理器
     */
    public async makeHandler(options: ISnippetHandlerOptions): Promise<ISnippetHandler> {
        /* 获取所有代码片段 */
        const response = await this.client.getSnippet({
            type: "all",
            enabled: 2,
        });

        /* 查询 ID 对应的代码片段 */
        const snippets = response.data.snippets; const snippet = snippets.find((snippet) => snippet.id === options.id);
        if (snippet) { // 若查询到对应的片段
            /* 生成的处理器 */
            const handler: ISnippetHandler = {
                modified: {
                    value: snippet.content,
                    language: snippet.type,
                },
                options: {
                    tabSize: this.customTabSize,
                },
                update: this.createUpdateFunction({
                    ...snippet,
                }),
            };

            return handler;
        }
        else {
            throw new Error(`Can't find snippet with id: ${options.id}`);
        }
    }
}
