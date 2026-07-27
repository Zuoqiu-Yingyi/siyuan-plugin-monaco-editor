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

import { Client } from "@siyuan-community/siyuan-sdk";
import { mount, unmount } from "svelte";

import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
    FLAG_POPUP,
} from "@workspace/utils/env/native-front-end";
import { Logger } from "@workspace/utils/logger";
import { trimSuffix } from "@workspace/utils/misc/string";
import { state } from "@workspace/utils/svelte/runes.svelte";

import i18n from "~/public/i18n/en_US.json";
import manifest from "~/public/plugin.json";

import { VditorBridgeSlave } from "@/bridge/VditorSlave";

import Vditor from "@/components/Vditor.svelte";

import type { IVditorHandlers } from "../types/vditor";

import type { IProps } from "@/components/Vditor.svelte";

import "@/styles/vditor.less";

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

let props: IProps & IVditorHandlers = state({
    plugin: {
        name: manifest.name,
        i18n,
        logger,
        client,
    },
    src2url,
    baseURL,
    rootURL,
});
let vditor: ReturnType<typeof mount> = mount(Vditor, {
    target: globalThis.document.body,
    props,
}); // 编辑器组件

const bridge = new VditorBridgeSlave(
    () => {
        /* 编辑器初始化 */
        bridge.addEventListener(
            "vditor-init",
            (e) => {
                const { data } = e.data;

                /* 编辑器已存在则销毁原编辑器 */
                if (vditor) {
                    unmount(vditor);
                }

                props = state({
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

                    onOpenLink: (params) => bridge.openLink(params),
                    onChanged: (params) => bridge.changed(params),
                    onSave: (params) => bridge.save(params),
                });

                /* 创建新的编辑器 */
                vditor = mount(Vditor, {
                    target: globalThis.document.body,
                    props,
                });
            },
        );

        /* 更改编辑器配置 */
        bridge.addEventListener(
            "vditor-set",
            (e) => {
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
