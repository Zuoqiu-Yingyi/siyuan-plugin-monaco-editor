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

import type { IBlockMenuContext } from "@workspace/utils/siyuan/menu/block";

import {
    TaskType,
} from "./enums";
import CustomBlockPlugin from "@/index";
import type { IFeature } from "@/types/config";

/* 分离 token */
function splitToken(token: string): string[] { 
    return token.trim().split(/\s+/); // 以空白字符分割
}

/* 插入 token */
function insertToken(tokens: string[], token: string): string[] { 
    if (tokens.includes(token)) return tokens; // 如果已经存在该 token, 则不做任何操作
    else return [...tokens, token]; // 否则插入该 token
}

/* 移除 token */
function removeToken(tokens: string[], token: string): string[] { 
    return tokens.filter(t => t !== token); // 删除该 token
}

/* 切换 token */
function toggleToken(tokens: string[], token: string): string[] { 
    if (tokens.includes(token)) return removeToken(tokens, token); // 如果已经存在该 token, 则删除该 token
    else return insertToken(tokens, token); // 否则插入该 token
}

/* 替换 token */
function replaceToken(tokens: string[], token: string, newToken: string): string[] {
    return tokens.map(t => t === token ? newToken : t); // 将所有 token 中的 token 替换为 newToken
}


export default {
    /* 编辑属性 */
    [TaskType.edit]: async (plugin, feature, context, params: { name: string, element: HTMLElement }) => {
        params.element.innerHTML = ""; // 删除所有下级节点

        /* 挂载一个 svelte 菜单项组件 */
        const item = new Item({
            target: params.element,
            props: {
                input: true,
                disabled: !feature.enable,
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
    /* 更新块属性 */
    [TaskType.update]: async (plugin, _feature, context, params: { name: string, value: string }) => {
        context.blocks.forEach(async block => {
            plugin.client.setBlockAttrs({
                id: block.id,
                attrs: {
                    [params.name]: params.value,
                },
            });
        });
    },
    /* 删除块属性 */
    [TaskType.delete]: async (plugin, _feature, context, params: { name: string }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            if (attrs.hasOwnProperty(params.name)) {
                /* 如果属性已存在, 则删除属性值 */
                plugin.client.setBlockAttrs({
                    id: block.id,
                    attrs: {
                        [params.name]: null,
                    },
                });
            }
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
    /* 插入某个 token */
    [TaskType.insert]: async (plugin, _feature, context, params: { name: string, token: string }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            let value: string;
            if (attrs.hasOwnProperty(params.name)) {
                /* 属性存在 */
                const tokens = splitToken(attrs[params.name]);
                value = insertToken(tokens, params.token).join(" ");
            }
            else {
                /* 属性不存在, 直接更新该属性 */
                value = params.token;
            }
            plugin.client.setBlockAttrs({
                id: block.id,
                attrs: {
                    [params.name]: value,
                },
            });
        });
    },
    /* 移除某个 token */
    [TaskType.remove]: async (plugin, _feature, context, params: { name: string, token: string }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            let value: string;
            if (attrs.hasOwnProperty(params.name)) {
                /* 属性存在 */
                const tokens = splitToken(attrs[params.name]);
                value = removeToken(tokens, params.token).join(" ");
                plugin.client.setBlockAttrs({
                    id: block.id,
                    attrs: {
                        [params.name]: value,
                    },
                });
            }
        });
    },
    /* 增删某个 token */
    [TaskType.toggle]: async (plugin, _feature, context, params: { name: string, token: string }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            let value: string;
            if (attrs.hasOwnProperty(params.name)) {
                /* 属性存在 */
                const tokens = splitToken(attrs[params.name]);
                value = toggleToken(tokens, params.token).join(" ");
            }
            else {
                /* 属性不存在, 直接更新该属性 */
                value = params.token;
            }
            plugin.client.setBlockAttrs({
                id: block.id,
                attrs: {
                    [params.name]: value,
                },
            });
        });
    },
    /* 替换某个 token */
    [TaskType.replace]: async (plugin, _feature, context, params: { name: string, token: string, newToken: string }) => {
        context.blocks.forEach(async block => {
            const response = await plugin.client.getBlockAttrs({ id: block.id });
            const attrs = response.data;
            let value: string;
            if (attrs.hasOwnProperty(params.name)) {
                /* 属性存在 */
                const tokens = splitToken(attrs[params.name]);
                value = replaceToken(tokens, params.token, params.newToken).join(" ");
                plugin.client.setBlockAttrs({
                    id: block.id,
                    attrs: {
                        [params.name]: value,
                    },
                });
            }
        });
    },
    /* 全屏/取消全屏 */
    [TaskType.fullscreen]: async (_plugin, _feature, context, _params: unknown) => {
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
