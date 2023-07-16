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
    import { onMount, createEventDispatcher } from "svelte";

    import type { editor as Editor } from "monaco-editor";
    import type MonacoEditorPlugin from "@/index";
    import { EditorBridgeMaster } from "@/bridge/master";

    import type { IEditorEvent, IEditorModel } from "@/types/editor";
    import type { IMonacoEditorOptions } from "@/types/config";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象

    export let diff: boolean = false; // 是否为差异对比模式
    export let savable: boolean = false; // 是否可保存 (保存按钮+派生保存事件)
    export let changable: boolean = false; // 是否可更改 (派生更改事件)

    export let locale = globalThis.siyuan.config.lang; // 界面语言
    export let original: IEditorModel = { value: "" }; // 编辑器原始内容
    export let modified: IEditorModel = { value: "" }; // 编辑器内容 (差异对比模式下的变更内容)
    export let options: IMonacoEditorOptions = {}; // 编辑器配置 (编辑器初始化 & 常规模式更新)
    export let diffOptions: Editor.IDiffEditorOptions = {}; // 对比编辑器配置 (仅用于差异对比模式更新)

    let iframe: HTMLIFrameElement; // iframe
    var inited = false;

    const dispatch = createEventDispatcher<IEditorEvent>();
    const bridge = new EditorBridgeMaster(
        plugin, //
        EditorBridgeMaster.createChannel(true), //
    );

    $: if (inited) bridge.set({ savable });
    $: if (inited) bridge.set({ changable });
    $: if (inited) bridge.set({ original });
    $: if (inited) bridge.set({ modified });
    $: if (inited) bridge.set({ options });
    $: if (inited) bridge.set({ diffOptions });

    bridge.addEventListener("editor-ready", e => {
        if (e.data.data.status) {
            bridge.init({
                name: plugin.name,
                i18n: plugin.i18n,

                locale,
                diff,
                savable,
                changable,
                original,
                modified,
                options,
            });
            inited = true;
        } else {
            inited = false;
        }
    });
    bridge.addEventListener("editor-changed", e => {
        dispatch("changed", e.data.data);
    });
    bridge.addEventListener("editor-save", e => {
        dispatch("save", e.data.data);
    });
    onMount(() => {
        bridge.createEditorIframe(iframe);
    });
</script>

<iframe
    bind:this={iframe}
    title={plugin.i18n.dock.title}
    class="fn__flex-1 editor"
/>

<style>
    .editor {
        border: 0;
    }
</style>
