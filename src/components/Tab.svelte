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
    import Tab from "@workspace/components/siyuan/tab/Tab.svelte";
    import EditorIframe from "./EditorIframe.svelte";

    export let plugin: EditorIframe["plugin"];
    export let savable: EditorIframe["savable"];
    export let changable: EditorIframe["changable"];
    export let modified: EditorIframe["modified"];
    export let options: EditorIframe["options"];

    let fullscreen: Tab["fullscreen"] = false; // 是否为全屏模式
    let breadcrumbItems: Tab["breadcrumbItems"] = []; // 面包屑项
    let breadcrumbIcons: Tab["breadcrumbIcons"] = []; // 面包屑按钮
</script>

<Tab
    {fullscreen}
    {breadcrumbItems}
    {breadcrumbIcons}
>
    <div
        slot="content"
        class="fn__flex fn__flex-1"
    >
        <EditorIframe
            {plugin}
            {savable}
            {changable}
            {modified}
            {options}
        />
    </div>
</Tab>
