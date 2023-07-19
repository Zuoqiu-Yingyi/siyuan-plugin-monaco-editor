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
    Breadcrumb,
    IBaseBreadcrumbOptions,
    IBreadcrumb,
} from "@/breadcrumb/breadcrumb";
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
    BlockBreadcrumb,
    type IBlockBreadcrumbOptions,
    type IBlockStore,
} from "@/breadcrumb/block";
import {
    AssetHandler,
    type IAssetHandler,
    type IAssetHandlerOptions,
} from "@/handlers/asset";
import {
    AssetBreadcrumb,
    type IAssetBreadcrumbOptions,
    type IAssetStore,
} from "@/breadcrumb/asset";

export type IFacadeOptions = IFacadeBlockOptions | IFacadeAssetOptions;
export type IStore = IBlockStore | IAssetStore;
export type IFacadeHandler = IBlockHandler | IAssetHandler;

export type IFacadeWindowOptions = Pick<IFacadeOptions, "type" | "handler">;

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

/* 门面参数 */
export interface IFacadeBaseOptions {
    type: HandlerType,
    handler: IBaseHandlerOptions,
    breadcrumb: IBaseBreadcrumbOptions,
}

export interface IFacadeBlockOptions extends IFacadeBaseOptions {
    type: HandlerType.block,
    handler: IBlockHandlerOptions,
    breadcrumb: IBlockBreadcrumbOptions,
}

export interface IFacadeAssetOptions extends IFacadeBaseOptions {
    type: HandlerType.asset,
    handler: IAssetHandlerOptions,
    breadcrumb: IAssetBreadcrumbOptions,
}

export interface ITabOptions {
    handler: IFacadeHandler;
    breadcrumb: IBreadcrumb;
}

export interface IWindowOptions {
    handler: IFacadeHandler;
}

export class Facade {
    protected blockHandler: InstanceType<typeof BlockHandler>;
    protected blockBreadcrumb: InstanceType<typeof BlockBreadcrumb>;

    protected assetHandler: InstanceType<typeof AssetHandler>;
    protected assetBreadcrumb: InstanceType<typeof AssetBreadcrumb>;

    constructor(
        protected readonly plugin: InstanceType<typeof MonacoEditorPlugin>,
    ) { }

    /* 派遣面包屑制造者 */
    protected dispatchHandlerMaker(type: HandlerType): Handler {
        switch (type) {
            case HandlerType.block: {
                if (!(this.blockHandler instanceof BlockHandler)) {
                    this.blockHandler = new BlockHandler(this.plugin);
                }
                return this.blockHandler as InstanceType<typeof BlockHandler>;
            }
            case HandlerType.asset: {
                if (!(this.assetHandler instanceof AssetHandler)) {
                    this.assetHandler = new AssetHandler(this.plugin);
                }
                return this.assetHandler as InstanceType<typeof AssetHandler>;
            }
            default:
                throw new Error(type.toString());
        }
    }

    /* 派遣处理器制造者 */
    protected dispatchBreadcrumbMaker(type: HandlerType): Breadcrumb {
        switch (type) {
            case HandlerType.block: {
                if (!(this.blockBreadcrumb instanceof BlockBreadcrumb)) {
                    this.blockBreadcrumb = new BlockBreadcrumb(this.plugin);
                }
                return this.blockBreadcrumb as InstanceType<typeof BlockBreadcrumb>;
            }
            case HandlerType.asset: {
                if (!(this.assetBreadcrumb instanceof AssetBreadcrumb)) {
                    this.assetBreadcrumb = new AssetBreadcrumb(this.plugin);
                }
                return this.assetBreadcrumb as InstanceType<typeof AssetBreadcrumb>;
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
