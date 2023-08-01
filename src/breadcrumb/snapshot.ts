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

export interface ISnapshotStore extends IBaseStore {
    fullscreen: Writable<ComponentProps<Tab>["fullscreen"]>; // 是否全屏显示
}

export interface ISnapshotBreadcrumbOptions extends IBaseBreadcrumbOptions {
    name: string; // 快照内容名称
    old: string; // 较早版本的快照对象 ID
    new: string; // 较晚版本的快照对象 ID
}

export class SnapshotBreadcrumb extends Breadcrumb {
    public async makeBreadcrumb(options: ISnapshotBreadcrumbOptions): Promise<IBreadcrumb> {
        const breadcrumb: IBreadcrumb = {
            breadcrumb: true,
            breadcrumbItems: [
                {
                    type: "item",
                    icon: "#iconHistory",
                    text: options.old,
                    textTitle: options.name,
                    textEllipsis: false,
                },
                {
                    type: "arrow",
                    icon: "#icon-monaco-editor-slash",
                },
                {
                    type: "item",
                    icon: "#iconHistory",
                    text: options.new,
                    textTitle: options.name,
                    textEllipsis: false,
                },
            ],
            breadcrumbIcons: [],
        };

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
