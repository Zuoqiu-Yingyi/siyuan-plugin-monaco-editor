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

<!-- 设置面板 -->

<script lang="ts">
    import Panels from "@workspace/components/siyuan/setting/panel/Panels.svelte";
    import Panel from "@workspace/components/siyuan/setting/panel/Panel.svelte";
    import Tabs from "@workspace/components/siyuan/setting/tab/Tabs.svelte";
    import Item from "@workspace/components/siyuan/setting/item/Item.svelte";
    import Input from "@workspace/components/siyuan/setting/item/Input.svelte";

    import { ItemType } from "@workspace/components/siyuan/setting/item/item";
    import { type ITab } from "@workspace/components/siyuan/setting/tab";

    import type Plugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";

    export let config: IConfig; // 传入的配置项
    export let plugin: InstanceType<typeof Plugin>; // 插件实例

    const i18n = plugin.i18n as unknown as I18N;

    async function updated() {
        await plugin.updateConfig(config);
    }

    function resetOptions() {
        plugin.siyuan.confirm(
            i18n.settings.generalSettings.reset.title, // 标题
            i18n.settings.generalSettings.reset.description, // 文本
            async () => {
                await plugin.resetConfig(); // 重置配置
                globalThis.location.reload(); // 刷新页面
            }, // 确认按钮回调
        );
    }

    enum PanelKey {
        general, // 常规设置
        focus, // 焦点设置
        typewriter, // 打字机设置
    }

    let panels_focus_key = PanelKey.general;
    const panels: ITab[] = [
        {
            key: PanelKey.general,
            text: i18n.settings.generalSettings.title,
            name: i18n.settings.generalSettings.title,
            icon: "#iconSettings",
        },
        {
            key: PanelKey.focus,
            text: i18n.settings.focusSettings.title,
            name: i18n.settings.focusSettings.title,
            icon: "#iconFocus",
        },
        {
            key: PanelKey.typewriter,
            text: i18n.settings.typewriterSettings.title,
            name: i18n.settings.typewriterSettings.title,
            icon: "#iconKeymap",
        },
    ];
</script>

<Panels
    {panels}
    focus={panels_focus_key}
    let:focus={focusPanel}
>
    <!-- 常规设置面板 -->
    <Panel display={panels[0].key === focusPanel}>
        <!-- 重置设置 -->
        <Item
            title={i18n.settings.generalSettings.reset.title}
            text={i18n.settings.generalSettings.reset.description}
        >
            <Input
                slot="input"
                type={ItemType.button}
                settingKey="Reset"
                settingValue={i18n.settings.generalSettings.reset.text}
                on:clicked={resetOptions}
            />
        </Item>
    </Panel>

    <!-- 焦点设置面板 -->
    <Panel display={panels[1].key === focusPanel}>
        <!-- 启用焦点模式 -->
        <Item
            title={i18n.settings.focusSettings.enable.title}
            text={i18n.settings.focusSettings.enable.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="enable"
                settingValue={config.focus.enable}
                on:changed={async e => {
                    config.focus.enable = e.detail.value;
                    await updated();
                }}
            />
        </Item>
    </Panel>

    <!-- 打字机设置面板 -->
    <Panel display={panels[2].key === focusPanel}>
        <!-- 启用打字机模式 -->
        <Item
            title={i18n.settings.typewriterSettings.enable.title}
            text={i18n.settings.typewriterSettings.enable.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="enable"
                settingValue={config.typewriter.enable}
                on:changed={async e => {
                    config.typewriter.enable = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 代码块焦点跟随行 -->
        <Item
            title={i18n.settings.typewriterSettings.code.title}
            text={i18n.settings.typewriterSettings.code.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="code"
                settingValue={config.typewriter.code.row}
                on:changed={async e => {
                    config.typewriter.code.row = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 表格块焦点跟随单元格 -->
        <Item
            title={i18n.settings.typewriterSettings.table.title}
            text={i18n.settings.typewriterSettings.table.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="table"
                settingValue={config.typewriter.table.row}
                on:changed={async e => {
                    config.typewriter.table.row = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 滚动延时时间 -->
        <Item
            title={i18n.settings.typewriterSettings.timeout.title}
            text={i18n.settings.typewriterSettings.timeout.description}
        >
            <Input
                slot="input"
                type={ItemType.number}
                settingKey="timeout"
                settingValue={config.typewriter.timeout}
                limits={{
                    min: 0,
                    max: Infinity,
                    step: 25,
                }}
                on:changed={async e => {
                    config.typewriter.timeout = e.detail.value;
                    await updated();
                }}
            />
        </Item>
    </Panel>
</Panels>

<style lang="less">
</style>
