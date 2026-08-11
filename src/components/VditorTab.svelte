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

    import { DEFAULT_VDITOR_PROPS } from "@/configs/vditor";
    import {
        Facade,

    } from "@/facades/facade";

    import VditorIframe from "./VditorIframe.svelte";

    import type { ComponentProps } from "svelte";
    import type { Unsubscriber } from "svelte/store";

    import type { IFacadeAssetOptions, ITabOptions } from "@/facades/facade";
    import type { IAssetHandler } from "@/handlers/asset";
    import type { IVditorEvents } from "@/types/vditor";

    import type { IProps as IVditorIframeProps } from "./VditorIframe.svelte";

    interface IProps {
        plugin: IVditorIframeProps["plugin"]; // 插件对象
        facadeOptions: IFacadeAssetOptions; // 门面参数
    }

    const {
        plugin,
        facadeOptions,
    }: IProps = $props();

    const assetsDirPath: IVditorIframeProps["assetsDirPath"] = plugin.config.vditor.assetsDirPath; // 资源目录
    const assetsUploadMode: IVditorIframeProps["assetsUploadMode"] = plugin.config.vditor.assetsUploadMode; // 资源目录模式
    const options: IVditorIframeProps["options"] = plugin.config.vditor.options;

    const theme: IVditorIframeProps["theme"] = DEFAULT_VDITOR_PROPS.theme;
    const codeBlockThemeLight: IVditorIframeProps["codeBlockThemeLight"] = window.siyuan?.config?.appearance?.codeBlockThemeLight;
    const codeBlockThemeDark: IVditorIframeProps["codeBlockThemeDark"] = window.siyuan?.config?.appearance?.codeBlockThemeDark;
    const updatable: IVditorIframeProps["updatable"] = DEFAULT_VDITOR_PROPS.updatable;

    let path: IVditorIframeProps["path"] = $state();
    let value: IVditorIframeProps["value"] = $state();
    let changeable: IVditorIframeProps["changeable"] = $state(DEFAULT_VDITOR_PROPS.changeable);

    let fullscreen: ComponentProps<Tab>["fullscreen"] = $state(false); // 是否为全屏模式

    let breadcrumb: ComponentProps<Tab>["breadcrumb"] = $state(false); // 是否显示面包屑
    let breadcrumbItems: ComponentProps<Tab>["breadcrumbItems"] = $state([]); // 面包屑项
    let breadcrumbIcons: ComponentProps<Tab>["breadcrumbIcons"] = $state([]); // 面包屑按钮

    let tabOptions: ITabOptions | undefined = $state();
    let inited: boolean = $state(false);

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
            const handler = tabOptions.handler as IAssetHandler;
            path = handler.path;
            value = handler.modified.value;

            breadcrumb = tabOptions.breadcrumb.breadcrumb;
            breadcrumbItems = tabOptions.breadcrumb.breadcrumbItems;
            breadcrumbIcons = tabOptions.breadcrumb.breadcrumbIcons;

            inited = true;
        }
    });

    /* 保存内容 */
    function update(params: IVditorEvents["changed"] | IVditorEvents["save"]) {
        tabOptions?.handler?.update?.(params.markdown);
    }

    /* 打开链接事件 */
    function openLink(params: IVditorEvents["open-link"]) {
        plugin.openLinkEventHandler(params);
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
            <VditorIframe
                {assetsDirPath}
                {assetsUploadMode}
                {changeable}
                {codeBlockThemeDark}
                {codeBlockThemeLight}
                onChanged={update}
                onOpenLink={openLink}
                onSave={update}
                {options}
                {path}
                {plugin}
                {theme}
                {updatable}
                {value}
            />
        {/if}
    </div>
</Tab>
