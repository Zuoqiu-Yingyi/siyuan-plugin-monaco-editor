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

import siyuan from "siyuan";

import { Client } from "@siyuan-community/siyuan-sdk";

import Item from "@workspace/components/siyuan/menu/Item.svelte"

import { Logger } from "@workspace/utils/logger";
import { merge } from "@workspace/utils/misc/merge";
import {
    getBlockMenuContext,
    type BlockMenuDetail,
} from "@workspace/utils/siyuan/menu/block";

import { DEFAULT_CONFIG } from "./configs/default";
import type { IConfig } from "./types/config";

export default class CustomBlockPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;

    protected readonly STYLE_ELEMENT_ID: string;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly SYSTEM_FONTS_DIALOG_ID: string;
    protected readonly USABLE_FONTS_DIALOG_ID: string;

    protected config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client();
        this.SETTINGS_DIALOG_ID = `plugin-${this.name}-settings-dialog`;
    }

    onload(): void {
        this.loadData(CustomBlockPlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = merge(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(() => {
                /* 开始监听块菜单事件 */
                this.eventBus.on("click-blockicon", this.blockMenuEventListener);
                this.eventBus.on("click-editortitleicon", this.blockMenuEventListener);
            });
    }

    onLayoutReady(): void {
    }

    onunload(): void {
        /* 停止监听块菜单事件 */
        this.eventBus.off("click-blockicon", this.blockMenuEventListener);
        this.eventBus.off("click-editortitleicon", this.blockMenuEventListener);
    }

    openSetting(): void {
    }

    /* 添加块菜单项 */
    protected readonly blockMenuEventListener = (e: CustomEvent<BlockMenuDetail>) => {
        // this.logger.debug(e);
        const detail = e.detail; // 获取菜单信息
        const context = getBlockMenuContext(detail); // 获取块菜单上下文

        if (context) {
            const submenu: siyuan.IMenuItemOption[] = []; // 子菜单

            if (!context.isDocumentBlock // 不是文档块
                && !context.isMultiBlock // 不是多个块
            ) {
                /* 添加一个输入框以设置块的 style 属性 */
                submenu.push({
                    element: globalThis.document.createElement("div"), // 避免生成其他内容
                    bind: (element) => {
                        element.innerHTML = ""; // 删除所有下级节点

                        /* 挂载一个 svelte 菜单项组件 */
                        const item = new Item({
                            target: element,
                            props: {
                                input: true,
                                icon: "#iconTheme",
                                label: this.i18n.menu.style.label,
                                accelerator: "style",
                            },
                        });

                        /* 异步获取该块的 style 属性 */
                        this.client.getBlockAttrs({
                            id: context.id,
                        }).then(response => {
                            /* 设置该块的 style 属性 */
                            item.$set({
                                value: response.data.style || "",
                            });

                            /* 每当 input 中值变化时, 更新该块的 style 属性 */
                            item.$on("changed", e => {
                                this.client.setBlockAttrs({
                                    id: context.id,
                                    attrs: {
                                        style: e.detail.value,
                                    },
                                });
                            });
                        });
                    },
                });
            }

            detail.menu.addItem({
                icon: "iconTheme",
                label: this.i18n.displayName,
                submenu,
            });
        }
    }

    /* 重置插件配置 */
    public async resetConfig(): Promise<void> {
        return this.updateConfig(merge(DEFAULT_CONFIG) as IConfig);
    }

    /* 更新插件配置 */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== this.config) {
            this.config = config;
        }
        return this.saveData(CustomBlockPlugin.GLOBAL_CONFIG_NAME, this.config);
    }
};
