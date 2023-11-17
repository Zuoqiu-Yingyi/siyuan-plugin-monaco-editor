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

/* 资源文件处理器 */
import { Handler, type IBaseHandlerOptions, type IHandler } from "./handler";

import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";
import { staticPathname2WorkspacePath } from "@workspace/utils/siyuan/url";
import { extname } from "@workspace/utils/path/browserify";
import { UTF8_CHAR_SET, type TLabel } from "@workspace/utils/coder/text";
import { detect } from "@workspace/utils/coder/text/charset";
import { TextTranscoder } from "@workspace/utils/coder/text/transcoder";
import { fn__code } from "@workspace/utils/siyuan/text/span";
import type { IBlob } from "@siyuan-community/siyuan-sdk";
import { asyncPrompt } from "@workspace/components/siyuan/dialog/prompt";

export interface IAssetHandler extends IHandler {
    path: string; // 相对于工作空间目录的路径
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => Promise<Blob>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export type IAssetHandlerOptions = IAssetHandlerOptions1 | IAssetHandlerOptions2;

export interface IAssetBaseHandlerOptions extends IBaseHandlerOptions {
    updatable: boolean; // 是否可更新
    pathname?: string; // 资源 URL 路径
    path?: string; // 相对于工作空间目录的路径
}

export interface IAssetHandlerOptions1 extends IAssetBaseHandlerOptions {
    pathname: string;
    path?: never;
}

export interface IAssetHandlerOptions2 extends IAssetBaseHandlerOptions {
    path: string;
    pathname?: never;
}

export class AssetHandler extends Handler {
    protected customTabSize: number; // 用户定义的缩进大小,

    constructor(
        plugin,
    ) {
        super(plugin);
        this.customTabSize = this.plugin.config.editor.options.tabSize;
    }

    /* 构造一个更新函数 */
    protected createUpdateFunction(
        path: string, // 相对于工作空间目录的资源文件路径
        wrap: (value: string) => Blob = v => (new Blob([v])), // 内容包装函数
    ): (value: string) => Promise<Blob> {
        return async (value: string) => {
            const blob = wrap(value);
            await this.plugin.client.putFile({
                path,
                file: blob,
            });
            return blob;
        };
    }

    protected async updateHandler(
        blob: IBlob,
        options: IAssetHandlerOptions,
        handler: IAssetHandler,
    ): Promise<void> {
        handler.modified.value = await blob.text();
        if (options.updatable) {
            handler.update = this.createUpdateFunction(handler.path);
        }
    }

    protected async updateHandlerWithCharset(
        charset: TLabel,
        blob: IBlob,
        options: IAssetHandlerOptions,
        handler: IAssetHandler,
    ): Promise<void> {
        try {
            this.plugin.siyuan.showMessage(`charset: ${fn__code(charset)}`);

            const buffer = await blob.arrayBuffer();
            const transcoder = new TextTranscoder(charset);
            handler.modified.value = transcoder.decode(buffer);

            if (options.updatable) {
                handler.update = this.createUpdateFunction(
                    handler.path,
                    value => {
                        try {
                            const buffer = transcoder.encode(value);
                            return new Blob([buffer]);
                        } catch (error) {
                            this.plugin.siyuan.showMessage(error, -1, "error");
                            throw error;
                        }
                    },
                );
            }
        } catch (error) {
            new Error();
            this.plugin.siyuan.showMessage(error, -1, "error");
            this.plugin.logger.warn(error);
            await this.updateHandler(blob, options, handler);
        }
    }

    /**
     * 生产一个块处理器
     */
    public async makeHandler(options: IAssetHandlerOptions): Promise<IAssetHandler> {
        const path = options.path ?? staticPathname2WorkspacePath(options.pathname);

        const handler: IAssetHandler = {
            path,
            modified: {
                value: "",
                language: extname(path),
            },
            options: {
                tabSize: this.customTabSize,
            },
        };

        const response = await this.client.getFile(
            { path },
            "blob",
        );
        const buffer = await response.arrayBuffer();
        const charset = detect(response.contentType, buffer);
        const flag_trans = !!charset && !UTF8_CHAR_SET.has(charset);

        if (flag_trans) {
            const input = await asyncPrompt(this.plugin.siyuan.Dialog, {
                title: "charset",
                value: charset,
            }) as TLabel;
            await this.updateHandlerWithCharset(input, response, options, handler);
        }
        else {
            await this.updateHandler(response, options, handler);
        }

        return handler;
    }
}
