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
import regexp from "./../regexp";

/**
 * 查询块 ID
 * @params e: 事件
 * @return: 块 ID
 */
export function getBlockID(e: Event): BlockID | void {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const dataset = (path[i] as HTMLElement).dataset;
        if (dataset) {
            switch (true) {
                case dataset.nodeId && regexp.id.test(dataset.nodeId):
                    return dataset.nodeId;
                case dataset.id && regexp.id.test(dataset.id):
                    return dataset.id;
                case dataset.oid && regexp.id.test(dataset.oid):
                    return dataset.oid;
                case dataset.rootId && regexp.id.test(dataset.rootId):
                    return dataset.rootId;

                default:
                    break
            }
        }
    }
    return;
}
