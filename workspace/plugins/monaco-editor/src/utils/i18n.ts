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

import {
    i18nCheck,
    i18nChecks,
} from "@workspace/types/siyuan/i18n";

import zh_Hans from "~/public/i18n/zh_CN.json";
import zh_Hant from "~/public/i18n/zh_CHT.json";
import en from "~/public/i18n/en_US.json";

export type I18N = typeof zh_Hans;

i18nChecks([
    i18nCheck<I18N, typeof zh_Hans>(),
    i18nCheck<I18N, typeof zh_Hant>(),
    i18nCheck<I18N, typeof en>(),
]);
