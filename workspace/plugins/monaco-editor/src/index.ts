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

import { Client } from "@siyuan-community/siyuan-sdk";

import {
    FLAG_ELECTRON,
    FLAG_DESKTOP,
    FLAG_MOBILE,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { getBlockID } from "@workspace/utils/siyuan/dom";
import { merge } from "@workspace/utils/misc/merge";
import { getBlockMenuContext } from "@workspace/utils/siyuan/menu/block";
import { getElementScreenPosition } from "@workspace/utils/misc/position";

import type { IClickBlockIconEvent, IClickEditorContentEvent } from "@workspace/types/siyuan/events";

import Dock from "./components/Dock.svelte";
import { DEFAULT_CONFIG, siyuanConfig2EditorOptions } from "./configs/default";
import { Editor } from "./editor";

import type {
    IConfig, IEditorOptions,
} from "./types/config";
import type { I18N } from "@/utils/i18n";
import type { BlockID } from "@workspace/types/siyuan";

export default class MonacoEditorPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    declare public readonly i18n: I18N;
    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;

    protected readonly EDITOR_URL: URL;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly tab: ReturnType<siyuan.Plugin["addTab"]>;
    protected readonly dock: {
        // editor: InstanceType<typeof Editor>,
        object: ReturnType<siyuan.Plugin["addDock"]>,
        model?: siyuan.IModel,
        component?: InstanceType<typeof Dock>,
    };
    protected config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client();
        this.EDITOR_URL = new URL(`${globalThis.document.baseURI}plugins/${this.name}/editor`);
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;

        const plugin = this;
        this.tab = this.addTab({
            type: "-editor-tab",
            init() {
                // const tab = this;
                // new Editor({
                //     // target,
                //     target: tab.element,
                //     props: {
                //         src: tab.data.href,
                //         tab,
                //         plugin,
                //     },
                // });
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
                    kramdown: true,
                },
                type: "-dock-panel",
                init() {
                    // plugin.logger.debug(this);
                    (this.element as HTMLElement).classList.add("fn__flex-column");
                    const dock = new Dock({
                        target: this.element,
                        props: {
                            plugin,
                            id: this.data.id,
                            kramdown: this.data.kramdown,

                            bar: {
                                logo: "#iconCode",
                                title: plugin.i18n.dock.title,
                                icons: [
                                    {
                                        icon: "#iconMarkdown",
                                        type: "kramdown",
                                        active: this.data.kramdown,
                                        ariaLabel: plugin.i18n.dock.kramdown.ariaLabel,
                                        onClick: (element, _e) => {
                                            element.classList.toggle("toolbar__item--active");
                                            if (element.classList.contains("toolbar__item--active")) {
                                                plugin.dock.component.$set({ kramdown: true });
                                            }
                                            else {
                                                plugin.dock.component.$set({ kramdown: false });
                                            }
                                        }
                                    },
                                    {
                                        icon: "#iconMin",
                                        type: "min",
                                        ariaLabel: `${globalThis.siyuan.languages.min} ${siyuan.adaptHotkey("⌘W")}`,
                                    },
                                ],
                            },
                            editor: {
                                modified: {
                                    value: "",
                                    language: "markdown",
                                },
                                options: plugin.config.editor.options,
                            },
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
                // /* 文档块菜单 */
                // this.eventBus.on("click-editortitleicon", this.blockMenuEventListener);
                // /* 块引用菜单 */
                // this.eventBus.on("open-menu-blockref", this.blockRefMenuEventListener);
                // /* 超链接菜单 */
                // this.eventBus.on("open-menu-link", this.linkMenuEventListener);

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
        // this.eventBus.off("click-editortitleicon", this.blockMenuEventListener);
        // this.eventBus.off("open-menu-blockref", this.blockRefMenuEventListener);
        // this.eventBus.off("open-menu-link", this.linkMenuEventListener);
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
    protected clickEditorContentEventListener = (e: IClickEditorContentEvent) => {
        // this.logger.debug(e);
        // this.logger.debug(this.dock);
        const block_id = getBlockID(e.detail.event);
        if (block_id) {
            this.updateDockEditor(block_id);
        }
    }

    /* 块菜单弹出事件监听器 */
    protected blockMenuEventListener = (e: IClickBlockIconEvent) => {
        const context = getBlockMenuContext(e.detail);

        /* 非文档块, 非多个块 */
        if (!context.isDocumentBlock && !context.isMultiBlock) {
            this.updateDockEditor(context.id);
        }
    }
}
