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

import type { BlockID } from "@workspace/types/siyuan";
import type { Category, Type } from "@/wakatime/heartbeats";
import type { types } from "@siyuan-community/siyuan-sdk";

/**
 * 心跳连接
 * REF: https://wakatime.com/developers#heartbeats
 * REF: https://github.com/wakatime/browser-wakatime/blob/master/src/types/heartbeats.ts
 */
export namespace Heartbeats {
    export interface IAction {
        // <string: entity heartbeat is logging time against, such as an absolute file path or domain>,
        entity: string;

        // <string: type of entity; can be file, app, or domain>,
        type: Type;

        // <string: category for this activity (optional); normally this is inferred automatically from type; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, code reviewing, researching, learning, or designing>,
        category?: Category;

        // <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
        time: number;

        // <string: project name (optional)>,
        project?: string;

        // <integer: count of the number of folders in the project root path (optional); for ex: if the project folder is /Users/user/projects/wakatime and the entity path is /Users/user/projects/wakatime/models/user.py then the project_root_count is 5 and the relative entity path after removing 5 prefix folders is models/user.py>,
        project_root_count?: number;

        // <string: branch name (optional)>,
        branch?: string;

        // <string: language name (optional)>,
        language?: string;

        // <string: comma separated list of dependencies detected from entity file (optional)>,
        dependencies?: string;

        // <integer: total number of lines in the entity (when entity type is file)>,
        lines?: number;

        // <integer: current line row number of cursor with the first line starting at 1 (optional)>,
        lineno?: number;

        // <integer: current cursor column position starting from 1 (optional)>,
        cursorpos?: number;

        // <boolean: whether this heartbeat was triggered from writing to a file (optional)>,
        is_write?: boolean;
    }

    export interface IRequest extends types.kernel.api.network.forwardProxy.IPayload {
        headers: [
            Context.IHeaders,
        ],
        timeout: number;
        payload: IAction | IAction[],
    }
}

export namespace Context {
    export interface IHeaders {
        "Authorization": string; // API KEY
        "User-Agent": string; // System + Version + Editor
        "X-Machine-Name": string; // Machine Name
        [key: string]: string;
    }

    export interface IEvent {
        time: number; // UNIX 时间戳 (单位: s)
        is_write: boolean; // 是否写入
    }

    export interface IRoot {
        id: BlockID; // 文档 ID
        box: BlockID; // 笔记本 ID
        path: string; // 文档路径
        events: IEvent[]; // 事件
    }

    export interface IContext {
        url: string;
        method: "POST";
        headers: IHeaders;

        project: string;
        language: string;

        includeID: (string | RegExp)[],
        excludeID: (string | RegExp)[],
        include: (string | RegExp)[],
        exclude: (string | RegExp)[],

        blocks: Map<BlockID, BlockID>; // block -> root
        roots: Map<BlockID, IRoot>; // root -> { box, path }
        actions: Heartbeats.IAction[]; // 待提交的活动
    }

    export interface ISystem {
        os: string, // 操作系统名称
        arch: string, // 处理器名称
        name: string, // 主机名
        workspaceDir: string, // 工作空间路径
        kernelVersion: string, // 思源内核版本
    }
}
