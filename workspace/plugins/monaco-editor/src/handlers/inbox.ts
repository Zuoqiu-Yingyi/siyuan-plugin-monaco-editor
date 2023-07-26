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

/* 收集箱处理器 */
import { Handler, type IBaseHandlerOptions, type IHandler } from "./handler";

import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";

export interface IInboxHandler extends IHandler {
    modified: IEditorModel; // 编辑器模式
    options: IMonacoEditorOptions; // 编辑器选项
    update?: (value: string) => ReturnType<typeof this.client.getInbox>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export interface IInboxHandlerOptions extends IBaseHandlerOptions {
    id: string; // 收集箱 ID
}

export class InboxHandler extends Handler {
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
    public async makeHandler(options: IInboxHandlerOptions): Promise<IInboxHandler> {
        /* 获取该收集箱项 */
        const response = await this.client.getShorthand({
            id: options.id,
        });

        /* 生成的处理器 */
        const handler: IInboxHandler = {
            modified: {
                value: response.data.shorthandContent,
                language: "markdown",
            },
            options: {
                tabSize: this.customTabSize,
            },
        };

        return handler;
    }
}
