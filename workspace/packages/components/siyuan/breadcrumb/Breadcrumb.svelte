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
    import type { IBlockIconProps } from "./../misc";

    import Bar from "./Bar.svelte";
    import BlockIcon from "./../misc/BlockIcon.svelte";

    export let items: ComponentProps<Bar>["items"] = [];
    export let icons: IBlockIconProps[] = [];
</script>

<div class="protyle-breadcrumb">
    <slot name="bar">
        <Bar {items} />
    </slot>
    <slot name="icons">
        {#each icons as icon, i (i)}
            {#if i === 0}
                <span class="protyle-breadcrumb__space" />
            {:else}
                <span class="fn__space" />
            {/if}
            <BlockIcon {...icon} />
        {/each}
    </slot>
</div>
