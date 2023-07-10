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
    import { onMount } from "svelte";

    import type { editor } from "monaco-editor";
    import loader from "@monaco-editor/loader";
    import { mapLocale } from "@/utils/locale";

    import { merge } from "@workspace/utils/misc/merge";

    export let locale = "zh-Hans"; // 界面语言
    export let content = ""; // 编辑器内容
    export let language = "plaintext"; // 编辑器语言模式
    export let options: editor.IStandaloneEditorConstructionOptions = {}; // 编辑器配置

    let editorElement;

    loader.config({
        paths: {
            vs: (() => {
                switch (true) {
                    case import.meta.env.DEV:
                        return "node_modules/monaco-editor/min/vs";

                    case import.meta.env.PROD:
                    default:
                        return "./../libs/monaco-editor/min/vs";
                }
            })(),
        },
        // monaco,
        "vs/nls": {
            availableLanguages: {
                "*": mapLocale(locale),
            },
        },
    });
    const init = loader.init();

    onMount(() => {
        init.then(monaco => {
            const editor = monaco.editor.create(
                editorElement,
                merge(options, {
                    value: content,
                    language: language,
                }),
            );
        });
    });
</script>

<!-- REF: https://www.svelte.cn/docs#bind_element -->
<div
    bind:this={editorElement}
    class="editor"
/>

<style lang="less">
    .editor {
        width: 100%;
        height: 100%;
    }
</style>
