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

/* 插件入口 */
import siyuan from "siyuan";

/* 静态资源 */
import icon_plugin from "./assets/symbols/icon-monaco-editor.symbol?raw"
import icon_slash from "./assets/symbols/icon-monaco-editor-slash.symbol?raw"

/* SDK */
import { Client } from "@siyuan-community/siyuan-sdk";

/* 工作空间资源 */
import { Logger } from "@workspace/utils/logger";
import { getBlockID } from "@workspace/utils/siyuan/dom";
import { isStaticPathname } from "@workspace/utils/siyuan/url";
import { merge } from "@workspace/utils/misc/merge";
import { getBlockMenuContext } from "@workspace/utils/siyuan/menu/block";
import { getElementScreenPosition } from "@workspace/utils/misc/position";
import { FLAG_ELECTRON } from "@workspace/utils/env/front-end";

/* 组件 */
import Dock from "./components/Dock.svelte";
import Tab from "./components/Tab.svelte";

/* 项目资源 */
import {
    DEFAULT_CONFIG,
    siyuanConfig2EditorOptions,
} from "./configs/default";
import { Inline, Language } from "./handlers/block";
import { EditorWindow } from "./utils/window";
import { HandlerType, type IFacadeOptions } from "./facades/facade";

/* 类型 */
import type { IClickBlockIconEvent, IClickEditorContentEvent, IOpenMenuLinkEvent } from "@workspace/types/siyuan/events";
import type { BlockID } from "@workspace/types/siyuan";

import type {
    IConfig, IEditorOptions,
} from "./types/config";
import type { I18N } from "@/utils/i18n";
import type { IDockData } from "./types/dock";

export default class MonacoEditorPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    declare public readonly i18n: I18N;
    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;
    public readonly lute: ReturnType<typeof siyuan.Lute["New"]>;
    public config: IConfig;

    protected readonly EDITOR_URL: URL;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly tab: ReturnType<siyuan.Plugin["addTab"]>;
    protected readonly dock: {
        // editor: InstanceType<typeof Editor>,
        object: ReturnType<siyuan.Plugin["addDock"]>,
        model?: siyuan.IModel,
        component?: InstanceType<typeof Dock>,
    };

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client();
        this.lute = globalThis.Lute.New();

        this.EDITOR_URL = new URL(`${globalThis.document.baseURI}plugins/${this.name}/editor`);
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;

        const plugin = this;
        this.tab = this.addTab({
            type: "-editor-tab",
            init() {
                // plugin.logger.debug(this);
                const tab = this;
                this.component = new Tab({
                    // target,
                    target: tab.element,
                    props: {
                        plugin,
                        ...tab.data,
                    },
                });
            },
            destroy() {
                this.component?.$destroy();
            },
        });
        this.dock = {
            object: this.addDock({
                config: {
                    position: "BottomRight",
                    size: { width: 256, height: 256 },
                    icon: "iconCode",
                    title: this.i18n.dock.title,
                    show: true,
                },
                data: {
                    id: "",
                    realTime: false,
                    inline: Inline.mark,
                    language: Language.kramdown,
                } as IDockData,
                type: "-dock-panel",
                init() {
                    // plugin.logger.debug(this);

                    (this.element as HTMLElement).classList.add("fn__flex-column");
                    const dock = new Dock({
                        target: this.element,
                        props: {
                            plugin,
                            editor: {
                                modified: {
                                    value: "",
                                    language: "markdown",
                                },
                                options: plugin.config.editor.options,
                            },
                            ...(this.data as IDockData),
                        },
                    });
                    plugin.dock.model = this;
                    plugin.dock.component = dock;
                },
                destroy() {
                    plugin.dock.component?.$destroy();
                    delete plugin.dock.component;
                },
            }),
        }
    }

    onload(): void {
        // this.logger.debug(this);
        /* 注册图标 */
        this.addIcons([
            icon_plugin, // 插件图标
            icon_slash, // 斜杠图标
        ].join(""));

        this.loadData(MonacoEditorPlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = merge(DEFAULT_CONFIG, config || {}) as IConfig;
                this.updateConfigBySiyuanConfig();
            })
            .catch(error => this.logger.error(error))
            .finally(() => {
                // globalThis.addEventListener(this.config.view.open.mouse.type, this.openViewEventListener, true);
                // globalThis.addEventListener(this.config.edit.open.mouse.type, this.openEditEventListener, true);

                /* 编辑区点击 */
                this.eventBus.on("click-editorcontent", this.clickEditorContentEventListener);

                /* 其他块菜单 */
                this.eventBus.on("click-blockicon", this.blockMenuEventListener);
                /* 文档块菜单 */
                this.eventBus.on("click-editortitleicon", this.blockMenuEventListener);
                // /* 块引用菜单 */
                // this.eventBus.on("open-menu-blockref", this.blockRefMenuEventListener);
                /* 超链接菜单 */
                this.eventBus.on("open-menu-link", this.linkMenuEventListener);

                // /* 快捷键/命令 */
                // this.addCommand({
                //     langKey: "openDesktopWindow",
                //     langText: this.i18n.menu.openDesktopWindow.label,
                //     hotkey: "⇧⌘N",
                //     customHotkey: "",
                //     callback: () => {
                //         this.openSiyuanDesktopWindow();
                //     },
                // });
                // this.addCommand({
                //     langKey: "openMobildWindow",
                //     langText: this.i18n.menu.openMobildWindow.label,
                //     hotkey: "",
                //     customHotkey: "",
                //     callback: () => {
                //         this.openSiyuanMobileWindow();
                //     },
                // });

            })
    }

    onLayoutReady(): void {
        this.openSetting();
    }

    onunload(): void {
        // globalThis.removeEventListener(this.config.view.open.mouse.type, this.openTabEventListener, true);
        // globalThis.removeEventListener(this.config.edit.open.mouse.type, this.openWindowEventListener, true);

        this.eventBus.off("click-editorcontent", this.clickEditorContentEventListener);

        this.eventBus.off("click-blockicon", this.blockMenuEventListener);
        this.eventBus.off("click-editortitleicon", this.blockMenuEventListener);
        // this.eventBus.off("open-menu-blockref", this.blockRefMenuEventListener);
        this.eventBus.off("open-menu-link", this.linkMenuEventListener);
    }

    openSetting(): void {
        // const that = this;
        // const dialog = new siyuan.Dialog({
        //     title: `${this.i18n.displayName} <code class="fn__code">${this.name}</code>`,
        //     content: `<div id="${that.SETTINGS_DIALOG_ID}" class="fn__flex-column" />`,
        //     width: FLAG_MOBILE ? "92vw" : "720px",
        //     height: FLAG_MOBILE ? undefined : "640px",
        // });
        // const settings = new Settings({
        //     target: dialog.element.querySelector(`#${that.SETTINGS_DIALOG_ID}`),
        //     props: {
        //         config: this.config,
        //         plugin: this,
        //     },
        // });
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
        this.updateConfigBySiyuanConfig();
        return this.saveData(MonacoEditorPlugin.GLOBAL_CONFIG_NAME, this.config);
    }

    /* 通过思源配置更新插件配置 */
    public updateConfigBySiyuanConfig(): void {
        this.config.editor.options = merge(this.config.editor.options, siyuanConfig2EditorOptions());
    }

    /* 更新侧边栏编辑器内容 */
    public updateDockEditor(id: BlockID): void {
        if (this.dock.model && this.dock.component) {
            this.dock.model.data.id = id;
            this.dock.component.$set({ id });
        }
    }

    /* 编辑器点击事件监听器 */
    protected readonly clickEditorContentEventListener = (e: IClickEditorContentEvent) => {
        // this.logger.debug(e);
        // this.logger.debug(this.dock);
        const block_id = getBlockID(e.detail.event);
        if (block_id) {
            this.updateDockEditor(block_id);
        }
    }

    /* 块菜单弹出事件监听器 */
    protected readonly blockMenuEventListener = (e: IClickBlockIconEvent) => {
        const context = getBlockMenuContext(e.detail);

        if (!context.isMultiBlock) { // 非多个块
            /* 更新侧边栏编辑器 */
            this.updateDockEditor(context.id);

            /* 添加菜单项 */
            const facadeOptions: Partial<IFacadeOptions> = {
                type: HandlerType.block,
                breadcrumb: {
                    id: context.id,
                },
            };
            const submenu: siyuan.IMenuItemOption[] = [];
            if (context.isDocumentBlock) { // 文档块
                /* 文档导出预览 */
                submenu.push({
                    icon: "iconUpload",
                    label: "Markdown",
                    accelerator: this.i18n.menu.export.accelerator,
                    submenu: this.buildOpenSubmenu(merge(
                        facadeOptions,
                        {
                            handler: {
                                id: context.id,
                                inline: Inline.mark,
                                language: Language.markdown,
                            },
                        },
                    )),
                });
            }
            else { // 其他块
                /* 显示行内元素 IAL 的 Markdown */
                submenu.push({
                    icon: "iconMarkdown",
                    label: "Markdown",
                    accelerator: "{: style}",
                    submenu: this.buildOpenSubmenu(merge(
                        facadeOptions,
                        {
                            handler: {
                                id: context.id,
                                inline: Inline.mark,
                                language: Language.markdown,
                            },
                        },
                    )),
                });
            }

            /* 标准 markdown */
            submenu.push({
                icon: "iconMarkdown",
                label: "Markdown",
                accelerator: this.i18n.menu.standard.accelerator,
                submenu: this.buildOpenSubmenu(merge(
                    facadeOptions,
                    {
                        handler: {
                            id: context.id,
                            inline: Inline.span,
                            language: Language.markdown,
                        },
                    },
                )),
            });

            /* 使用 <span> 标签的 kramdown */
            submenu.push({
                icon: "iconInlineCode",
                label: "kramdown",
                accelerator: "&lt;span&gt;",
                submenu: this.buildOpenSubmenu(merge(
                    facadeOptions,
                    {
                        handler: {
                            id: context.id,
                            inline: Inline.span,
                            language: Language.kramdown,
                        },
                    },
                )),
            });

            /* 使用标识符的 kramdown */
            submenu.push({
                icon: "iconMarkdown",
                label: "kramdown",
                accelerator: "*mark*",
                submenu: this.buildOpenSubmenu(merge(
                    facadeOptions,
                    {
                        handler: {
                            id: context.id,
                            inline: Inline.mark,
                            language: Language.kramdown,
                        },
                    },
                )),
            });

            e.detail.menu.addItem({
                // icon: "icon-monaco-editor",
                icon: "iconCode",
                label: this.i18n.displayName,
                submenu,
            });
        }
    }

    /* 超链接菜单打开事件监听器 */
    protected readonly linkMenuEventListener = (e: IOpenMenuLinkEvent) => {
        const element = e.detail.element;
        const href = element.dataset.href || "";
        const submenu: siyuan.IMenuItemOption[] = [];
        switch (true) {
            case isStaticPathname(href): { // 静态文件资源
                submenu.push({
                    icon: "iconFile",
                    label: this.i18n.menu.editAssetFile.label,
                    submenu: this.buildOpenSubmenu({
                        type: HandlerType.asset,
                        handler: {
                            pathname: href,
                        },
                        breadcrumb: {
                            pathname: href,
                        },
                    }),
                });
                break;
            }
            case href.startsWith("file://"): { // 本地文件
                if (FLAG_ELECTRON) { // 仅 Electron 环境可访问本地文件

                }
                else {
                    return;
                }
                break;
            }
            case href.startsWith("//"):
            case href.startsWith("ftp://"):
            case href.startsWith("ftps://"):
            case href.startsWith("http://"):
            case href.startsWith("https://"): { // 网络资源

                break;
            }
            default:
                return;
        }
        if (submenu.length > 0) {
            e.detail.menu.addItem({
                icon: "iconCode",
                label: this.i18n.displayName,
                submenu,
            });
        }
    }

    /**
     * 构建打开子菜单
     * @param facadeOptions: 门面参数
     * @param icon: 页签图标
     * @param title: 页签标题
     * @param options: 编辑器初始配置
     */
    protected buildOpenSubmenu(
        facadeOptions: IFacadeOptions,
        // icon: string = "icon-monaco-editor",
        icon: string = "iconCode",
        title: string = this.i18n.displayName,
        options: IEditorOptions = this.config.editor.options,
    ): siyuan.IMenuItemOption[] {
        const submenu: siyuan.IMenuItemOption[] = [];
        const custom = {
            icon,
            title,
            fn: this.tab,
            data: {
                options,
                facadeOptions,
            },
        }; // 自定义页签参数

        /* 在新页签中打开 */
        submenu.push({
            icon: "iconAdd",
            label: this.i18n.menu.openInNewTab.label,
            click: () => {
                siyuan.openTab({
                    app: this.app,
                    custom,
                    keepCursor: false,
                    removeCurrentTab: false,
                });
            },
        });

        /* 在后台页签中打开 */
        submenu.push({
            icon: "iconMin",
            label: this.i18n.menu.openTabBackground.label,
            click: () => {
                siyuan.openTab({
                    app: this.app,
                    custom,
                    keepCursor: true,
                    removeCurrentTab: false,
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
                    custom,
                    position: "right",
                    keepCursor: false,
                    removeCurrentTab: false,
                });
            },
        });

        /* 在页签下方打开 */
        submenu.push({
            icon: "iconLayoutBottom",
            label: this.i18n.menu.openTabBottom.label,
            click: () => {
                siyuan.openTab({
                    app: this.app,
                    custom,
                    position: "bottom",
                    keepCursor: false,
                    removeCurrentTab: false,
                });
            },
        });

        /* 在新窗口打开 */
        submenu.push({
            icon: "iconOpenWindow",
            label: this.i18n.menu.openByNewWindow.label,
            click: async element => {
                const { x, y } = getElementScreenPosition(element);

                const editor = new EditorWindow(this);
                await editor.init(custom.data);
                editor.open({
                    x: Math.round(x),
                    y: Math.round(y),
                    title,
                    ...this.config.window.options,
                });
            },
        });
        return submenu;
    }
}
