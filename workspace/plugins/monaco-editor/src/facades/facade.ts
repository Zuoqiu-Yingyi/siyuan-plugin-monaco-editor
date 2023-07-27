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

/* 处理器门面 */

import type MonacoEditorPlugin from "@/index";

import type {
    Handler,
    IBaseHandlerOptions,
    IHandler,
} from "@/handlers/handler";
import {
    BlockHandler,
    type IBlockHandler,
    type IBlockHandlerOptions,
} from "@/handlers/block";
import {
    AssetHandler,
    type IAssetHandler,
    type IAssetHandlerOptions,
} from "@/handlers/asset";
import {
    LocalHandler,
    type ILocalHandler,
    type ILocalHandlerOptions,
} from "@/handlers/local";

import type {
    Breadcrumb,
    IBaseBreadcrumbOptions,
    IBreadcrumb,
} from "@/breadcrumb/breadcrumb";
import {
    BlockBreadcrumb,
    type IBlockBreadcrumbOptions,
    type IBlockStore,
} from "@/breadcrumb/block";
import {
    AssetBreadcrumb,
    type IAssetBreadcrumbOptions,
    type IAssetStore,
} from "@/breadcrumb/asset";
import {
    LocalBreadcrumb,
    type ILocalBreadcrumbOptions,
    type ILocalStore,
} from "@/breadcrumb/local";
import { NetworkHandler, type INetworkHandlerOptions, type INetworkHandler } from "@/handlers/network";
import { NetworkBreadcrumb, type INetworkBreadcrumbOptions, type INetworkStore } from "@/breadcrumb/network";
import { SnippetHandler, type ISnippetHandlerOptions } from "@/handlers/snippet";
import { SnippetBreadcrumb, type ISnippetBreadcrumbOptions } from "@/breadcrumb/snippet";
import { InboxHandler, type IInboxHandlerOptions } from "@/handlers/inbox";
import { InboxBreadcrumb, type IInboxBreadcrumbOptions } from "@/breadcrumb/inbox";
import { HistoryHandler, type IHistoryHandlerOptions } from "@/handlers/history";
import { HistoryBreadcrumb, type IHistoryBreadcrumbOptions } from "@/breadcrumb/history";

/* 处理器类型 */
export enum HandlerType {
    inbox, // 收集箱
    block, // 思源块
    asset, // 资源文件
    local, // 本地文件
    network, // 网络文件
    snippet, // 代码片段
    history, // 历史文档
    snapshot, // 快照
}

export type IFacadeOptions = IFacadeAssetOptions
    | IFacadeBlockOptions
    | IFacadeHistoryOptions
    | IFacadeInboxOptions
    | IFacadeLocalOptions
    | IFacadeNetworkOptions
    | IFacadeSnippetOptions;
export type IStore = IBlockStore
    | IAssetStore
    | ILocalStore
    | INetworkStore;
export type IFacadeHandler = IBlockHandler
    | IAssetHandler
    | ILocalHandler
    | INetworkHandler;

export type IFacadeWindowOptions = Pick<IFacadeOptions, "type" | "handler">;

/* 门面参数 */
export interface IFacadeBaseOptions {
    type: HandlerType,
    handler: IBaseHandlerOptions,
    breadcrumb: IBaseBreadcrumbOptions,
}

export interface IFacadeAssetOptions extends IFacadeBaseOptions {
    type: HandlerType.asset,
    handler: IAssetHandlerOptions,
    breadcrumb: IAssetBreadcrumbOptions,
}

export interface IFacadeBlockOptions extends IFacadeBaseOptions {
    type: HandlerType.block,
    handler: IBlockHandlerOptions,
    breadcrumb: IBlockBreadcrumbOptions,
}

export interface IFacadeHistoryOptions extends IFacadeBaseOptions {
    type: HandlerType.history,
    handler: IHistoryHandlerOptions,
    breadcrumb: IHistoryBreadcrumbOptions,
}

export interface IFacadeInboxOptions extends IFacadeBaseOptions {
    type: HandlerType.inbox,
    handler: IInboxHandlerOptions,
    breadcrumb: IInboxBreadcrumbOptions,
}

export interface IFacadeLocalOptions extends IFacadeBaseOptions {
    type: HandlerType.local,
    handler: ILocalHandlerOptions,
    breadcrumb: ILocalBreadcrumbOptions,
}

export interface IFacadeNetworkOptions extends IFacadeBaseOptions {
    type: HandlerType.network,
    handler: INetworkHandlerOptions,
    breadcrumb: INetworkBreadcrumbOptions,
}

export interface IFacadeSnippetOptions extends IFacadeBaseOptions {
    type: HandlerType.snippet,
    handler: ISnippetHandlerOptions,
    breadcrumb: ISnippetBreadcrumbOptions,
}

export interface ITabOptions {
    handler: IFacadeHandler;
    breadcrumb: IBreadcrumb;
}

export interface IWindowOptions {
    handler: IFacadeHandler;
}

export class Facade {
    protected assetHandler: InstanceType<typeof AssetHandler>;
    protected assetBreadcrumb: InstanceType<typeof AssetBreadcrumb>;

    protected blockHandler: InstanceType<typeof BlockHandler>;
    protected blockBreadcrumb: InstanceType<typeof BlockBreadcrumb>;

    protected historyHandler: InstanceType<typeof HistoryHandler>;
    protected historyBreadcrumb: InstanceType<typeof HistoryBreadcrumb>;

    protected inboxHandler: InstanceType<typeof InboxHandler>;
    protected inboxBreadcrumb: InstanceType<typeof InboxBreadcrumb>;

    protected localHandler: InstanceType<typeof LocalHandler>;
    protected localBreadcrumb: InstanceType<typeof LocalBreadcrumb>;

    protected networkHandler: InstanceType<typeof NetworkHandler>;
    protected networkBreadcrumb: InstanceType<typeof NetworkBreadcrumb>;

    protected snippetHandler: InstanceType<typeof SnippetHandler>;
    protected snippetBreadcrumb: InstanceType<typeof SnippetBreadcrumb>;

    constructor(
        protected readonly plugin: InstanceType<typeof MonacoEditorPlugin>,
    ) { }

    /* 派遣处理器制造者 */
    protected dispatchHandlerMaker(type: HandlerType): Handler {
        switch (type) {
            case HandlerType.asset: {
                if (!(this.assetHandler instanceof AssetHandler)) {
                    this.assetHandler = new AssetHandler(this.plugin);
                }
                return this.assetHandler as InstanceType<typeof AssetHandler>;
            }
            case HandlerType.block: {
                if (!(this.blockHandler instanceof BlockHandler)) {
                    this.blockHandler = new BlockHandler(this.plugin);
                }
                return this.blockHandler as InstanceType<typeof BlockHandler>;
            }
            case HandlerType.history: {
                if (!(this.historyHandler instanceof HistoryHandler)) {
                    this.historyHandler = new HistoryHandler(this.plugin);
                }
                return this.historyHandler as InstanceType<typeof HistoryHandler>;
            }
            case HandlerType.inbox: {
                if (!(this.inboxHandler instanceof InboxHandler)) {
                    this.inboxHandler = new InboxHandler(this.plugin);
                }
                return this.inboxHandler as InstanceType<typeof InboxHandler>;
            }
            case HandlerType.local: {
                if (!(this.localHandler instanceof LocalHandler)) {
                    this.localHandler = new LocalHandler(this.plugin);
                }
                return this.localHandler as InstanceType<typeof LocalHandler>;
            }
            case HandlerType.network: {
                if (!(this.networkHandler instanceof NetworkHandler)) {
                    this.networkHandler = new NetworkHandler(this.plugin);
                }
                return this.networkHandler as InstanceType<typeof NetworkHandler>;
            }
            case HandlerType.snippet: {
                if (!(this.snippetHandler instanceof SnippetHandler)) {
                    this.snippetHandler = new SnippetHandler(this.plugin);
                }
                return this.snippetHandler as InstanceType<typeof SnippetHandler>;
            }
            default:
                throw new Error(type.toString());
        }
    }

    /* 派遣处理器制造者 */
    protected dispatchBreadcrumbMaker(type: HandlerType): Breadcrumb {
        switch (type) {
            case HandlerType.asset: {
                if (!(this.assetBreadcrumb instanceof AssetBreadcrumb)) {
                    this.assetBreadcrumb = new AssetBreadcrumb(this.plugin);
                }
                return this.assetBreadcrumb as InstanceType<typeof AssetBreadcrumb>;
            }
            case HandlerType.block: {
                if (!(this.blockBreadcrumb instanceof BlockBreadcrumb)) {
                    this.blockBreadcrumb = new BlockBreadcrumb(this.plugin);
                }
                return this.blockBreadcrumb as InstanceType<typeof BlockBreadcrumb>;
            }
            case HandlerType.history: {
                if (!(this.historyBreadcrumb instanceof HistoryBreadcrumb)) {
                    this.historyBreadcrumb = new HistoryBreadcrumb(this.plugin);
                }
                return this.historyBreadcrumb as InstanceType<typeof HistoryBreadcrumb>;
            }
            case HandlerType.inbox: {
                if (!(this.inboxBreadcrumb instanceof InboxBreadcrumb)) {
                    this.inboxBreadcrumb = new InboxBreadcrumb(this.plugin);
                }
                return this.inboxBreadcrumb as InstanceType<typeof InboxBreadcrumb>;
            }
            case HandlerType.local: {
                if (!(this.localBreadcrumb instanceof LocalBreadcrumb)) {
                    this.localBreadcrumb = new LocalBreadcrumb(this.plugin);
                }
                return this.localBreadcrumb as InstanceType<typeof LocalBreadcrumb>;
            }
            case HandlerType.network: {
                if (!(this.networkBreadcrumb instanceof NetworkBreadcrumb)) {
                    this.networkBreadcrumb = new NetworkBreadcrumb(this.plugin);
                }
                return this.networkBreadcrumb as InstanceType<typeof NetworkBreadcrumb>;
            }
            case HandlerType.snippet: {
                if (!(this.snippetBreadcrumb instanceof SnippetBreadcrumb)) {
                    this.snippetBreadcrumb = new SnippetBreadcrumb(this.plugin);
                }
                return this.snippetBreadcrumb as InstanceType<typeof SnippetBreadcrumb>;
            }
            default:
                throw new Error(type.toString());
        }
    }

    /* 构造页签配置 */
    public async makeTabOptions(options: IFacadeOptions, stores?: IStore): Promise<ITabOptions> {
        const handlerMaker = this.dispatchHandlerMaker(options.type);
        const breadcrumbMaker = this.dispatchBreadcrumbMaker(options.type);

        if (stores) options.breadcrumb.stores = stores;
        const promises: [Promise<IHandler>, Promise<IBreadcrumb>] = [
            handlerMaker.makeHandler(options.handler),
            breadcrumbMaker.makeBreadcrumb(options.breadcrumb),
        ];
        const [handler, breadcrumb] = await Promise.all(promises) as [IFacadeHandler, IBreadcrumb];
        breadcrumb.breadcrumbIcons.forEach(icon => {
            switch (icon.type) {
                case "refresh":
                    icon.disabled = !handler.update;
                    break;
            }
        });
        return {
            handler,
            breadcrumb,
        };
    }

    public async makeWindowOptions(options: IFacadeWindowOptions): Promise<IWindowOptions> {
        const handlerMaker = this.dispatchHandlerMaker(options.type);
        const handler = await handlerMaker.makeHandler(options.handler);
        return {
            handler: handler as IFacadeHandler,
        };
    }
}
