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

import type { editor as Editor } from "monaco-editor";
import type { IEditorModel } from "@/types/editor";
import type { IMonacoEditorOptions } from "@/types/config";

type Plugin = InstanceType<typeof MonacoEditorPlugin>;

export interface IHandler {
    original?: IEditorModel; // 编辑器模式 (原始内容)
    modified?: IEditorModel; // 编辑器模式 (变更内容)
    options?: IMonacoEditorOptions; // 编辑器配置
    diffOptions?: Editor.IDiffEditorOptions; // 差异对比编辑器配置
    update?: (value: string) => string; // 处理编辑器内容的方法 (若未定义则不能更新)
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

    public abstract makeHandler(...args: any[]): Promise<IHandler>;
}
