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
import { extname } from "@workspace/utils/path/browserify";
import { uri2path } from "@workspace/utils/misc/url";
import {
    Handler,
    type IBaseHandlerOptions,
    type IHandler,
} from "./handler";
import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";

export interface ILocalHandler extends IHandler {
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => Promise<void>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export interface ILocalHandlerOptions extends IBaseHandlerOptions {
    uri: string; // 资源路径
}

export class LocalHandler extends Handler {
    protected customTabSize: number; // 用户定义的缩进大小,

    constructor(
        plugin,
    ) {
        super(plugin);
        this.customTabSize = this.plugin.config.editor.options.tabSize;
    }

    /* 构造一个更新函数 */
    protected createUpdateFunction(
        path: string, // 文件绝对路径
    ): (value: string) => Promise<void> {
        return async (value: string) => {
            const fs = globalThis.require("fs/promises") as typeof import("fs/promises");
            await fs.writeFile(path, value);
        };
    }

    /**
     * 生产一个块处理器
     */
    public async makeHandler(options: ILocalHandlerOptions): Promise<ILocalHandler> {
        const { uri } = options;
        const path = uri2path(uri);
        const handler: ILocalHandler = {
            modified: {
                value: "",
                language: extname(path),
            },
            options: {
                tabSize: this.customTabSize,
            },
        }; // 生成的处理器

        // this.logger.debug(uri, path);
        const fs = globalThis.require("fs/promises") as typeof import("fs/promises");
        const stats = await fs.stat(path);
        if (stats?.isFile()) {
            const content = await fs.readFile(path, "utf-8");
            handler.modified.value = content;
            handler.update = this.createUpdateFunction(path);
        }
        else {
            throw new Error(`file does not exist: ${path}`);
        }
        return handler;
    }
}
