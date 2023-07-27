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

/* 是否为暗色主题 */
export function isDarkTheme(): boolean {
    const themeMode = globalThis
        .document
        .documentElement
        .dataset
        .themeMode;

    if (themeMode) {
        return themeMode === "dark";
    }
    else {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
