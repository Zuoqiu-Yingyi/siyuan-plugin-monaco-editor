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

import { mapLang } from "@workspace/utils/locale/language";

// REF: https://www.npmjs.com/package/monaco-editor-nls
export function mapLocale(locale: string): string {
    switch (mapLang(locale)) {
        case "zh-Hans":
            return "zh-cn";
        case "zh-Hant":
            return "zh-tw";

        case "de":
            return "de";
        case "es":
            return "es";
        case "fr":
            return "fr";
        case "it":
            return "it";
        case "ja":
            return "ja";
        case "ko":
            return "ko";
        case "ru":
            return "ru";

        case "en":
        default:
            return "en";
    }
}
