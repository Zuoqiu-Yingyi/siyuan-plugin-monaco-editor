// Copyright (C) 2023 Zuoqiu Yingyi
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as sdk from "@siyuan-community/siyuan-sdk";
import { get } from "svelte/store";

import { TooltipsDirection } from "@workspace/components/siyuan/misc/tooltips";
import { getDocPaths } from "@workspace/utils/siyuan/breadcrumb";

import {
    Breadcrumb,

} from "./breadcrumb";

import type { ComponentProps } from "svelte";
import type { Writable } from "svelte/store";

import type Tab from "@workspace/components/siyuan/tab/Tab.svelte";
import type { BlockID } from "@workspace/types/siyuan";

import type { IBaseBreadcrumbOptions, IBaseStore, IBreadcrumb } from "./breadcrumb";

import type { IProps as IEditorIframeProps } from "@/components/EditorIframe.svelte";

/* 建立从节点类型到 svg 图标引用 ID 的映射 */
export const NodeType2IconID = new Map<sdk.siyuan.NodeType, string>([
    [sdk.siyuan.NodeType.NodeNotebook, "#iconFilesRoot"],
    [sdk.siyuan.NodeType.NodeFolder, "#iconFolder"],

    [sdk.siyuan.NodeType.NodeDocument, "#iconFile"],
    [sdk.siyuan.NodeType.NodeSuperBlock, "#iconSuper"],
    [sdk.siyuan.NodeType.NodeBlockquote, "#iconQuote"],
    [sdk.siyuan.NodeType.NodeList, "#iconList"],
    [sdk.siyuan.NodeType.NodeListItem, "#iconListItem"],

    [sdk.siyuan.NodeType.NodeHeading, "#iconHeadings"],
    [sdk.siyuan.NodeType.NodeParagraph, "#iconParagraph"],
    [sdk.siyuan.NodeType.NodeMathBlock, "#iconMath"],
    [sdk.siyuan.NodeType.NodeTable, "#iconTable"],
    [sdk.siyuan.NodeType.NodeCodeBlock, "#iconCode"],
    [sdk.siyuan.NodeType.NodeHTMLBlock, "#iconHTML5"],
    [sdk.siyuan.NodeType.NodeThematicBreak, "#iconLine"],
    [sdk.siyuan.NodeType.NodeAudio, "#iconRecord"],
    [sdk.siyuan.NodeType.NodeVideo, "#iconVideo"],
    [sdk.siyuan.NodeType.NodeIFrame, "#iconLanguage"],
    [sdk.siyuan.NodeType.NodeWidget, "#iconBoth"],
    [sdk.siyuan.NodeType.NodeBlockQueryEmbed, "#iconSQL"],
]);
export const SubType2IconID = new Map<sdk.siyuan.BlockSubType, string>([
    [sdk.siyuan.BlockSubType.h1, "#iconH1"],
    [sdk.siyuan.BlockSubType.h2, "#iconH2"],
    [sdk.siyuan.BlockSubType.h3, "#iconH3"],
    [sdk.siyuan.BlockSubType.h4, "#iconH4"],
    [sdk.siyuan.BlockSubType.h5, "#iconH5"],
    [sdk.siyuan.BlockSubType.h6, "#iconH6"],

    [sdk.siyuan.BlockSubType.u, "#iconList"],
    [sdk.siyuan.BlockSubType.o, "#iconOrderedList"],
    [sdk.siyuan.BlockSubType.t, "#iconCheck"],

    [sdk.siyuan.BlockSubType.none, ""],
]);

export interface IBlockStore extends IBaseStore {
    changeable: Writable<IEditorIframeProps["changeable"]>; // 编辑器是否可更改
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

        response_getBlockBreadcrumb.data.forEach((item) => {
            switch (item.type) {
                case sdk.siyuan.NodeType.NodeDocument: {
                    const paths = getDocPaths(
                        response_getBlockInfo.data.box,
                        response_getBlockInfo.data.path,
                        item.name,
                    );
                    const notebook = paths.shift()!;
                    breadcrumb.breadcrumbItems.push({
                        type: "item",
                        icon: NodeType2IconID.get(sdk.siyuan.NodeType.NodeNotebook),
                        text: notebook.hpath,
                        textTitle: notebook.hpath,
                        textEllipsis: true,
                    });

                    paths.forEach((doc) => {
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
                        icon: NodeType2IconID.get(item.type as sdk.siyuan.NodeType),
                        text: item.name,
                        textTitle: item.name,
                        textEllipsis: true,
                    });
                    break;
                }
            }
        });
        /* 面包屑最后一项非 id 对应的块, 说明面包屑未导航到当前块 */
        if (id !== response_getBlockBreadcrumb.data.at(-1)?.id) {
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
                icon: NodeType2IconID.get(response_getDoc.data.type as sdk.siyuan.NodeType),
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
                    const changeable = get(props.active!);
                    options.stores!.changeable.set(!changeable);
                    props.active!.set(!changeable);
                },
            });

            /* 全屏 */
            breadcrumb.breadcrumbIcons.push({
                icon: "#iconFullscreen",
                type: "fullscreen",
                ariaLabel: this.i18n.button.fullscreen.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick(_e, _element, props) {
                    const fullscreen = get(props.active!);
                    options.stores!.fullscreen.set(!fullscreen);
                    props.active!.set(!fullscreen);
                },
            });

            // TODO: 在新窗口打开
        }
        return breadcrumb;
    }
}
