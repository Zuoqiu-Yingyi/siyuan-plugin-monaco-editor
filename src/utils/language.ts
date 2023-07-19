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

import type { languages } from "monaco-editor";

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

export class Languages {
    protected readonly _set_id = new Set<string>(); // 语言 ID 集合
    protected readonly _map_alias_id = new Map<string, string>(); // 语言别名 -> ID
    protected readonly _map_extension_id = new Map<string, string>(); // 语言文件扩展名 -> ID
    protected readonly _map_mimetype_id = new Map<string, string>(); // 语言 mine-type -> ID

    constructor(langs: languages.ILanguageExtensionPoint[]) {
        langs.forEach(lang => {
            const id = this.wash(lang.id);
            this._set_id.add(id);

            if (lang.aliases) {
                lang.aliases.forEach(alias => {
                    this._map_alias_id.set(this.wash(alias), id);
                });
            }
            if (lang.extensions) {
                lang.extensions.forEach(extension => {
                    this._map_extension_id.set(this.wash(extension), id);
                });
            }
            if (lang.mimetypes) {
                lang.mimetypes.forEach(mimetype => {
                    this._map_mimetype_id.set(this.wash(mimetype), id);
                });
            }
        });
    }

    protected wash(lang: string): string {
        return lang.trim().toLowerCase();
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
