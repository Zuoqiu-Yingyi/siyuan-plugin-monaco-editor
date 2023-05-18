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

<script
    lang="ts"
    context="module"
>
    import { waitLocale, _ as t } from "svelte-i18n";
    import { localizeInit } from "./utils/i18n";

    import Counter from "./libs/Counter.svelte";

    import svelteLogo from "./assets/svelte.svg";
    import viteLogo from "./assets/jupyter.svg";

    localizeInit();
    export async function preload() {
        // awaits for the loading of the 'en-US' and 'en' dictionaries
        return waitLocale();
    }
</script>

<main>
    <div>
        <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noreferrer"
        >
            <img
                src={viteLogo}
                class="logo"
                alt="Vite Logo"
            />
        </a>
        <a
            href="https://svelte.dev"
            target="_blank"
            rel="noreferrer"
        >
            <img
                src={svelteLogo}
                class="logo svelte"
                alt="Svelte Logo"
            />
        </a>
    </div>
    <h1>Jupyter + Svelte</h1>
    <h2>{$t("plugin.name")}</h2>

    <div class="card">
        <Counter />
    </div>

    <p>
        Check out <a
            href="https://github.com/sveltejs/kit#readme"
            target="_blank"
            rel="noreferrer">SvelteKit</a
        >, the official Svelte app framework powered by Vite!
    </p>

    <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style lang="less">
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;

        &:hover {
            filter: drop-shadow(0 0 2em #646cffaa);
        }

        &.svelte:hover {
            filter: drop-shadow(0 0 2em #ff3e00aa);
        }
    }

    .read-the-docs {
        color: #888;
    }
</style>
