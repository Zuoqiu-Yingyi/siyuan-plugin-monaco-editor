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

import { extname } from "./../path/browserify";
import textExtensions from "text-extensions";

const extensions = new Set(textExtensions);

export function isTextExt(ext: string): boolean {
    ext = ext.startsWith(".") ? ext.substring(1) : ext;
    return extensions.has(ext.toLowerCase());
}

// REF: https://github.com/sindresorhus/is-text-path/blob/main/index.js
export function isTextPath(path: string): boolean {
    return isTextExt(extname(path));
}
