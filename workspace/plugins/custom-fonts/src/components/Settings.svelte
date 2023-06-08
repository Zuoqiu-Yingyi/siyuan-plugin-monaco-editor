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

    import type CustomFontsPlugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";

    export let config: IConfig; // 传入的配置项
    export let plugin: InstanceType<typeof CustomFontsPlugin>; // 插件实例

    export let textareaHeight: number = 0; // 文本框高度(px)

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
        snippet,
        fonts,
    }

    enum TabKey {
        base,
        code,
        graph,
        math,
        emoji,
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
            key: PanelKey.snippet,
            text: i18n.settings.cssSettings.title,
            name: i18n.settings.cssSettings.title,
            icon: "#iconCode",
        },
        {
            key: PanelKey.fonts,
            text: i18n.settings.fontsSettings.title,
            name: i18n.settings.fontsSettings.title,
            icon: "#iconFont",
        },
    ];

    let fonts_settings_tabs_focus_key = TabKey.base;
    const tabs = {
        fonts: [
            {
                key: TabKey.base,
                text: i18n.settings.fontsSettings.base.title,
                name: i18n.settings.fontsSettings.base.title,
                icon: "🗛",
            },
            {
                key: TabKey.code,
                text: i18n.settings.fontsSettings.code.title,
                name: i18n.settings.fontsSettings.code.title,
                icon: "💻",
            },
            {
                key: TabKey.graph,
                text: i18n.settings.fontsSettings.graph.title,
                name: i18n.settings.fontsSettings.graph.title,
                icon: "📊",
            },
            {
                key: TabKey.math,
                text: i18n.settings.fontsSettings.math.title,
                name: i18n.settings.fontsSettings.math.title,
                icon: "🔢",
            },
            {
                key: TabKey.emoji,
                text: i18n.settings.fontsSettings.emoji.title,
                name: i18n.settings.fontsSettings.emoji.title,
                icon: "🙂",
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

        <!-- 查看系统字体 -->
        <Item
            title={i18n.settings.generalSettings.showSystemFonts.title}
            text={i18n.settings.generalSettings.showSystemFonts.description}
        >
            <Input
                slot="input"
                type={ItemType.button}
                settingKey="showSystemFonts"
                settingValue={i18n.settings.generalSettings.showSystemFonts.text}
                on:clicked={() => plugin.showSystemFonts()}
            />
        </Item>

        <!-- 查看可用字体 -->
        <Item
            title={i18n.settings.generalSettings.showUsableFonts.title}
            text={i18n.settings.generalSettings.showUsableFonts.description}
        >
            <Input
                slot="input"
                type={ItemType.button}
                settingKey="showSystemFonts"
                settingValue={i18n.settings.generalSettings.showUsableFonts.text}
                on:clicked={() => plugin.showUsableFonts()}
            />
        </Item>
    </Panel>

    <!-- CSS 片段设置面板 -->
    <Panel display={panels[1].key === focusPanel}>
        <!-- 是否启用 CSS 片段 -->
        <Item
            title={i18n.settings.cssSettings.enable.title}
            text={i18n.settings.cssSettings.enable.description}
        >
            <Input
                slot="input"
                type={ItemType.checkbox}
                settingKey="enable"
                settingValue={config.css.enable}
                on:changed={e => {
                    config.css.enable = e.detail.value;
                    updated();
                }}
            />
        </Item>

        <!-- CSS 片段输入框 -->
        <Item
            block={true}
            title={i18n.settings.cssSettings.snippet.title}
            text={i18n.settings.cssSettings.snippet.description}
        >
            <Input
                slot="input"
                block={true}
                type={ItemType.textarea}
                height={textareaHeight}
                settingKey="code"
                settingValue={config.css.code}
                placeholder={i18n.settings.cssSettings.snippet.placeholder}
                on:changed={e => {
                    config.css.code = e.detail.value;
                    updated();
                }}
            />
        </Item>
    </Panel>

    <!-- 字体设置面板 -->
    <Panel display={panels[2].key === focusPanel}>
        <Tabs
            focus={fonts_settings_tabs_focus_key}
            tabs={tabs.fonts}
            let:focus={focusTab}
        >
            <!-- 标签页 1 - 基础字体设置 -->
            <div
                data-type={tabs.fonts[0].name}
                class:fn__none={tabs.fonts[0].key !== focusTab}
            >
                <!-- 是否启用自定义字体列表 -->
                <Item
                    title={i18n.settings.fontsSettings.base.enable.title}
                    text={i18n.settings.fontsSettings.base.enable.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.fonts.base.enable}
                        on:changed={e => {
                            config.fonts.base.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 自定义字体列表 -->
                <Item
                    block={true}
                    title={i18n.settings.fontsSettings.base.fontsList.title}
                    text={i18n.settings.fontsSettings.base.fontsList.description}
                >
                    <Input
                        slot="input"
                        block={true}
                        type={ItemType.textarea}
                        height={textareaHeight}
                        settingKey="list"
                        settingValue={config.fonts.base.list.join("\n")}
                        placeholder={i18n.settings.fontsSettings.base.fontsList.placeholder}
                        on:changed={e => {
                            if (e.detail.value === "") {
                                config.fonts.base.list = [];
                            } else {
                                config.fonts.base.list = e.detail.value.split("\n");
                            }
                            updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 2 - 代码字体设置 -->
            <div
                data-type={tabs.fonts[1].name}
                class:fn__none={tabs.fonts[1].key !== focusTab}
            >
                <!-- 是否启用自定义字体列表 -->
                <Item
                    title={i18n.settings.fontsSettings.code.enable.title}
                    text={i18n.settings.fontsSettings.code.enable.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.fonts.code.enable}
                        on:changed={e => {
                            config.fonts.code.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 自定义字体列表 -->
                <Item
                    block={true}
                    title={i18n.settings.fontsSettings.code.fontsList.title}
                    text={i18n.settings.fontsSettings.code.fontsList.description}
                >
                    <Input
                        slot="input"
                        block={true}
                        type={ItemType.textarea}
                        height={textareaHeight}
                        settingKey="list"
                        settingValue={config.fonts.code.list.join("\n")}
                        placeholder={i18n.settings.fontsSettings.code.fontsList.placeholder}
                        on:changed={e => {
                            if (e.detail.value === "") {
                                config.fonts.code.list = [];
                            } else {
                                config.fonts.code.list = e.detail.value.split("\n");
                            }
                            updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 3 - 图表字体设置 -->
            <div
                data-type={tabs.fonts[2].name}
                class:fn__none={tabs.fonts[2].key !== focusTab}
            >
                <!-- 是否启用自定义字体列表 -->
                <Item
                    title={i18n.settings.fontsSettings.graph.enable.title}
                    text={i18n.settings.fontsSettings.graph.enable.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.fonts.graph.enable}
                        on:changed={e => {
                            config.fonts.graph.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 自定义字体列表 -->
                <Item
                    block={true}
                    title={i18n.settings.fontsSettings.graph.fontsList.title}
                    text={i18n.settings.fontsSettings.graph.fontsList.description}
                >
                    <Input
                        slot="input"
                        block={true}
                        type={ItemType.textarea}
                        height={textareaHeight}
                        settingKey="list"
                        settingValue={config.fonts.graph.list.join("\n")}
                        placeholder={i18n.settings.fontsSettings.graph.fontsList.placeholder}
                        on:changed={e => {
                            if (e.detail.value === "") {
                                config.fonts.graph.list = [];
                            } else {
                                config.fonts.graph.list = e.detail.value.split("\n");
                            }
                            updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 4 - 数学字体设置 -->
            <div
                data-type={tabs.fonts[3].name}
                class:fn__none={tabs.fonts[3].key !== focusTab}
            >
                <!-- 是否启用自定义字体列表 -->
                <Item
                    title={i18n.settings.fontsSettings.math.enable.title}
                    text={i18n.settings.fontsSettings.math.enable.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.fonts.math.enable}
                        on:changed={e => {
                            config.fonts.math.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 自定义字体列表 -->
                <Item
                    block={true}
                    title={i18n.settings.fontsSettings.math.fontsList.title}
                    text={i18n.settings.fontsSettings.math.fontsList.description}
                >
                    <Input
                        slot="input"
                        block={true}
                        type={ItemType.textarea}
                        height={textareaHeight}
                        settingKey="list"
                        settingValue={config.fonts.math.list.join("\n")}
                        placeholder={i18n.settings.fontsSettings.math.fontsList.placeholder}
                        on:changed={e => {
                            if (e.detail.value === "") {
                                config.fonts.math.list = [];
                            } else {
                                config.fonts.math.list = e.detail.value.split("\n");
                            }
                            updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 5 - 表情符号字体设置 -->
            <div
                data-type={tabs.fonts[4].name}
                class:fn__none={tabs.fonts[4].key !== focusTab}
            >
                <!-- 是否启用自定义字体列表 -->
                <Item
                    title={i18n.settings.fontsSettings.emoji.enable.title}
                    text={i18n.settings.fontsSettings.emoji.enable.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="enable"
                        settingValue={config.fonts.emoji.enable}
                        on:changed={e => {
                            config.fonts.emoji.enable = e.detail.value;
                            updated();
                        }}
                    />
                </Item>

                <!-- 自定义字体列表 -->
                <Item
                    block={true}
                    title={i18n.settings.fontsSettings.emoji.fontsList.title}
                    text={i18n.settings.fontsSettings.emoji.fontsList.description}
                >
                    <Input
                        slot="input"
                        block={true}
                        type={ItemType.textarea}
                        height={textareaHeight}
                        settingKey="list"
                        settingValue={config.fonts.emoji.list.join("\n")}
                        placeholder={i18n.settings.fontsSettings.emoji.fontsList.placeholder}
                        on:changed={e => {
                            if (e.detail.value === "") {
                                config.fonts.emoji.list = [];
                            } else {
                                config.fonts.emoji.list = e.detail.value.split("\n");
                            }
                            updated();
                        }}
                    />
                </Item>
            </div>
        </Tabs>
    </Panel>
</Panels>

<style lang="less">
</style>
