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

/* token 分割 */
export function tokenSplit(token: string): string[] {
    return token
        .replaceAll("\\,", "\n")
        .split(",")
        .map(t => t.replaceAll("\n", ","));
}

export function isCustomAttrKey(key: string): boolean {
    return key.startsWith("custom-");
}

/**
 * REF https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
 */
export function looseJsonParse(josn: string): any {
    return eval?.(`"use strict";(${josn})`);
}
