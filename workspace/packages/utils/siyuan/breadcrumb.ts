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

import { BlockID } from "@workspace/types/siyuan";

export interface IPath {
    path: string;
    hpath: string;
}

/**
 * 获得文档路径
 * @param box: 笔记本 ID
 * @param path: 文档路径
 * @param hpath: 文档可读路径 (包含笔记本名称)
 */
export function getDocPaths(
    box: BlockID,
    path: string,
    hpath: string,
): IPath[] {
    path = box + path.substring(0, path.lastIndexOf(".sy"));
    const paths = path.split("/");
    const hpaths = hpath.split("/");
    const length = Math.min(paths.length, hpaths.length);
    const result: IPath[] = [];
    for (let i = 0; i < length; ++i) {
        result.push({
            path: paths[i],
            hpath: hpaths[i],
        });
    }
    return result;
}
