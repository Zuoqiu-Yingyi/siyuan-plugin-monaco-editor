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

import type {
    IDocumentBlockMenuDetail,
    IOtherBlockMenuDetail,
} from "@workspace/utils/siyuan/menu/block";

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

export interface IClickBlockIconEvent extends CustomEvent<IOtherBlockMenuDetail> {
    type: "click-blockicon";
}

export interface IClickEditorTitleIconEvent extends CustomEvent<IDocumentBlockMenuDetail> {
    type: "click-editorcontent";
}

export interface IOpenMenuLinkEvent extends CustomEvent<IOpenMenuLinkDetail> {
    type: "open-menu-link";
}

export interface IOpenMenuBlockRefEvent extends CustomEvent<IOpenMenuBlockRefDetail> {
    type: "open-menu-blockref";
}
