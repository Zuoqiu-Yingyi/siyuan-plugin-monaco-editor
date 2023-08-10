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
    import ListItem from "./ListItem.svelte";

    import { type IListItem } from "./list";

    export let items: IListItem[] = [];
    export let className: string = "b3-list b3-list--background";
    export let border: boolean = false;
    export let fn__none: boolean = false;
    export let flex_1: boolean = true;
    export let width: number = 0;
    export let indent: string = "";
</script>

<ul
    class={className}
    class:b3-list--border={border}
    class:fn__none={fn__none}
    class:fn__flex-1={flex_1}
    style:margin-left={indent}
    style:width={width > 0 ? `${width}px` : undefined}
>
    {#each items as item, i (i)}
        <ListItem {...item} />
    {/each}
</ul>
