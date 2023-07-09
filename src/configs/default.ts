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

import * as sdk from "@siyuan-community/siyuan-sdk";

import type { IConfig } from "@/types/config";

import {
    MenuItemMode,
    TaskType,
} from "@/utils/enums";

export const DEFAULT_CONFIG: IConfig = {
    features: [
        { // 自定义块 style 属性
            id: "custom-block-style",
            enable: true,
            mode: MenuItemMode.input,
            multi: false,
            icon: "#iconTheme",
            type: {
                default: { enable: true },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: false },
            },
            tasks: [
                {
                    type: TaskType.edit,
                    params: {
                        name: "style",
                    },
                },
            ],
        },
        { // 分割线
            id: "custom-block-separator-1F23B9BB-BD9C-41A1-830E-F48D23618889",
            enable: true,
            mode: MenuItemMode.separator,
            multi: false,
            type: {
                default: { enable: true },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: false },
            },
        },
        { // 全宽显示
            id: "custom-block-width-full",
            enable: true,
            mode: MenuItemMode.button,
            multi: false,
            icon: "iconHideDock",
            accelerator: "width: full",
            style: true,
            token: "width-full",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeAudio]: { enable: true },
                [sdk.siyuan.NodeType.NodeIFrame]: { enable: true },
                [sdk.siyuan.NodeType.NodeVideo]: { enable: true },
                [sdk.siyuan.NodeType.NodeWidget]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-width",
                        token: "full",
                    },
                },
            ],
        },
        { // 全屏显示
            id: "custom-block-fullscreen",
            enable: true,
            mode: MenuItemMode.button,
            multi: false,
            icon: "iconFullscreen",
            tasks: [
                {
                    type: TaskType.fullscreen,
                },
            ],
        },
        { // 分割线
            id: "custom-block-separator-85642773-CEF8-4D0B-AFDF-BC450D162BEB",
            enable: true,
            mode: MenuItemMode.separator,
            multi: false,
        },
        { // 弹幕
            id: "custom-block-render-danmaku",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "icon-custom-block-render-danmaku",
            accelerator: "render: danmaku",
            style: true,
            token: "render-danmaku",
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-render",
                        token: "danmaku",
                    },
                },
            ],
        },
        { // 滚屏显示
            id: "custom-block-render-scroll",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconScrollWrapped",
            accelerator: "render: scroll",
            style: true,
            token: "render-scroll",
            type: {
                default: { enable: true },
                [sdk.siyuan.NodeType.NodeTable]: { enable: false },
            },
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-render",
                        token: "scroll",
                    },
                },
            ],
        },
        { // 分割线
            id: "custom-block-separator-71DD3901-AA75-412F-B764-17346468357D",
            enable: true,
            mode: MenuItemMode.separator,
            multi: true,
        },
        { // 显示块 ID
            id: "custom-block-render-id",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconInfo",
            accelerator: "render: id",
            style: true,
            token: "render-id",
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-render",
                        token: "id",
                    },
                },
            ],
        },
        { // 显示块序号
            id: "custom-block-render-index",
            enable: true,
            mode: MenuItemMode.button,
            multi: false,
            icon: "iconSpreadOdd",
            accelerator: "render: index",
            style: true,
            token: "render-index",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-render",
                        token: "index",
                    },
                },
            ],
        },
        { // 显示块内容
            id: "custom-block-render-content",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconMarkdown",
            accelerator: "render: content",
            style: true,
            token: "render-content",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },

                [sdk.siyuan.NodeType.NodeBlockquote]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
                [sdk.siyuan.NodeType.NodeListItem]: { enable: true },
                [sdk.siyuan.NodeType.NodeSuperBlock]: { enable: true },
                
                [sdk.siyuan.NodeType.NodeBlockQueryEmbed]: { enable: true },
                [sdk.siyuan.NodeType.NodeHeading]: { enable: true },
                [sdk.siyuan.NodeType.NodeParagraph]: { enable: true },
                [sdk.siyuan.NodeType.NodeMathBlock]: { enable: true },
                [sdk.siyuan.NodeType.NodeTable]: { enable: true },
                [sdk.siyuan.NodeType.NodeCodeBlock]: { enable: true },
                [sdk.siyuan.NodeType.NodeHTMLBlock]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-render",
                        token: "content",
                    },
                },
            ],
        },
        { // 显示块轮廓
            id: "custom-block-render-outline",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconMax",
            accelerator: "render: outline",
            style: true,
            token: "render-outline",
            tasks: [
                {
                    type: TaskType.toggle,
                    params: {
                        name: "custom-block-render",
                        token: "outline",
                    },
                },
            ],
        },
        { // 分割线
            id: "custom-block-separator-C55B65F3-4470-4C3A-B6D2-81A760634A11",
            enable: true,
            mode: MenuItemMode.separator,
            multi: true,
        },
        { // 书写模式
            id: "custom-block-writing-mode",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconEdit",
            accelerator: "writing-mode",
            style: true,
            token: "writing-mode",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
                [sdk.siyuan.NodeType.NodeBlockQueryEmbed]: { enable: true },
                [sdk.siyuan.NodeType.NodeBlockquote]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
                [sdk.siyuan.NodeType.NodeListItem]: { enable: true },
                [sdk.siyuan.NodeType.NodeSuperBlock]: { enable: true },
                [sdk.siyuan.NodeType.NodeHeading]: { enable: true },
                [sdk.siyuan.NodeType.NodeParagraph]: { enable: true },
                [sdk.siyuan.NodeType.NodeTable]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.switch,
                    params: {
                        name: "custom-block-writing-mode",
                        values: [
                            "vertical-rl",
                            "vertical-lr",
                            // "sideways-rl",
                            // "sideways-lr",
                            null,
                        ],
                    },
                },
            ],
        },
        { // 分割线
            id: "custom-block-separator-B320E3AA-01A7-45AB-8C64-B58578CDA111",
            enable: true,
            mode: MenuItemMode.separator,
            multi: true,
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeTable]: { enable: true },
            },
        },
        { // 表格-默认宽度
            id: "custom-block-table-width-default",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconUndo",
            accelerator: "table-width: null",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeTable]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.delete,
                    params: {
                        name: "custom-block-table-width",
                    },
                },
            ],
        },
        { // 表格-自动宽度
            id: "custom-block-table-width-auto",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "icon-custom-block-width-auto",
            accelerator: "table-width: auto",
            style: true,
            token: "table-width-auto",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeTable]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.update,
                    params: {
                        name: "custom-block-table-width",
                        value: "auto",
                    },
                },
            ],
        },
        { // 表格-单元格等宽
            id: "custom-block-table-width-equal",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "icon-custom-block-width-equal",
            accelerator: "table-width: equal",
            style: true,
            token: "table-width-equal",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeTable]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.update,
                    params: {
                        name: "custom-block-table-width",
                        value: "equal",
                    },
                },
            ],
        },
        { // 分割线
            id: "custom-block-separator-92B49367-D643-4AEC-B90F-7EB86DF4890A",
            enable: true,
            mode: MenuItemMode.separator,
            multi: true,
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
            },
        },
        { // 列表-默认视图
            id: "custom-block-list-view-default",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconUndo",
            accelerator: "list-view: null",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.delete,
                    params: {
                        name: "custom-block-list-view",
                    },
                },
            ],
        },
        { // 列表-导图视图
            id: "custom-block-list-view-map",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconGraph",
            accelerator: "list-view: map",
            style: true,
            token: "list-view-map",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.update,
                    params: {
                        name: "custom-block-list-view",
                        value: "map",
                    },
                },
            ],
        },
        { // 列表-表格视图
            id: "custom-block-list-view-table",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconTable",
            accelerator: "list-view: table",
            style: true,
            token: "list-view-table",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.update,
                    params: {
                        name: "custom-block-list-view",
                        value: "table",
                    },
                },
            ],
        },
        { // 列表-看板视图
            id: "custom-block-list-view-board",
            enable: true,
            mode: MenuItemMode.button,
            multi: true,
            icon: "iconSplitLR",
            accelerator: "list-view: board",
            style: true,
            token: "list-view-board",
            type: {
                default: { enable: false },
                [sdk.siyuan.NodeType.NodeDocument]: { enable: true },
                [sdk.siyuan.NodeType.NodeList]: { enable: true },
            },
            tasks: [
                {
                    type: TaskType.update,
                    params: {
                        name: "custom-block-list-view",
                        value: "board",
                    },
                },
            ],
        },
    ],
};
