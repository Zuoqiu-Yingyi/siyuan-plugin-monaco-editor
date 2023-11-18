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

import "@/styles/vditor.less";
import manifest from "~/public/plugin.json";
import i18n from "~/public/i18n/en_US.json";
import { Logger } from "@workspace/utils/logger";
import { trimSuffix } from "@workspace/utils/misc/string";
import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
    FLAG_POPUP,
} from "@workspace/utils/env/native-front-end";

import Vditor from "@/components/Vditor.svelte";
import { VditorBridgeSlave } from "@/bridge/VditorSlave";
import { Client } from "@siyuan-community/siyuan-sdk";

const src2url = new Map<string, string>(); // 将 src 目标映射为 blob URL
const baseURL = "./../libs/vditor";
const rootURL = trimSuffix(globalThis.location.pathname, `/plugins/${manifest.name}/iframes/vditor.html`);
const logger = new Logger(`${manifest.name}-vditor-${(() => {
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
const client = new Client({ baseURL: `${globalThis.location.origin}${rootURL}/` });

var vditor: InstanceType<typeof Vditor> = new Vditor({
    target: globalThis.document.body,
    props: {
        plugin: {
            name: manifest.name,
            i18n,
            logger,
            client,
        },
        src2url,
        baseURL,
        rootURL,
    },
}); // 编辑器组件

const bridge = new VditorBridgeSlave(
    () => {
        /* 编辑器初始化 */
        bridge.addEventListener(
            "vditor-init",
            e => {
                const { data } = e.data;

                /* 编辑器已存在则销毁原编辑器 */
                if (vditor) {
                    vditor.$destroy();
                }

                /* 创建新的编辑器 */
                vditor = new Vditor({
                    target: globalThis.document.body,
                    props: {
                        plugin: {
                            name: data.name,
                            i18n: data.i18n,
                            logger,
                            client,
                        },
                        src2url,
                        baseURL,
                        rootURL,

                        path: data.path,
                        vditorID: data.vditorID,
                        assetsDirPath: data.assetsDirPath,
                        assetsUploadMode: data.assetsUploadMode,
                        options: data.options,
                        value: data.value,
                        theme: data.theme,
                        codeBlockThemeLight: data.codeBlockThemeLight,
                        codeBlockThemeDark: data.codeBlockThemeDark,
                        debug: data.debug,
                    },
                });

                /* 监听更改与保存事件 */
                vditor.$on("changed", e => bridge.changed(e.detail));
                vditor.$on("save", e => bridge.save(e.detail));
                vditor.$on("open-link", e => bridge.openLink(e.detail));
            },
        );

        /* 更改编辑器配置 */
        bridge.addEventListener(
            "vditor-set",
            e => {
                const { data } = e.data;

                if (vditor) {
                    vditor.$set(data);
                }
            },
        );
        bridge.ready();
    },
);
