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
import { Logger } from "@workspace/utils/logger";
import { trimSuffix } from "@workspace/utils/misc/string";
import {
    FLAG_ELECTRON,
    FLAG_IFRAME,
    FLAG_POPUP,
} from "@workspace/utils/env/native-front-end";

import Vditor from "@/components/Vditor.svelte";
import { Client } from "@siyuan-community/siyuan-sdk";
import { AssetsUploadMode } from "@/vditor/asset";

const name = manifest.name;
const baseURL = "./../libs/vditor";
const rootURL = trimSuffix(location.pathname, `/plugins/${name}/iframes/vditor.html`);
const src2url = new Map<string, string>(); // 将 src 目标映射为 blob URL

var vditor: InstanceType<typeof Vditor>; // 编辑器组件

const logger = new Logger(`${name}-vditor-${(() => {
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

/* 创建新的编辑器 */
vditor = new Vditor({
    target: globalThis.document.body,
    props: {
        plugin: {
            name,
            // TODO: 初始化 i18n
            i18n: undefined,
            logger,
            client,
        },
        path: `/data${location.pathname}`,
        src2url,
        baseURL,
        rootURL,
        assetsDirPath: "./../test/",
        assetsUploadMode: AssetsUploadMode.relative,
        debug: true,
    },
});
vditor.$on("open-link", e => {
    logger.debugs("open-link", e.detail);
});
vditor.$on("changed", e => {
    // logger.debugs("changed", e.detail);
});
vditor.$on("save", e => {
    logger.debugs("save", e.detail);
});

globalThis.addEventListener("beforeunload", () => {
    vditor.$destroy();

    for (const url of src2url.values()) {
        URL.revokeObjectURL(url);
    }
});
