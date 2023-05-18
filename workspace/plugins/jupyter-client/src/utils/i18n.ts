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

// REF https://github.com/kaisermann/svelte-i18n/blob/main/docs/Getting%20Started.md

import {
    init,
    addMessages,
    getLocaleFromNavigator,
} from 'svelte-i18n';

import { mapLang } from '@workspace/utils/locale/language';
import { type SiyuanWindow } from '@workspace/types/siyuan/window';

import en from './../locales/en.json';
import zh_Hans from './../locales/zh-Hans.json';
import zh_Hant from './../locales/zh-Hant.json';

addMessages('en', en);
addMessages('zh-Hans', zh_Hans);
addMessages('zh-Hant', zh_Hant);

export function localizeInit(lang: string = (window as unknown as SiyuanWindow)?.siyuan?.config?.lang): void | Promise<void> {
    return init({
        fallbackLocale: 'en',
        initialLocale: mapLang(
            lang ?? getLocaleFromNavigator(),
            ['en', 'zh-Hans', 'zh-Hant'],
        ),
    });
}
