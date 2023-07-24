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

import type siyuan from "siyuan";
import Prompt from "./Prompt.svelte";

export type PromptCallback<T> = (
    value: string,
    dialog: InstanceType<typeof siyuan.Dialog>,
    component: InstanceType<typeof Prompt>,
) => T | Promise<T>;

export interface IPromptOptions {
    title: string; // 标题
    text: string; // 说明文本
    value?: string; // 输入框默认文本
    placeholder?: string; // 输入框空白提示文本
    tips?: string; // 提示文本
    width?: string; // 宽度
    height?: string; // 高度
    input?: PromptCallback<string>; // 返回更新的提示文本
    change?: PromptCallback<string>; // 返回更新的提示文本
    confirm?: PromptCallback<boolean>; // 返回是否关闭
    cancel?: PromptCallback<boolean>; // 返回是否关闭
}

export interface IPromptReturn {
    id: string; // 对话框元素 ID
    dialog: InstanceType<typeof siyuan.Dialog>; // 对话框实例
    component: InstanceType<typeof Prompt>; // 组件实例
}

/* 打开提示输入框 */
export function prompt(Dialog: typeof siyuan.Dialog, options: IPromptOptions): IPromptReturn {
    const id = `dialog-prompt-${Date.now()}`;

    const dialog = new Dialog({
        title: options.title,
        content: `<div id="${id}" class="fn__flex-column" />`,
        width: options.width || undefined,
        height: options.height || undefined,
        destroyCallback: () => component?.$destroy(),
    });

    const component = new Prompt({
        target: dialog.element.querySelector(`#${id}`),
        props: {
            text: options.text,
            value: options.value,
            placeholder: options.placeholder,
            tips: options.tips,
        },
    });

    component.$on("input", async e => {
        if (options.input) {
            const tips = await options.input(
                e.detail.value,
                dialog,
                component,
            );
            component.$set({ tips });
        }
    });
    component.$on("change", async e => {
        if (options.change) {
            const tips = await options.change(
                e.detail.value,
                dialog,
                component,
            );
            component.$set({ tips });
        }
    });
    component.$on("confirm", async e => {
        const close = options.confirm
            ? await options.confirm(
                e.detail.value,
                dialog,
                component,
            )
            : true;
        if (close) {
            dialog.destroy();
        }
    });
    component.$on("cancel", async e => {
        const close = options.cancel
            ? await options.cancel(
                e.detail.value,
                dialog,
                component,
            )
            : true;
        if (close) {
            dialog.destroy();
        }
    });

    return {
        id,
        dialog,
        component,
    };
}
