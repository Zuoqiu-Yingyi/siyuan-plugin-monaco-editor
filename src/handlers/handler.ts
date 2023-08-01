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

import MonacoEditorPlugin from "@/index";

import type { IEditorOptions } from "@/types/editor";

type Plugin = InstanceType<typeof MonacoEditorPlugin>;

export interface IHandler extends Partial<IEditorOptions> {
    update?: (value: string) => Promise<any>; // 处理并保存编辑器内容的方法 (若未定义则不能更新)
}

export interface IBaseHandlerOptions {
}

export abstract class Handler {
    public readonly client: Plugin["client"];
    public readonly logger: Plugin["logger"];
    public readonly lute: Plugin["lute"];
    public readonly i18n: Plugin["i18n"];

    constructor(
        public readonly plugin: Plugin,
    ) {
        this.client = this.plugin.client;
        this.logger = this.plugin.logger;
        this.lute = this.plugin.lute;
        this.i18n = this.plugin.i18n;
    }

    /* 生成处理器 */
    public abstract makeHandler(options: IBaseHandlerOptions): Promise<IHandler>;
}
