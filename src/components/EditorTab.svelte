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
    import { onDestroy, type ComponentProps, type ComponentEvents } from "svelte";
    import { Facade, type IFacadeOptions, type ITabOptions } from "@/facades/facade";
    import { writable, type Unsubscriber } from "svelte/store";

    import Tab from "@workspace/components/siyuan/tab/Tab.svelte";
    import EditorIframe from "./EditorIframe.svelte";

    export let plugin: ComponentProps<EditorIframe>["plugin"]; // 插件对象
    export let options: ComponentProps<EditorIframe>["options"]; // 编辑器参数
    export let facadeOptions: IFacadeOptions; // 门面参数
    
    let diff: ComponentProps<EditorIframe>["diff"];
    let savable: ComponentProps<EditorIframe>["savable"];
    let changable: ComponentProps<EditorIframe>["changable"];

    let original: ComponentProps<EditorIframe>["original"];
    let originalOptions: ComponentProps<EditorIframe>["originalOptions"];
    let modified: ComponentProps<EditorIframe>["modified"];
    let modifiedOptions: ComponentProps<EditorIframe>["modifiedOptions"];

    let fullscreen: ComponentProps<Tab>["fullscreen"] = false; // 是否为全屏模式

    let breadcrumb: ComponentProps<Tab>["breadcrumb"] = false; // 是否显示面包屑
    let breadcrumbItems: ComponentProps<Tab>["breadcrumbItems"] = []; // 面包屑项
    let breadcrumbIcons: ComponentProps<Tab>["breadcrumbIcons"] = []; // 面包屑按钮

    let tabOptions: ITabOptions;
    let inited: boolean = false;

    /* 响应式数据 */
    const stores = {
        changable: writable(changable),
        fullscreen: writable(fullscreen),
    };
    $: stores.changable.set(changable);
    $: stores.fullscreen.set(fullscreen);
    const unsubscribes: Unsubscriber[] = [
        stores.changable.subscribe(v => (changable = v)), //
        stores.fullscreen.subscribe(v => (fullscreen = v)), //
    ];
    onDestroy(() => {
        unsubscribes.forEach(unsubscribe => unsubscribe());
    });

    /* 门店 */
    const facade = new Facade(plugin);
    $: facade.makeTabOptions(facadeOptions, stores).then(o => (tabOptions = o));
    $: {
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
    }
    $: inited = (diff !== undefined);

    /* 保存内容 */
    function update(e: ComponentEvents<EditorIframe>["save"] | ComponentEvents<EditorIframe>["changed"]) {
        tabOptions?.handler?.update?.(e.detail.value);
    }

    /* 悬浮事件 */
    function hover(e: ComponentEvents<EditorIframe>["hover"]) {
        /* 悬浮显示思源块 */
        plugin.openFloatLayer(e.detail);
    }

    /* 打开链接事件 */
    function open(e: ComponentEvents<EditorIframe>["open"]) {
        /* 在新页签打开思源块 */
        plugin.openDocTab(e.detail);
    }
</script>

<Tab
    {fullscreen}
    {breadcrumb}
    {breadcrumbItems}
    {breadcrumbIcons}
>
    <div
        slot="content"
        class="fn__flex fn__flex-1"
    >
        {#if inited}
            <EditorIframe
                on:save={update}
                on:changed={update}
                on:hover={hover}
                on:open={open}
                {plugin}
                {diff}
                {savable}
                {changable}
                {options}
                {original}
                {modified}
                {originalOptions}
                {modifiedOptions}
            />
        {/if}
    </div>
</Tab>
