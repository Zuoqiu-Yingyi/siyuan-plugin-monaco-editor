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
    import { AssetBreadcrumb } from "@/breadcrumb/asset";
    import Tab from "@workspace/components/siyuan/tab/Tab.svelte";
    import type MonacoEditorPlugin from "@/index";
    import { writable } from "svelte/store";
    import type { IBreadcrumb } from "@/breadcrumb/breadcrumb";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
    export let pathname: string; // iframe 资源路径
    export let title: string; // iframe 标题路径

    /* 响应式数据 */
    const fullscreen = writable(false);
    const stores = {
        fullscreen,
    };

    /* 面包屑构造 */
    const breadcrumb_maker = new AssetBreadcrumb(plugin);
    let breadcrumbOptions: IBreadcrumb;
    $: breadcrumb_maker.makeBreadcrumb({
        stores,
        pathname,
    }).then(items => (breadcrumbOptions = items));
</script>

<Tab
    fullscreen={$fullscreen}
    {...breadcrumbOptions}
>
    <iframe
        src={pathname}
        {title}
        slot="content"
        class="fn__flex fn__flex-1 preview"
    />
</Tab>

<style>
    .preview {
        border: 0;
    }
</style>
