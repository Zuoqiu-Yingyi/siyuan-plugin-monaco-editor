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
    import Editor from "./Editor.svelte";

    import regexp from "@workspace/utils/regexp";
    import type { IBar } from "@workspace/components/siyuan/dock/block/index";

    import type MonacoEditorPlugin from "@/index";
    import type { IDockEditor } from "@/types/editor";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
    export let id: string; // 块 ID
    export let kramdown: boolean; // 是否启用 kramdown 模式

    export let bar: IBar; // 标题栏配置
    export let editor: IDockEditor; // 编辑器配置

    $: {
        if (regexp.id.test(id)) {
            if (kramdown) {
                plugin.client
                    .getBlockKramdown({ id })
                    .then(response => {
                        editor.modified.value = response.data.kramdown;
                    })
                    .catch(err => plugin.logger.error(err));
            } else {
                // TODO: markdown 模式
            }
        }
    }

    function save(e: ComponentEvents<Editor>["save"]) {
        if (kramdown) {
            plugin.client
                .updateBlock({
                    id,
                    dataType: "markdown",
                    data: e.detail.value,
                })
                .catch(err => plugin.logger.error(err));
        } else {
            // TODO: markdown 模式
        }
    }
</script>

<Bar {...bar} />
<Editor
    on:save={save}
    {...editor}
    {plugin}
    embed={true}
    savable={true}
    locale={globalThis.siyuan.config.lang}
/>
