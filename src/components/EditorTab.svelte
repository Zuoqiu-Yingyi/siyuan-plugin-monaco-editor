<!--
 Copyright (C) 2023 Zuoqiu Yingyi

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<script lang="ts">
    import {
        onDestroy,

    } from "svelte";
    import {
        writable,

    } from "svelte/store";

    import Tab from "@workspace/components/siyuan/tab/Tab.svelte";

    import {
        Facade,

    } from "@/facades/facade";

    import EditorIframe from "./EditorIframe.svelte";

    import type { ComponentProps } from "svelte";
    import type { Unsubscriber } from "svelte/store";

    import type { IFacadeOptions, ITabOptions } from "@/facades/facade";
    import type { IEditorEvents } from "@/types/editor";

    import type { IProps as IEditorIframeProps } from "./EditorIframe.svelte";

    interface IProps {
        plugin: IEditorIframeProps["plugin"]; // 插件对象
        options: IEditorIframeProps["options"]; // 编辑器参数
        facadeOptions: IFacadeOptions; // 门面参数
    }

    const {
        plugin,
        options,
        facadeOptions,
    }: IProps = $props();

    let diff: IEditorIframeProps["diff"] = $state();
    let savable: IEditorIframeProps["savable"] = $state();
    let changeable: IEditorIframeProps["changeable"] = $state();

    let original: IEditorIframeProps["original"] = $state();
    let originalOptions: IEditorIframeProps["originalOptions"] = $state();
    let modified: IEditorIframeProps["modified"] = $state();
    let modifiedOptions: IEditorIframeProps["modifiedOptions"] = $state();

    let fullscreen: ComponentProps<Tab>["fullscreen"] = $state(false); // 是否为全屏模式

    let breadcrumb: ComponentProps<Tab>["breadcrumb"] = $state(false); // 是否显示面包屑
    let breadcrumbItems: ComponentProps<Tab>["breadcrumbItems"] = $state([]); // 面包屑项
    let breadcrumbIcons: ComponentProps<Tab>["breadcrumbIcons"] = $state([]); // 面包屑按钮

    let tabOptions: ITabOptions | undefined = $state();
    // eslint-disable-next-line prefer-const
    let inited: boolean = $derived(diff !== undefined);

    /* 响应式数据 */
    const stores = {
        changeable: writable(false),
        fullscreen: writable(false),
    };

    $effect(() => {
        stores.changeable.set(changeable!);
    });
    $effect(() => {
        stores.fullscreen.set(fullscreen!);
    });

    const unsubscribes: Unsubscriber[] = [
        stores.changeable.subscribe((v) => (changeable = v)), //
        stores.fullscreen.subscribe((v) => (fullscreen = v)), //
    ];
    onDestroy(() => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
    });

    /* 门店 */
    const facade = new Facade(plugin);
    $effect(() => {
        facade.makeTabOptions(facadeOptions, stores).then((o) => (tabOptions = o));
    });
    $effect(() => {
        if (tabOptions) {
            diff = !!tabOptions.handler.original;
            savable = !!tabOptions.handler.update;

            original = tabOptions.handler.original;
            originalOptions = tabOptions.handler.options;

            modified = tabOptions.handler.modified;
            modifiedOptions = tabOptions.handler.options;

            breadcrumb = tabOptions.breadcrumb.breadcrumb;
            breadcrumbItems = tabOptions.breadcrumb.breadcrumbItems;
            breadcrumbIcons = tabOptions.breadcrumb.breadcrumbIcons;
        }
    });

    /* 保存内容 */
    function update(params: IEditorEvents["changed"] | IEditorEvents["save"]) {
        tabOptions?.handler?.update?.(params.value);
    }

    /* 悬浮事件 */
    function hover(params: IEditorEvents["hover"]) {
        /* 悬浮显示思源块 */
        plugin.openFloatLayer(params);
    }

    /* 打开链接事件 */
    function open(params: IEditorEvents["open"]) {
        /* 在新页签打开思源块 */
        plugin.openDocTab(params);
    }
</script>

<Tab
    {breadcrumb}
    {breadcrumbIcons}
    {breadcrumbItems}
    {fullscreen}
>
    <div
        slot="content"
        class="fn__flex fn__flex-1"
    >
        {#if inited}
            <EditorIframe
                {changeable}
                {diff}
                {modified}
                {modifiedOptions}
                onChanged={update}
                onHover={hover}
                onOpen={open}
                onSave={update}
                {options}
                {original}
                {originalOptions}
                {plugin}
                {savable}
            />
        {/if}
    </div>
</Tab>
