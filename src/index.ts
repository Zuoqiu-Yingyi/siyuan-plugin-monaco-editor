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

import icon_wakatime from "./assets/symbols/icon-wakatime.symbol?raw";
import icon_wakatime_wakapi from "./assets/symbols/icon-wakatime-wakapi.symbol?raw";
import manifest from "~/public/plugin.json";

import {
    Client,
    type types,
} from "@siyuan-community/siyuan-sdk";

import Settings from "./components/Settings.svelte";

import {
    FLAG_ELECTRON,
    FLAG_DESKTOP,
    FLAG_MOBILE,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { mergeIgnoreArray } from "@workspace/utils/misc/merge";
import { parse } from "@workspace/utils/path/browserify";
import { normalize } from "@workspace/utils/path/normalize";
import { DEFAULT_CONFIG } from "./configs/default";
import { Type } from "./wakatime/heartbeats";
import type { IConfig } from "./types/config";
import type {
    Heartbeats,
    Context,
} from "./types/wakatime";
import type {
    IWebSocketMainEvent,
    IClickEditorContentEvent,
    ILoadedProtyleEvent,
} from "@workspace/types/siyuan/events";
import type { ITransaction } from "@workspace/types/siyuan/transaction";
import type { BlockID } from "@workspace/types/siyuan";
import type { IProtyle } from "@workspace/types/siyuan/protyle";

type INotebook = types.kernel.api.notebook.lsNotebooks.INotebook;

export default class WakaTimePlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    static readonly WAKATIME_DEFAULT_API_URL = "https://wakatime.com/api/v1";
    static readonly WAKATIME_HEARTBEATS_PATH = "users/current/heartbeats";
    static readonly WAKATIME_STATUS_BAR_PATH = "users/current/statusbar/today";

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;
    public readonly notebook = new Map<BlockID, INotebook>(); // 笔记本 ID => 笔记本信息

    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly context: Context.IContext; // 心跳连接上下文

    public config: IConfig;
    protected timer: number; // 定时器

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client(undefined, "fetch");

        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;
        this.context = {
            url: this.wakatimeHeartbeatsUrl,
            method: "POST",
            project: this.wakatimeProject,
            language: this.wakatimeLanguage,
            headers: this.wakatimeHeaders,
            blocks: new Map<BlockID, BlockID>(),
            roots: new Map<BlockID, Context.IRoot>(),
            actions: new Array<Heartbeats.IAction>(),
        };
    }

    onload(): void {
        // this.logger.debug(this);

        /* 注册图标 */
        this.addIcons([
            icon_wakatime,
            icon_wakatime_wakapi,
        ].join(""));

        this.loadData(WakaTimePlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = mergeIgnoreArray(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(() => {
                this.updateTimer();
                this.updateContext();
                this.updateNotebook();

                /* 总线 */
                this.eventBus.on("ws-main", this.webSocketMainEventListener);

                /* 编辑器加载 */
                this.eventBus.on("loaded-protyle", this.loadedProtyleEventListener);

                /* 编辑区点击 */
                this.eventBus.on("click-editorcontent", this.clickEditorContentEventListener);

            });
    }

    onLayoutReady(): void {
    }

    onunload(): void {
        this.eventBus.off("ws-main", this.webSocketMainEventListener);
        this.eventBus.off("loaded-protyle", this.loadedProtyleEventListener);
        this.eventBus.off("click-editorcontent", this.clickEditorContentEventListener);

        clearInterval(this.timer);
        this.commit();
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
        return this.updateConfig(mergeIgnoreArray(DEFAULT_CONFIG) as IConfig);
    }

    /* 更新插件配置 */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== this.config) {
            this.config = config;
        }
        this.updateTimer();
        this.updateContext();
        return this.saveData(WakaTimePlugin.GLOBAL_CONFIG_NAME, this.config);
    }

    /* 更新定时器 */
    public updateTimer(interval: number = this.config.wakatime.interval) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(this.commit, interval * 1_000);
    }

    /* 更新 wakatime 请求上下文 */
    public updateContext() {
        this.context.url = this.wakatimeHeartbeatsUrl;
        this.context.project = this.wakatimeProject;
        this.context.language = this.wakatimeLanguage;
        this.context.headers = this.wakatimeHeaders;
    }

    /* 更新 notebook */
    public updateNotebook(notebooks: INotebook[] = globalThis.siyuan?.notebooks) {
        if (Array.isArray(notebooks)) {
            notebooks.forEach(notebook => this.notebook.set(notebook.id, notebook));
        }
    }

    /* 提交活动 */
    protected readonly commit = async () => {
        const roots = Array.from(this.context.roots.values());
        this.context.blocks.clear();
        this.context.roots.clear();

        const actions = await this.buildHeartbeats(roots);
        this.context.actions.push(...actions);

        if (this.context.actions.length > 0) {
            if (this.config.wakatime.heartbeats) { // 是否发送心跳连接
                // WakaTime 限制一次最多提交 25 条记录
                for (let i = 0; i < this.context.actions.length; i += 25) {
                    this.sentHeartbeats(this.context.actions.slice(i, i + 25));
                }
            }
            this.context.actions.length = 0;
        }
    };

    /* 总线事件监听器 */
    protected readonly webSocketMainEventListener = (e: IWebSocketMainEvent) => {
        // this.logger.debug(e);
        if (e.detail.cmd === "transactions") {
            const transactions = e.detail.data as ITransaction[];

            /* 获取所有更改的块 ID */
            transactions?.forEach(transaction => {
                transaction.doOperations?.forEach(operation => {
                    if (operation.id) {
                        this.addEditEvent(operation.id);
                    }
                });
                transaction.doOperations?.forEach(operation => {
                    if (operation.id) {
                        this.addEditEvent(operation.id);
                    }
                });
            });
        }
    }

    /* 编辑器加载事件监听器 */
    protected readonly loadedProtyleEventListener = (e: ILoadedProtyleEvent) => {
        // this.logger.debug(e);
        const protyle = e.detail;
        this.addViewEvent(protyle);
    }

    /* 编辑器点击事件监听器 */
    protected readonly clickEditorContentEventListener = (e: IClickEditorContentEvent) => {
        // this.logger.debug(e);
        const protyle = e.detail.protyle;
        this.addViewEvent(protyle);
    }

    /* 添加编辑事件 */
    protected async addEditEvent(id: BlockID): Promise<Context.IRoot> {
        const time = this.now;

        /* 获取块对应的文档信息 */
        let root_id = this.context.blocks.get(id);
        let root_info = this.context.roots.get(root_id);
        if (!root_info) {
            const block_info = await this.client.getBlockInfo({ id });

            root_id = block_info.data.rootID;
            root_info = {
                id: root_id,
                box: block_info.data.box,
                path: block_info.data.path,
                events: [],
            };

            this.context.blocks.set(id, root_id);
            this.context.roots.set(root_id, root_info);
        }

        /* 添加编辑事件 */
        return this.addEvent({
            id: root_info.id,
            box: root_info.box,
            path: root_info.path,
            time,
            is_write: true,
        });
    }

    /* 添加查看事件 */
    protected addViewEvent(protyle: IProtyle): Context.IRoot | undefined {
        const time = this.now;

        if (protyle.notebookId && protyle.path && protyle.block.rootID) {
            const root_id = protyle.block.rootID;
            this.context.blocks.set(root_id, root_id);
            return this.addEvent({
                id: root_id,
                box: protyle.notebookId,
                path: protyle.path,
                time,
                is_write: false,
            });
        }
    }

    /* 添加事件 */
    protected addEvent(options: Omit<Context.IRoot, "events"> & Context.IEvent): Context.IRoot {
        let root = this.context.roots.get(options.id);
        if (root) {
            const event: Context.IEvent = {
                time: options.time,
                is_write: options.is_write,
            };

            /* 如果上一个事件为同类型的事件, 替换该事件 */
            if (root.events.at(-1)?.is_write === event.is_write) {
                root.events.pop();
            }
            root.events.push(event);
        }
        else {
            root = {
                id: options.id,
                box: options.box,
                path: options.path,
                events: [{
                    time: options.time,
                    is_write: options.is_write,
                }],
            };
            this.context.roots.set(options.id, root);
        }
        return root;
    }

    /**
     * 从块 ID 构造心跳连接
     * @deprecated
     * @param id 块 ID
     * @param is_write 是否为编辑活动
     * @returns 心跳连接活动
     */
    public async buildHeartbeatsFromID(id: BlockID | BlockID[], is_write: boolean): Promise<Heartbeats.IAction[]> {
        const time = this.now; // 当前时间

        if (!Array.isArray(id)) {
            id = [id];
        }

        /* 获取块所在文档的信息 */
        const ids = Array.from(new Set(id)); // 块去重
        const blocks_info = await Promise.all(ids.map(id => this.client.getBlockInfo({ id })));

        const root_set = new Set<BlockID>();
        const root_blocks = blocks_info.filter(info => {
            if (!root_set.has(info.data.rootID)) {
                root_set.add(info.data.rootID);
                return true;
            }
            return false;
        }); // 文档块去重

        return Promise.all(root_blocks.map(doc => {
            return this.buildHeartbeat(
                doc.data,
                time,
                is_write,
            );
        }));
    }

    /**
     * 构造心跳连接
     * @param roots 文档信息
     * @returns 心跳连接活动
     */
    public async buildHeartbeats(roots: Context.IRoot[]): Promise<Heartbeats.IAction[]> {
        return Promise.all(roots.flatMap(root => {
            return root.events.map(event => this.buildHeartbeat(
                root,
                event.time,
                event.is_write,
            ));
        }));
    }

    /**
     * 构建一个心跳连接
     * @param doc 文档信息
     * @param time 时间
     * @param is_write 是否写入
     */
    public async buildHeartbeat(
        doc: {
            box: BlockID,
            path: string,
        },
        time: number,
        is_write: boolean,
    ): Promise<Heartbeats.IAction> {
        const branch = this.config.wakatime.hide_branch_names
            ? doc.box
            : this.notebook.get(doc.box)?.name;
        const entity = this.config.wakatime.hide_file_names
            ? `${branch}${doc.path}`
            : `${branch}${(await this.client.getHPathByPath({
                path: doc.path,
                notebook: doc.box,
            })).data}.sy`;

        return {
            type: Type.File,
            category: is_write
                ? this.config.wakatime.edit.category
                : this.config.wakatime.view.category,

            project: this.context.project,
            branch,
            entity,
            language: this.context.language,
            time,
            is_write,
        };
    }

    /**
     * 发送心跳连接
     * REF: https://wakatime.com/developers#heartbeats
     */
    public async sentHeartbeats(payload: Heartbeats.IAction | Heartbeats.IAction[]) {
        return this.client.forwardProxy({
            url: Array.isArray(payload)
                ? `${this.context.url}.bulk`
                : this.context.url,
            method: this.context.method,
            headers: [
                this.context.headers,
            ],
            timeout: this.config.wakatime.timeout * 1_000,
            payload,
        });
    }

    /* 测试服务状态 */
    public async testService(): Promise<boolean> {
        try {
            const response = await this.client.forwardProxy({
                url: this.wakatimeStatusBarUrl,
                method: "GET",
                headers: [
                    this.context.headers,
                ],
                timeout: this.config.wakatime.timeout * 1_000,
            });
            if (200 <= response.data.status && response.data.status < 300) return true;
            else {
                this.logger.warn(response);
                return false;
            };
        } catch (error) {
            return false;
        }
    }

    /* 获取时间戳 */
    public time(date: Date = new Date()): number {
        return date.getTime() / 1_000;
    }

    /* 获取当前时间戳 */
    public get now(): number {
        return this.time();
    }

    /* default project name */
    public get wakatimeDefaultProject(): string {
        return `siyuan-workspace:${parse(normalize(globalThis.siyuan.config.system.workspaceDir)).base}`;
    }

    /* default language name */
    public get wakatimeDefaultLanguage(): string {
        return "Siyuan";
    }

    /* default API URL */
    public get wakatimeDefaultApiUrl(): string {
        return WakaTimePlugin.WAKATIME_DEFAULT_API_URL;
    }

    /* default hostname */
    public get wakatimeDefaultHostname(): string {
        return globalThis.siyuan.config.system.name;
    }

    /* wakatime project */
    public get wakatimeProject(): string {
        return this.config?.wakatime?.project
            || this.wakatimeDefaultProject;
    }

    /* wakatime language */
    public get wakatimeLanguage(): string {
        return this.config?.wakatime?.language
            || this.wakatimeDefaultLanguage;
    }

    public get wakatimeHeaders(): Context.IHeaders {
        return {
            "Authorization": this.wakatimeAuthorization,
            "User-Agent": this.wakatimeUserAgent,
            "X-Machine-Name": this.wakatimeHostname,
        };
    }

    /* wakatime user agent */
    public get wakatimeUserAgent(): string {
        return `wakatime/v${globalThis.siyuan.config.system.kernelVersion
            } ${globalThis.siyuan.config.system.os
            }-${globalThis.process?.arch || "unknown"
            } siyuan-wakatime/${manifest.version
            }`;
    }

    /* wakatime API URL */
    public get wakatimeApiUrl(): string {
        return this.config?.wakatime?.api_url || this.wakatimeDefaultApiUrl;
    }

    /* wakatime url */
    public get wakatimeHeartbeatsUrl(): string {
        return `${this.wakatimeApiUrl}/${WakaTimePlugin.WAKATIME_HEARTBEATS_PATH}`;
    }

    /* wakatime url */
    public get wakatimeStatusBarUrl(): string {
        return `${this.wakatimeApiUrl}/${WakaTimePlugin.WAKATIME_STATUS_BAR_PATH}`;
    }

    /* wakatime Authorization */
    public get wakatimeAuthorization(): string {
        return `Basic ${btoa(this.config?.wakatime?.api_key)}`;
    }

    /* wakatime Hostname */
    public get wakatimeHostname(): string {
        return this.config?.wakatime.hostname || this.wakatimeDefaultHostname;
    }
};
