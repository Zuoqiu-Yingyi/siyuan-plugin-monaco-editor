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

export interface IInboxStore extends IBaseStore {
    fullscreen: Writable<ComponentProps<Tab>["fullscreen"]>; // 是否全屏显示
}

export interface IInboxBreadcrumbOptions extends IBaseBreadcrumbOptions {
    id: string; // 收集箱 ID
}

export class InboxBreadcrumb extends Breadcrumb {
    public async makeBreadcrumb(options: IInboxBreadcrumbOptions): Promise<IBreadcrumb> {
        const breadcrumb: IBreadcrumb = {
            breadcrumb: true,
            breadcrumbItems: [],
            breadcrumbIcons: [],
        };

        /* 获取对应的收集箱信息 */
        const response = await this.client.getShorthand({
            id: options.id,
        });

        /* 代码片段引用路径 */
        breadcrumb.breadcrumbItems.push({
            type: "item",
            icon: "#icon-monaco-editor-time",
            text: response.data.hCreated,
            textTitle: response.data.shorthandURL,
            textEllipsis: false,
        }, {
            type: "arrow",
            icon: "#iconRight",
        }, {
            type: "item",
            icon: "#iconHeadings",
            text: response.data.shorthandTitle,
            textTitle: response.data.shorthandDesc,
            textEllipsis: false,
        });

        /* 当前收集箱项对应的面包屑显示为激活状态 */
        Breadcrumb.setLastBreadcrumbItemActive(breadcrumb);

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
