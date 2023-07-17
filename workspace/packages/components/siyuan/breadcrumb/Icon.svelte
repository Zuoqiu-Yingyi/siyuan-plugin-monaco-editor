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
    import type { IBreadcrumbIcon } from ".";

    export let icon: IBreadcrumbIcon["icon"];
    export let show: IBreadcrumbIcon["show"] = true;
    export let none: IBreadcrumbIcon["none"] = false;
    export let active: IBreadcrumbIcon["active"] = false;
    export let type: IBreadcrumbIcon["type"] = "";
    export let ariaLabel: IBreadcrumbIcon["ariaLabel"] = "";
    export let onClick: IBreadcrumbIcon["onClick"] = () => false;

    let button: HTMLButtonElement;
</script>

<button
    bind:this={button}
    on:click={e => {active = onClick(e, button, active)}}
    data-type={type}
    aria-label={ariaLabel}
    class:fn__none={none}
    class:block__icon--show={show}
    class:toolbar__item--active={active}
    class="block__icon fn__flex-center"
>
    <Svg {icon} />
</button>
