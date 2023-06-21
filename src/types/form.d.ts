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

import { ShallowReactive } from "vue";

export interface IAttr {
    key: string;
    _key: string;
    value: string;
}

export interface IBasicAttrs {
    created: string;
    updated: string;
    title: string;
    name: string;
    alias: string[];
    tags: string[];
    bookmark: string;
    memo: string;
}

export interface IOtherAttrs {
    id: string;
    icon: string;
    scroll: string;
    "title-img": string;

    [key: string]: string;
}

export interface IUnknownsAttrs {
    [key: string]: string;
}

export interface IForm {
    basics: IBasicAttrs;

    customs: IAttr[];

    others: IOtherAttrs;

    unknowns: IUnknownsAttrs;
}
