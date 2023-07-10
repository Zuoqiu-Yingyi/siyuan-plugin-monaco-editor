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

export function mapLang(lang: string, preset: string[] = []): string {
    lang = lang
        .replaceAll("_", "-")
        .toLowerCase();

    switch (true) {
        case lang in preset:
            break;

        case lang.startsWith("zh-chs"):
        case lang.startsWith("zh-cns"):
            lang = "zh-Hans";
            break;
        case lang.startsWith("zh-cht"):
        case lang.startsWith("zh-cnt"):
            lang = "zh-Hant";
            break;

        case lang.startsWith("zh-hans"):
        case lang.startsWith("zh-cn"):
        case lang.startsWith("zh-sg"):
            lang = "zh-Hans";
            break;

        case lang.startsWith("zh-hant"):
        case lang.startsWith("zh-tw"):
        case lang.startsWith("zh-hk"):
        case lang.startsWith("zh-mo"):
            lang = "zh-Hant";
            break;

        case lang.startsWith("zh"):
            lang = "zh-Hans";
            break;

        case lang.startsWith("en"):
            lang = "en";
            break;
        case lang.startsWith("es"):
            lang = "es";
            break;
        case lang.startsWith("fr"):
            lang = "fr";
            break;
        default:
            break;
    }
    return lang;
}
