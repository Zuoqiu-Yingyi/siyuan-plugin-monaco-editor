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
import { getPathExtension } from "@workspace/utils/misc/url";

export interface INetworkHandler extends IHandler {
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => Promise<Blob>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export interface INetworkHandlerOptions extends IBaseHandlerOptions {
    uri: string; // 资源路径
}

export class NetworkHandler extends Handler {
    protected customTabSize: number; // 用户定义的缩进大小,

    constructor(
        plugin,
    ) {
        super(plugin);
        this.customTabSize = this.plugin.config.editor.options.tabSize;
    }

    /**
     * 生产一个块处理器
     */
    public async makeHandler(options: INetworkHandlerOptions): Promise<INetworkHandler> {
        const { uri } = options;
        const url = new URL(uri);
        const handler: INetworkHandler = {
            modified: {
                value: "",
                language: getPathExtension(url.pathname),
            },
            options: {
                tabSize: this.customTabSize,
            },
        }; // 生成的处理器

        // this.client.forwardProxy 无法访问部分资源
        const response = await fetch(
            uri,
            {
                method: "GET",
            },
        );
        if (response.ok) {
            handler.modified.value = await response.text();
            if (!handler.modified.language.startsWith(".")) {
                const content_type = response.headers.get("content-type");
                const mine_type = content_type ? content_type.split(";")[0] : "";
                handler.modified.language = mine_type ? mine_type : handler.modified.language;
            }
        }
        else {
            throw new Error(response.statusText);
        }
        return handler;
    }
}
