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
    import { createEventDispatcher } from "svelte";

    export let icon: string = ""; // 图标
    export let label: string = ""; // 菜单项文本/input 提示
    export let input: boolean = false; // 是否为输入框
    export let disabled : boolean = false; // 是否禁用
    export let value: string = ""; // 输入框内容
    export let accelerator: string = ""; // 捷径提示

    const dispatch = createEventDispatcher();

    function changed(event: Event) {
        dispatch("changed", { value, event });
    }
</script>

<!-- 菜单项图标 -->
{#if icon}
    <svg class="b3-menu__icon">
        <use xlink:href={icon} />
    </svg>
{:else}
    <slot name="icon">
        <svg class="b3-menu__icon">
            <use xlink:href="#" />
        </svg>
    </slot>
{/if}

<!-- 菜单项标签 -->
<span class="b3-menu__label">
    {#if !input}
        <!-- 文本 -->
        {label}
    {:else}
        <!-- 输入框 -->
        <div class="fn__hr--small" />
        <input
            placeholder={label}
            {disabled}
            bind:value={value}
            on:change={changed}
            class="b3-text-field fn__size200"
        />
        <div class="fn__hr--small" />
    {/if}
</span>

<!-- 菜单项捷径提示 -->
{#if accelerator}
    <span class="b3-menu__accelerator">
        {accelerator}
    </span>
{/if}
