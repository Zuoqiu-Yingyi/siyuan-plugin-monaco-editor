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
import { staticPathname2WorkspacePath } from "@workspace/utils/siyuan/url";
import { extname } from "@workspace/utils/path/browserify";

export interface IAssetHandler extends IHandler {
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => Promise<Blob>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export type IAssetHandlerOptions = IAssetHandlerOptions1 | IAssetHandlerOptions2;

export interface IAssetHandlerOptions1 extends IBaseHandlerOptions {
    pathname: string; // 资源 URL 路径
    path?: never;
}

export interface IAssetHandlerOptions2 extends IBaseHandlerOptions {
    pathname?: never;
    path: string; // 相对于工作空间目录的路径
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

    /**
     * 生产一个块处理器
     */
    public async makeHandler(options: IAssetHandlerOptions): Promise<IAssetHandler> {
        const path = options.path ?? staticPathname2WorkspacePath(options.pathname);
        const handler: IAssetHandler = {
            modified: {
                value: "",
                language: extname(path),
            },
            options: {
                tabSize: this.customTabSize,
            },
        }; // 生成的处理器
        const response = await fetch(
            '/api/file/getFile',
            {
                method: "POST",
                body: JSON.stringify({
                    path,
                }),
            });
        if (response.ok) {
            handler.modified.value = await response.text();
            // const content_type = response.headers.get("content-type");
            // const mine_type = content_type ? content_type.split(";")[0] : "";
            // handler.modified.language = mine_type ? mine_type : handler.modified.language;
            handler.update = this.createUpdateFunction(path);
        }
        else {
            throw new Error(response.statusText);
        }
        return handler;
    }
}
