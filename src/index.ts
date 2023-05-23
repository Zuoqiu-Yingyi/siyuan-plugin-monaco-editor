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
import Webview from "./components/Webview.svelte"
import Settings from "@workspace/components/siyuan/setting/Example.svelte"
import { isElectron } from "@workspace/utils/env/front-end";

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

    
    private readonly webview_tab: ReturnType<siyuan.Plugin["addTab"]>;
    private readonly SETTINGS_DIALOG_ID: string;

    constructor(options: any) {
        super(options);
        
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;

        const pluginContext = this;
        this.webview_tab = this.addTab({
            type: "-webview-tag",
            init() {
                // console.debug(this)

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
        // console.debug(this);
        if (isElectron()) {
            globalThis.addEventListener("click", this.linkClientEventListener, true);
        }
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
        // console.debug(e);
        const target = e.target as HTMLElement;
        if (
            target.dataset &&
            target.dataset.type === "a" &&
            target.dataset.href
        ) {
            console.info(`[${this.name}]: ${target.dataset.href}`);
            const plugin = this
            if (WebviewPlugin.isUrlSchemeAvailable(target.dataset.href)) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    siyuan.openTab({
                        custom: {
                            icon: "iconLanguage",
                            title: target.title || target.innerText || target.dataset.href,
                            fn: plugin.webview_tab,
                            data: {
                                url: target.dataset.href,
                                title: target.title || target.innerText,
                            },
                        },
                    });
                } catch (e) {
                    console.warn(e)
                }
            }
        }
    }
};
