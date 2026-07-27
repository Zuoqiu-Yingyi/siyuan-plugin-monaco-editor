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

<script
    lang="ts"
    module
>
    import type MonacoEditorPlugin from "@/index";
    import type {
        IVditorHandlers,
        IVditorProps,
    } from "@/types/vditor";

    export interface IProps {
        plugin: InstanceType<typeof MonacoEditorPlugin>;

        path?: IVditorProps["path"];
        vditorID?: IVditorProps["vditorID"];
        assetsDirPath?: IVditorProps["assetsDirPath"];
        assetsUploadMode?: IVditorProps["assetsUploadMode"];
        options?: IVditorProps["options"];
        value?: IVditorProps["value"];
        theme?: IVditorProps["theme"];
        codeBlockThemeLight?: IVditorProps["codeBlockThemeLight"];
        codeBlockThemeDark?: IVditorProps["codeBlockThemeDark"];
        updatable?: IVditorProps["updatable"];
        changeable?: IVditorProps["changeable"];
        debug?: IVditorProps["debug"];
    }
</script>

<script lang="ts">

    import { VditorBridgeMaster } from "@/bridge/VditorMaster";

    import { DEFAULT_VDITOR_PROPS } from "../configs/vditor";

    import type { Action } from "svelte/action";

    const {
        plugin,

        path = DEFAULT_VDITOR_PROPS.path,
        vditorID = DEFAULT_VDITOR_PROPS.vditorID,
        assetsDirPath = DEFAULT_VDITOR_PROPS.assetsDirPath,
        assetsUploadMode = DEFAULT_VDITOR_PROPS.assetsUploadMode,
        options = DEFAULT_VDITOR_PROPS.options,
        value = DEFAULT_VDITOR_PROPS.value,
        theme = DEFAULT_VDITOR_PROPS.theme,
        codeBlockThemeLight = DEFAULT_VDITOR_PROPS.codeBlockThemeLight,
        codeBlockThemeDark = DEFAULT_VDITOR_PROPS.codeBlockThemeDark,
        updatable = DEFAULT_VDITOR_PROPS.updatable,
        changeable = DEFAULT_VDITOR_PROPS.changeable,
        debug = DEFAULT_VDITOR_PROPS.debug,

        onOpenLink,
        onChanged,
        onSave,
    }: IProps & IVditorHandlers = $props();

    let inited = $state(false);

    const bridge = new VditorBridgeMaster(
        plugin, //
        VditorBridgeMaster.createChannel(true), //
    );

    $effect(() => {
        if (inited) {
            bridge.set({
                path,
                vditorID,
                assetsDirPath,
                assetsUploadMode,
                // @ts-expect-error
                options: $state.snapshot(options),
                value,
                theme,
                codeBlockThemeLight,
                codeBlockThemeDark,
                updatable,
                changeable,
                debug,
            });
        }
    });

    bridge.addEventListener("vditor-ready", (e) => {
        // plugin.logger.debug("vditor-ready");

        if (e.data.data.status) {
            bridge.init({
                name: plugin.name,
                i18n: plugin.i18n,

                path,
                vditorID,
                assetsDirPath,
                assetsUploadMode,
                // @ts-expect-error
                options: $state.snapshot(options),
                value,
                theme,
                codeBlockThemeLight,
                codeBlockThemeDark,
                updatable,
                changeable,
                debug,
            });
            inited = true;
        }
        else {
            inited = false;
        }
    });
    bridge.addEventListener("vditor-open-link", (e) => {
        onOpenLink?.(e.data.data);
    });
    bridge.addEventListener("vditor-changed", (e) => {
        onChanged?.(e.data.data);
    });
    bridge.addEventListener("vditor-save", (e) => {
        onSave?.(e.data.data);
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
    class="fn__flex-1 vditor"
    title={plugin.displayName}
    use:init
></iframe>

<style>
    .vditor {
        border: 0;
    }
</style>
