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

import { isElectron } from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { isMatchedMouseEvent } from "@workspace/utils/shortcut/match";
import { merge } from "@workspace/utils/misc/merge";
// import Settings from "@workspace/components/siyuan/setting/Example.svelte";

import Settings from "./components/Settings.svelte";
import Webview from "./components/Webview.svelte"
import { DEFAULT_CONFIG } from "./configs/default";

import type { IConfig, IProtocols } from "./types/config";

export default class WebviewPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    protected readonly logger: InstanceType<typeof Logger>;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly webview_tab: ReturnType<siyuan.Plugin["addTab"]>;
    protected config: IConfig;

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
        this.loadData(WebviewPlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = merge(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(() => {
                if (isElectron()) {
                    /* 注册触发打开页签动作的监听器 */
                    globalThis.addEventListener(this.config.tab.open.mouse.type, this.openTabEventListener, true);
                }
            })
    }

    onLayoutReady(): void {
        this.openSetting();
    }

    onunload(): void {
        if (isElectron()) {
            /* 移除触发打开页签动作的监听器 */
            globalThis.removeEventListener(this.config.tab.open.mouse.type, this.openTabEventListener, true);
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

    protected saveConfig(): void {
        this.saveData(WebviewPlugin.GLOBAL_CONFIG_NAME, this.config)
            .catch(error => this.logger.error(error));
    }

    protected isUrlSchemeAvailable(url: string, protocols: IProtocols): boolean {
        for (const key in protocols) {
            const protocol = protocols[key];
            if (protocol.enable && url.startsWith(protocol.prefix)) {
                return true;
            }
        }
        return false;
    }

    protected readonly openTabEventListener = (e: MouseEvent) => {
        // this.logger.debug(e);

        /* 判断功能是否已启用 */
        if (!this.config.tab.enable) return;

        /* 判断事件是否为目标事件 */
        if (!isMatchedMouseEvent(e, this.config.tab.open.mouse)) return;

        const target = e.target as HTMLElement;
        let valid: boolean = false; // 是否有效
        let href: string = ""; // 链接地址
        let title: string = ""; // 链接标题

        switch (target.localName) {
            case "a":
                valid = this.config.tab.open.targets.hyperlink.other.enable;
                href = (target as HTMLAnchorElement).href;
                title = target.title || target.innerText;
                break;
            case "span":
                if (/\ba\b/.test(target.dataset.type)) {
                    valid = this.config.tab.open.targets.hyperlink.editor.enable;
                    href = target.dataset.href;
                    title = target.dataset.title || target.innerText;
                }
                break;
            default:
                break;
        }

        /* 判断目标元素是否有效 */
        if (valid) {
            this.logger.info(href);
            if (this.isUrlSchemeAvailable(href, this.config.tab.open.protocols)) {
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
                    this.logger.warn(e);
                }
            }
        }
    }
};
