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

    import { ItemType } from "@workspace/components/siyuan/setting/item/item";
    import { type ITab } from "@workspace/components/siyuan/setting/tab";

    import type MonacoEditorPlugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";

    export let config: IConfig; // 传入的配置项
    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件实例

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
        menu, // 菜单设置
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
            key: PanelKey.menu,
            text: i18n.settings.menuSettings.title,
            name: i18n.settings.menuSettings.title,
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
        <!-- 编辑器面板 -->
        <Item
            title={i18n.settings.generalSettings.editor.title}
            text={i18n.settings.generalSettings.editor.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Editor"
                settingValue={config.dock.editor.enable}
                on:changed={async e => {
                    config.dock.editor.enable = e.detail.value;
                    await updated();
                    globalThis.location.reload();
                }}
            />
        </Item>

        <!-- 资源管理器面板 -->
        <Item
            title={i18n.settings.generalSettings.explorer.title}
            text={i18n.settings.generalSettings.explorer.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Explorer"
                settingValue={config.dock.explorer.enable}
                on:changed={async e => {
                    config.dock.explorer.enable = e.detail.value;
                    await updated();
                    globalThis.location.reload();
                }}
            />
        </Item>

        <!-- 安全模式 -->
        <Item
            title={i18n.settings.generalSettings.safeMode.title}
            text={i18n.settings.generalSettings.safeMode.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Safe Mode"
                settingValue={config.dock.explorer.safe}
                on:changed={async e => {
                    config.dock.explorer.safe = e.detail.value;
                    await updated();
                }}
            />
        </Item>

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

    <!-- 菜单面板 -->
    <Panel display={panels[1].key === focusPanel}>
        <!-- 代码片段右键菜单 -->
        <Item
            title={i18n.settings.menuSettings.snippet.title}
            text={i18n.settings.menuSettings.snippet.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Snippet"
                settingValue={config.operates.menu.snippet}
                on:changed={async e => {
                    config.operates.menu.snippet = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 收集箱速记右键菜单 -->
        <Item
            title={i18n.settings.menuSettings.shorthand.title}
            text={i18n.settings.menuSettings.shorthand.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Shorthand"
                settingValue={config.operates.menu.shorthand}
                on:changed={async e => {
                    config.operates.menu.shorthand = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 文件历史面板 -->
        <Item
            title={i18n.settings.menuSettings.history1.title}
            text={i18n.settings.menuSettings.history1.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="File hostory"
                settingValue={config.operates.menu.history1}
                on:changed={async e => {
                    config.operates.menu.history1 = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 文档历史面板 -->
        <Item
            title={i18n.settings.menuSettings.history2.title}
            text={i18n.settings.menuSettings.history2.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Document hostory"
                settingValue={config.operates.menu.history2}
                on:changed={async e => {
                    config.operates.menu.history2 = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 快照 -->
        <Item
            title={i18n.settings.menuSettings.snapshot.title}
            text={i18n.settings.menuSettings.snapshot.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="Snapshot"
                settingValue={config.operates.menu.snapshot}
                on:changed={async e => {
                    config.operates.menu.snapshot = e.detail.value;
                    await updated();
                }}
            />
        </Item>
    </Panel>
</Panels>

<style lang="less">
</style>
