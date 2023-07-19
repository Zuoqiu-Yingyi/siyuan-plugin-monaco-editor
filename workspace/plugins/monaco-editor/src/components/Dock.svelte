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
    import { get } from "svelte/store";

    import Bar from "@workspace/components/siyuan/dock/Bar.svelte";
    import EditorIframe from "./EditorIframe.svelte";

    import regexp from "@workspace/utils/regexp";
    import { TooltipsDirection } from "@workspace/components/siyuan/misc/tooltips";

    import type { IBar } from "@workspace/components/siyuan/dock/index";
    import type MonacoEditorPlugin from "@/index";
    import type { IDockEditor } from "@/types/editor";
    import { BlockHandler, Language, Inline, type IBlockHandler } from "@/handlers/block";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
    export let editor: IDockEditor; // 编辑器配置

    export let id: string = ""; // 块 ID
    export let realTime: boolean = false; // 是否启用实时更新模式
    export let inline: Inline = Inline.mark; // 是否启用 kramdown 模式
    export let language: Language = Language.kramdown; // 是否启用 kramdown 模式

    export let bar: IBar = {
        // 标题栏配置
        logo: "#iconCode",
        title: plugin.i18n.dock.title,
        icons: [
            {
                // 实时更新按钮
                icon: "#iconRefresh",
                type: "refresh",
                active: realTime,
                ariaLabel: plugin.i18n.dock.refresh.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick: (_e, _element, props) => {
                    let active = get(props.active);
                    active = !active;
                    realTime = active;
                    props.active.set(active);
                },
            },
            {
                // 行内元素是否使用 <span> 标签
                icon: "#iconInlineCode",
                type: "inline",
                active: inline === Inline.span,
                ariaLabel: plugin.i18n.dock.inline.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick: (_e, _element, props) => {
                    let active = get(props.active);
                    active = !active;
                    if (active) {
                        inline = Inline.span;
                    } else {
                        inline = Inline.mark;
                    }
                    props.active.set(active);
                },
            },
            {
                // kramdown 模式按钮
                icon: "#iconMarkdown",
                type: "kramdown",
                active: language === Language.kramdown,
                ariaLabel: plugin.i18n.dock.kramdown.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick: (_e, _element, props) => {
                    let active = get(props.active);
                    active = !active;
                    if (active) {
                        language = Language.kramdown;
                    } else {
                        language = Language.markdown;
                    }
                    props.active.set(active);
                },
            },
            {
                icon: "#iconMin",
                type: "min",
                ariaLabel: `${globalThis.siyuan.languages.min} ${plugin.siyuan.adaptHotkey("⌘W")}`,
                tooltipsDirection: TooltipsDirection.sw,
            },
        ],
    };

    const blockHandler = new BlockHandler(plugin);
    let handler: IBlockHandler;
    let savable: boolean = false;

    $: {
        if (regexp.id.test(id)) {
            blockHandler.makeHandler({ id, inline, language }).then(h => (handler = h));
        }
    }

    $: {
        if (handler) {
            savable = !!handler.update;
            editor.modified = handler.modified;
            editor.modifiedOptions = handler.options;
        }
    }

    function update(e: ComponentEvents<EditorIframe>["save"] | ComponentEvents<EditorIframe>["changed"]) {
        handler.update?.(e.detail.value);
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
