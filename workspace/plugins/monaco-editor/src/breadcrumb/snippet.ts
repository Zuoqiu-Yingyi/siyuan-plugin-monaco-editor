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
import { baseURL } from "@workspace/utils/env/front-end";

export interface ISnippetStore extends IBaseStore {
    fullscreen: Writable<ComponentProps<Tab>["fullscreen"]>; // 是否全屏显示
}

export interface ISnippetBreadcrumbOptions extends IBaseBreadcrumbOptions {
    id: string; // 代码片段 ID
}

export class SnippetBreadcrumb extends Breadcrumb {
    public async makeBreadcrumb(options: ISnippetBreadcrumbOptions): Promise<IBreadcrumb> {
        const breadcrumb: IBreadcrumb = {
            breadcrumb: true,
            breadcrumbItems: [],
            breadcrumbIcons: [],
        };

        /* 获取所有代码片段 */
        const response = await this.client.getSnippet({
            type: "all",
            enabled: 2,
        });

        /* 查询 ID 对应的代码片段 */
        const snippets = response.data.snippets; const snippet = snippets.find((snippet) => snippet.id === options.id);
        if (snippet) { // 若查询到对应的片段
            /* 代码片段引用路径 */
            breadcrumb.breadcrumbItems.push({
                type: "item",
                icon: "#iconCode",
                text: "snippets",
                textTitle: `${baseURL}snippets`,
                textEllipsis: false,
            }, {
                type: "arrow",
                icon: "#icon-monaco-editor-slash",
            }, {
                type: "item",
                text: `${snippet.name}.${snippet.type}`,
                textTitle: `${baseURL}snippets/${snippet.name}.${snippet.type}`,
                textEllipsis: false,
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
        else {
            throw new Error(`Can't find snippet with id: ${options.id}`);
        }
    }
}
