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

import type { editor as Editor } from "monaco-editor";
import type { IMonacoEditorOptions } from "@/types/config";

/* 编辑器模式 */
export interface IEditorModel {
    value: string; // 编辑器内容
    language?: string; // 编辑器语言模式
    uri?: Editor.Uri; // 通过 URI 推断编辑器语言模式
}

/* 侧边栏编辑器 */
export interface IDockEditor {
    modified: IEditorModel,
    options: IMonacoEditorOptions,
}
