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
    import Svg from "./Svg.svelte";
    import type { IBlockIcon } from "./index";
    import { TooltipsDirection } from "./tooltips";

    export let icon: IBlockIcon["icon"] = "#iconHelp";
    export let show: IBlockIcon["show"] = true;
    export let none: IBlockIcon["none"] = false;
    export let active: IBlockIcon["active"] = false;
    export let disabled: IBlockIcon["disabled"] = false;
    export let type: IBlockIcon["type"] = "";
    export let ariaLabel: IBlockIcon["ariaLabel"] = "";
    export let onClick: IBlockIcon["onClick"] = (_event, _element, active) => active;
    export let tooltipsDirection: IBlockIcon["tooltipsDirection"] = TooltipsDirection.none;

    let button: HTMLButtonElement;
</script>

<button
    bind:this={button}
    on:click
    on:dblclick
    on:click={e => {
        active = onClick(e, button, active);
    }}
    data-type={type}
    aria-label={ariaLabel}
    class:fn__none={none}
    class:block__icon--show={show}
    class:toolbar__item--active={active}
    class:toolbar__item--disabled={disabled}
    class:b3-tooltips={tooltipsDirection !== TooltipsDirection.none}
    class="block__icon fn__flex-center {tooltipsDirection}"
>
    <Svg {icon} />
</button>
