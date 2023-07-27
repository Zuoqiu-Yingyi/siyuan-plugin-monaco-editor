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

import {
    Breadcrumb,
    type IBaseBreadcrumbOptions,
    type IBaseStore,
    type IBreadcrumb,
} from "./breadcrumb";
import type { ComponentProps } from "svelte";
import {
    get,
    type Writable,
} from "svelte/store";
import type Tab from "@workspace/components/siyuan/tab/Tab.svelte";
import { TooltipsDirection } from "@workspace/components/siyuan/misc/tooltips";
import type { BlockID } from "@workspace/types/siyuan";
import { getDocPaths } from "@workspace/utils/siyuan/breadcrumb";
import { NodeType2IconID } from "./block";
import * as sdk from "@siyuan-community/siyuan-sdk";

export interface IHistoryStore extends IBaseStore {
    fullscreen: Writable<ComponentProps<Tab>["fullscreen"]>; // 是否全屏显示
}

export type IHistoryBreadcrumbOptions = IHistoryBreadcrumbOptions1 | IHistoryBreadcrumbOptions2;

export interface IHistoryBreadcrumbBaseOptions extends IBaseBreadcrumbOptions {
    stores?: IHistoryStore; // 响应式数据
    path?: string; // 历史附件绝对路径
    id?: BlockID; // 文档块 ID
}

/* 文件历史面板的入口 (Alt + H) */
export interface IHistoryBreadcrumbOptions1 extends IHistoryBreadcrumbBaseOptions {
    path: string;
    id?: never;
}

/* 文档历史面板的入口 (文档树右键 > 文件历史) */
export interface IHistoryBreadcrumbOptions2 extends IHistoryBreadcrumbBaseOptions {
    path?: never;
    id: BlockID;
}

export class HistoryBreadcrumb extends Breadcrumb {
    public async makeBreadcrumb(options: IHistoryBreadcrumbOptions): Promise<IBreadcrumb> {
        const breadcrumb: IBreadcrumb = {
            breadcrumb: true,
            breadcrumbItems: [],
            breadcrumbIcons: [],
        };

        /* 通过 path 获取文档块 ID */
        if (options.path) {
            options.id = options.path.slice(-25, -3);
        }

        /* 获取块信息 */
        const [
            response_getBlockInfo,
            response_getBlockBreadcrumb,
        ] = await Promise.all([
            this.client.getBlockInfo({ id: options.id }),
            this.client.getBlockBreadcrumb({ id: options.id }),
        ]);

        /* 获得文档路径 */
        const paths = getDocPaths(
            response_getBlockInfo.data.box,
            response_getBlockInfo.data.path,
            response_getBlockBreadcrumb.data[0].name,
        );
        const notebook = paths.shift();
        breadcrumb.breadcrumbItems.push({
            type: "item",
            icon: NodeType2IconID.get(sdk.siyuan.NodeType.NodeNotebook),
            text: notebook.hpath,
            textTitle: notebook.hpath,
            textEllipsis: true,
        });

        paths.forEach(doc => {
            breadcrumb.breadcrumbItems.push({
                type: "arrow",
                icon: "#icon-monaco-editor-slash",
            }, {
                type: "item",
                itemId: doc.path,
                iconId: doc.path,
                icon: NodeType2IconID.get(sdk.siyuan.NodeType.NodeDocument),
                text: doc.hpath,
                textTitle: doc.hpath,
                textEllipsis: true,
            });
        });

        if (options.stores) {
            /* 全屏 */
            breadcrumb.breadcrumbIcons.push({
                icon: "#iconFullscreen",
                type: "fullscreen",
                ariaLabel: this.i18n.button.fullscreen.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick(_e, _element, props) {
                    const fullscreen = get(props.active);
                    options.stores.fullscreen.set(!fullscreen);
                    props.active.set(!fullscreen);
                },
            });

            // TODO: 在新窗口打开
        }
        return breadcrumb;
    }
}
