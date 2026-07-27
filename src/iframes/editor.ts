// Copyright (C) 2023 Zuoqiu Yingyi
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { mount, unmount } from "svelte";

import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
    FLAG_POPUP,
} from "@workspace/utils/env/native-front-end";
import { Logger } from "@workspace/utils/logger";
import { state } from "@workspace/utils/svelte/runes.svelte";

import i18n from "~/public/i18n/en_US.json";
import manifest from "~/public/plugin.json";

import { EditorBridgeSlave } from "@/bridge/EditorSlave";

import Editor from "@/components/Editor.svelte";

import type { IEditorHandlers } from "../types/editor";

import type { IProps } from "@/components/Editor.svelte";

/* 界面入口 */
import "@/styles/editor.less";

const logger = new Logger(`${manifest.name}-editor-${(() => {
    switch (true) {
        case FLAG_ELECTRON:
            return "window";
        case FLAG_IFRAME:
            return "iframe";
        case FLAG_POPUP:
            return "popup";
        default:
            return "unknow";
    }
})()}`);

let props: IProps & IEditorHandlers = state({
    plugin: {
        name: manifest.name,
        i18n,
        logger,
    },
});
let editor: null | ReturnType<typeof mount> = !FLAG_ELECTRON
    ? mount(Editor, {
            target: globalThis.document.body,
            props,
        })
    : null; // 编辑器组件

const bridge = new EditorBridgeSlave(
    () => {
        /* 编辑器初始化 */
        bridge.addEventListener(
            "editor-init",
            (e) => {
                const { data } = e.data;
                // logger.debug(data);

                /* 编辑器已存在则销毁原编辑器 */
                if (editor) {
                    unmount(editor);
                }

                props = state({
                    plugin: {
                        name: data.name,
                        i18n: data.i18n,
                        logger,
                    },
                    path: data.path,
                    diff: data.diff,
                    locale: data.locale,
                    savable: data.savable,
                    changeable: data.changeable,
                    original: data.original,
                    modified: data.modified,
                    options: data.options,

                    onChanged: (params) => bridge.changed(params),
                    onSave: (params) => bridge.save(params),
                    onHover: (params) => bridge.hover(params),
                    onOpen: (params) => bridge.open(params),
                });

                /* 创建新的编辑器 */
                editor = mount(Editor, {
                    target: globalThis.document.body,
                    props,
                });
            },
        );
        /* 更改编辑器配置 */
        bridge.addEventListener(
            "editor-set",
            (e) => {
                // logger.debug("editor-set", e.data);
                const { data } = e.data;

                // REF: https://svelte.dev/docs/svelte/legacy-component-api#$set
                Object.entries(data).forEach(([key, value]) => {
                    // @ts-expect-error Svelte $set
                    props[key] = value;
                });
            },
        );
        bridge.ready();
    },
);
