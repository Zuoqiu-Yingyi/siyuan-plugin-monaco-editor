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

import type {
    IMessageVditorMasterEventMap,
    IMessageVditorReady,
    IMessageVditorChanged,
    IMessageVditorSave,
    IMessageVditorOpenLink,
} from "@/types/message";
import { BridgeSlave } from "./slave";

export type MasterMessageEvent = IMessageVditorMasterEventMap[keyof IMessageVditorMasterEventMap];
export type MessageEventListener<
    K extends keyof IMessageVditorMasterEventMap = keyof IMessageVditorMasterEventMap,
> = (messageEvent: IMessageVditorMasterEventMap[K]) => void;

export class VditorBridgeSlave extends BridgeSlave<boolean, IMessageVditorMasterEventMap> {
    constructor(
        protected oninited: (this: InstanceType<typeof VditorBridgeSlave>) => any = () => { },
    ) {
        super(oninited);
    }

    /* 就绪 */
    public ready(data: IMessageVditorReady["data"] = { status: true }) {
        /* 组装消息 */
        const message: IMessageVditorReady = {
            channel: "vditor-ready",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器内容更改 */
    public changed(data: IMessageVditorChanged["data"]) {
        /* 组装消息 */
        const message: IMessageVditorChanged = {
            channel: "vditor-changed",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器保存 */
    public save(data: IMessageVditorSave["data"]) {
        /* 组装消息 */
        const message: IMessageVditorSave = {
            channel: "vditor-save",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }

    /* 编辑器打开超链接 */
    public openLink(data: IMessageVditorOpenLink["data"]) {
        /* 组装消息 */
        const message: IMessageVditorOpenLink = {
            channel: "vditor-open-link",
            data,
        };

        /* 发送消息 */
        this.port.postMessage(message);
    }
}
