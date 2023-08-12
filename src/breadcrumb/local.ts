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
import { uri2path } from "@workspace/utils/misc/url";

export interface ILocalStore extends IBaseStore {
    fullscreen: Writable<ComponentProps<Tab>["fullscreen"]>; // 是否全屏显示
}

export interface ILocalBreadcrumbOptions extends IBaseBreadcrumbOptions {
    uri: string; // 资源路径
    stores?: ILocalStore; // 响应式数据
}

export class LocalBreadcrumb extends Breadcrumb {
    public async makeBreadcrumb(options: ILocalBreadcrumbOptions): Promise<IBreadcrumb> {
        const { uri } = options;
        const breadcrumb: IBreadcrumb = {
            breadcrumb: true,
            breadcrumbItems: [],
            breadcrumbIcons: [],
        };

        const paths: string[] = ["file://"];
        const path = uri2path(uri);
        breadcrumb.breadcrumbItems.push({
            type: "item",
            text: "file://",
            textTitle: paths.join("/"),
            textEllipsis: false,
        });
        path.split("/").forEach(p => {
            paths.push(p);
            breadcrumb.breadcrumbItems.push({
                type: "arrow",
                icon: "#icon-monaco-editor-slash",
            }, {
                type: "item",
                text: p,
                textTitle: paths.join("/"),
                textEllipsis: false,
            });
        });

        /* 当前文件对应的面包屑显示为激活状态 */
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
