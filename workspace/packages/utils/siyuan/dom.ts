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
    BlockID,
    SnippetID,
    ShorthandID,
    HistoryPath,
    HistoryCreated,
    SnapshotID,
} from "@workspace/types/siyuan";
import regexp from "./../regexp";

/**
 * 查询块 ID
 * @param e: 事件
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

/**
 * 获取代码片段 ID
 * @param e: 事件
 * @return: 收集箱 ID
 */
export function getSnippetID(e: Event): SnippetID | void {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const element = path[i] as HTMLElement;
        const dataset = element.dataset;
        if (dataset) {
            switch (true) {
                case dataset.id && regexp.snippet.test(dataset.id):
                    if (dataset.type === "css" || dataset.type === "js") {
                        return dataset.id;
                    }
                    break
                default:
                    break
            }
        }
    }
    return;
}

/**
 * 获取收集箱项 ID
 * @param e: 事件
 * @return: 收集箱 ID
 */
export function getShorthandID(e: Event): ShorthandID | void {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const element = path[i] as HTMLElement;
        const dataset = element.dataset;
        if (dataset) {
            switch (true) {
                case dataset.id && regexp.shorthand.test(dataset.id):
                    if (
                        element
                            ?.parentElement
                            ?.classList
                            ?.contains
                            ?.("sy_inbox") // 收集箱项内容
                        || element
                            ?.parentElement
                            ?.parentElement
                            ?.parentElement
                            ?.classList
                            ?.contains
                            ?.("sy__inbox") // 收集箱项标题
                    ) {
                        return dataset.id;
                    }
                    break
                default:
                    break
            }
        }
    }
    return;
}

/**
 * 获取文档历史创建时间
 * @param e: 事件
 * @return: 文档历史创建时间
 */
export function getHistoryCreated(e: Event): HistoryCreated | void {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const element = path[i] as HTMLElement;
        const dataset = element.dataset;
        if (dataset) {
            switch (true) {
                case dataset.created && regexp.created.test(dataset.created):
                    if (
                        element
                            ?.parentElement
                            ?.parentElement
                            ?.classList
                            ?.contains
                            ?.("history__panel") // 文件历史面板
                        && !element
                            ?.parentElement
                            ?.parentElement
                            ?.parentElement
                            ?.classList
                            ?.contains
                            ?.("history__repo") // 非数据历史面板
                    ) {
                        return dataset.created;
                    }
                    break
                default:
                    break
            }
        }
    }
    return;
}

/**
 * 获取历史文档路径
 * @param e: 事件
 * @return: 历史文档路径
 */
export function getHistoryPath(e: Event): HistoryPath | void {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const element = path[i] as HTMLElement;
        const dataset = element.dataset;
        if (dataset) {
            switch (true) {
                case dataset.path && regexp.history.test(dataset.path):
                    if (dataset.type === "doc") {
                        return dataset.path;
                    }
                    break
                default:
                    break
            }
        }
    }
    return;
}

/**
 * 获取快照对象 ID
 * @param e: 事件
 * @return: 快照对象 ID 与快照原文件名/标题
 */
export function getSnapshotIDs(e: Event): { id: SnapshotID | void, id2: SnapshotID | void, name: string | void } {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const element = path[i] as HTMLElement;
        const dataset = element.dataset;
        if (dataset) {
            switch (true) {
                case dataset.id && regexp.snapshot.test(dataset.id):
                    if (element
                        ?.parentElement
                        ?.parentElement
                        ?.parentElement
                        ?.classList
                        ?.contains
                        ?.("history__diff") // 快照对比面板
                    ) {
                        return {
                            id: dataset.id, // 较早的快照
                            id2: dataset.id2, // 较晚的快照
                            name: (element.firstElementChild as HTMLElement)?.innerText, // 文件名/文档标题
                        };
                    }
                    break
                default:
                    break
            }
        }
    }
    return {
        id: undefined,
        id2: undefined,
        name: undefined,
    };
}
