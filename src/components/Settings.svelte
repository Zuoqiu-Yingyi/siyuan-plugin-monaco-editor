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
    import Shortcut from "@workspace/components/siyuan/setting/specified/Shortcut.svelte";
    import Group from "@workspace/components/siyuan/setting/item/Group.svelte";
    import MiniItem from "@workspace/components/siyuan/setting/item/MiniItem.svelte";

    import { ItemType } from "@workspace/components/siyuan/setting/item/item";
    import { type ITab } from "@workspace/components/siyuan/setting/tab";

    import { MouseButton } from "@workspace/utils/shortcut";

    import type WebviewPlugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";
    import { MenuBarStatus } from "@/utils/window";
    import { EditorType } from "@workspace/utils/siyuan";

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
        openTab,
        openWindow,
    }

    enum TabKey {
        general,
        protocol,
        shortcut,
        siyuan,
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
            key: PanelKey.openTab,
            text: i18n.settings.openTab,
            name: i18n.settings.openTab,
            icon: "#iconBoth",
        },
        {
            key: PanelKey.openWindow,
            text: i18n.settings.openWindow,
            name: i18n.settings.openWindow,
            icon: "#iconOpenWindow",
        },
    ];

    let tab_settings_tabs_focus_key = TabKey.general;
    let window_settings_tabs_focus_key = TabKey.general;
    const tabs = {
        tab: [
            {
                key: TabKey.general,
                text: i18n.settings.general,
                name: i18n.settings.general,
                icon: "⚙",
            },
            {
                key: TabKey.protocol,
                text: i18n.settings.protocol,
                name: i18n.settings.protocol,
                icon: "🌐",
            },
            {
                key: TabKey.shortcut,
                text: i18n.settings.shortcut,
                name: i18n.settings.shortcut,
                icon: "⌨",
            },
        ] as ITab[],
        window: [
            {
                key: TabKey.general,
                text: i18n.settings.general,
                name: i18n.settings.general,
                icon: "⚙",
            },
            {
                key: TabKey.protocol,
                text: i18n.settings.protocol,
                name: i18n.settings.protocol,
                icon: "🌐",
            },
            {
                key: TabKey.shortcut,
                text: i18n.settings.shortcut,
                name: i18n.settings.shortcut,
                icon: "⌨",
            },
            {
                key: TabKey.siyuan,
                text: i18n.settings.siyuan.title,
                name: i18n.settings.siyuan.title,
                icon: "📝",
            },
        ] as ITab[],
    };
</script>

<Panels
    {panels}
    focus={panels_focus_key}
    let:focus={focusPanel}
>
    <!-- 常规设置面板 -->
    <Panel display={panels[0].key === focusPanel}>
        <!-- 自定义 UA -->
        <Item
            title={i18n.settings.generalSettings.useragent.title}
            text={i18n.settings.generalSettings.useragent.description}
            block={true}
        >
            <Input
                slot="input"
                type={ItemType.text}
                block={true}
                placeholder={globalThis.navigator.userAgent}
                settingKey="Text"
                settingValue={config.general.useragent}
                on:changed={e => {
                    config.general.useragent = e.detail.value;
                    updated();
                }}
            />
        </Item>

        <!-- 背景颜色 -->
        <Item
            title={i18n.settings.background.title}
            text={i18n.settings.background.description}
        >
            <Input
                slot="input"
                type={ItemType.text}
                settingKey="text"
                settingValue={config.general.background}
                on:changed={e => {
                    config.general.background = e.detail.value;
                    updated();
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

    <!-- 打开页签的设置面板 -->
    <Panel display={panels[1].key === focusPanel}>
        <Tabs
            focus={tab_settings_tabs_focus_key}
            tabs={tabs.tab}
            let:focus={focusTab}
        >
            <!-- 标签页 1 - 通用设置 -->
            <div
                data-type={tabs.tab[0].name}
                class:fn__none={tabs.tab[0].key !== focusTab}
            >
                <!-- 是否启用 -->
                <Item
                    title={i18n.settings.open.enable.tab.title}
                    text={i18n.settings.open.enable.tab.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="Checkbox"
                        settingValue={config.tab.enable}
                        on:changed={e => {
                            config.tab.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 编辑器超链接 -->
                <Item
                    title={i18n.settings.open.editorHyperlink.title}
                    text={i18n.settings.open.editorHyperlink.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="Checkbox"
                        settingValue={config.tab.open.targets.hyperlink.editor}
                        on:changed={e => {
                            config.tab.open.targets.hyperlink.editor = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 其他超链接 -->
                <Item
                    title={i18n.settings.open.otherHyperlink.title}
                    text={i18n.settings.open.otherHyperlink.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="Checkbox"
                        settingValue={config.tab.open.targets.hyperlink.other}
                        on:changed={e => {
                            config.tab.open.targets.hyperlink.other = e.detail.value;
                            updated();
                        }}
                    />
                </Item>
            </div>
            <!-- 标签页 2 - 协议设置 -->
            <div
                data-type={tabs.tab[1].name}
                class:fn__none={tabs.tab[1].key !== focusTab}
            >
                <Group title={i18n.settings.protocols.title}>
                    {#each Object.entries(config.tab.open.protocols) as [key, protocol] (key)}
                        <MiniItem minWidth="8em">
                            <code
                                slot="title"
                                class="fn__code">{protocol.prefix}</code
                            >
                            <Input
                                slot="input"
                                type={ItemType.checkbox}
                                settingKey="Checkbox"
                                settingValue={protocol.enable}
                                on:changed={e => {
                                    protocol.enable = e.detail.value;
                                    updated();
                                }}
                            />
                        </MiniItem>
                    {/each}
                </Group>
            </div>
            <!-- 标签页 3 - 快捷键设置 -->
            <div
                data-type={tabs.tab[2].name}
                class:fn__none={tabs.tab[2].key !== focusTab}
            >
                <Shortcut
                    minWidth="16em"
                    title={i18n.settings.open.shortcut.title}
                    shortcut={config.tab.open.mouse}
                    displayMouseEvent={false}
                    disabledMouseButton={true}
                    mouseButtonTitle={i18n.settings.mouse.button}
                    mouseButtonOptions={[{ key: MouseButton.Left, text: i18n.settings.mouse.left }]}
                    on:changed={updated}
                />
            </div>
        </Tabs>
    </Panel>

    <!-- 打开窗口的设置面板 -->
    <Panel display={panels[2].key === focusPanel}>
        <Tabs
            focus={window_settings_tabs_focus_key}
            tabs={tabs.window}
            let:focus={focusTab}
        >
            <!-- 标签页 1 - 通用设置 -->
            <div
                data-type={tabs.window[0].name}
                class:fn__none={tabs.window[0].key !== focusTab}
            >
                <!-- 是否启用 -->
                <Item
                    title={i18n.settings.open.enable.window.title}
                    text={i18n.settings.open.enable.window.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.window.enable}
                        on:changed={e => {
                            config.window.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 编辑器超链接 -->
                <Item
                    title={i18n.settings.open.editorHyperlink.title}
                    text={i18n.settings.open.editorHyperlink.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="editorHyperlink"
                        settingValue={config.window.open.targets.hyperlink.editor}
                        on:changed={e => {
                            config.window.open.targets.hyperlink.editor = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 其他超链接 -->
                <Item
                    title={i18n.settings.open.otherHyperlink.title}
                    text={i18n.settings.open.otherHyperlink.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="otherHyperlink"
                        settingValue={config.window.open.targets.hyperlink.other}
                        on:changed={e => {
                            config.window.open.targets.hyperlink.other = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 窗口宽度 -->
                <Item
                    title={i18n.settings.window.width.title}
                    text={i18n.settings.window.width.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.number}
                        settingKey="width"
                        settingValue={config.window.params.width}
                        limits={{ min: 320, max: 15360, step: 40 }}
                        on:changed={e => {
                            config.window.params.width = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 窗口高度 -->
                <Item
                    title={i18n.settings.window.height.title}
                    text={i18n.settings.window.height.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.number}
                        settingKey="height"
                        settingValue={config.window.params.height}
                        limits={{ min: 240, max: 8640, step: 40 }}
                        on:changed={e => {
                            config.window.params.height = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 窗口置顶 -->
                <Item
                    title={i18n.settings.window.top.title}
                    text={i18n.settings.window.top.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="top"
                        settingValue={config.window.params.alwaysOnTop}
                        on:changed={e => {
                            config.window.params.alwaysOnTop = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 窗口菜单栏 -->
                <Item
                    title={i18n.settings.window.menuBar.title}
                    text={i18n.settings.window.menuBar.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="menuBar"
                        settingValue={config.window.params.enableMenuBar // 是否启用菜单栏
                            ? config.window.params.autoHideMenuBar // 是否自动隐藏菜单栏
                                ? MenuBarStatus.AutoHide // 自动隐藏
                                : MenuBarStatus.AlwaysShow // 总是显示
                            : MenuBarStatus.Disabled}
                        on:changed={e => {
                            switch (e.detail.value) {
                                case MenuBarStatus.AutoHide:
                                    config.window.params.enableMenuBar = true;
                                    config.window.params.autoHideMenuBar = true;
                                    break;
                                case MenuBarStatus.AlwaysShow:
                                    config.window.params.enableMenuBar = true;
                                    config.window.params.autoHideMenuBar = false;
                                    break;
                                case MenuBarStatus.Disabled:
                                    config.window.params.enableMenuBar = false;
                                    break;
                            }
                            updated();
                        }}
                        options={[
                            { key: MenuBarStatus.AutoHide, text: i18n.settings.window.menuBar.options.autoHide },
                            { key: MenuBarStatus.AlwaysShow, text: i18n.settings.window.menuBar.options.alwaysShow },
                            { key: MenuBarStatus.Disabled, text: i18n.settings.window.menuBar.options.disabled },
                        ]}
                    />
                </Item>
            </div>

            <!-- 标签页 2 - 协议设置 -->
            <div
                data-type={tabs.window[1].name}
                class:fn__none={tabs.window[1].key !== focusTab}
            >
                <Group title={i18n.settings.protocols.title}>
                    {#each Object.entries(config.window.open.protocols) as [key, protocol] (key)}
                        <MiniItem minWidth="8em">
                            <code
                                slot="title"
                                class="fn__code">{protocol.prefix}</code
                            >
                            <Input
                                slot="input"
                                type={ItemType.checkbox}
                                settingKey="Checkbox"
                                settingValue={protocol.enable}
                                on:changed={e => {
                                    protocol.enable = e.detail.value;
                                    updated();
                                }}
                            />
                        </MiniItem>
                    {/each}
                </Group>
            </div>

            <!-- 标签页 3 - 快捷键设置 -->
            <div
                data-type={tabs.window[2].name}
                class:fn__none={tabs.window[2].key !== focusTab}
            >
                <Shortcut
                    minWidth="16em"
                    title={i18n.settings.open.shortcut.title}
                    shortcut={config.window.open.mouse}
                    displayMouseEvent={false}
                    disabledMouseButton={true}
                    mouseButtonTitle={i18n.settings.mouse.button}
                    mouseButtonOptions={[{ key: MouseButton.Middle, text: i18n.settings.mouse.middle }]}
                    on:changed={updated}
                />
            </div>

            <!-- 标签页 4 - 思源窗口设置 -->
            <div
                data-type={tabs.window[3].name}
                class:fn__none={tabs.window[3].key !== focusTab}
            >
                <!-- 是否启用 -->
                <Item
                    title={i18n.settings.siyuan.enable.title}
                    text={i18n.settings.siyuan.enable.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.window.siyuan.enable}
                        on:changed={e => {
                            config.window.siyuan.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 打开一个桌面端编辑器 -->
                <Item
                    title={i18n.settings.siyuan.open.desktop.title}
                    text={i18n.settings.siyuan.open.desktop.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.button}
                        settingKey="open-desktop-window"
                        settingValue={i18n.settings.siyuan.open.desktop.text}
                        on:clicked={e => plugin.openSiyuanDesktopWindow(e.detail.event)}
                    />
                </Item>

                <!-- 打开一个移动端编辑器 -->
                <Item
                    title={i18n.settings.siyuan.open.mobile.title}
                    text={i18n.settings.siyuan.open.mobile.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.button}
                        settingKey="open-mobile-window"
                        settingValue={i18n.settings.siyuan.open.mobile.text}
                        on:clicked={e => plugin.openSiyuanMobileWindow(e.detail.event)}
                    />
                </Item>

                <!-- 是否默认聚焦 -->
                <Item
                    title={i18n.settings.siyuan.focus.title}
                    text={i18n.settings.siyuan.focus.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="focus"
                        settingValue={config.window.siyuan.focus}
                        on:changed={e => {
                            config.window.siyuan.focus = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 默认打开的思源编辑器 -->
                <Item
                    title={i18n.settings.siyuan.editorType.title}
                    text={i18n.settings.siyuan.editorType.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="menuBar"
                        settingValue={config.window.siyuan.editorType}
                        on:changed={e => {
                            config.window.siyuan.editorType = e.detail.value;
                            updated();
                        }}
                        options={[
                            { key: EditorType.mobile, text: i18n.settings.siyuan.editorType.options.mobile },
                            { key: EditorType.desktop, text: i18n.settings.siyuan.editorType.options.desktop },
                        ]}
                    />
                </Item>
            </div>
        </Tabs>
    </Panel>
</Panels>

<style lang="less">
</style>
