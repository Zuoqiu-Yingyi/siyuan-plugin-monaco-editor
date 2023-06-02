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

// REF https://github.com/siyuan-note/siyuan/blob/dev/app/src/types/protyle.d.ts

import siyuan from "siyuan";

export interface IProtyle {
    app: any;
    transactionTime: number;
    id: string;
    block: {
        id?: string;
        scroll?: boolean;
        parentID?: string;
        parent2ID?: string;
        rootID?: string;
        showAll?: boolean;
        mode?: number;
        blockCount?: number;
        action?: string[];
    };
    disabled: boolean;
    selectElement?: HTMLElement;
    ws?: any;
    notebookId?: string;
    path?: string;
    model?: any;
    updated: boolean;
    element: HTMLElement;
    scroll?: any;
    gutter?: any;
    breadcrumb?: any;
    title?: any;
    background?: any;
    contentElement?: HTMLElement;
    options: any;
    lute?: siyuan.Lute;
    toolbar?: any;
    preview?: any;
    hint?: any;
    upload?: any;
    undo?: any;
    wysiwyg?: any;
}
