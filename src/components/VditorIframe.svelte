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
    import { createEventDispatcher } from "svelte";
    import type { Action } from "svelte/action";

    import { VditorBridgeMaster } from "@/bridge/VditorMaster";

    import type MonacoEditorPlugin from "@/index";
    import type { IVditorEvents, IVditorProps } from "@/types/vditor";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象

    export let path: IVditorProps["path"] = undefined;
    export let vditorID: IVditorProps["vditorID"] = undefined;
    export let assetsDirPath: IVditorProps["assetsDirPath"] = undefined;
    export let assetsUploadMode: IVditorProps["assetsUploadMode"] = undefined;
    export let options: IVditorProps["options"] = undefined;
    export let value: IVditorProps["value"] = undefined;
    export let theme: IVditorProps["theme"] = undefined;
    export let codeBlockThemeLight: IVditorProps["codeBlockThemeLight"] = undefined;
    export let codeBlockThemeDark: IVditorProps["codeBlockThemeDark"] = undefined;
    export let updatable: IVditorProps["updatable"] = undefined;
    export let changable: IVditorProps["changable"] = undefined;
    export let debug: IVditorProps["debug"] = undefined;

    var inited = false;

    const dispatch = createEventDispatcher<IVditorEvents>();
    const bridge = new VditorBridgeMaster(
        plugin, //
        VditorBridgeMaster.createChannel(true), //
    );

    $: if (inited) bridge.set({ path });
    $: if (inited) bridge.set({ vditorID });
    $: if (inited) bridge.set({ assetsDirPath });
    $: if (inited) bridge.set({ assetsUploadMode });
    $: if (inited) bridge.set({ options });
    $: if (inited) bridge.set({ value });
    $: if (inited) bridge.set({ theme });
    $: if (inited) bridge.set({ codeBlockThemeLight });
    $: if (inited) bridge.set({ codeBlockThemeDark });
    $: if (inited) bridge.set({ updatable });
    $: if (inited) bridge.set({ changable });
    $: if (inited) bridge.set({ debug });

    bridge.addEventListener("vditor-ready", e => {
        // plugin.logger.debug("vditor-ready");

        if (e.data.data.status) {
            bridge.init({
                name: plugin.name,
                i18n: plugin.i18n,

                path,
                vditorID,
                assetsDirPath,
                assetsUploadMode,
                options,
                value,
                theme,
                codeBlockThemeLight,
                codeBlockThemeDark,
                updatable,
                changable,
                debug,
            });
            inited = true;
        } else {
            inited = false;
        }
    });
    bridge.addEventListener("vditor-open-link", e => {
        dispatch("open-link", e.data.data);
    });
    bridge.addEventListener("vditor-changed", e => {
        dispatch("changed", e.data.data);
    });
    bridge.addEventListener("vditor-save", e => {
        dispatch("save", e.data.data);
    });

    /* 挂载编辑器 */
    const init: Action<HTMLIFrameElement> = function (iframe) {
        bridge.createEditorIframe(iframe);
        return {
            destroy() {
                bridge.destroy();
            },
        };
    };
</script>

<!-- 
    use:init: 挂载后调用 {@link init} 方法
    REF: https://svelte.dev/docs/svelte-action
 -->
<iframe
    use:init
    title={plugin.displayName}
    class="fn__flex-1 vditor"
/>

<style>
    .vditor {
        border: 0;
    }
</style>
