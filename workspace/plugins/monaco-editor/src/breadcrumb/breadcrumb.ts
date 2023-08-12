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

import MonacoEditorPlugin from "@/index";

import type { ComponentProps } from "svelte";
import type { Writable } from "svelte/store";

import type Tab from "@workspace/components/siyuan/tab/Tab.svelte";

type Plugin = InstanceType<typeof MonacoEditorPlugin>;

export interface IBaseStore {
    [key: string]: Writable<any>;
}

export interface IBaseBreadcrumbOptions {
    stores?: IBaseStore; // 响应式数据
}

export interface IBreadcrumb {
    breadcrumb: ComponentProps<Tab>["breadcrumb"]; // 是否显示面包屑
    breadcrumbItems: ComponentProps<Tab>["breadcrumbItems"]; // 面包屑项
    breadcrumbIcons: ComponentProps<Tab>["breadcrumbIcons"]; // 面包屑按钮
}

export abstract class Breadcrumb {
    /**
     * 设置面包屑中最后一项的状态为激活
     * @param breadcrumb 面包屑
     * @param index 面包屑项索引
     * @returns 是否成功设置
     */
    public static setLastBreadcrumbItemActive(
        breadcrumb: IBreadcrumb,
        index: number = -1,
    ): boolean {
        const item = breadcrumb.breadcrumbItems.at(index);
        if (item && item.type === "item") {
            item.active = true;
            return true;
        }
        return false;
    }


    public readonly client: Plugin["client"];
    public readonly logger: Plugin["logger"];
    public readonly i18n: Plugin["i18n"];

    constructor(
        public readonly plugin: Plugin,
    ) {
        this.client = this.plugin.client;
        this.logger = this.plugin.logger;
        this.i18n = this.plugin.i18n;
    }

    /* 生成面包屑 */
    public abstract makeBreadcrumb(options: IBaseBreadcrumbOptions): Promise<IBreadcrumb>;
}
