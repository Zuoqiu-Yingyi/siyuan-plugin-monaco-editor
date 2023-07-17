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
    import type { ComponentEvents } from "svelte";
    import Bar from "@workspace/components/siyuan/dock/block/Bar.svelte";

    import EditorIframe from "./EditorIframe.svelte";

    import regexp from "@workspace/utils/regexp";
    import type { IBar } from "@workspace/components/siyuan/dock/block/index";

    import type MonacoEditorPlugin from "@/index";
    import type { IDockEditor } from "@/types/editor";
    import { BlockHandler, Language, Inline, type IBlockEditHandler } from "@/handlers/block";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
    export let id: string; // 块 ID
    export let realTime: boolean = false; // 是否启用实时更新模式
    export let inline: Inline; // 是否启用 kramdown 模式
    export let language: Language; // 是否启用 kramdown 模式

    export let bar: IBar; // 标题栏配置
    export let editor: IDockEditor; // 编辑器配置

    const blockHandler = new BlockHandler(plugin);
    let handler: IBlockEditHandler;
    let savable: boolean = false;

    $: {
        if (regexp.id.test(id)) {
            blockHandler.makeEditHandler(id, inline, language).then(h => (handler = h));
        }
    }

    $: {
        if (handler) {
            savable = !!handler.update;
            editor = {
                modified: handler.model,
                options: handler.options,
            };
        }
    }

    function update(e: ComponentEvents<EditorIframe>["save"] | ComponentEvents<EditorIframe>["changed"]) {
        if (handler?.update) {
            plugin.client.updateBlock({
                id,
                dataType: "markdown",
                data: handler.update(e.detail.value),
            });
        }
    }
</script>

<Bar {...bar} />
<EditorIframe
    on:save={update}
    on:changed={update}
    {plugin}
    {savable}
    changable={realTime}
    {...editor}
/>
