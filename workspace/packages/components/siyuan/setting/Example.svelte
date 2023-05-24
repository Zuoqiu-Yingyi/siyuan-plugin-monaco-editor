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
    import { ItemType } from "./item/item";

    import Panels from "./panel/Panels.svelte";
    import Panel from "./panel/Panel.svelte";
    import Tabs from "./tab/Tabs.svelte";
    import Item from "./item/Item.svelte";
    import Input from "./item/Input.svelte";

    let block = false;
    let normal = false;

    let panel_focus_key = 1;
    let panels = [
        {
            key: 1,
            text: "panel-example",
            name: "panel-example-name",
            icon: "#iconSettings",
        },
        {
            key: 2,
            text: "panel-test",
            name: "panel-test-name",
            icon: "",
        },
    ];
    let tab_focus_key = 1;
    let tabs = [
        {
            key: 1,
            text: "tab-example",
            name: "tab-example-name",
            icon: "🌰",
        },
        {
            key: 2,
            text: "tab-test",
            name: "tab-test-name",
            icon: "🧪",
        },
    ];

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
<Panels
    {panels}
    focus={panel_focus_key}
    let:focus={panel_focus}
>
    <Panel display={panels[0].key === panel_focus}>
        <Tabs
            focus={tab_focus_key}
            {tabs}
            let:focus
        >
            <div
                data-type={tabs[0].name}
                class:fn__none={tabs[0].key !== focus}
            >
                <Item
                    {block}
                    title="Checkbox"
                    text="This is a checkbox"
                >
                    <h4 slot="title">This setting panel is provided by a svelte component</h4>
                    <span slot="text">
                        See:
                        <code class="fn__code">/lib/setting-pannel.svelte</code>
                    </span>
                </Item>

                <Item
                    {block}
                    title="Checkbox"
                    text="This is a checkbox"
                >
                    <Input
                        slot="input"
                        {block}
                        {normal}
                        type={ItemType.checkbox}
                        settingKey="Checkbox"
                        settingValue={block}
                        on:changed={event => {
                            showMessage(`Checkbox changed: ${event.detail.key} = ${event.detail.value}`);
                            setTimeout(() => (block = !block), 0);
                        }}
                    />
                </Item>

                <Item
                    {block}
                    title="Input"
                    text="This is an text input"
                >
                    <Input
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
                </Item>

                <Item
                    {block}
                    title="Slide"
                    text="This is a number input"
                >
                    <Input
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
                </Item>

                <Item
                    {block}
                    title="Slide"
                    text="This is a slide"
                >
                    <Input
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
                </Item>

                <Item
                    {block}
                    title="Button"
                    text="This is a button"
                >
                    <Input
                        slot="input"
                        {block}
                        {normal}
                        type={ItemType.button}
                        settingKey="Button"
                        settingValue="Click me"
                        on:clicked={() => {
                            showMessage("Button clicked");
                            setTimeout(() => (normal = !normal), 0);
                        }}
                    />
                </Item>

                <Item
                    {block}
                    title="Select"
                    text="This is a select"
                >
                    <Input
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
                </Item>

                <Item
                    {block}
                    title="Textarea"
                    text="This is an text textarea"
                >
                    <Input
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
                </Item>
            </div>
            <div
                data-type={tabs[1].name}
                class:fn__none={tabs[1].key !== focus}
            >
                Empty Tab
            </div>
        </Tabs>
    </Panel>

    <Panel display={panels[1].key === panel_focus}>Empty Panel</Panel>
</Panels>
