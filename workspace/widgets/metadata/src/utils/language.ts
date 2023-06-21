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

import { ArcoLang } from '@arco-design/web-vue/es/locale/interface';

import arco_en from '@arco-design/web-vue/es/locale/lang/en-us';
import arco_en_Hans from '@arco-design/web-vue/es/locale/lang/zh-cn';
import arco_en_Hant from '@arco-design/web-vue/es/locale/lang/zh-tw';

/* 获得 Arco 内置的语言包 */
export function getArcoLang(lang: string): ArcoLang {
    switch (lang) {
        case 'zh-Hans':
            return arco_en_Hans;
        case 'zh-Hant':
            return arco_en_Hant;
        case 'en':
        default:
            return arco_en;
    }
}
