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
        IEditorHandlers,
        IEditorProps,
    } from "@/types/editor";

    export interface IProps {
        plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象

        diff?: IEditorProps["diff"];
        locale?: IEditorProps["locale"];
        savable?: IEditorProps["savable"];
        changeable?: IEditorProps["changeable"];
        original?: IEditorProps["original"];
        modified?: IEditorProps["modified"];
        options?: IEditorProps["options"];
        originalOptions?: IEditorProps["originalOptions"];
        modifiedOptions?: IEditorProps["modifiedOptions"];
        diffOptions?: IEditorProps["diffOptions"];
    }
</script>

<script lang="ts">

    import { EditorBridgeMaster } from "@/bridge/EditorMaster";

    import { DEFAULT_EDITOR_PROPS } from "../configs/editor";

    import type { Action } from "svelte/action";

    const {
        plugin,
        diff = false,
        locale = DEFAULT_EDITOR_PROPS.locale,
        savable = DEFAULT_EDITOR_PROPS.savable,
        changeable = DEFAULT_EDITOR_PROPS.changeable,
        original = DEFAULT_EDITOR_PROPS.original,
        modified = DEFAULT_EDITOR_PROPS.modified,
        options = DEFAULT_EDITOR_PROPS.options,
        originalOptions = DEFAULT_EDITOR_PROPS.originalOptions,
        modifiedOptions = DEFAULT_EDITOR_PROPS.modifiedOptions,
        diffOptions = DEFAULT_EDITOR_PROPS.diffOptions,

        onChanged,
        onSave,
        onHover,
        onOpen,
    }: IProps & IEditorHandlers = $props();

    let inited = $state(false);

    const bridge = new EditorBridgeMaster(
        plugin, //
        EditorBridgeMaster.createChannel(true), //
    );

    $effect(() => {
        if (inited) {
            bridge.set({
                savable,
                changeable,

                original: $state.snapshot(original),
                modified: $state.snapshot(modified),
                // @ts-expect-error
                options: $state.snapshot(options),
                // @ts-expect-error
                originalOptions: $state.snapshot(originalOptions),
                // @ts-expect-error
                modifiedOptions: $state.snapshot(modifiedOptions),
                // @ts-expect-error
                diffOptions: $state.snapshot(diffOptions),
            });
        }
    });

    bridge.addEventListener("editor-ready", (e) => {
        // plugin.logger.debug("editor-ready");

        if (e.data.data.status) {
            bridge.init({
                name: plugin.name,
                i18n: plugin.i18n,

                diff,
                locale,

                savable,
                changeable,

                original: $state.snapshot(original),
                modified: $state.snapshot(modified),
                // @ts-expect-error
                options: $state.snapshot(options),
                // @ts-expect-error
                originalOptions: $state.snapshot(originalOptions),
                // @ts-expect-error
                modifiedOptions: $state.snapshot(modifiedOptions),
                // @ts-expect-error
                diffOptions: $state.snapshot(diffOptions),
            });
            inited = true;
        }
        else {
            inited = false;
        }
    });
    bridge.addEventListener("editor-changed", (e) => {
        onChanged?.(e.data.data);
    });
    bridge.addEventListener("editor-save", (e) => {
        onSave?.(e.data.data);
    });
    bridge.addEventListener("editor-hover-siyuan", (e) => {
        onHover?.(e.data.data);
    });
    bridge.addEventListener("editor-open-siyuan", (e) => {
        onOpen?.(e.data.data);
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
    class="fn__flex-1 editor"
    title={plugin.displayName}
    use:init
></iframe>

<style>
    .editor {
        border: 0;
    }
</style>
