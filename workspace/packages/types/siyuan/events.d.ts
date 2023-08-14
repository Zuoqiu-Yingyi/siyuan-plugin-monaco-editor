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

import siyuan from "siyuan";
import type { IProtyle } from "./protyle";
import type { ITransaction } from "./transaction";

import type {
    IDocumentBlockMenuDetail,
    IOtherBlockMenuDetail,
} from "@workspace/utils/siyuan/menu/block";

export interface IWebSocketMainDetail {
    cmd?: string
    callback?: string
    data?: any
    msg: string
    code: number
    sid?: string
}

export interface IWebSocketTransactionsDetail extends IWebSocketMainDetail {
    cmd: "transactions"
    data: ITransaction[]
}

export interface IClickEditorContentDetail {
    event: PointerEvent;
    protyle: IProtyle;
}

export interface IOpenMenuLinkDetail {
    element: HTMLSpanElement,
    menu: InstanceType<typeof siyuan.Menu>;
    protyle: IProtyle;
}

export interface IOpenMenuBlockRefDetail {
    element: HTMLSpanElement,
    menu: InstanceType<typeof siyuan.Menu>;
    protyle: IProtyle;
}

export interface IOpenSiyuanUrlDetail {
    url: string;
}

export interface IOpenSiyuanUrlBlockDetail extends IOpenSiyuanUrlDetail {
    id: string;
    focus: boolean;
    exist: boolean;
}

export interface IOpenSiyuanUrlPluginDetail extends IOpenSiyuanUrlDetail {
}

export interface ILoadedProtyleDetail extends IProtyle {
}

export interface IWebSocketMainEvent extends CustomEvent<IWebSocketMainDetail> {
    type: "ws-main";
}

export interface IClickBlockIconEvent extends CustomEvent<IOtherBlockMenuDetail> {
    type: "click-blockicon";
}

export interface IClickEditorTitleIconEvent extends CustomEvent<IDocumentBlockMenuDetail> {
    type: "click-editorcontent";
}

export interface IClickEditorContentEvent extends CustomEvent<IClickEditorContentDetail> {
    type: "click-editorcontent";
}

export interface IOpenMenuLinkEvent extends CustomEvent<IOpenMenuLinkDetail> {
    type: "open-menu-link";
}

export interface IOpenMenuBlockRefEvent extends CustomEvent<IOpenMenuBlockRefDetail> {
    type: "open-menu-blockref";
}

export interface IOpenSiyuanUrlEvent extends CustomEvent<IOpenSiyuanUrlDetail> {
    type: "open-siyuan-url";
}

export interface IOpenSiyuanUrlBlockEvent extends CustomEvent<IOpenSiyuanUrlBlockDetail> {
    type: "open-siyuan-url-block";
}

export interface IOpenSiyuanUrlPluginEvent extends CustomEvent<IOpenSiyuanUrlPluginDetail> {
    type: "open-siyuan-url-plugin";
}

export interface ILoadedProtyleEvent extends CustomEvent<ILoadedProtyleDetail> {
    type: "loaded-protyle";
}
