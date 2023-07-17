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
    import Svg from "./../../misc/Svg.svelte";

    import { TooltipsDirection } from "./../../misc/tooltips";
    import type { IIcon } from ".";

    export let icon: IIcon["icon"]; // 图标 ID
    export let type: IIcon["type"] = ""; // data-type 属性值
    export let active: IIcon["active"] = false; // 按钮是否激活
    export let ariaLabel: IIcon["ariaLabel"] = ""; // 提示标签内容
    export let tooltipsDirection: IIcon["tooltipsDirection"] = TooltipsDirection.sw; // 提示标签方向
    export let onClick: IIcon["onClick"] = () => false; // 按钮点击回调函数

    let element: HTMLButtonElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    bind:this={element}
    on:click={e => {active = onClick(e, element, active)}}
    data-type={type}
    aria-label={ariaLabel}
    class:toolbar__item--active={active}
    class="block__icon b3-tooltips {tooltipsDirection}"
>
    <Svg {icon} />
</button>
