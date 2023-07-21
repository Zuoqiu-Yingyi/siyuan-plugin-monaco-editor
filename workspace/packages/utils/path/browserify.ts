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

import browserify from "path-browserify";
import type {
    FormatInputPathObject,
    ParsedPath,
} from "path";

export default browserify;

export function basename(path: string, suffix?: string): string {
    return browserify.basename(path, suffix);
}

export function dirname(path: string): string {
    return browserify.dirname(path);
}

export function extname(path: string): string {
    return browserify.extname(path);
}

export function format(pathObject: FormatInputPathObject): string {
    return browserify.format(pathObject);
}

export function isAbsolute(path: string): boolean {
    return browserify.isAbsolute(path);
}

export function join(...paths: string[]): string {
    return browserify.join(...paths);
}

export function normalize(path: string): string {
    return browserify.normalize(path);
}

export function parse(path: string): ParsedPath {
    return browserify.parse(path);
}

export function resolve(...paths: string[]): string {
    return browserify.resolve(...paths);
}

export function relative(from: string, to: string): string {
    return browserify.relative(from, to);
}

export function toNamespacedPath(path: string): string {
    return browserify.toNamespacedPath(path);
}
