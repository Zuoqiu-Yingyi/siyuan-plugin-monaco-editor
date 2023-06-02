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

import {
    isElectron,
    isDesktop,
    isMobile,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { isMatchedMouseEvent } from "@workspace/utils/shortcut/match";
import { merge } from "@workspace/utils/misc/merge";
import { getBlockID } from "@workspace/utils/siyuan/dom";
import {
    Pathname,
    buildSiyuanWebURL,
    editorType2Pathname,
    parseSiyuanURL,
} from "@workspace/utils/siyuan/url";
import {
    getBlockMenuContext,
    type BlockMenuDetail,
} from "@workspace/utils/siyuan/menu/block";

// import Settings from "@workspace/components/siyuan/setting/Example.svelte";

import Settings from "./components/Settings.svelte";
import Webview from "./components/Webview.svelte"
import { DEFAULT_CONFIG } from "./configs/default";

import type {
    IConfig,
    IProtocols,
    ITargets,
    IWindowParams,
} from "./types/config";
import {
    openNewWindow,
    type IOverwrite,
    type IWebPreferences,
} from "./utils/window";
import { EditorType } from "~/../../packages/utils/siyuan";

export default class WebviewPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;

    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly webview_tab: ReturnType<siyuan.Plugin["addTab"]>;
    protected config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;

        const plugin = this;
        this.webview_tab = this.addTab({
            type: "-webview-tag",
            init() {
                // pluginContext.logger.debug(this)

                // const target = document.createElement("div");
                // (this.element as HTMLElement).append(target);

                const tab = this;
                new Webview({
                    // target,
                    target: tab.element,
                    props: {
                        src: tab.data.href,
                        tab,
                        plugin,
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
                if (isElectron() && isDesktop()) {
                    /* 注册触发打开页签动作的监听器 */
                    globalThis.addEventListener(this.config.tab.open.mouse.type, this.openTabEventListener, true);
                }
                globalThis.addEventListener(this.config.window.open.mouse.type, this.openWindowEventListener, true);

                this.eventBus.on("click-blockicon", this.blockMenuEventListener);
                this.eventBus.on("click-editortitleicon", this.blockMenuEventListener);
            })

    }

    onLayoutReady(): void {
        // this.openSetting();
    }

    onunload(): void {
        if (isElectron() && isDesktop()) {
            /* 移除触发打开页签动作的监听器 */
            globalThis.removeEventListener(this.config.tab.open.mouse.type, this.openTabEventListener, true);
        }
        globalThis.removeEventListener(this.config.window.open.mouse.type, this.openWindowEventListener, true);

        this.eventBus.off("click-blockicon", this.blockMenuEventListener);
        this.eventBus.off("click-editortitleicon", this.blockMenuEventListener);
    }

    openSetting(): void {
        const that = this;
        const id = globalThis.crypto.randomUUID();
        const dialog = new siyuan.Dialog({
            title: that.name,
            content: `<div id="${that.SETTINGS_DIALOG_ID}" class="fn__flex-column" />`,
            width: isMobile() ? "92vw" : "720px",
            height: isMobile() ? undefined : "640px",
        });
        const settings = new Settings({
            target: dialog.element.querySelector(`#${that.SETTINGS_DIALOG_ID}`),
            props: {
                config: this.config,
                plugin: this,
            },
        });
    }

    /* 重置插件配置 */
    public async resetConfig(): Promise<void> {
        return this.updateConfig(merge(DEFAULT_CONFIG) as IConfig);
    }

    /* 更新插件配置 */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== this.config) {
            this.config = config;
        }
        return this.saveData(WebviewPlugin.GLOBAL_CONFIG_NAME, this.config);
    }

    /* 获得 UA */
    public get useragent(): string {
        return this.config.general.useragent || global.navigator.userAgent;
    }

    /* 打开新标签页 */
    public openWebviewTab(href: string, title?: string, icon: string = "iconLanguage") {
        siyuan.openTab({
            app: this.app,
            custom: {
                icon,
                title: title || this.name,
                fn: this.webview_tab,
                data: {
                    href,
                    title: title || this.name,
                },
            },
        });
    }

    /* 打开新窗口 */
    public openWindow(
        href: string,
        params: IOverwrite = {
            x: 0,
            y: 0,
            title: null,
        },
        webPreferences: IWebPreferences = {
            defaultFontSize: globalThis.siyuan.config.editor.fontSize,
            defaultFontFamily: {
                standard: globalThis.siyuan.config.editor.fontFamily,
            },
        },
    ) {
        try {
            const url = new URL(href);
            const window = openNewWindow(
                url,
                this.config.window.params,
                params,
                webPreferences,
                this,
            );
        } catch (err) {
            this.logger.warn(err);
        }
    }

    /* 打开思源桌面端窗口 */
    public openSiyuanDesktopWindow(e?: MouseEvent, href?: string): void {
        const params = {
            x: e?.screenX | 0,
            y: e?.screenY | 0,
            title: "desktop",
            alwaysOnTop: false, // 桌面端禁用置顶
            autoHideMenuBar: false, // 禁用自动隐藏菜单栏
            webPreferences: {
                nodeIntegration: true, // 是否启用 Node.js 内置模块
                webviewTag: true, // 是否启用 webview 标签
                contextIsolation: false, // 是否开启上下文隔离, 设置 false 之后可以使用 require
            },

            enableMenuBar: true, // (自定义) 启用菜单栏
            enableElectron: true, // (自定义) 启用 Electron 环境
        }
        this.openWindow(href || buildSiyuanWebURL(Pathname.desktop).href, params);
    }

    /* 打开思源移动端窗口 */
    public openSiyuanMobileWindow(e?: MouseEvent, href?: string): void {
        const params = {
            x: e?.screenX | 0,
            y: e?.screenY | 0,
            title: "mobile",
            alwaysOnTop: true, // 移动端启用置顶
            autoHideMenuBar: false,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true,
                contextIsolation: false,
            },

            enableMenuBar: true,
            enableElectron: true,
        }
        this.openWindow(href || buildSiyuanWebURL(Pathname.mobile).href, params);
    }

    /* 打开思源窗口 */
    public openSiyuanWindow(url: URL, e?: MouseEvent): void {
        switch (this.config.window.siyuan.editorType) {
            case EditorType.desktop:
                this.openSiyuanDesktopWindow(e, url.href);
                break;

            case EditorType.mobile:
                this.openSiyuanMobileWindow(e, url.href);
                break;
        }
    }

    /* 是否为有效的 URL 协议 */
    protected isUrlSchemeAvailable(url: string, protocols: IProtocols): boolean {
        for (const key in protocols) {
            const protocol = protocols[key];
            if (protocol.enable && url.startsWith(protocol.prefix)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取超链接的元数据
     * @param element: 超链接元素
     * @params targets: 目标配置
     */
    protected parseHyperlinkMeta(element: HTMLElement, targets: ITargets) {
        const meta = {
            valid: false, // 是否为有效的超链接
            enabled: false, // 是否为激活的超链接
            href: undefined, // 超链接目标
            title: undefined, // 超链接标题/锚文本
        };
        switch (element.localName) {
            case "a":
                meta.valid = true;
                meta.enabled = targets.hyperlink.other.enable;
                meta.href = (element as HTMLAnchorElement).href;
                meta.title = element.title || element.innerText;
                break;
            case "span":
                if (/\ba\b/.test(element.dataset.type)) {
                    meta.valid = true;
                    meta.enabled = targets.hyperlink.editor.enable;
                    meta.href = element.dataset.href;
                    meta.title = element.dataset.title || element.innerText;
                }
                break;
            default:
                break;
        }
        return meta;
    }

    /* 添加块菜单项 */
    protected readonly blockMenuEventListener = (e: any) => {
        // this.logger.debug(e);
        const detail = e.detail as BlockMenuDetail;
        const context = getBlockMenuContext(e.detail);
        if (context) {
            const submenu: siyuan.IMenuItemOption[] = [];
            const clickEventListener = (element: HTMLElement, focus: boolean) => {
                const url = buildSiyuanWebURL(
                    editorType2Pathname(this.config.window.siyuan.editorType),
                    {
                        id: context.id,
                        focus,
                    }
                );

                const rect = element.getBoundingClientRect();
                this.openSiyuanWindow(url, {
                    screenX: globalThis.screenX + rect.x,
                    screenY: globalThis.screenY + rect.y,
                } as any);
            };

            /* 新窗口打开块 */
            submenu.push({
                icon: "iconOpenWindow",
                label: this.i18n.menu.openEditor.label,
                click: (element) => clickEventListener(element, false),
            });

            if (!context.isDocumentBlock // 不是文档块
                && !context.isMultiBlock // 不是多个块
            ) {
                /* 新窗口打开块并聚焦 */
                submenu.push({
                    icon: "iconFocus",
                    label: this.i18n.menu.openFocusedEditor.label,
                    click: (element) => clickEventListener(element, true),
                });
            }

            detail.menu.addItem({
                icon: "iconLanguage",
                label: this.i18n.displayName,
                submenu,
            });
        }
    }

    /* 打开标签页 */
    protected readonly openTabEventListener = (e: MouseEvent) => {
        try {
            // this.logger.debug(e);

            /* 判断功能是否已启用 */
            if (!this.config.tab.enable) return;

            /* 判断事件是否为目标事件 */
            if (!isMatchedMouseEvent(e, this.config.tab.open.mouse)) return;

            const meta = this.parseHyperlinkMeta(e.target as HTMLElement, this.config.tab.open.targets);

            /* 判断目标元素是否有效 */
            if (meta.valid) {
                this.logger.info(meta.href);
                if (this.isUrlSchemeAvailable(meta.href, this.config.tab.open.protocols)) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();

                        this.openWebviewTab(meta.href, meta.title);
                    } catch (e) {
                        this.logger.warn(e);
                    }
                }
            }
        } catch (e) {
            this.logger.warn(e);
        }
    }

    /* 打开窗口 */
    protected readonly openWindowEventListener = (e: MouseEvent) => {
        try {
            // this.logger.debug(e);

            /* 判断功能是否已启用 */
            if (!this.config.window.enable) return;

            /* 判断事件是否为目标事件 */
            if (!isMatchedMouseEvent(e, this.config.window.open.mouse)) return;

            const meta = this.parseHyperlinkMeta(e.target as HTMLElement, this.config.window.open.targets);

            /* 打开超链接 */
            if (meta.valid) { // 是否为超链接
                this.logger.info(meta.href);

                /* 仅访问激活的超链接 */
                if (meta.enabled && this.isUrlSchemeAvailable(meta.href, this.config.window.open.protocols)) {
                    e.preventDefault();
                    e.stopPropagation();

                    /* 思源协议 siyuan:// 需要使用单独的方案 */
                    if (meta.href.startsWith("siyuan://")) {
                        if (this.config.window.siyuan.enable) {
                            /* 打开思源编辑器 */
                            const url = buildSiyuanWebURL(
                                editorType2Pathname(this.config.window.siyuan.editorType),
                                parseSiyuanURL(new URL(meta.href)),
                            );
                            this.openSiyuanWindow(url, e);
                        }
                    }
                    else {
                        this.openWindow(meta.href, {
                            x: e.screenX,
                            y: e.screenY,
                            title: meta.title || this.name,
                        });
                    }
                }
            }
            else { // 不为超链接
                /* 打开思源编辑器 */
                if (this.config.window.siyuan.enable) {
                    const block_id = getBlockID(e);
                    if (block_id) {
                        e.preventDefault();
                        e.stopPropagation();

                        const url = buildSiyuanWebURL(
                            editorType2Pathname(this.config.window.siyuan.editorType),
                            {
                                id: block_id,
                                focus: this.config.window.siyuan.focus,
                            }
                        );
                        this.openSiyuanWindow(url, e);
                    }
                }
            }

        } catch (e) {
            this.logger.warn(e);
        }
    }
};
