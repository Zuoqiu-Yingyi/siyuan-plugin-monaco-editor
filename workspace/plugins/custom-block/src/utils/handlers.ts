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

import Item from "@workspace/components/siyuan/menu/Item.svelte"
import { Iterator } from "@workspace/utils/misc/iterator";

import type { IBlockMenuContext } from "@workspace/utils/siyuan/menu/block";

import {
    TaskType,
} from "./enums";
import CustomBlockPlugin from "@/index";
import type { IFeature } from "@/types/config";

export default {
    /* 编辑属性 */
    [TaskType.edit]: async (plugin, feature, context, params: { name: string, element: HTMLElement }) => {
        params.element.innerHTML = ""; // 删除所有下级节点

        /* 挂载一个 svelte 菜单项组件 */
        const item = new Item({
            target: params.element,
            props: {
                input: true,
                icon: feature.icon,
                label: plugin.i18n.menu[feature.id].label,
                accelerator: params.name,
            },
        });

        /* 异步获取该块的 style 属性 */
        const response = await plugin.client.getBlockAttrs({
            id: context.id,
        });

        /* 设置该块的 style 属性 */
        item.$set({
            value: response.data[params.name] || "",
        });

        /* 每当 input 中值变化时, 更新该块的 style 属性 */
        item.$on("changed", e => {
            plugin.client.setBlockAttrs({
                id: context.id,
                attrs: {
                    [params.name]: e.detail.value,
                },
            });
        });
    },
    /* 切换块属性 */
    [TaskType.switch]: async (plugin, _feature, context, params: { name: string, values: (string | null)[] }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            let value: string;
            if (attrs.hasOwnProperty(params.name)) {
                /* 如果属性已存在, 则切换属性值 */
                const index = params.values.findIndex(value => value === attrs[params.name]);
                value = params.values[(index + 1) % params.values.length];
            }
            else {
                /* 属性不存在, 直接更新该属性 */
                value = params.values[0];
            }
            plugin.client.setBlockAttrs({
                id: block.id,
                attrs: {
                    [params.name]: value,
                },
            });
        });
    },
    /* 增删某个 token */
    [TaskType.toggle]: async (plugin, feature, context, params: { name: string, token: string }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            if (attrs.hasOwnProperty(params.name)) {
                /* 属性存在 */
                const tokens = attrs[params.name].trim().split(/\s+/);
                if (tokens.some(token => token === params.token)) {
                    /* token 存在, 删除该 token 后更新属性 */
                    plugin.client.setBlockAttrs({
                        id: block.id,
                        attrs: {
                            [params.name]: tokens.filter(token => token !== params.token).join(" "),
                        },
                    });
                    return;
                }
                else {
                    /* token 不存在, 添加该 token 后更新属性 */
                    plugin.client.setBlockAttrs({
                        id: block.id,
                        attrs: {
                            [params.name]: tokens.concat(params.token).join(" "),
                        },
                    });
                }
            }
            else {
                /* 属性不存在, 直接更新该属性 */
                plugin.client.setBlockAttrs({
                    id: block.id,
                    attrs: {
                        [params.name]: params.token,
                    },
                });
            }
        });
    },
    /* 全屏/取消全屏 */
    [TaskType.fullscreen]: async (plugin, _feature, context, _params: any) => {
        if (context.isDocumentBlock) {
            /* 文档块 */
            context.element.parentElement.parentElement.classList.toggle('fullscreen');
        }
        else {
            /* 非文档块 */
            let element;
            switch (context.element.dataset.type) {
                case 'NodeVideo':
                    element = context.element.querySelector('video');
                    break;
                case 'NodeIFrame':
                case 'NodeWidget':
                    element = context.element.querySelector('iframe');
                    break;
                case 'NodeHTMLBlock':
                    element = context.element.querySelector('protyle-html');
                    break;
                default:
                    element = context.element;
                    break;
            }
            element.requestFullscreen();
        }
    },
} as Record<TaskType, (
    plugin: InstanceType<typeof CustomBlockPlugin>, // 插件对象
    feature: IFeature, // 菜单功能定义
    context: IBlockMenuContext, // 块菜单上下文
    params: any, // 任务参数
    ...args: any[] // 其他参数
) => any>;
