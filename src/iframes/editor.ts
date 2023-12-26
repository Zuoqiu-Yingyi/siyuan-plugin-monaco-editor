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

/* 界面入口 */
import "@/styles/editor.less";
import manifest from "~/public/plugin.json";
import i18n from "~/public/i18n/en_US.json";
import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
    FLAG_POPUP,
} from "@workspace/utils/env/native-front-end";
import { Logger } from "@workspace/utils/logger";

import Editor from "@/components/Editor.svelte";
import { EditorBridgeSlave } from "@/bridge/EditorSlave";

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

var editor: InstanceType<typeof Editor> = !FLAG_ELECTRON
    ? new Editor({
        target: globalThis.document.body,
        props: {
            plugin: {
                name: manifest.name,
                i18n,
                logger,
            },
        },
    })
    : null; // 编辑器组件

const bridge = new EditorBridgeSlave(
    () => {
        /* 编辑器初始化 */
        bridge.addEventListener(
            "editor-init",
            e => {
                const { data } = e.data;
                // logger.debug(data);

                /* 编辑器已存在则销毁原编辑器 */
                if (editor) {
                    editor.$destroy();
                }

                /* 创建新的编辑器 */
                editor = new Editor({
                    target: globalThis.document.body,
                    props: {
                        plugin: {
                            name: data.name,
                            i18n: data.i18n,
                            logger: logger,
                        },
                        path: data.path,
                        diff: data.diff,
                        locale: data.locale,
                        savable: data.savable,
                        changable: data.changable,
                        original: data.original,
                        modified: data.modified,
                        options: data.options,
                    },
                });
                /* 监听更改与保存事件 */
                editor.$on("changed", e => bridge.changed(e.detail));
                editor.$on("save", e => bridge.save(e.detail));
                editor.$on("hover", e => bridge.hover(e.detail));
                editor.$on("open", e => bridge.open(e.detail));
            },
        );
        /* 更改编辑器配置 */
        bridge.addEventListener(
            "editor-set",
            e => {
                const { data } = e.data;

                if (editor) {
                    editor.$set(data);
                }
            },
        );
        bridge.ready();
    },
);
