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
    import type { IBreadcrumbElement } from ".";
    import Svg from "./../misc/Svg.svelte";
    import Item from "./Item.svelte";

    export let items: IBreadcrumbElement[] = [];
</script>

<div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
    <slot>
        {#each items as item, i (i)}
            {#if item.type === "item"}
                <Item {...item} />
            {:else if item.type === "arrow"}
                <Svg
                    className="protyle-breadcrumb__arrow"
                    icon={item.icon || "#iconRight"}
                />
            {/if}
        {/each}
    </slot>
</div>
