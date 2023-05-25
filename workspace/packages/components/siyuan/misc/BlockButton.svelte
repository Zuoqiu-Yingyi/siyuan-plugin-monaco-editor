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

    import { TooltipsDirection } from "./tooltips";

    export let icon: string;
    export let ariaLabel: string = undefined;
    export let active = false;
    export let disabled = false;
    export let tooltipsDirection: TooltipsDirection = TooltipsDirection.s;
</script>

<button
    on:click
    aria-label={ariaLabel}
    class:toolbar__item--active={active}
    class:toolbar__item--disabled={disabled}
    class="block__icon block__icon--show fn__flex-center b3-tooltips {tooltipsDirection}"
>
    <Svg {icon} />
</button>
