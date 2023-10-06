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
import * as sdk from "@siyuan-community/siyuan-sdk";

import { Handler, type IBaseHandlerOptions, type IHandler } from "./handler";
import { heightlight2monaco } from "@/editor/language";

import type { BlockID } from "@workspace/types/siyuan";
import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";

type NodeType = sdk.siyuan.NodeType;
const NodeType = sdk.siyuan.NodeType;

/* 块语言模式 */
export enum Language {
    markdown,
    kramdown,
}

/* 行内元素样式 */
export enum Inline {
    mark, // 使用 markdown 的标志符
    span, // 使用 <span> 标签
}

export interface IBlockHandler extends IHandler {
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => Promise<string>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export interface IBlockHandlerOptions extends IBaseHandlerOptions {
    id: BlockID; // 块 ID
    inline: Inline; // 行内元素样式
    language: Language; // 语言模式
}

export class BlockHandler extends Handler {
    protected customTabSize: number; // 用户定义的缩进大小,

    constructor(
        plugin,
    ) {
        super(plugin);
        this.customTabSize = this.plugin.config.editor.options.tabSize;
    }

    /* 使用 SQL 查询块信息 */
    protected async queryBlock(id: BlockID) {
        return this.client.sql({
            stmt: `SELECT * FROM blocks WHERE id = '${id}';`,
        });
    }

    /* 移除末尾的 IAL */
    protected removeLastIAL(kramdown: string): string {
        return kramdown.substring(0, kramdown.lastIndexOf("\n{:"));
    }

    /* 构造一个更新函数 */
    protected createUpdateFunction(
        id: BlockID, // 块 ID
        wrap?: (value: string) => string, // 内容包装函数
    ): (value: string) => Promise<string> {
        return async (value: string) => {
            if (wrap) {
                value = wrap(value);
            }
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
    public async makeHandler(options: IBlockHandlerOptions): Promise<IBlockHandler> {
        const { id, inline, language } = options;
        const handler: IBlockHandler = {
            modified: {
                value: "",
                language: "markdown",
            },
            options: {
                tabSize: 2,
            },
        }; // 生成的处理器
        const response_getDoc = await this.client.getDoc({
            id,
            mode: 0,
            size: Number.MAX_SAFE_INTEGER,
        }); // 获取块相关信息
        const block_type = response_getDoc.data.type as NodeType; // 块类型

        switch (language) {
            case Language.markdown: {
                switch (block_type) {
                    /* 文档块 */
                    case NodeType.NodeDocument: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.client.exportMdContent({ id });
                                handler.modified.value = response.data.content;
                                break;
                            }
                            case Inline.span: { // 使用 <span> 标签
                                handler.modified.value = this.lute.BlockDOM2StdMd(response_getDoc.data.content);
                                break;
                            }
                        }
                        break;
                    }

                    /* HTML 相关块 */
                    case NodeType.NodeAudio:
                    case NodeType.NodeVideo:
                    case NodeType.NodeIFrame:
                    case NodeType.NodeWidget:
                    case NodeType.NodeHTMLBlock: {
                        handler.modified.value = this.lute.BlockDOM2StdMd(response_getDoc.data.content);
                        handler.modified.language = "html";
                        handler.options.tabSize = this.customTabSize;
                        handler.update = this.createUpdateFunction(id);
                        break;
                    }

                    /* 嵌入块 */
                    case NodeType.NodeBlockQueryEmbed: {
                        const markdown = this.lute.BlockDOM2StdMd(response_getDoc.data.content);
                        const result = /^\s*\{\{(.*)\}\}\s*$/s.exec(markdown);
                        if (result && result.length === 2) { // 正确提取出 SQL 代码
                            handler.modified.value = result[1];
                            handler.modified.language = "sql";
                            handler.options.tabSize = this.customTabSize;
                            handler.update = this.createUpdateFunction(id, value => `{{${value}}}`);
                        }
                        else { // 回退为 markdown 编辑
                            handler.modified.value = markdown;
                            handler.update = this.createUpdateFunction(id);
                        }
                        break;
                    }

                    /* 代码块 */
                    case NodeType.NodeCodeBlock: {
                        const markdown = this.lute.BlockDOM2StdMd(response_getDoc.data.content);
                        const rows = markdown.trim().split("\n");
                        const begin = rows.shift();
                        const end = rows.pop();
                        const result = /^`{3,}(.*)$/.exec(begin);
                        if (result && result.length === 2) { // 正确提取出语言标签
                            const language = result[1].trim()
                            handler.modified.value = rows.join("\n");
                            handler.modified.language = heightlight2monaco(language);
                            handler.options.tabSize = this.customTabSize;
                            handler.update = this.createUpdateFunction(id, value => `${begin}\n${value}\n${end}`);
                        }
                        else { // 回退为 markdown 编辑
                            handler.modified.value = markdown;
                            handler.update = this.createUpdateFunction(id);
                        }
                        break;
                    }

                    /* 标题块 */
                    case NodeType.NodeHeading: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.queryBlock(id);
                                if (response.data.length > 0) {
                                    handler.modified.value = response.data[0].markdown;
                                    break;
                                }
                            }
                            case Inline.span: { // 使用 <span> 标签
                                const response = await this.client.getBlockDOM({ id });
                                handler.modified.value = this.lute.BlockDOM2StdMd(response.data.dom);
                                break;
                            }
                        }
                        handler.update = this.createUpdateFunction(id);
                        break;
                    }

                    /* 容器块 */
                    case NodeType.NodeSuperBlock:
                    case NodeType.NodeBlockquote:
                    case NodeType.NodeList:
                    case NodeType.NodeListItem: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.queryBlock(id);
                                if (response.data.length > 0) {
                                    handler.modified.value = response.data[0].markdown;
                                    break;
                                }
                            }
                            case Inline.span: { // 使用 <span> 标签
                                handler.modified.value = this.lute.BlockDOM2StdMd(response_getDoc.data.content);
                                break;
                            }
                        }
                        break;
                    }

                    /* 其他叶子块 */
                    default: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.queryBlock(id);
                                if (response.data.length > 0) {
                                    handler.modified.value = response.data[0].markdown;
                                    break;
                                }
                            }
                            case Inline.span: { // 使用 <span> 标签
                                handler.modified.value = this.lute.BlockDOM2StdMd(response_getDoc.data.content);
                                break;
                            }
                        }
                        handler.update = this.createUpdateFunction(id);
                        break;
                    }
                }
                break;
            }
            case Language.kramdown: {
                switch (block_type) {
                    /* 文档块 */
                    case NodeType.NodeDocument: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.client.getBlockKramdown({ id });
                                handler.modified.value = this.removeLastIAL(response.data.kramdown);
                                break;
                            }
                            case Inline.span: { // 使用 <span> 标签
                                handler.modified.value = this.lute.BlockDOM2Md(response_getDoc.data.content);
                                break;
                            }
                        }
                        break;
                    }
                    /* 标题块 */
                    case NodeType.NodeHeading: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.client.getBlockKramdown({ id });
                                handler.modified.value = response.data.kramdown;
                                break;
                            }
                            case Inline.span: { // 使用 <span> 标签
                                const response = await this.client.getBlockDOM({ id });
                                handler.modified.value = this.lute.BlockDOM2Md(response.data.dom);
                                break;
                            }
                        }
                        break;
                    }
                    /* 其他块 */
                    default: {
                        switch (inline) {
                            case Inline.mark: { // 使用 markdown 标志符
                                const response = await this.client.getBlockKramdown({ id });
                                handler.modified.value = response.data.kramdown;
                                break;
                            }
                            case Inline.span: { // 使用 <span> 标签
                                handler.modified.value = this.lute.BlockDOM2Md(response_getDoc.data.content);
                                break;
                            }
                        }
                        break;
                    }
                }
                handler.update = this.createUpdateFunction(id);
                break;
            }
        }
        return handler;
    }
}
