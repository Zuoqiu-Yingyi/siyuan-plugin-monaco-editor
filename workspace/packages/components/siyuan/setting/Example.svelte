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
REF: https://github.com/siyuan-note/plugin-sample-vite-svelte/blob/main/src/libs/setting-panel.svelte
-->

<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    import { showMessage } from "siyuan";
    import { ItemType } from "./item";
    import SettingItem from "./normal/Item.svelte";
    import SettingInput from "./normal/Input.svelte";

    let block = false;
    let normal = false;

    onMount(() => {
        showMessage("Setting panel opened");
    });
    onDestroy(() => {
        showMessage("Setting panel closed");
    });
</script>

<!--
You can use this template to quickly create a setting panel,
with the same UI style in SiYuan
-->

<div class="config__tab-container">
    <SettingItem
        {block}
        title="Checkbox"
        text="This is a checkbox"
    >
        <h4 slot="title">This setting panel is provided by a svelte component</h4>
        <span slot="text">
            See:
            <code class="fn__code">/lib/setting-pannel.svelte</code>
        </span>
    </SettingItem>

    <SettingItem
        {block}
        title="Checkbox"
        text="This is a checkbox"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.checkbox}
            settingKey="Checkbox"
            settingValue={block}
            on:changed={event => {
                showMessage(`Checkbox changed: ${event.detail.key} = ${event.detail.value}`);
                setTimeout(() => block = !block, 0);
            }}
        />
    </SettingItem>
    <SettingItem
        {block}
        title="Input"
        text="This is an text input"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.text}
            settingKey="Text"
            settingValue=""
            placeholder="Input something"
            on:changed={event => {
                showMessage(`Input changed: ${event.detail.key} = ${event.detail.value}`);
            }}
        />
    </SettingItem>
    <SettingItem
        {block}
        title="Slide"
        text="This is a number input"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.number}
            settingKey="Number"
            settingValue={50}
            limits={{
                min: 0,
                max: 100,
                step: 1,
            }}
            on:changed={event => {
                showMessage(`Slide changed: ${event.detail.key} = ${event.detail.value}`);
            }}
        />
    </SettingItem>
    <SettingItem
        {block}
        title="Slide"
        text="This is a slide"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.slider}
            settingKey="Slide"
            settingValue={50}
            limits={{
                min: 0,
                max: 100,
                step: 1,
            }}
            on:changed={event => {
                showMessage(`Slide changed: ${event.detail.key} = ${event.detail.value}`);
            }}
        />
    </SettingItem>
    <SettingItem
        {block}
        title="Button"
        text="This is a button"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.button}
            settingKey="Button"
            settingValue="Click me"
            on:clicked={() => {
                showMessage("Button clicked");
                setTimeout(() => normal = !normal, 0);
            }}
        />
    </SettingItem>
    <SettingItem
        {block}
        title="Select"
        text="This is a select"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.select}
            settingKey="Select"
            settingValue="left"
            options={{
                left: "Left",
                center: "Center",
                right: "Right",
            }}
            on:changed={event => {
                showMessage(`Select changed: ${event.detail.key} = ${event.detail.value}`);
            }}
        />
    </SettingItem>
    <SettingItem
        {block}
        title="Textarea"
        text="This is an text textarea"
    >
        <SettingInput
            slot="input"
            {block}
            {normal}
            type={ItemType.textarea}
            settingKey="Textarea"
            settingValue=""
            placeholder="Input something"
            on:changed={event => {
                showMessage(`Input changed: ${event.detail.key} = ${event.detail.value}`);
            }}
        />
    </SettingItem>
</div>
