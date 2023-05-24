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

<!-- 设置项输入组件 -->

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { ItemType, type ILimits, type IOptions } from "./item";

    export let type: ItemType; // Setting Type
    export let settingKey: string;
    export let settingValue: any;

    export let block: boolean = false; // Using Block Style
    export let normal: boolean = true; // Normal Size
    export let placeholder: string = ""; // Use it if type is text/number/textarea
    export let options: IOptions = {}; // Use it if type is select
    export let limits: ILimits = { min: 0, max: 100, step: 1 }; // Use it if type is number/slider

    const dispatch = createEventDispatcher();

    function clicked() {
        dispatch("clicked");
    }

    function changed() {
        dispatch("changed", { key: settingKey, value: settingValue });
    }
</script>

{#if type === ItemType.checkbox}
    <!-- Checkbox -->
    <input
        class="b3-switch"
        class:fn__block={block}
        class:fn__flex-center={!block}
        type="checkbox"
        bind:checked={settingValue}
        on:change={changed}
    />
{:else if type === ItemType.text}
    <!-- Text Input -->
    <input
        class="b3-text-field"
        class:fn__block={block}
        class:fn__size200={!block && normal}
        class:fn__flex-center={!block}
        {placeholder}
        bind:value={settingValue}
        on:change={changed}
    />
{:else if type === ItemType.number}
    <!-- Number Input -->
    <input
        class="b3-text-field"
        class:fn__block={block}
        class:fn__size200={!block && normal}
        class:fn__flex-center={!block}
        type="number"
        {placeholder}
        min={limits.min}
        max={limits.max}
        step={limits.step}
        bind:value={settingValue}
        on:change={changed}
    />
{:else if type === ItemType.slider}
    <!-- Slider -->
    <input
        class="b3-slider"
        class:fn__block={block}
        class:fn__size200={!block && normal}
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        bind:value={settingValue}
        on:change={changed}
    />
{:else if type === ItemType.button}
    <!-- Button Input -->
    <button
        class="b3-button b3-button--outline"
        class:fn__block={block}
        class:fn__size200={!block && normal}
        class:fn__flex-center={!block}
        on:click={clicked}
    >
        {settingValue}
    </button>
{:else if type === ItemType.select}
    <!-- Dropdown select -->
    <select
        class="b3-select"
        class:fn__block={block}
        class:fn__size200={!block && normal}
        class:fn__flex-center={!block}
        bind:value={settingValue}
        on:change={changed}
    >
        {#each Object.entries(options) as [value, text]}
            <option {value}>{text}</option>
        {/each}
    </select>
{:else if type === ItemType.textarea}
    <!-- Text Area -->
    <textarea
        class="b3-text-field"
        class:fn__block={block}
        class:fn__size200={!block && normal}
        {placeholder}
        bind:value={settingValue}
        on:change={changed}
    />
{/if}

<style lang="less">
    .fn__block {
        &.b3-switch {
            overflow: visible;
            padding-left: 1em;
        }

        &.b3-slider {
            padding: 0;
        }
    }
</style>
