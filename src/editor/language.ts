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

import type { IEditorEvents, IPlugin } from "@/types/editor";
import type { BlockID } from "@workspace/types/siyuan";
import type { default as Monaco, languages } from "monaco-editor";
import type { createEventDispatcher } from "svelte";
import { MarkdownFormatter } from "./markdown/formatter";
import { MarkdownCompletion } from "./markdown/completion";


/* 将 heightlight.js 的语言映射为 monaco 支持的语言 */
export function heightlight2monaco(language: string): string {
    switch (language) {
        case "mindmap":
            return "markdown";
        case "echarts":
            return "json";

        case "c#":
            return "csharp";
        case "js":
            return "javascript";
        case "ts":
            return "typescript";
        case "objectivec":
            return "objective-c";
        case "solidity":
            return "sol";
        case "vbscript":
            return "vb";
        default:
            return language;
    }
}

export enum SiyuanTokenType {
    link, // 思源超链接
    reference, // 思源块引用
    id, // 思源 id
}

export interface ISiyuanLink extends Monaco.languages.ILink {
    id: BlockID; // 思源块 ID
    type: SiyuanTokenType; // 思源字段类型
    token: string; // 字段
}

export interface ISiyuanToken {
    token: string; // 思源相关字段
    type: SiyuanTokenType, // 思源相关字段类型
    id: BlockID; // 思源相关字段中的块 ID
    start: number; // 思源相关字段在行中的起始位置
    end: number; // 思源相关字段在行中的结束位置
}

export class Languages {
    public static readonly REGEXP = {
        /**
         * 匹配思源 ID 相关字段
         * - 思源超链接: siyuan://*
         * - 思源块引用:
         *   - 动态锚文本((01234567890123-abcdefg '块引用名称'))
         *   - 静态锚文本((01234567890123-abcdefg "块引用名称"))
         * - 思源块 ID: 01234567890123-abcdefg
         */
        siyuan: /(siyuan:\/\/\S*\d{14}-[0-9a-z]{7}\S*)|(\(\(\d{14}-[0-9a-z]{7} ['"][^'"]*['"]\)\))|(\d{14}-[0-9a-z]{7})/g,
        id: /\d{14}-[0-9a-z]{7}/g,
    } as const;

    public static getSiyuanTokens(line: string): ISiyuanToken[] {
        const tokens: ISiyuanToken[] = [];
        const results = line.matchAll(Languages.REGEXP.siyuan);
        for (const result of results) {
            const token = result.at(0);
            const start = result.index + 1;
            const end = start + token.length;
            const { type, id } = (() => {
                switch (true) {
                    case result.at(1) !== undefined: { // 思源超链接
                        return {
                            type: SiyuanTokenType.link,
                            id: token.match(Languages.REGEXP.id).at(0),
                        }
                    }
                    case result.at(2) !== undefined: { // 思源块引用
                        return {
                            type: SiyuanTokenType.reference,
                            id: token.match(Languages.REGEXP.id).at(0),
                        }
                    }
                    case result.at(3) !== undefined: { // 思源块 ID
                        return {
                            type: SiyuanTokenType.id,
                            id: token,
                        }
                    }
                    default:
                        break;
                }
            })();
            tokens.push({
                token,
                type,
                id,
                start,
                end,
            });
        }
        return tokens;
    }

    protected readonly _langs: languages.ILanguageExtensionPoint[]; // 所支持的语言列表
    protected readonly _set_id = new Set<string>(); // 语言 ID 集合
    protected readonly _map_alias_id = new Map<string, string>(); // 语言别名 -> ID
    protected readonly _map_extension_id = new Map<string, string>(); // 语言文件扩展名 -> ID
    protected readonly _map_mimetype_id = new Map<string, string>(); // 语言 mine-type -> ID
    protected readonly _map_id_extension = new Map<string, string>(); // 语言 ID -> 文件扩展名
    protected readonly _map_id_mimetype = new Map<string, string>(); // 语言 ID -> mine-type

    constructor(
        public readonly pluign: IPlugin,
        protected readonly _monaco: typeof Monaco,
        protected readonly _dispatch: ReturnType<typeof createEventDispatcher<IEditorEvents>>
    ) {
        this._langs = this._monaco.languages.getLanguages();
        this._langs.forEach(lang => {
            const id = this.wash(lang.id);
            this._set_id.add(id);

            /* 注册思源相关超链接解析器 */
            this._monaco.languages.registerLinkProvider(id, this.siyuanLinkProvider);
            /* 注册思源相关超链接悬浮解析器 */
            this._monaco.languages.registerHoverProvider(id, this.siyuanHoverProvider);


            if (lang.aliases) {
                lang.aliases.forEach(alias => {
                    this._map_alias_id.set(this.wash(alias), id);
                });
            }
            if (lang.extensions) {
                lang.extensions.forEach(extension => {
                    this._map_extension_id.set(this.wash(extension), id);
                });
                if (lang.extensions.length > 0) {
                    this._map_id_extension.set(id, this.wash(lang.extensions.at(0)));
                }
            }
            if (lang.mimetypes) {
                lang.mimetypes.forEach(mimetype => {
                    this._map_mimetype_id.set(this.wash(mimetype), id);
                });
                if (lang.mimetypes.length > 0) {
                    this._map_id_mimetype.set(id, this.wash(lang.mimetypes.at(0)));
                }
            }
        });

        /* 添加额外的文件扩展名映射 */
        this._map_extension_id.set(".sy", "json");
        this._map_extension_id.set(".ipynb", "json");
        this._map_extension_id.set(".drawio", "xml");

        /* 注册 Markdown 格式化工具 */
        this._monaco.languages.registerDocumentFormattingEditProvider("markdown", new MarkdownFormatter(this.pluign, this._monaco));
        /* 注册 Markdown 自动补全工具 */
        this._monaco.languages.registerCompletionItemProvider("markdown", new MarkdownCompletion(this.pluign, this._monaco));
    }

    /* 鼠标悬浮在思源链接 */
    protected readonly siyuanHoverProvider: Monaco.languages.HoverProvider = {
        provideHover: (model, position, token) => {
            /* 获取鼠标悬浮所在行 */
            const line = model.getLineContent(position.lineNumber);
            const siyuan_tokens = Languages.getSiyuanTokens(line);
            const siyuan_token = siyuan_tokens.find(t => (t.start <= position.column && position.column <= t.end));

            const hover = { contents: [] };
            if (siyuan_token) { // 如果悬浮在思源 token 上方
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(() => {
                        // this.pluign.logger.info(siyuan_token);
                        this._dispatch("hover", { id: siyuan_token.id }); // 派遣鼠标悬浮事件
                        resolve(hover);
                    }, 1_000); // 悬浮 1s 后派遣悬浮事件

                    /* 鼠标移出时调用 */
                    token.onCancellationRequested((e) => {
                        // this.pluign.logger.debug(e);
                        clearTimeout(timer);
                        resolve(hover);
                    });
                });
            }
            else {
                return hover;
            }
        }
    }

    /* 解析思源相关链接 */
    protected readonly siyuanLinkProvider: Monaco.languages.LinkProvider = {
        provideLinks: (model, token) => {
            const links: ISiyuanLink[] = [];
            const lines = model.getLinesContent();
            const length = lines.length;
            for (let i = 0; i < length; ++i) {
                const tokens = Languages.getSiyuanTokens(lines[i]);
                for (const token of tokens) {
                    const link: ISiyuanLink = {
                        range: {
                            startLineNumber: i + 1,
                            startColumn: token.start,
                            endLineNumber: i + 1,
                            endColumn: token.end,
                        },
                        id: token.id,
                        type: token.type,
                        token: token.token,
                        /**
                         * 提供 url 后就不会调用 {@link Monaco.languages.LinkProvider["resolveLink"]}
                         */
                        // url: "",
                        // tooltip: token,
                    };
                    switch (token.type) {
                        case SiyuanTokenType.link: { // 思源超链接
                            link.tooltip = this.pluign.i18n.editor.tooltip.siyuanBlockHyperlink.label;
                            break;
                        }
                        case SiyuanTokenType.reference: { // 思源块引用
                            link.tooltip = this.pluign.i18n.editor.tooltip.siyuanBlockReference.label;
                            break;
                        }
                        case SiyuanTokenType.id: { // 思源块 ID
                            link.tooltip = this.pluign.i18n.editor.tooltip.siyuanBlockID.label;
                            break;
                        }
                    }
                    link.tooltip = `${link.tooltip} → [${link.id}]`;
                    // link.tooltip = `[${link.tooltip}](${link.id})`;
                    links.push(link);
                }
            }
            return {
                links,
            };
        },
        resolveLink: (link: ISiyuanLink, token) => {
            // this.pluign.logger.info(link);

            switch (link.type) {
                case SiyuanTokenType.link: { // 思源超链接
                    link.url = link.token;
                    break;
                }
                default: {
                    link.url = `siyuan://blocks/${link.id}`;
                    break;
                }
            }

            /* 派遣打开思源块事件 */
            const url = new URL(link.url);
            this._dispatch("open", {
                id: link.id,
                focus: parseInt(url.searchParams.get("focus")),
            });

            /* 设置 url 以避免输出链接目标丢失的警告 */
            link.url = this._monaco.Uri.parse(link.url);
            // link.url = " ";

            return link;
        }
    }

    /* 清洗语言名 */
    protected wash(lang: string): string {
        return lang.trim().toLowerCase();
    }

    /* 获取语言对应文件的扩展名 */
    public getExtension(lang: string): string {
        lang = this.wash(lang);
        return this._map_id_extension.get(lang) ?? lang;
    }

    /* 获取语言对应文件的 MIME type */
    public getMimeType(lang: string): string {
        lang = this.wash(lang);
        return this._map_id_mimetype.get(lang) ?? lang;
    }

    /* 将语言映射到语言 ID */
    public map(lang: string): string {
        lang = this.wash(lang);
        switch (true) {
            case this._set_id.has(lang):
                return lang;
            case this._map_alias_id.has(lang):
                return this._map_alias_id.get(lang);
            case this._map_extension_id.has(lang):
                return this._map_extension_id.get(lang);
            case this._map_mimetype_id.has(lang):
                return this._map_mimetype_id.get(lang);
            default:
                return lang;
        }
    }
}
