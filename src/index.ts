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
    KernelError,
    type types,
} from "@siyuan-community/siyuan-sdk";

import Settings from "./components/Settings.svelte";

import {
    FLAG_MOBILE,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { mergeIgnoreArray } from "@workspace/utils/misc/merge";
import { parse } from "@workspace/utils/path/browserify";
import { normalize } from "@workspace/utils/path/normalize";
import { sleep } from "@workspace/utils/misc/sleep";
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
import {
    Cache,
    type TCacheDatum,
} from "./wakatime/cache";

type INotebook = types.kernel.api.notebook.lsNotebooks.INotebook;

export default class WakaTimePlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";
    static readonly OFFLINE_CACHE_PATH = "temp/.wakatime/cache";

    static readonly WAKATIME_DEFAULT_API_URL = "https://wakatime.com/api/v1";
    static readonly WAKATIME_STATUS_BAR_PATH = "users/current/statusbar/today";
    static readonly WAKATIME_HEARTBEATS_PATH = "users/current/heartbeats";
    static readonly WAKATIME_HEARTBEATS_BULK = 25; // 每次提交数量限制

    static readonly CACHE_CHECK_INTERVAL = 5 * 60 * 1_000; // 缓存检查时间间隔
    static readonly CACHE_COMMIT_INTERVAL = 1 * 1_000; // 缓存每次提交时间间隔

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;
    public readonly cache: InstanceType<typeof Cache<TCacheDatum>>; // 缓存
    public readonly caches: InstanceType<typeof Cache<TCacheDatum>>[]; // 历史缓存
    public readonly notebook = new Map<BlockID, INotebook>(); // 笔记本 ID => 笔记本信息

    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly context: Context.IContext; // 心跳连接上下文

    public config: IConfig;

    protected heartbeatTimer: number; // 心跳定时器
    protected cacheCheckTimer: number; // 缓存检查定时器

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client(undefined, "fetch");
        this.cache = new Cache(this.client, WakaTimePlugin.OFFLINE_CACHE_PATH);
        this.caches = [];

        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;

        this.context = {
            url: this.wakatimeHeartbeatsUrl,
            method: "POST",
            headers: this.wakatimeHeaders,

            project: this.wakatimeProject,
            language: this.wakatimeLanguage,

            includeID: [],
            excludeID: [],
            include: [],
            exclude: [],

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

        /* 加载配置文件 */
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

        /* 加载缓存数据 */
        this.cache.load();
    }

    onLayoutReady(): void {
    }

    onunload(): void {
        this.eventBus.off("ws-main", this.webSocketMainEventListener);
        this.eventBus.off("loaded-protyle", this.loadedProtyleEventListener);
        this.eventBus.off("click-editorcontent", this.clickEditorContentEventListener);

        clearInterval(this.heartbeatTimer);
        clearInterval(this.cacheCheckTimer);
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

    /* 清理缓存 */
    public async clearCache(directory: string = WakaTimePlugin.OFFLINE_CACHE_PATH): Promise<boolean> {
        try {
            await this.client.removeFile({ path: directory });
            return true;
        } catch (error) {
            return false
        }
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
        /* 心跳定时器 */
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(this.commit, interval * 1_000);

        /* 缓存检查定时器 */
        clearInterval(this.cacheCheckTimer);
        this.cacheCheckTimer = setInterval(this.checkCache, WakaTimePlugin.CACHE_CHECK_INTERVAL);
    }

    /* 更新 wakatime 请求上下文 */
    public updateContext() {
        this.context.url = this.wakatimeHeartbeatsUrl;
        this.context.headers = this.wakatimeHeaders;

        this.context.project = this.wakatimeProject;
        this.context.language = this.wakatimeLanguage;

        this.context.includeID = this.wakatimeIncludeID;
        this.context.excludeID = this.wakatimeExcludeID;

        this.context.include = this.wakatimeInclude;
        this.context.exclude = this.wakatimeExclude;
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

        /* 在 ID 中进行过滤 */
        const valid_roots = roots
            .filter(root => {
                const entity = `${root.box}${root.path}`;
                return this.filter(
                    entity,
                    this.context.includeID,
                    this.context.excludeID,
                );
            });

        const actions = await this.buildHeartbeats(valid_roots);

        /* 在 entity 中进行过滤 */
        const valid_actions = actions
            .filter(action => {
                const entity = action.entity;
                return this.filter(
                    entity,
                    this.context.include,
                    this.context.exclude,
                );
            });

        this.context.actions.push(...valid_actions);

        if (this.context.actions.length > 0) {
            const actions = this.context.actions.slice(); // 数组浅拷贝
            this.context.actions.length = 0;

            /* 构造心跳连接请求 */
            const requests: Heartbeats.IRequest[] = [];
            for (let i = 0; i < actions.length; i += WakaTimePlugin.WAKATIME_HEARTBEATS_BULK) {
                // WakaTime 限制一次最多提交 25 条记录
                requests.push(this.buildHeartbeatsRequest(actions.slice(i, i + WakaTimePlugin.WAKATIME_HEARTBEATS_BULK)))
            }

            if (this.config.wakatime.heartbeats) { // 提交数据
                for (const request of requests) {
                    await this.sentHeartbeats(
                        request,
                        request => {
                            if (this.config.wakatime.offline) {
                                this.cache.push(request.payload);
                            }
                        }
                    ); // 发送载荷
                }
            }
            else { // 不提交数据
                if (this.config.wakatime.offline) { // 若开启离线缓存
                    this.cache.push(...requests.map(request => request.payload)); // 写入缓存
                }
            }
            await this.cache.save(); // 缓存持久化
        }
    };

    /* 检查缓存 */
    protected readonly checkCache = async () => {
        const cache_files_name = await this.cache.getAllCacheFileName(); // 所有缓存文件名称

        /* 初始化历史缓存对象列表 */
        this.caches.length = 0;
        this.caches.push(...cache_files_name.map(filename => new Cache(
            this.client,
            WakaTimePlugin.OFFLINE_CACHE_PATH,
            filename,
        )));

        /* 定时提交缓存 */
        if (this.caches.length > 0) {
            for (const cache of this.caches) {
                if (this.config.wakatime.heartbeats) { // 提交
                    await cache.load(); // 加载缓存文件

                    const exceptions: TCacheDatum[] = []; // 提交缓存时发生异常

                    /* 依次提交缓存内容 */
                    for (let index = 0; index < cache.length; ++index) {
                        const payload = cache.at(index);

                        /* 提交缓存 */
                        await this.sentHeartbeats(
                            this.buildHeartbeatsRequest(payload),
                            request => exceptions.push(request.payload),
                        );

                        if (index === 0 && exceptions.length > 0) {
                            /**
                             * 第一次提交出现问题
                             * 可能用户处于离线状态
                             * 本次不再进行提交
                             */
                            return;
                        }

                        /* 休眠 */
                        await sleep(WakaTimePlugin.CACHE_COMMIT_INTERVAL);
                    }

                    if (exceptions.length > 0) {
                        /* 存在异常, 保存异常提交到缓存文件 */
                        cache.clear();
                        cache.push(...exceptions);
                        await cache.save();

                        /**
                         * 本轮提交存在异常
                         * 可能用户网络状态可能不稳定
                         * 本次不再进行提交
                         */
                        return;
                    }
                    else {
                        /* 不存在异常, 删除缓存文件 */
                        await cache.remove();
                    }
                }
                else { // 不提交
                    return;
                }
            }
        }
    }

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
                transaction.undoOperations?.forEach(operation => {
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
    protected async addEditEvent(id: BlockID): Promise<Context.IRoot | null> {
        try {
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
        } catch (error) {
            if (error instanceof KernelError) { // 块删除事件导致无法查询到对应的块
                // this.logger.warn(error);
                return;
            }
            else {
                throw error;
            }
        }
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
     * 构造心跳连接请求
     * @param payload 心跳连接载荷
     * @returns 心跳连接请求
     */
    public buildHeartbeatsRequest(payload: Heartbeats.IAction | Heartbeats.IAction[]): Heartbeats.IRequest {
        const request: Heartbeats.IRequest = {
            url: Array.isArray(payload)
                ? `${this.context.url}.bulk`
                : this.context.url,
            method: this.context.method,
            headers: [
                this.context.headers,
            ],
            timeout: this.config.wakatime.timeout * 1_000,
            payload,
        };
        return request;
    }

    /**
     * 发送心跳连接
     * REF: https://wakatime.com/developers#heartbeats
     * @param request 心跳连接请求
     * @param reject 心跳连接失败时的回调
     */
    public async sentHeartbeats(
        request: Heartbeats.IRequest,
        reject: (request: Heartbeats.IRequest) => void,
    ) {
        try {
            const response = await this.client.forwardProxy(request);
            if (200 <= response.data.status && response.data.status < 300) {
            }
            else {
                reject(request);
            }
            return response;
        } catch (error) {
            reject(request);
        }
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

    /**
     * 黑白名单过滤
     * @param entity 文件路径
     * @param include 包含列表
     * @param exclude 排除列表
     * @returns 是否通过过滤
     */
    protected filter(
        entity: string,
        include: (string | RegExp)[],
        exclude: (string | RegExp)[],
    ): boolean {
        if (include.length > 0) { // 白名单过滤
            let pass = false; // 是否通过白名单过滤
            for (const entry of include) {
                if (typeof entry === "string") {
                    if (entity.includes(entry)) {
                        pass = true;
                        break;
                    }
                }
                else if (entry instanceof RegExp) {
                    if (entry.test(entity)) {
                        pass = true;
                        break;
                    }
                }
            }
            if (!pass) return false;
        }
        if (exclude.length > 0) { // 黑名单过滤
            let pass = true; // 是否通过黑名单过滤
            for (const entry of exclude) {
                if (typeof entry === "string") {
                    if (entity.includes(entry)) {
                        pass = false;
                        break;
                    }
                }
                else if (entry instanceof RegExp) {
                    if (entry.test(entity)) {
                        pass = false;
                        break;
                    }
                }
            }
            return pass;
        }
        return true;
    }

    /* 清洗列表 */
    protected washList(list: string[]): (string | RegExp)[] {
        return list
            .filter(entry => {
                entry = entry.trim();
                if (entry !== "" && entry !== "//") {
                    /* 过滤无效的正则表达式 */
                    if (entry.startsWith("/") && entry.endsWith("/")) {
                        try {
                            new RegExp(entry.slice(1, -1));
                            return true;
                        } catch (error) {
                            this.siyuan.showMessage(
                                error,
                                undefined,
                                "error",
                            );
                            return false;
                        }
                    }
                    return true;
                }
                else return false;
            })
            .map(entry => {
                if (entry.startsWith("/") && entry.endsWith("/")) {
                    return new RegExp(entry.slice(1, -1));
                }
                else {
                    return entry;
                }
            });
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

    /* wakatime include */
    public get wakatimeIncludeID(): (string | RegExp)[] {
        return this.washList(this.config.wakatime.includeID);
    }
    public get wakatimeInclude(): (string | RegExp)[] {
        return this.washList(this.config.wakatime.include);
    }

    /* wakatime exclude */
    public get wakatimeExcludeID(): (string | RegExp)[] {
        return this.washList(this.config.wakatime.excludeID);
    }
    public get wakatimeExclude(): (string | RegExp)[] {
        return this.washList(this.config.wakatime.exclude);
    }
};
