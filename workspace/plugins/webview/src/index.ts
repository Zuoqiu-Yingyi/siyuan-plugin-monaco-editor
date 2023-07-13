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
    FLAG_ELECTRON,
    FLAG_DESKTOP,
    FLAG_MOBILE,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { isMatchedMouseEvent } from "@workspace/utils/shortcut/match";
import { merge } from "@workspace/utils/misc/merge";
import { getElementScreenPosition } from "@workspace/utils/misc/position";
import { getBlockID } from "@workspace/utils/siyuan/dom";
import {
    Pathname,
    buildSiyuanWebURL,
    editorType2Pathname,
    parseSiyuanURL,
} from "@workspace/utils/siyuan/url";
import {
    getBlockMenuContext,
} from "@workspace/utils/siyuan/menu/block";
import { EditorType } from "@workspace/utils/siyuan";
import { calculateScreenPosition, type IPosition } from "@workspace/utils/dom/position";

import type {
    IClickBlockIconEvent,
    IClickEditorTitleIconEvent,
    IOpenMenuBlockRefEvent,
    IOpenMenuLinkEvent,
} from "@workspace/types/siyuan/events";
import type { BlockID } from "@workspace/types/siyuan";

// import Settings from "@workspace/components/siyuan/setting/Example.svelte";

import Settings from "./components/Settings.svelte";
import Webview from "./components/Webview.svelte"
import { DEFAULT_CONFIG } from "./configs/default";

import type {
    IConfig,
    IProtocols,
    ITargets,
} from "./types/config";
import {
    openNewWindow,
    type IOverwrite,
    type IWebPreferences,
} from "./utils/window";

export default class WebviewPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;

    protected readonly TOP_BAR_MENU_ID: string;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly webview_tab: ReturnType<siyuan.Plugin["addTab"]>;
    protected tab_bar_item: ReturnType<siyuan.Plugin["addTopBar"]>;
    protected config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.TOP_BAR_MENU_ID = `${this.name}-top-bar-menu`;
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
                if (FLAG_ELECTRON && FLAG_DESKTOP) {
                    /* 注册触发打开页签动作的监听器 */
                    globalThis.addEventListener(this.config.tab.open.mouse.type, this.openTabEventListener, true);
                }
                globalThis.addEventListener(this.config.window.open.mouse.type, this.openWindowEventListener, true);

                /* 文档块菜单 */
                this.eventBus.on("click-editortitleicon", this.blockMenuEventListener);
                /* 其他块菜单 */
                this.eventBus.on("click-blockicon", this.blockMenuEventListener);
                /* 块引用菜单 */
                this.eventBus.on("open-menu-blockref", this.blockRefMenuEventListener);
                /* 超链接菜单 */
                this.eventBus.on("open-menu-link", this.linkMenuEventListener);

                /* 快捷键/命令 */
                this.addCommand({
                    langKey: "openDesktopWindow",
                    langText: this.i18n.menu.openDesktopWindow.label,
                    hotkey: "⇧⌘N",
                    customHotkey: "",
                    callback: () => {
                        this.openSiyuanDesktopWindow();
                    },
                });
                this.addCommand({
                    langKey: "openMobildWindow",
                    langText: this.i18n.menu.openMobildWindow.label,
                    hotkey: "",
                    customHotkey: "",
                    callback: () => {
                        this.openSiyuanMobileWindow();
                    },
                });
            })

    }

    onLayoutReady(): void {
        // this.openSetting();
        if (FLAG_DESKTOP) {
            /* 顶部工具栏菜单 */
            const menu = new siyuan.Menu(this.TOP_BAR_MENU_ID);
            this.tab_bar_item = this.addTopBar({
                icon: "iconOpenWindow",
                title: this.i18n.displayName,
                position: "right",
                callback: (e) => {
                    // this.logger.debug(e);
                    const menu = new siyuan.Menu(this.TOP_BAR_MENU_ID);

                    /* 菜单项 - 打开桌面端窗口 */
                    menu.addItem({
                        icon: "iconSiYuan",
                        label: this.i18n.menu.openDesktopWindow.label,
                        click: (element) => {
                            const position = getElementScreenPosition(element);
                            this.openSiyuanDesktopWindow({ screenX: position.centerX, screenY: position.centerY });
                        },
                    });

                    /* 菜单项 - 打开移动端窗口 */
                    menu.addItem({
                        icon: "iconSiYuan",
                        label: this.i18n.menu.openMobildWindow.label,
                        click: (element) => {
                            const position = getElementScreenPosition(element);
                            this.openSiyuanMobileWindow({ screenX: position.centerX, screenY: position.centerY });
                        },
                    });

                    /* 菜单打开选项 */
                    const menu_open_options = {
                        x: 0,
                        y: 0,
                        isLeft: true,
                    };

                    /* 顶栏菜单项项被隐藏 */
                    if ((e.target as HTMLElement).classList.contains("fn__none")) {
                        const barPlugins = document.getElementById("barPlugins");
                        if (barPlugins) {
                            const rect = barPlugins.getBoundingClientRect();
                            menu_open_options.x = rect.x + rect.width / 2;
                            menu_open_options.y = rect.y + rect.height / 2;
                        }
                    }
                    else {
                        const rect = this.tab_bar_item.getBoundingClientRect();
                        menu_open_options.x = rect.x + rect.width / 2;
                        menu_open_options.y = rect.y + rect.height / 2;
                    }

                    /* 打开菜单 */
                    menu.open(menu_open_options);
                },
            });
        }
    }

    onunload(): void {
        if (FLAG_ELECTRON && FLAG_DESKTOP) {
            /* 移除触发打开页签动作的监听器 */
            globalThis.removeEventListener(this.config.tab.open.mouse.type, this.openTabEventListener, true);
        }
        globalThis.removeEventListener(this.config.window.open.mouse.type, this.openWindowEventListener, true);

        this.eventBus.off("click-blockicon", this.blockMenuEventListener);
        this.eventBus.off("click-editortitleicon", this.blockMenuEventListener);
        this.eventBus.off("open-menu-blockref", this.blockRefMenuEventListener);
        this.eventBus.off("open-menu-link", this.linkMenuEventListener);
    }

    openSetting(): void {
        const that = this;
        const dialog = new siyuan.Dialog({
            title: `${this.i18n.displayName} <code class="fn__code">${this.name}</code>`,
            content: `<div id="${that.SETTINGS_DIALOG_ID}" class="fn__flex-column" />`,
            width: FLAG_MOBILE ? "92vw" : "720px",
            height: FLAG_MOBILE ? undefined : "640px",
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

    /* 获得背景颜色 */
    public get background(): string {
        return this.config.general.background;
    }

    /** 
     * 打开新标签页
     * @param href: 访问地址
     * @param title: 页签标题
     * @param icon: 页签图标
     * @param options: 页签其他选项
     */
    public openWebviewTab(
        href: string,
        title?: string,
        icon: string = "iconLanguage",
        options: object = {},
    ) {
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
            keepCursor: false,
            removeCurrentTab: false,
            ...options,
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
                {
                    backgroundColor: this.background,
                    ...this.config.window.params,
                },
                params,
                webPreferences,
                this,
            );
            return window;
        } catch (err) {
            this.logger.warn(err);
        }
    }

    /**
     * 在新窗口打开网页
     * @param: e: 位置信息
     * @param: href: 地址
     * @param: title: 标题
     */
    public openWebpageWindow(
        href: string,
        title: string,
        e?: MouseEvent | IPosition,
    ) {
        const params = {
            x: e?.screenX ?? 0,
            y: e?.screenY ?? 0,
            title: title,
            alwaysOnTop: false, // 禁用置顶
            autoHideMenuBar: true, // 自动隐藏菜单栏
            webPreferences: {
                nodeIntegration: false, // 是否启用 Node.js 内置模块
                webviewTag: false, // 是否启用 webview 标签
                contextIsolation: false, // 是否开启上下文隔离, 设置 false 之后可以使用 require
            },

            enableMenuBar: true, // (自定义) 启用菜单栏
            enableElectron: false, // (自定义) 启用 Electron 环境
        };
        return this.openWindow(href, params);
    }

    /* 打开思源桌面端窗口 */
    public openSiyuanDesktopWindow(
        e?: MouseEvent | IPosition,
        href?: string,
    ): void {
        const params = {
            x: e?.screenX ?? 0,
            y: e?.screenY ?? 0,
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
        };
        this.openWindow(href || buildSiyuanWebURL(Pathname.desktop).href, params);
    }

    /* 打开思源移动端窗口 */
    public openSiyuanMobileWindow(
        e?: MouseEvent | IPosition,
        href?: string,
    ): void {
        const params = {
            x: e?.screenX ?? 0,
            y: e?.screenY ?? 0,
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
        };
        this.openWindow(href || buildSiyuanWebURL(Pathname.mobile).href, params);
    }

    /* 打开思源窗口 */
    public openSiyuanWindow(
        url: URL,
        e?: MouseEvent | IPosition,
    ): void {
        switch (this.config.window.siyuan.editorType) {
            case EditorType.desktop:
                this.openSiyuanDesktopWindow(e, url.href);
                break;

            case EditorType.mobile:
                this.openSiyuanMobileWindow(e, url.href);
                break;
        }
    }

    /* 通过 ID 打开思源窗口 */
    public openSiyuanWindowByID(element: HTMLElement, id: BlockID, focus: boolean) {
        const url = buildSiyuanWebURL(
            editorType2Pathname(this.config.window.siyuan.editorType),
            {
                id,
                focus,
            },
        );

        this.openSiyuanWindowByURL(element, url);
    }

    /* 通过 URL 打开思源窗口 */
    public openSiyuanWindowByURL(element: HTMLElement, url: URL) {
        this.openSiyuanWindow(url, calculateScreenPosition(element) as any);
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

    /* 块引用菜单 */
    protected readonly blockRefMenuEventListener = (e: IOpenMenuBlockRefEvent) => {
        // this.logger.debug(e);

        const element = e.detail.element; // 块引用 DOM 元素
        const id = element.dataset.id; // 块引用目标块 ID
        const submenu: siyuan.IMenuItemOption[] = [];

        /* 新窗口打开块 */
        submenu.push({
            icon: "iconOpenWindow",
            label: this.i18n.menu.openEditor.label,
            click: () => this.openSiyuanWindowByID(element, id, false),
        });

        /* 新窗口打开块并聚焦 */
        submenu.push({
            icon: "iconFocus",
            label: this.i18n.menu.openFocusedEditor.label,
            click: () => this.openSiyuanWindowByID(element, id, true),
        });

        e.detail.menu.addItem({
            icon: "iconLanguage",
            label: this.i18n.displayName,
            submenu,
        });
    }

    /* 超链接菜单 */
    protected readonly linkMenuEventListener = (e: IOpenMenuLinkEvent) => {
        // this.logger.debug(e);
        const submenu: siyuan.IMenuItemOption[] = [];

        const element = e.detail.element; // 超链接元素
        const link = this.parseHyperlinkMeta(element, this.config.tab.open.targets);

        switch (true) {
            /* 思源超链接 */
            case link.href.startsWith("siyuan:"): {
                const url = new URL(link.href);
                const param = parseSiyuanURL(url);

                /* 在后台页签中打开 */
                submenu.push({
                    icon: "iconFile",
                    label: this.i18n.menu.openTabBackground.label,
                    click: () => {
                        siyuan.openTab({
                            app: this.app,
                            doc: {
                                id: param.id,
                                action: [
                                    "cb-get-focus", // 光标定位到块
                                    "cb-get-hl", // 高亮块
                                ],
                                zoomIn: param.focus,
                            },
                            keepCursor: true, // 焦点不跳转到新 tab
                            removeCurrentTab: false, // 不移除原页签
                        });
                    },
                });
                /* 在页签右侧打开 */
                submenu.push({
                    icon: "iconLayoutRight",
                    label: this.i18n.menu.openTabRight.label,
                    click: () => {
                        siyuan.openTab({
                            app: this.app,
                            doc: {
                                id: param.id,
                                action: [
                                    "cb-get-focus", // 光标定位到块
                                    "cb-get-hl", // 高亮块
                                ],
                                zoomIn: param.focus,
                            },
                            position: "right",
                            keepCursor: false, // 焦点不跳转到新 tab
                            removeCurrentTab: false, // 不移除原页签
                        });
                    },
                });
                /* 在页签下侧打开 */
                submenu.push({
                    icon: "iconLayoutBottom",
                    label: this.i18n.menu.openTabBottom.label,
                    click: () => {
                        siyuan.openTab({
                            app: this.app,
                            doc: {
                                id: param.id,
                                action: [
                                    "cb-get-focus", // 光标定位到块
                                    "cb-get-hl", // 高亮块
                                ],
                                zoomIn: param.focus,
                            },
                            position: "bottom",
                            keepCursor: false, // 焦点不跳转到新 tab
                            removeCurrentTab: false, // 不移除原页签
                        });
                    },
                });
                /* 使用新窗口打开 */
                submenu.push({
                    icon: "iconOpenWindow",
                    label: this.i18n.menu.openByNewWindow.label,
                    click: () => this.openSiyuanWindowByID(element, param.id, param.focus),
                });
                break;
            }

            /* 静态文件服务 */
            case link.href.startsWith("stage/"): // 安装目录/resources/stage

            case link.href.startsWith("appearance/"): // 工作空间/conf/appearance
            case link.href.startsWith("export/"): // 工作空间/temp/export
            case link.href.startsWith("history/"): // 工作空间/history

            case link.href.startsWith("assets/"): // 工作空间/data/assets
            case link.href.startsWith("emojies/"): // 工作空间/data/emojies
            case link.href.startsWith("plugins/"): // 工作空间/data/plugins
            case link.href.startsWith("plugins/"): // 工作空间/data/plugins
            case link.href.startsWith("snippets/"): // 工作空间/data/snippets
            case link.href.startsWith("templates/"): // 工作空间/data/templates
            case link.href.startsWith("widgets/"): // 工作空间/data/widgets
                {
                    const href = `${globalThis.document.baseURI}${link.href}`;
                    if (FLAG_ELECTRON && FLAG_DESKTOP) {
                        /* 在后台页签中打开 */
                        submenu.push({
                            icon: "iconFile",
                            label: this.i18n.menu.openTabBackground.label,
                            click: () => this.openWebviewTab(
                                href,
                                link.title,
                                undefined,
                                { keepCursor: true },
                            ),
                        });
                        /* 在页签右侧打开 */
                        submenu.push({
                            icon: "iconLayoutRight",
                            label: this.i18n.menu.openTabRight.label,
                            click: () => this.openWebviewTab(
                                href,
                                link.title,
                                undefined,
                                { position: "right" },
                            ),
                        });
                        /* 在页签下侧打开 */
                        submenu.push({
                            icon: "iconLayoutBottom",
                            label: this.i18n.menu.openTabBottom.label,
                            click: () => this.openWebviewTab(
                                href,
                                link.title,
                                undefined,
                                { position: "bottom" },
                            ),
                        });
                    }
                    /* 使用新窗口打开 */
                    submenu.push({
                        icon: "iconOpenWindow",
                        label: this.i18n.menu.openByNewWindow.label,
                        click: () => this.openWebpageWindow(
                            href,
                            link.title,
                            calculateScreenPosition(element),
                        ),
                    });
                    break;
                }

            /* 其他超链接 */
            default: {
                if (FLAG_ELECTRON && FLAG_DESKTOP) {
                    /* 在后台页签中打开 */
                    submenu.push({
                        icon: "iconFile",
                        label: this.i18n.menu.openTabBackground.label,
                        click: () => this.openWebviewTab(
                            link.href,
                            link.title,
                            undefined,
                            { keepCursor: true },
                        ),
                    });
                    /* 在页签右侧打开 */
                    submenu.push({
                        icon: "iconLayoutRight",
                        label: this.i18n.menu.openTabRight.label,
                        click: () => this.openWebviewTab(
                            link.href,
                            link.title,
                            undefined,
                            { position: "right" },
                        ),
                    });
                    /* 在页签下侧打开 */
                    submenu.push({
                        icon: "iconLayoutBottom",
                        label: this.i18n.menu.openTabBottom.label,
                        click: () => this.openWebviewTab(
                            link.href,
                            link.title,
                            undefined,
                            { position: "bottom" },
                        ),
                    });
                }
                /* 使用新窗口打开 */
                submenu.push({
                    icon: "iconOpenWindow",
                    label: this.i18n.menu.openByNewWindow.label,
                    click: () => this.openWebpageWindow(
                        link.href,
                        link.title,
                        calculateScreenPosition(element),
                    ),
                });
                break;
            }
        }

        e.detail.menu.addItem({
            icon: "iconLanguage",
            label: this.i18n.displayName,
            submenu,
        });
    }

    /* 块菜单 */
    protected readonly blockMenuEventListener = (e: IClickBlockIconEvent | IClickEditorTitleIconEvent) => {
        // this.logger.debug(e);
        const detail = e.detail;
        const context = getBlockMenuContext(e.detail);
        if (context) {
            const submenu: siyuan.IMenuItemOption[] = [];

            /* 新窗口打开块 */
            submenu.push({
                icon: "iconOpenWindow",
                label: this.i18n.menu.openEditor.label,
                click: (element) => this.openSiyuanWindowByID(element, context.id, false),
            });

            if (!context.isDocumentBlock // 不是文档块
                && !context.isMultiBlock // 不是多个块
            ) {
                /* 新窗口打开块并聚焦 */
                submenu.push({
                    icon: "iconFocus",
                    label: this.i18n.menu.openFocusedEditor.label,
                    click: (element) => this.openSiyuanWindowByID(element, context.id, true),
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
