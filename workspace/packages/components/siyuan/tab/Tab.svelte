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
    import type { ComponentProps } from "svelte";
    import Breadcrumb from "./../breadcrumb/Breadcrumb.svelte";
    export let fullscreen = false; // 是否为全屏模式
    export let items: ComponentProps<Breadcrumb>["items"] = [];
    export let icons: ComponentProps<Breadcrumb>["icons"] = [];
</script>

<div
    class:fullscreen
    class="fn__flex-column"
>
    <slot name="breadcrumb">
        <Breadcrumb
            {items}
            {icons}
        />
    </slot>
    <div class="protyle-preview">
        <slot name="content" />
    </div>
</div>
