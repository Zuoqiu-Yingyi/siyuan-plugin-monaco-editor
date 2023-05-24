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

import Settings from "@workspace/components/siyuan/setting/Example.svelte";
import { isElectron } from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";

import Webview from "./components/Webview.svelte"

export default class WebviewPlugin extends siyuan.Plugin {
    static isUrlSchemeAvailable(url: string): boolean {
        switch (true) {
            case url.startsWith("https://"):
            case url.startsWith("http://"):
            case url.startsWith("file://"):
            case url.startsWith("ftps://"):
            case url.startsWith("ftp://"):
            case url.startsWith("//"):
                return true;
            default:
                return false;
        }
    }


    protected readonly logger: InstanceType<typeof Logger>;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly webview_tab: ReturnType<siyuan.Plugin["addTab"]>;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;

        const pluginContext = this;
        this.webview_tab = this.addTab({
            type: "-webview-tag",
            init() {
                // pluginContext.logger.debug(this)

                // const target = document.createElement("div");
                // (this.element as HTMLElement).append(target);

                const tabContext = this;
                new Webview({
                    // target,
                    target: tabContext.element,
                    props: {
                        url: tabContext.data.url,
                        tabContext,
                        pluginContext,
                    },
                });
            },
        });
    }

    onload(): void {
        // this.logger.debug(this);
        if (isElectron()) {
            globalThis.addEventListener("click", this.linkClientEventListener, true);
        }
    }

    onLayoutReady(): void {
        this.openSetting();
    }

    onunload(): void {
        if (isElectron()) {
            globalThis.removeEventListener("click", this.linkClientEventListener, true);
        }
    }

    openSetting(): void {
        const that = this;
        const id = globalThis.crypto.randomUUID();
        const dialog = new siyuan.Dialog({
            title: that.name,
            content: `<div id="${that.SETTINGS_DIALOG_ID}"/>`,
            width: siyuan.isMobile() ? "92vw" : "520px",
        });
        const global = new Settings({
            target: dialog.element.querySelector(`#${that.SETTINGS_DIALOG_ID}`),
        });
    }

    linkClientEventListener = (e: MouseEvent) => {
        // this.logger.debug(e);
        const target = e.target as HTMLElement;
        let valid: boolean = false; // 是否有效
        let href: string = ""; // 链接地址
        let title: string = ""; // 链接标题

        switch (target.localName) {
            case "a":
                valid = true;
                href = (target as HTMLAnchorElement).href;
                title = target.title || target.innerText;
                break;
            case "span":
                if (/\ba\b/.test(target.dataset.type)) {
                    valid = true;
                    href = target.dataset.href;
                    title = target.dataset.title || target.innerText;
                }
                break;
            default:
                break;
        }
        if (valid) {
            this.logger.info(href);
            if (WebviewPlugin.isUrlSchemeAvailable(href)) {
                try {
                    e.preventDefault();
                    e.stopPropagation();

                    const plugin = this
                    siyuan.openTab({
                        custom: {
                            icon: "iconLanguage",
                            title: title || plugin.name,
                            fn: plugin.webview_tab,
                            data: {
                                url: href,
                                title: title || plugin.name,
                            },
                        },
                    });
                } catch (e) {
                    this.logger.warn(e)
                }
            }
        }
    }
};
