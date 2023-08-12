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

import * as sdk from "@siyuan-community/siyuan-sdk";
import { getDocPaths } from "@workspace/utils/siyuan/breadcrumb";

import {
    Breadcrumb,
    type IBaseBreadcrumbOptions,
    type IBaseStore,
    type IBreadcrumb,
} from "./breadcrumb";

import type { ComponentProps } from "svelte";
import { get, type Writable } from "svelte/store";

import type Tab from "@workspace/components/siyuan/tab/Tab.svelte";

import type EditorIframe from "@/components/EditorIframe.svelte";

import type { BlockID } from "@workspace/types/siyuan";
import { TooltipsDirection } from "@workspace/components/siyuan/misc/tooltips";

type NodeType = sdk.siyuan.NodeType;
type BlockSubType = sdk.siyuan.BlockSubType;

const NodeType = sdk.siyuan.NodeType;
const BlockSubType = sdk.siyuan.BlockSubType;

/* 建立从节点类型到 svg 图标引用 ID 的映射 */
export const NodeType2IconID = new Map<NodeType, string>([
    [NodeType.NodeNotebook, "#iconFilesRoot"],
    [NodeType.NodeFolder, "#iconFolder"],

    [NodeType.NodeDocument, "#iconFile"],
    [NodeType.NodeSuperBlock, "#iconSuper"],
    [NodeType.NodeBlockquote, "#iconQuote"],
    [NodeType.NodeList, "#iconList"],
    [NodeType.NodeListItem, "#iconListItem"],

    [NodeType.NodeHeading, "#iconHeadings"],
    [NodeType.NodeParagraph, "#iconParagraph"],
    [NodeType.NodeMathBlock, "#iconMath"],
    [NodeType.NodeTable, "#iconTable"],
    [NodeType.NodeCodeBlock, "#iconCode"],
    [NodeType.NodeHTMLBlock, "#iconHTML5"],
    [NodeType.NodeThematicBreak, "#iconLine"],
    [NodeType.NodeAudio, "#iconRecord"],
    [NodeType.NodeVideo, "#iconVideo"],
    [NodeType.NodeIFrame, "#iconLanguage"],
    [NodeType.NodeWidget, "#iconBoth"],
    [NodeType.NodeBlockQueryEmbed, "#iconSQL"],
]);
export const SubType2IconID = new Map<BlockSubType, string>([
    [BlockSubType.h1, "#iconH1"],
    [BlockSubType.h2, "#iconH2"],
    [BlockSubType.h3, "#iconH3"],
    [BlockSubType.h4, "#iconH4"],
    [BlockSubType.h5, "#iconH5"],
    [BlockSubType.h6, "#iconH6"],

    [BlockSubType.u, "#iconList"],
    [BlockSubType.o, "#iconOrderedList"],
    [BlockSubType.t, "#iconCheck"],

    [BlockSubType.none, ""],
]);

export interface IBlockStore extends IBaseStore {
    changable: Writable<ComponentProps<EditorIframe>["changable"]>; // 编辑器是否可更改
    fullscreen: Writable<ComponentProps<Tab>["fullscreen"]>; // 是否全屏显示
}

export interface IBlockBreadcrumbOptions extends IBaseBreadcrumbOptions {
    id: BlockID; // 块 ID
    stores?: IBlockStore; // 响应式数据
}

export class BlockBreadcrumb extends Breadcrumb {
    public async makeBreadcrumb(options: IBlockBreadcrumbOptions): Promise<IBreadcrumb> {
        const { id } = options;
        const breadcrumb: IBreadcrumb = {
            breadcrumb: true,
            breadcrumbItems: [],
            breadcrumbIcons: [],
        };

        /* 获取块信息 */
        const [
            response_getBlockInfo,
            response_getBlockBreadcrumb,
        ] = await Promise.all([
            this.client.getBlockInfo({ id }),
            this.client.getBlockBreadcrumb({ id }),
        ]);

        response_getBlockBreadcrumb.data.forEach(item => {
            switch (item.type) {
                case NodeType.NodeDocument: {
                    const paths = getDocPaths(
                        response_getBlockInfo.data.box,
                        response_getBlockInfo.data.path,
                        item.name,
                    );
                    const notebook = paths.shift();
                    breadcrumb.breadcrumbItems.push({
                        type: "item",
                        icon: NodeType2IconID.get(NodeType.NodeNotebook),
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
                            icon: NodeType2IconID.get(NodeType.NodeDocument),
                            text: doc.hpath,
                            textTitle: doc.hpath,
                            textEllipsis: true,
                        });
                    });

                    /* 当前文档对应的面包屑显示为激活状态 */
                    Breadcrumb.setLastBreadcrumbItemActive(breadcrumb);
                    break;
                }
                default: {
                    breadcrumb.breadcrumbItems.push({
                        type: "arrow",
                        icon: "#iconRight",
                    }, {
                        type: "item",
                        itemId: item.id,
                        iconId: item.id,
                        icon: NodeType2IconID.get(item.type as NodeType),
                        text: item.name,
                        textTitle: item.name,
                        textEllipsis: true,
                    });
                    break;
                }
            }
        });
        /* 面包屑最后一项非 id 对应的块, 说明面包屑未导航到当前块 */
        if (id !== response_getBlockBreadcrumb.data.at(-1).id) {
            const response_getDoc = await this.client.getDoc({
                id,
                mode: 0,
                size: Number.MAX_SAFE_INTEGER,
            });

            breadcrumb.breadcrumbItems.push({
                type: "arrow",
                icon: "#iconRight",
            }, {
                type: "item",
                itemId: id,
                iconId: id,
                icon: NodeType2IconID.get(response_getDoc.data.type as NodeType),
            });
        }

        /* 当前块对应的面包屑显示为激活状态 */
        Breadcrumb.setLastBreadcrumbItemActive(breadcrumb);

        if (options.stores) {
            /* 实时更新 */
            breadcrumb.breadcrumbIcons.push({
                icon: "#iconRefresh",
                type: "refresh",
                ariaLabel: this.i18n.button.realTime.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick(_e, _element, props) {
                    const changable = get(props.active);
                    options.stores.changable.set(!changable);
                    props.active.set(!changable);
                },
            });

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
