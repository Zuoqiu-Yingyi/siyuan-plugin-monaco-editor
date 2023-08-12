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
    import Svg from "./../misc/Svg.svelte";
    import type { IBreadcrumbItem } from ".";

    export let itemId: IBreadcrumbItem["itemId"] = "";

    export let iconId: IBreadcrumbItem["iconId"] = "";
    export let icon: IBreadcrumbItem["icon"] = "";

    export let text: IBreadcrumbItem["text"] = "";
    export let textTitle: IBreadcrumbItem["textTitle"] = "";
    export let textEllipsis: IBreadcrumbItem["textEllipsis"] = true;

    export let active: IBreadcrumbItem["active"] = false;
</script>

<span
    data-node-id={itemId}
    class:protyle-breadcrumb__item--active={active}
    class="protyle-breadcrumb__item"
>
    <slot name="svg">
        {#if icon}
            <Svg
                id={iconId}
                {icon}
            />
        {/if}
    </slot>

    <span
        title={textTitle}
        class:protyle-breadcrumb__text--ellipsis={textEllipsis}
        class="protyle-breadcrumb__text"
    >
        {text}
    </span>
</span>
