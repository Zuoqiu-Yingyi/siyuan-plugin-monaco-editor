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
import streamsaver from "streamsaver";

/* 静态资源 */
import "./styles/plugin.less";

import icon_plugin from "./assets/symbols/icon-monaco-editor.symbol?raw";
import icon_time from "./assets/symbols/icon-monaco-editor-time.symbol?raw";
import icon_slash from "./assets/symbols/icon-monaco-editor-slash.symbol?raw";
import icon_file_tree from "./assets/symbols/icon-monaco-editor-file-tree.symbol?raw";
import icon_folder_opend from "./assets/symbols/icon-monaco-editor-folder-opend.symbol?raw";
import icon_folder_closed from "./assets/symbols/icon-monaco-editor-folder-closed.symbol?raw";
import icon_material_icons from "./assets/symbols/icon-monaco-editor-material-icons.symbol?raw";

/* SDK */
import { Client } from "@siyuan-community/siyuan-sdk";

/* 工作空间资源 */
import { Logger } from "@workspace/utils/logger";
import {
    getNodeID,
    getHistoryCreated,
    getHistoryPath,
    getShorthandID,
    getSnapshotIDs,
    getSnippetID,
    isSiyuanProtyleWysiwyg,
} from "@workspace/utils/siyuan/dom";
import {
    isStaticPathname,
    isStaticWebFileServicePath,
    workspacePath2StaticPathname,
} from "@workspace/utils/siyuan/url";
import { merge } from "@workspace/utils/misc/merge";
import {
    getBlockMenuContext,
    type BlockMenuDetail,
} from "@workspace/utils/siyuan/menu/block";
import { FLAG_ELECTRON } from "@workspace/utils/env/front-end";
import { isMatchedMouseEvent } from "@workspace/utils/shortcut/match";
import { normalize } from "@workspace/utils/path/normalize";
import { isBinaryPath } from "@workspace/utils/file/binary";

/* 组件 */
import EditorTab from "./components/EditorTab.svelte";
import VditorTab from "./components/VditorTab.svelte";
import PreviewTab from "./components/PreviewTab.svelte";
import EditorDock from "./components/EditorDock.svelte";
import ExplorerDock from "./components/ExplorerDock.svelte";
import Settings from "./components/Settings.svelte";

/* 项目资源 */
import {
    DEFAULT_CONFIG,
    getCodeFontFamily,
    siyuanConfig2EditorOptions,
} from "./configs/default";
import {
    Inline,
    Language,
} from "./handlers/block";
import { EditorWindow } from "./editor/window";
import {
    HandlerType,
    type IFacadeAssetOptions,
    type IFacadeOptions,
} from "./facades/facade";

/* 类型 */
import type {
    IClickEditorContentEvent,
    IOpenMenuDocTreeEvent,
    IOpenMenuInboxEvent,
    IOpenMenuLinkEvent,
    IOpenSiyuanUrlPluginEvent,
} from "@workspace/types/siyuan/events";
import type {
    BlockID,
    ISiyuanGlobal,
} from "@workspace/types/siyuan";

import type {
    IConfig, IEditorOptions,
} from "./types/config";
import type { I18N } from "@/utils/i18n";
import type { IDockData } from "./types/dock";
import { trimPrefix } from "@workspace/utils/misc/string";
import {
    OpenMode,
    OpenScheme,
} from "./utils/url";
import { FileTreeNodeType } from "@workspace/components/siyuan/tree/file";
import {
    basename,
    parse,
} from "@workspace/utils/path/browserify";
import { showSaveDialog } from "@workspace/utils/electron/remote/dialog";
import { fn__code } from "@workspace/utils/siyuan/text/span";
import { showItemInFolder } from "@workspace/utils/electron/shell";
import { VditorWindow } from "./vditor/window";
import type { IVditorEvents } from "./types/vditor";

declare var globalThis: ISiyuanGlobal;

export interface IEditorTab extends siyuan.ITabModel {
    component?: InstanceType<typeof EditorTab>;
}

export interface IVditorTab extends siyuan.ITabModel {
    component?: InstanceType<typeof VditorTab>;
}

export interface IPreviewTab extends siyuan.ITabModel {
    component?: InstanceType<typeof PreviewTab>;
}

export default class MonacoEditorPlugin extends siyuan.Plugin {
    public static readonly GLOBAL_CONFIG_NAME = "global-config";
    public static readonly CUSTOM_MENU_NAME = "plugin-monaco-editor-custom-menu";
    public static readonly CUSTOM_TAB_TYPE_EDITOR = "-editor-tab";
    public static readonly CUSTOM_TAB_TYPE_VDITOR = "-vditor-tab";
    public static readonly CUSTOM_TAB_TYPE_PREVIEW = "-preview-tab";

    declare public readonly i18n: I18N;
    public readonly siyuan = siyuan;
    public readonly streamsaver = streamsaver;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;
    public readonly lute: ReturnType<typeof siyuan.Lute["New"]>;
    public config: IConfig;

    protected readonly EDITOR_URL: URL;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly CUSTOM_TAB_ID_EDITOR: string;
    protected readonly CUSTOM_TAB_ID_VDITOR: string;
    protected readonly CUSTOM_TAB_ID_PREVIEW: string;

    protected readonly editorTab: ReturnType<siyuan.Plugin["addTab"]>;
    protected readonly vditorTab: ReturnType<siyuan.Plugin["addTab"]>;
    protected readonly previewTab: ReturnType<siyuan.Plugin["addTab"]>;

    protected editorDock: {
        // editor: InstanceType<typeof Editor>,
        dock: ReturnType<siyuan.Plugin["addDock"]>,
        model?: siyuan.ICustomModel,
        component?: InstanceType<typeof EditorDock>,
    }; // 编辑器面板
    protected explorerDock: {
        // editor: InstanceType<typeof Editor>,
        dock: ReturnType<siyuan.Plugin["addDock"]>,
        model?: siyuan.IModel,
        component?: InstanceType<typeof ExplorerDock>,
    }; // 资源管理器面板

    constructor(options: any) {
        super(options);

        this.streamsaver.mitm = `plugins/${this.name}/libs/streamsaver/mitm.html?version=2.0.0`;
        this.logger = new Logger(this.name);
        this.client = new Client(undefined, "fetch");
        this.lute = globalThis.Lute.New();

        this.EDITOR_URL = new URL(`${globalThis.document.baseURI}plugins/${this.name}/editor`);
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;
        this.CUSTOM_TAB_ID_EDITOR = `${this.name}${MonacoEditorPlugin.CUSTOM_TAB_TYPE_EDITOR}`;
        this.CUSTOM_TAB_ID_VDITOR = `${this.name}${MonacoEditorPlugin.CUSTOM_TAB_TYPE_VDITOR}`;
        this.CUSTOM_TAB_ID_PREVIEW = `${this.name}${MonacoEditorPlugin.CUSTOM_TAB_TYPE_PREVIEW}`;

        const plugin = this;
        this.editorTab = this.addTab({
            type: MonacoEditorPlugin.CUSTOM_TAB_TYPE_EDITOR,
            beforeDestroy() {
                // plugin.logger.debug("tab-beforeDestroy");
            },
            resize() {
                // plugin.logger.debug("tab-resize");
            },
            update() {
                // plugin.logger.debug("tab-update");
            },
            init() {
                // plugin.logger.debug("tab-init");
                // plugin.logger.debug(this);

                const tab: IEditorTab = this;
                tab.component = new EditorTab({
                    // target,
                    target: tab.element,
                    props: {
                        plugin,
                        ...tab.data,
                    },
                });
            },
            destroy() {
                // plugin.logger.debug("tab-destroy");

                const tab: IEditorTab = this;
                tab.component?.$destroy();
            },
        });

        this.vditorTab = this.addTab({
            type: MonacoEditorPlugin.CUSTOM_TAB_TYPE_VDITOR,
            init() {
                // plugin.logger.debug("tab-init");
                // plugin.logger.debug(this);

                const tab: IVditorTab = this;
                tab.component = new VditorTab({
                    target: tab.element,
                    props: {
                        plugin,
                        ...tab.data,
                    },
                });
            },
            destroy() {
                // plugin.logger.debug("tab-destroy");

                const tab: IVditorTab = this;
                tab.component?.$destroy();
            },
        });

        this.previewTab = this.addTab({
            type: MonacoEditorPlugin.CUSTOM_TAB_TYPE_PREVIEW,
            init() {
                // plugin.logger.debug("tab-init");
                // plugin.logger.debug(this);

                const tab: IPreviewTab = this;
                tab.component = new PreviewTab({
                    target: tab.element,
                    props: {
                        plugin,
                        ...tab.data,
                    },
                });
            },
            destroy() {
                // plugin.logger.debug("tab-destroy");

                const tab: IPreviewTab = this;
                tab.component?.$destroy();
            },
        });
    }

    onload(): void {
        // this.logger.debug(this);
        /* 注册图标 */
        this.addIcons([
            icon_plugin, // 插件图标
            icon_time, // 时间图标
            icon_slash, // 斜杠图标
            icon_file_tree, // 文件树
            icon_folder_opend, // 文件夹(打开)
            icon_folder_closed, // 文件夹(关闭)
            icon_material_icons, // material 文件主题图标
        ].join(""));

        this.loadData(MonacoEditorPlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = merge(DEFAULT_CONFIG, config || {}) as IConfig;
                this.updateConfigBySiyuanConfig();
            })
            .catch(error => this.logger.error(error))
            .finally(() => {
                const plugin = this;

                /* 添加编辑器侧边面板 */
                if (this.config.dock.editor.enable) {
                    this.editorDock = {
                        dock: this.addDock({
                            config: {
                                position: "BottomRight",
                                size: { width: 0, height: 256 },
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
                            type: "-dock-editor",
                            init() {
                                // plugin.logger.debug(this);

                                (this.element as HTMLElement).classList.add("fn__flex-column");
                                const dock = new EditorDock({
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
                                plugin.editorDock.model = this;
                                plugin.editorDock.component = dock;
                            },
                            destroy() {
                                plugin.editorDock.component?.$destroy();
                                delete plugin.editorDock.component;
                                delete plugin.editorDock.model;
                            },
                        }),
                    };
                }

                /* 添加文件资源管理器侧边面板 */
                if (this.config.dock.explorer.enable) {
                    this.explorerDock = {
                        dock: this.addDock({
                            config: {
                                position: "LeftTop",
                                size: { width: 256, height: 0 },
                                icon: "icon-monaco-editor-file-tree",
                                title: this.i18n.explorer.title,
                                show: true,
                            },
                            data: {
                                workspace: normalize(globalThis.siyuan.config.system.workspaceDir),
                            },
                            type: "-dock-explorer",
                            init() {
                                // plugin.logger.debug(this);

                                (this.element as HTMLElement).classList.add("fn__flex-column");
                                const dock = new ExplorerDock({
                                    target: this.element,
                                    props: {
                                        plugin,
                                        ...this.data,
                                    },
                                });
                                plugin.explorerDock.model = this;
                                plugin.explorerDock.component = dock;
                            },
                            destroy() {
                                plugin.explorerDock.component?.$destroy();
                                delete plugin.explorerDock.component;
                                delete plugin.explorerDock.model;
                            },
                        }),
                    };
                }

                /* 注册触发打开窗口动作的监听器 */
                globalThis.addEventListener(this.config.operates.menu.open.mouse.type, this.contextmenuEventListener, true);

                /* 编辑区点击 */
                this.eventBus.on("click-editorcontent", this.clickEditorContentEventListener);

                /* 文档树菜单 */
                this.eventBus.on("open-menu-doctree", this.doctreeMenuEventListener);
                /* 收集箱菜单 */
                this.eventBus.on("open-menu-inbox", this.inobxMenuEventListener);

                /* 其他块菜单 */
                this.eventBus.on("click-blockicon", this.blockMenuEventListener);
                /* 文档块菜单 */
                this.eventBus.on("click-editortitleicon", this.blockMenuEventListener);
                // /* 块引用菜单 */
                // this.eventBus.on("open-menu-blockref", this.blockRefMenuEventListener);
                /* 超链接菜单 */
                this.eventBus.on("open-menu-link", this.linkMenuEventListener);

                /* 思源 URL */
                this.eventBus.on("open-siyuan-url-plugin", this.openSiyuanUrlEventListener);

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
        // this.openSetting();
        /* 若之前未查询到 --b3-font-family-code */
        if (this.config?.editor?.options) {
            this.config.editor.options.fontFamily = getCodeFontFamily();
        }
    }

    onunload(): void {
        globalThis.removeEventListener(this.config.operates.menu.open.mouse.type, this.contextmenuEventListener, true);

        this.eventBus.off("click-editorcontent", this.clickEditorContentEventListener);

        this.eventBus.off("open-menu-doctree", this.doctreeMenuEventListener);
        this.eventBus.off("open-menu-inbox", this.inobxMenuEventListener);

        this.eventBus.off("click-blockicon", this.blockMenuEventListener);
        this.eventBus.off("click-editortitleicon", this.blockMenuEventListener);

        // this.eventBus.off("open-menu-blockref", this.blockRefMenuEventListener);
        this.eventBus.off("open-menu-link", this.linkMenuEventListener);
        this.eventBus.off("open-siyuan-url-plugin", this.openSiyuanUrlEventListener);
    }

    openSetting(): void {
        const dialog = new siyuan.Dialog({
            title: `${this.displayName} <code class="fn__code">${this.name}</code>`,
            content: `<div id="${this.SETTINGS_DIALOG_ID}" class="fn__flex-column" />`,
            width: "720px",
            height: "640px",
        });
        const settings = new Settings({
            target: dialog.element.querySelector(`#${this.SETTINGS_DIALOG_ID}`),
            props: {
                config: this.config,
                plugin: this,
            },
        });
    }

    /* 捕获错误 */
    public catch(error: any): void {
        this.logger.error(error);
        this.client.pushErrMsg(error);
    }

    /* 确认框 */
    public async confirm(title: string, text: string): Promise<boolean> {
        return new Promise((resolve, reject) => siyuan.confirm(
            title,
            text,
            () => resolve(true),
            () => resolve(false),
        ));
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
        // this.logger.debug(this.config.editor.options);
    }

    /* 更新侧边栏编辑器内容 */
    public updateDockEditor(id: BlockID): void {
        if (this.editorDock.model && this.editorDock.component) {
            this.editorDock.model.data.id = id;
            this.editorDock.component.$set({ id });
        }
    }

    /* 在浮窗打开块 */
    public openFloatLayer(options: { id: BlockID }): void {
        this.addFloatLayer({
            ids: [options.id],
            x: globalThis.siyuan.coordinates.clientX,
            y: globalThis.siyuan.coordinates.clientY,
        });
    }

    /* 在新页签打开块 */
    public async openDocTab(options: { id: BlockID, focus?: number }): Promise<siyuan.ITab> {
        return siyuan.openTab({
            app: this.app,
            doc: {
                id: options.id,
                action: ["cb-get-focus", "cb-get-hl"],
                zoomIn: options.focus === 1,
            },
        });
    }

    /* 打开超链接 */
    public openLink(
        url: string | URL,
        target: string = "_blank",
        features?: string,
    ): void {
        globalThis.open(url, target, features);
    }

    /* 处理打开超链接事件 */
    public openLinkEventHandler(data: IVditorEvents["open-link"]): void {
        if (data.path.target) {
            const title = data.title || data.anchor || data.href;
            switch (true) {
                case data.path.target.endsWith(".md"):
                    this.openWorkspaceFile(data.path.target, title, "iconMarkdown", true, this.config.open.markdown);
                    break;

                default:
                    this.openWorkspaceFile(data.path.target, title);
                    break;
            }
        }
        else {
            this.openLink(data.href);
        }
    }


    /* 处理打开事件 */
    protected openEventHandler(e: MouseEvent) {
        // this.logger.debug(e);

        const menu = new siyuan.Menu(MonacoEditorPlugin.CUSTOM_MENU_NAME);

        /* 代码片段 */
        if (this.config.operates.menu.snippet) {
            const snippet_id = getSnippetID(e); // 获取代码片段 ID
            // this.logger.debug(snippet_id);
            if (snippet_id) {
                menu.addItem({
                    icon: "iconCode",
                    label: this.displayName,
                    submenu: this.buildOpenSubmenu(
                        {
                            type: HandlerType.snippet,
                            handler: {
                                id: snippet_id,
                            },
                            breadcrumb: {
                                id: snippet_id,
                            },
                        },
                    ),
                });
                menu.open({
                    x: globalThis.siyuan.coordinates.clientX,
                    y: globalThis.siyuan.coordinates.clientY,
                });
                return;
            }
        }

        /* 文件历史 */
        if (this.config.operates.menu.history1) {
            const history_path = getHistoryPath(e); // 获取历史文档路径
            // this.logger.debug(history_path);
            if (history_path) {
                if (history_path.endsWith(".sy")) {
                    const submenu_options: IFacadeOptions = {
                        type: HandlerType.history,
                        handler: {
                            kramdown: false,
                            path: history_path,
                        },
                        breadcrumb: {
                            path: history_path,
                        },
                    };

                    menu.addItem({
                        icon: "iconCode",
                        label: this.displayName,
                        submenu: [
                            /* 添加查看 markdown 菜单项 */
                            {
                                icon: "iconPreview",
                                label: this.i18n.menu.diffView.label,
                                accelerator: "Markdown",
                                submenu: this.buildOpenSubmenu(merge(
                                    submenu_options,
                                    {
                                        handler: {
                                            kramdown: false,
                                        },
                                    } as unknown,
                                )),
                            },
                            /* 添加编辑 kramdown 菜单项 */
                            {
                                icon: "iconEdit",
                                label: this.i18n.menu.diffEdit.label,
                                accelerator: "kramdown",
                                submenu: this.buildOpenSubmenu(merge(
                                    submenu_options,
                                    {
                                        handler: {
                                            kramdown: true,
                                        },
                                    } as unknown,
                                )),
                            },
                        ],
                    });

                    menu.open({
                        x: globalThis.siyuan.coordinates.clientX,
                        y: globalThis.siyuan.coordinates.clientY,
                    });
                    return;
                }
            }
        }

        /* 文档历史 */
        if (this.config.operates.menu.history2) {
            /* 文档历史创建时间 */
            const history_created = getHistoryCreated(e); // 获取历史文档路径
            // this.logger.debug(history_created);
            if (history_created) {
                /* 通过获取文档树激活的文档项获取对应的文档块 ID */
                const doc_elemetn = globalThis.document.querySelector(".sy__file .b3-list-item--focus");
                const doc_id = (doc_elemetn as HTMLElement)?.dataset?.nodeId;
                if (doc_id) { // 获取到对应的文档 ID
                    const submenu_options: IFacadeOptions = {
                        type: HandlerType.history,
                        handler: {
                            kramdown: false,
                            id: doc_id,
                            created: history_created,
                        },
                        breadcrumb: {
                            id: doc_id,
                        },
                    };

                    menu.addItem({
                        icon: "iconCode",
                        label: this.displayName,
                        submenu: [
                            /* 添加查看 markdown 菜单项 */
                            {
                                icon: "iconPreview",
                                label: this.i18n.menu.diffView.label,
                                accelerator: "Markdown",
                                submenu: this.buildOpenSubmenu(merge(
                                    submenu_options,
                                    {
                                        handler: {
                                            kramdown: false,
                                        },
                                    } as unknown,
                                )),
                            },
                            /* 添加编辑 kramdown 菜单项 */
                            {
                                icon: "iconEdit",
                                label: this.i18n.menu.diffEdit.label,
                                accelerator: "kramdown",
                                submenu: this.buildOpenSubmenu(merge(
                                    submenu_options,
                                    {
                                        handler: {
                                            kramdown: true,
                                        },
                                    } as unknown,
                                )),
                            },
                        ],
                    });

                    menu.open({
                        x: globalThis.siyuan.coordinates.clientX,
                        y: globalThis.siyuan.coordinates.clientY,
                    });
                    return;
                }
            }
        }

        /* 文件快照 */
        if (this.config.operates.menu.snapshot) {
            const {
                id: snapshot_old, // 较早的快照
                id2: snapshot_new, // 较晚的快照
                name: snapshot_name, // 快照文件名/文档标题
            } = getSnapshotIDs(e);
            // this.logger.debug(snapshot_old, snapshot_new);
            if (snapshot_old && snapshot_new && snapshot_name) {
                const submenu_options: IFacadeOptions = {
                    type: HandlerType.snapshot,
                    handler: {
                        kramdown: false,
                        old: snapshot_old,
                        new: snapshot_new,
                    },
                    breadcrumb: {
                        old: snapshot_old,
                        new: snapshot_new,
                        name: snapshot_name,
                    },
                };

                menu.addItem({
                    icon: "iconCode",
                    label: this.displayName,
                    submenu: [
                        /* 添加查看 markdown 菜单项 */
                        {
                            icon: "iconPreview",
                            label: this.i18n.menu.diffView.label,
                            accelerator: "Markdown",
                            submenu: this.buildOpenSubmenu(merge(
                                submenu_options,
                                {
                                    handler: {
                                        kramdown: false,
                                    },
                                } as unknown,
                            )),
                        },
                        /* 添加编辑 kramdown 菜单项 */
                        {
                            icon: "iconPreview",
                            label: this.i18n.menu.diffView.label,
                            accelerator: "kramdown",
                            submenu: this.buildOpenSubmenu(merge(
                                submenu_options,
                                {
                                    handler: {
                                        kramdown: true,
                                    },
                                } as unknown,
                            )),
                        },
                    ],
                });

                menu.open({
                    x: globalThis.siyuan.coordinates.clientX,
                    y: globalThis.siyuan.coordinates.clientY,
                });
                return;
            }
        }
    }

    /* 上下文菜单事件 */
    protected readonly contextmenuEventListener = (e: MouseEvent) => {
        try {
            // this.logger.debug(e);

            /* 判断功能是否已启用 */
            if (!this.config.operates.menu.open.enable) return;

            /* 判断事件是否为目标事件 */
            if (isMatchedMouseEvent(e, this.config.operates.menu.open.mouse)) {
                this.openEventHandler(e);
            };

        } catch (e) {
            this.logger.warn(e);
        }
    }

    /* 编辑器点击事件监听器 */
    protected readonly clickEditorContentEventListener = (e: IClickEditorContentEvent) => {
        // this.logger.debug(e);
        // this.logger.debug(this.dock);

        var block_id: string | void;
        if (isSiyuanProtyleWysiwyg(e.detail.event.target)) { // 文档块
            block_id = e.detail.protyle.block.rootID;
        }
        else {
            block_id = getNodeID(e.detail.event);
        }
        if (block_id) {
            this.updateDockEditor(block_id);
        }
    }

    /* 文档树菜单弹出事件监听器 */
    protected readonly doctreeMenuEventListener = (e: IOpenMenuDocTreeEvent) => {
        // this.logger.debug(e);

        const submenu: siyuan.IMenuItemOption[] = [];
        switch (e.detail.type) {
            case "doc": { // 单文档
                const id = e.detail.elements.item(0)?.dataset?.nodeId;

                if (id) {
                    submenu.push(
                        {
                            /* 文档导出预览 */
                            icon: "iconUpload",
                            label: "Markdown",
                            accelerator: this.i18n.menu.export.accelerator,
                            submenu: this.buildOpenSubmenu({
                                type: HandlerType.block,
                                breadcrumb: { id },
                                handler: {
                                    id,
                                    inline: Inline.mark,
                                    language: Language.markdown,
                                },
                            }),
                        },
                        {
                            /* 标准 markdown */
                            icon: "iconMarkdown",
                            label: "Markdown",
                            accelerator: this.i18n.menu.standard.accelerator,
                            submenu: this.buildOpenSubmenu({
                                type: HandlerType.block,
                                breadcrumb: { id },
                                handler: {
                                    id,
                                    inline: Inline.span,
                                    language: Language.markdown,
                                },
                            }),
                        },
                        {
                            /* 使用 <span> 标签的 kramdown */
                            icon: "iconInlineCode",
                            label: "kramdown",
                            accelerator: "&lt;span&gt;",
                            submenu: this.buildOpenSubmenu({
                                type: HandlerType.block,
                                breadcrumb: { id },
                                handler: {
                                    id,
                                    inline: Inline.mark,
                                    language: Language.kramdown,
                                },
                            }),
                        },
                        {
                            /* 使用标识符的 kramdown */
                            icon: "iconMarkdown",
                            label: "kramdown",
                            accelerator: "*mark*",
                            submenu: this.buildOpenSubmenu({
                                type: HandlerType.block,
                                breadcrumb: { id },
                                handler: {
                                    id,
                                    inline: Inline.span,
                                    language: Language.kramdown,
                                },
                            }),
                        },
                    );
                }
                break;
            }
            default:
                break;
        }

        if (submenu.length > 0) {
            e.detail.menu.addItem({
                // icon: "iconCode",
                icon: "icon-monaco-editor",
                label: this.displayName,
                submenu,
            });
        }
    }

    /* 收集箱菜单弹出事件监听器 */
    protected readonly inobxMenuEventListener = (e: IOpenMenuInboxEvent) => {
        // this.logger.debug(e);

        const submenu: siyuan.IMenuItemOption[] = [];

        /* 收集箱速记 */
        if (this.config.operates.menu.shorthand) {
            const shorthand_id = e.detail.ids.find(id => id === e.detail.element.dataset.id);
            if (shorthand_id) {
                submenu.push({
                    icon: "iconMarkdown",
                    label: "Markdown",
                    submenu: this.buildOpenSubmenu(
                        {
                            type: HandlerType.inbox,
                            handler: {
                                id: shorthand_id,
                                format: "markdown",
                            },
                            breadcrumb: {
                                id: shorthand_id,
                            },
                        },
                    ),
                });
                submenu.push({
                    icon: "iconHTML5",
                    label: "HTML",
                    submenu: this.buildOpenSubmenu(
                        {
                            type: HandlerType.inbox,
                            handler: {
                                id: shorthand_id,
                                format: "html",
                            },
                            breadcrumb: {
                                id: shorthand_id,
                            },
                        },
                    ),
                });
            }
        }

        if (submenu.length > 0) {
            e.detail.menu.addItem({
                // icon: "iconCode",
                icon: "icon-monaco-editor",
                label: this.displayName,
                submenu,
            });
        }
    }

    /* 块菜单弹出事件监听器 */
    protected readonly blockMenuEventListener = (e: CustomEvent<BlockMenuDetail>) => {
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
                // icon: "iconCode",
                icon: "icon-monaco-editor",
                label: this.displayName,
                submenu,
            });
        }
    }

    /* 超链接菜单打开事件监听器 */
    protected readonly linkMenuEventListener = (e: IOpenMenuLinkEvent) => {
        const element = e.detail.element;
        const href = element.dataset.href || "";
        const submenu: siyuan.IMenuItemOption[] = [];
        try {
            switch (true) {
                case isStaticPathname(href): { // 静态文件资源
                    if (isBinaryPath(href)) break; // 不打开二进制文件

                    submenu.push({
                        icon: "iconFile",
                        label: this.i18n.menu.editAssetFile.label,
                        submenu: this.buildOpenSubmenu({
                            type: HandlerType.asset,
                            handler: {
                                pathname: href,
                                updatable: true,
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
                        if (isBinaryPath(href)) break; // 不打开二进制文件

                        submenu.push({
                            icon: "iconFile",
                            label: this.i18n.menu.editLocalFile.label,
                            accelerator: "file://",
                            submenu: this.buildOpenSubmenu({
                                type: HandlerType.local,
                                handler: {
                                    uri: href,
                                },
                                breadcrumb: {
                                    uri: href,
                                },
                            }),
                        });
                    }
                    break;
                }
                case href.startsWith("//"):
                case href.startsWith("ftp://"):
                case href.startsWith("ftps://"):
                case href.startsWith("http://"):
                case href.startsWith("https://"): { // 网络资源
                    const url = new URL(
                        href.startsWith("//")
                            ? `https:${href}`
                            : href
                    );
                    if (isBinaryPath(url.pathname)) break; // 不打开二进制文件

                    submenu.push({
                        icon: "iconLanguage",
                        label: this.i18n.menu.viewNetworkFile.label,
                        accelerator: `${url.protocol}//`,
                        submenu: this.buildOpenSubmenu({
                            type: HandlerType.network,
                            handler: {
                                uri: url.href,
                            },
                            breadcrumb: {
                                uri: url.href,
                            },
                        }),
                    });
                    break;
                }
                default:
                    break;
            }
        }
        catch (err) {
            this.logger.warn(err);
        }
        finally {
            if (submenu.length > 0) {
                e.detail.menu.addItem({
                    // icon: "iconCode",
                    icon: "icon-monaco-editor",
                    label: this.displayName,
                    submenu,
                });
            }
        }
    }

    /* 思源 URL 打开事件监听器 */
    protected readonly openSiyuanUrlEventListener = async (e: IOpenSiyuanUrlPluginEvent) => {
        // this.logger.debug(e);
        const url = new URL(e.detail.url);
        if (url.pathname.startsWith(`//plugins/${this.name}/open/workspace/`)) { // 打开文件
            const scheme = (url.searchParams.get("scheme") as OpenScheme | null);
            const mode = (url.searchParams.get("mode") as OpenMode | null);
            const relative = globalThis.decodeURI(trimPrefix(url.pathname, `//plugins/${this.name}/open/workspace/`));

            switch (scheme) {
                default:
                case OpenScheme.Editor: { // 文本编辑器
                    const custom = {
                        icon: "iconCode",
                        title: relative,
                        id: this.CUSTOM_TAB_ID_EDITOR,
                        data: {
                            options: this.config.editor.options,
                            facadeOptions: {
                                type: HandlerType.asset,
                                handler: {
                                    path: relative,
                                    updatable: true,
                                },
                                breadcrumb: {
                                    path: relative,
                                },
                            } as IFacadeOptions,
                        },
                    }; // 自定义页签参数

                    switch (mode) {
                        default:
                        case OpenMode.Tab:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                keepCursor: false,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.TabBackground:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                keepCursor: true,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.TabRight:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                position: "right",
                                keepCursor: false,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.TabBottom:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                position: "bottom",
                                keepCursor: false,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.Window: {
                            const { screenX: x, screenY: y } = globalThis.siyuan.coordinates;

                            const editor = new EditorWindow(this);
                            await editor.init(custom.data);
                            editor.open({
                                x,
                                y,
                                title: custom.title,
                                ...this.config.window.options,
                            });
                            break;
                        }
                    }
                    break;
                }
                case OpenScheme.Vditor: { // Vditor 编辑器
                    const custom = {
                        icon: "iconMarkdown",
                        title: relative,
                        id: this.CUSTOM_TAB_ID_VDITOR,
                        data: {
                            vditor: this.config.vditor,
                            facadeOptions: {
                                type: HandlerType.asset,
                                handler: {
                                    path: relative,
                                    updatable: true,
                                },
                                breadcrumb: {
                                    path: relative,
                                },
                            } as IFacadeAssetOptions,
                        },
                    }; // 自定义页签参数

                    switch (mode) {
                        default:
                        case OpenMode.Tab:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                keepCursor: false,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.TabBackground:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                keepCursor: true,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.TabRight:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                position: "right",
                                keepCursor: false,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.TabBottom:
                            siyuan.openTab({
                                app: this.app,
                                custom,
                                position: "bottom",
                                keepCursor: false,
                                removeCurrentTab: false,
                            });
                            break;
                        case OpenMode.Window: {
                            const { screenX: x, screenY: y } = globalThis.siyuan.coordinates;

                            const vditor = new VditorWindow(this);
                            await vditor.init(custom.data);
                            vditor.open({
                                x,
                                y,
                                title: custom.title,
                                ...this.config.window.options,
                            });
                            break;
                        }
                    }
                    break;
                }
                case OpenScheme.Preview: { // 文件预览
                    if (isStaticWebFileServicePath(relative)) {
                        const pathname = workspacePath2StaticPathname(relative);
                        const custom = {
                            icon: "iconPreview",
                            title: relative,
                            id: this.CUSTOM_TAB_ID_PREVIEW,
                            data: {
                                pathname,
                                title: relative,
                            },
                        }; // 自定义页签参数

                        switch (mode) {
                            default:
                            case OpenMode.Tab:
                                siyuan.openTab({
                                    app: this.app,
                                    custom,
                                    keepCursor: true,
                                    removeCurrentTab: false,
                                });
                                break;
                            case OpenMode.TabBackground:
                                siyuan.openTab({
                                    app: this.app,
                                    custom,
                                    keepCursor: true,
                                    removeCurrentTab: false,
                                });
                                break;
                            case OpenMode.TabRight:
                                siyuan.openTab({
                                    app: this.app,
                                    custom,
                                    position: "right",
                                    keepCursor: false,
                                    removeCurrentTab: false,
                                });
                                break;
                            case OpenMode.TabBottom:
                                siyuan.openTab({
                                    app: this.app,
                                    custom,
                                    position: "bottom",
                                    keepCursor: false,
                                    removeCurrentTab: false,
                                });
                                break;
                            case OpenMode.Window:
                                break;
                        }
                    }
                    break;
                }
            }
        }
        else if (url.pathname.startsWith(`//plugins/${this.name}/export/workspace/`)) { // 导出文件/文件夹
            const relative = trimPrefix(url.pathname, `//plugins/${this.name}/export/workspace/`);
            const info = parse(relative);
            const response = await this.client.readDir({ path: info.dir });
            const entry = response.data.find((entry) => entry.name === info.base);

            switch (entry?.isDir) {
                case true:
                    await this.export(
                        relative,
                        info.base,
                        FileTreeNodeType.Folder,
                    );
                    break;
                case false:
                    await this.export(
                        relative,
                        info.base,
                        FileTreeNodeType.File,
                    );
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 构建打开子菜单
     * @param facadeOptions: 门面参数
     * @param icon: 页签图标
     * @param title: 页签标题
     * @param disabled: 是否禁用
     * @param options: 编辑器初始配置
     */
    public buildOpenSubmenu(
        facadeOptions: IFacadeOptions,
        // icon: string = "icon-monaco-editor",
        icon: string = "iconCode",
        title: string = this.displayName,
        disabled: boolean = false,
        options: IEditorOptions = this.config.editor.options,
    ): siyuan.IMenuItemOption[] {
        icon = icon.startsWith("#")
            ? icon.substring(1)
            : icon; // 删除 # 前缀

        const submenu: siyuan.IMenuItemOption[] = [];
        const custom = {
            icon,
            title,
            id: this.CUSTOM_TAB_ID_EDITOR,
            data: {
                options,
                facadeOptions,
            },
        }; // 自定义页签参数

        /* 在新页签中打开 */
        submenu.push({
            icon: "iconAdd",
            label: this.i18n.menu.openInNewTab.label,
            disabled,
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
            disabled,
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
            disabled,
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
            disabled,
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

        submenu.push({ type: "separator" });

        /* 在新窗口打开 */
        submenu.push({
            icon: "iconOpenWindow",
            label: this.i18n.menu.openByNewWindow.label,
            disabled,
            click: async () => {
                const { screenX: x, screenY: y } = globalThis.siyuan.coordinates;

                const editor = new EditorWindow(this);
                await editor.init(custom.data);
                editor.open({
                    x,
                    y,
                    title,
                    ...this.config.window.options,
                });
            },
        });
        return submenu;
    }

    /**
     * 构建 vditor 子菜单
     * @param path: 资源路径
     * @param icon: 页签图标
     * @param title: 页签标题
     * @param disabled: 是否禁用
     */
    public buildOpenVditorSubmenu(
        path: string,
        icon: string = "iconMarkdown",
        title: string = "Vditor",
        disabled: boolean = false,
    ): siyuan.IMenuItemOption[] {
        icon = icon.startsWith("#")
            ? icon.substring(1)
            : icon; // 删除 # 前缀

        const submenu: siyuan.IMenuItemOption[] = [];
        const custom = {
            icon,
            title,
            id: this.CUSTOM_TAB_ID_VDITOR,
            data: {
                vditor: this.config.vditor,
                facadeOptions: {
                    type: HandlerType.asset,
                    handler: {
                        path,
                        updatable: true,
                    },
                    breadcrumb: {
                        path,
                    },
                } as IFacadeAssetOptions,
            },
        }; // 自定义页签参数

        /* 在新页签中打开 */
        submenu.push({
            icon: "iconAdd",
            label: this.i18n.menu.openInNewTab.label,
            disabled,
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
            disabled,
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
            disabled,
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
            disabled,
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

        submenu.push({ type: "separator" });

        /* 在新窗口打开 */
        submenu.push({
            icon: "iconOpenWindow",
            label: this.i18n.menu.openByNewWindow.label,
            disabled,
            click: async () => {
                const { screenX: x, screenY: y } = globalThis.siyuan.coordinates;

                const vditor = new VditorWindow(this);
                await vditor.init(custom.data);
                vditor.open({
                    x,
                    y,
                    title,
                    ...this.config.window.options,
                });
            },
        });

        return submenu;
    }

    /**
     * 构建资源预览子菜单
     * @param pathname: 资源路径
     * @param icon: 页签图标
     * @param title: 页签标题
     * @param disabled: 是否禁用
     */
    public buildOpenPreviewSubmenu(
        pathname: string,
        icon: string = "iconFile",
        title: string = this.displayName,
        disabled: boolean = false,
    ): siyuan.IMenuItemOption[] {
        icon = icon.startsWith("#")
            ? icon.substring(1)
            : icon; // 删除 # 前缀

        const submenu: siyuan.IMenuItemOption[] = [];
        const custom = {
            icon,
            title,
            id: this.CUSTOM_TAB_ID_PREVIEW,
            data: {
                pathname,
                title,
            },
        }; // 自定义页签参数

        /* 在新页签中打开 */
        submenu.push({
            icon: "iconAdd",
            label: this.i18n.menu.openInNewTab.label,
            disabled,
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
            disabled,
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
            disabled,
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
            disabled,
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

        return submenu;
    }

    /**
     * 打开工作空间目录下的文件
     * @param path 相对于工作空间目录的文件路径
     * @param icon 页签图标
     * @param title 页签标题
     * @param updatable 是否可更改
     * @param scheme 打开方案
     * @param options 页签选项
     */
    public openWorkspaceFile(
        path: string,
        title: string,
        icon: string = "iconCode",
        updatable: boolean = true,
        scheme: OpenScheme = this.config.open.default,
        options: {
            position?: "right" | "bottom",
            keepCursor?: boolean // 是否跳转到新 tab 上
            removeCurrentTab?: boolean // 在当前页签打开时需移除原有页签
        } = {},
    ): void {
        icon = icon.startsWith("#")
            ? icon.substring(1)
            : icon; // 删除 # 前缀

        const custom = (() => {
            const facadeOptions = {
                type: HandlerType.asset,
                handler: {
                    path,
                    updatable,
                },
                breadcrumb: {
                    path,
                },
            };
            switch (scheme) {
                default:
                case OpenScheme.Editor:
                    return {
                        id: this.CUSTOM_TAB_ID_EDITOR,
                        data: {
                            options: this.config.editor.options,
                            facadeOptions,
                        },
                    };

                case OpenScheme.Vditor:
                    return {
                        id: this.CUSTOM_TAB_ID_VDITOR,
                        data: {
                            options: this.config.vditor.options,
                            facadeOptions,
                        },
                    };
            }
        })()

        this.siyuan.openTab({
            app: this.app,
            custom: {
                icon,
                title,
                ...custom,
            },
            ...options,
        });
    }

    /**
     * 下载文件/文件夹
     * @param path - 所需下载的文件/文件夹相对于工作空间目录的路径
     * @param name - 所需下载的文件/文件夹名称
     * @param type - 下载内容类型
     */
    public async download(
        path: string,
        name: string,
        type: FileTreeNodeType,
    ): Promise<void> {
        /* 文件夹需要首先打包为压缩文件 */
        if (type === FileTreeNodeType.Folder) {
            const response = await this.client.exportResources({
                paths: [
                    path,
                ],
                name,
            });
            path = response.data.path;
        }

        /* 下载文件流 */
        const response = await this.client.getFile({ path }, "stream");
        if (response) {
            // this.logger.debugs(basename(path), response);
            const write_stream = this.streamsaver.createWriteStream(basename(path));
            await response.pipeTo(write_stream);
        }

        /* 下载完压缩文件后删除 */
        if (type === FileTreeNodeType.Folder) {
            await this.client.removeFile({ path });
        }
    }

    /**
     * 导出文件/文件夹
     * @param path - 所需导出的文件/文件夹相对于工作空间目录的路径
     * @param name - 所需导出的文件/文件夹名称
     * @param type - 下载内容类型
     */
    public async export(
        path: string,
        name: string,
        type: FileTreeNodeType,
    ): Promise<void> {
        const i10n_save_as = type === FileTreeNodeType.File
            ? this.i18n.menu.exportFile
            : this.i18n.menu.exportFolder;

        const asyncFs = globalThis.require("node:fs/promises") as typeof import("fs/promises");
        const result = await showSaveDialog({
            title: i10n_save_as.title.replaceAll("${1}", path),
            defaultPath: name,
            properties: [
                "showHiddenFiles",
                "createDirectory",
                "treatPackageAsDirectory",
                "showOverwriteConfirmation",
            ],
        });
        if (!result.canceled && result.filePath) {
            // this.logger.debugs(path, result.filePath);
            const { join } = globalThis.require("node:path") as typeof import("path");
            const source = join(
                globalThis.siyuan.config.system.workspaceDir,
                path,
            );
            await asyncFs.cp(
                source,
                result.filePath,
                {
                    recursive: true, // 递归复制
                },
            );
            this.siyuan.confirm(
                i10n_save_as.label,
                i10n_save_as.message
                    .replaceAll("${1}", fn__code(path))
                    .replaceAll("${2}", fn__code(result.filePath)),
                () => {
                    showItemInFolder(result.filePath);
                },
            )
        }
    }
}
