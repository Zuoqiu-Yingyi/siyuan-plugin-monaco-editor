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
    import Item from "@workspace/components/siyuan/setting/item/Item.svelte";
    import Input from "@workspace/components/siyuan/setting/item/Input.svelte";
    import Group from "@workspace/components/siyuan/setting/item/Group.svelte";
    import MiniItem from "@workspace/components/siyuan/setting/item/MiniItem.svelte";

    import { ItemType } from "@workspace/components/siyuan/setting/item/item";
    import { type ITab } from "@workspace/components/siyuan/setting/tab";

    import type WebviewPlugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";
    import { MenuItemMode } from "../utils/enums";
    import Svg from "@workspace/components/siyuan/misc/Svg.svelte";

    export let config: IConfig; // 传入的配置项
    export let plugin: InstanceType<typeof WebviewPlugin>; // 插件实例

    const i18n = plugin.i18n as unknown as I18N;

    function updated() {
        plugin.updateConfig(config);
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
        general,
        feature,
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
            key: PanelKey.feature,
            text: i18n.settings.featureSettings.title,
            name: i18n.settings.featureSettings.title,
            icon: "#iconMenu",
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

    <!-- 功能面板 -->
    <Panel display={panels[1].key === focusPanel}>
        {#each config.features as feature, i (i)}
            <!-- 非分割线 -->
            {#if feature.mode !== MenuItemMode.separator}
                <Group title={i18n.menu[feature.id].label}>
                    <MiniItem minWidth="12em">
                        <Svg
                            slot="icon"
                            icon="#iconMenu"
                            className="svg"
                        />
                        <span slot="title">
                            {i18n.settings.featureSettings.menu.label}
                        </span>
                        <Input
                            slot="input"
                            type={ItemType.checkbox}
                            settingKey="Checkbox"
                            settingValue={feature.enable}
                            on:changed={e => {
                                feature.enable = e.detail.value;
                                updated();
                            }}
                        />
                    </MiniItem>
                    {#if feature.style !== undefined}
                        <MiniItem minWidth="12em">
                            <Svg
                                slot="icon"
                                icon="#iconTheme"
                                className="svg"
                            />
                            <span slot="title">
                                {i18n.settings.featureSettings.style.label}
                            </span>
                            <Input
                                slot="input"
                                type={ItemType.checkbox}
                                settingKey="Checkbox"
                                settingValue={feature.style}
                                on:changed={e => {
                                    feature.style = e.detail.value;
                                    updated();
                                }}
                            />
                        </MiniItem>
                    {/if}
                </Group>
            {/if}
        {/each}
    </Panel>
</Panels>

<style lang="less">
</style>
