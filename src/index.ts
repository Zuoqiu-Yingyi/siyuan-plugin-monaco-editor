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

import {
    FLAG_ELECTRON,
    FLAG_DESKTOP,
    FLAG_MOBILE,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { merge } from "@workspace/utils/misc/merge";
import { parse } from "@workspace/utils/path/browserify";
import { normalize } from "@workspace/utils/path/normalize";
import { DEFAULT_CONFIG } from "./configs/default";
import type { IConfig } from "./types/config";
import type { IContext, IHeaders, heartbeats } from "./types/wakatime";
import type {
    IWebSocketMainEvent,
    IClickEditorContentEvent,
    ILoadedProtyleEvent,
} from "@workspace/types/siyuan/events";
import type { ITransaction } from "@workspace/types/siyuan/transaction";
import type { BlockID } from "@workspace/types/siyuan";

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

    public readonly ids: Set<BlockID> = new Set(); // 待处理的块 ID
    public readonly actions: heartbeats.IPayload[] = []; // 待处理的操作

    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly context: IContext; // 心跳连接上下文

    protected config: IConfig;
    protected timer: number; // 定时器

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client(undefined, "fetch");

        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;
        this.context = {
            url: this.wakatimeURL,
            method: "POST",
            project: this.wakatimeProject,
            headers: this.wakatimeHeaders,
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
                this.config = merge(DEFAULT_CONFIG, config || {}) as IConfig;
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
        this.eventBus.off("click-editorcontent", this.clickEditorContentEventListener);
    }

    openSetting(): void {
        this.testConnection().then(status => this.logger.debug(status));
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
        this.updateTimer();
        this.updateContext();
        return this.saveData(WakaTimePlugin.GLOBAL_CONFIG_NAME, this.config);
    }

    /* 更新定时器 */
    public updateTimer(interval: number = this.config.wakatime.interval) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(this.commit, interval);
    }

    /* 更新 wakatime 请求上下文 */
    public updateContext() {
        this.context.url = this.wakatimeURL;
        this.context.project = this.wakatimeProject;
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
        const ids = Array.from(this.ids);
        this.ids.clear();
        const actions = await this.buildHeartbeats(ids, true);
        this.actions.push(...actions);

        if (this.actions.length > 0) {
            this.sentHeartbeats(this.actions);
            this.actions.length = 0;
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
                        this.ids.add(operation.id);
                    }
                });
                transaction.doOperations?.forEach(operation => {
                    if (operation.id) {
                        this.ids.add(operation.id);
                    }
                });
            });
        }
    }

    /* 编辑器加载事件监听器 */
    protected readonly loadedProtyleEventListener = (e: ILoadedProtyleEvent) => {
        // this.logger.debug(e);
        const protyle = e.detail;
        if (protyle.notebookId && protyle.path) {
            this.buildHeartbeat(
                {
                    box: protyle.notebookId,
                    path: protyle.path,
                },
                Date.now() / 1_000,
                false,
            ).then(action => this.actions.push(action));
        }
    }

    /* 编辑器点击事件监听器 */
    protected readonly clickEditorContentEventListener = (e: IClickEditorContentEvent) => {
        // this.logger.debug(e);
        const protyle = e.detail.protyle;
        if (protyle.notebookId && protyle.path) {
            this.buildHeartbeat(
                {
                    box: protyle.notebookId,
                    path: protyle.path,
                },
                Date.now() / 1_000,
                false,
            ).then(action => this.actions.push(action));
        }
    }

    /**
     * 构造心跳连接
     */
    public async buildHeartbeats(id: BlockID | BlockID[], is_write: boolean): Promise<heartbeats.IPayload[]> {
        const time = Date.now() / 1_000; // 当前时间

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
    ): Promise<heartbeats.IPayload> {
        const notebook_name = this.notebook.get(doc.box)?.name;
        const hpath = await this.client.getHPathByPath({
            path: doc.path,
            notebook: doc.box,
        });
        return {
            type: "file",
            category: "learning",

            project: this.context.project,
            branch: notebook_name,
            entity: `${notebook_name}${hpath.data}.sy`,
            language: "Siyuan",
            time,
            is_write,
        };
    }

    /**
     * 发送心跳连接
     * REF: https://wakatime.com/developers#heartbeats
     */
    public async sentHeartbeats(payload: heartbeats.IPayload | heartbeats.IPayload[]) {
        return this.client.forwardProxy({
            url: Array.isArray(payload)
                ? `${this.context.url}.bulk`
                : this.context.url,
            method: this.context.method,
            headers: [
                this.context.headers,
            ],
            payload,
        });
    }

    /* 测试连接状态 */
    public async testConnection(): Promise<boolean> {
        try {
            const response = await this.client.forwardProxy({
                url: this.wakatimeStatusBarURL,
                method: "GET",
                headers: [
                    this.context.headers,
                ],
            });
            if (200 <= response.data.status && response.data.status < 300) return true;
            else return false;
        } catch (error) {
            return false;
        }
    }

    /* wakatime project */
    public get wakatimeProject(): string {
        return this.config?.wakatime?.project
            || `siyuan-workspace:${parse(normalize(globalThis.siyuan.config.system.workspaceDir)).base}`;
    }


    public get wakatimeHeaders(): IHeaders {
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

    /* wakatime url */
    public get wakatimeURL(): string {
        return `${this.config?.wakatime?.api_url || WakaTimePlugin.WAKATIME_DEFAULT_API_URL}/${WakaTimePlugin.WAKATIME_HEARTBEATS_PATH}`;
    }

    /* wakatime url */
    public get wakatimeStatusBarURL(): string {
        return `${this.config?.wakatime?.api_url || WakaTimePlugin.WAKATIME_DEFAULT_API_URL}/${WakaTimePlugin.WAKATIME_STATUS_BAR_PATH}`;
    }

    /* wakatime Authorization */
    public get wakatimeAuthorization(): string {
        return `Basic ${btoa(this.config?.wakatime?.api_key)}`;
    }

    /* wakatime Hostname */
    public get wakatimeHostname(): string {
        return globalThis.siyuan.config.system.name;
    }
};
