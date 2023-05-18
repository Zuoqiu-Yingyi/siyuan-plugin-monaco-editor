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
    lang = lang.replaceAll("_", "-");

    switch (true) {
        case lang in preset:
            break;

        case lang.startsWith("zh-CNS"):
            lang = "zh-Hans";
            break;
        case lang.startsWith("zh-CNT"):
            lang = "zh-Hant";
            break;

        case lang.startsWith("zh-Hans"):
        case lang.startsWith("zh-CN"):
        case lang.startsWith("zh-SG"):
            lang = "zh-Hans";
            break;

        case lang.startsWith("zh-Hant"):
        case lang.startsWith("zh-TW"):
        case lang.startsWith("zh-HK"):
        case lang.startsWith("zh-MO"):
            lang = "zh-Hant";
            break;

        case lang.startsWith("zh"):
            lang = "zh-Hans";
            break;

        case lang.startsWith("en"):
            lang = "en";
            break;
        default:
            break;
    }
    return lang;
}
