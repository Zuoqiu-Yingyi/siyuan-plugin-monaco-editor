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
    import Input from "@workspace/components/siyuan/setting/item/Input.svelte";
    import { ItemType } from "@workspace/components/siyuan/setting/item/item";
    import Item from "@workspace/components/siyuan/setting/item/Item.svelte";
    import Panel from "@workspace/components/siyuan/setting/panel/Panel.svelte";
    import Panels from "@workspace/components/siyuan/setting/panel/Panels.svelte";
    import Tabs from "@workspace/components/siyuan/setting/tab/Tabs.svelte";

    import { OpenScheme } from "@/utils/url";
    import { AssetsUploadMode } from "@/vditor/asset";

    import type { ITab } from "@workspace/components/siyuan/setting/tab";

    import type MonacoEditorPlugin from "@/index";
    import type { IConfig } from "@/types/config";

    interface IProps {
        config: IConfig; // 传入的配置项
        plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件实例
    }

    const {
        config,
        plugin,
    }: IProps = $props();

    // svelte-ignore state_referenced_locally
    const i18n = plugin.i18n;

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

    const PanelKey = {
        general: "general", // 常规设置
        menu: "menu", // 菜单设置
        editor: "editor", // 编辑器设置
    } as const;

    const panels_focus_key = PanelKey.general;
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
        {
            key: PanelKey.editor,
            text: i18n.settings.editorSettings.title,
            name: i18n.settings.editorSettings.title,
            icon: "#icon-monaco-editor",
        },
    ];

    const TabKey = {
        global: "global", // 全局设置
        monaco: "monaco", // Monaco 编辑器设置
        vditor: "vditor", // Vditor 编辑器设置
    } as const;

    const editor_settings_tabs_focus_key = TabKey.global;
    const tabs = {
        editor: [
            {
                key: TabKey.global,
                text: i18n.settings.editorSettings.globalTab.title,
                name: i18n.settings.editorSettings.globalTab.title,
                icon: "⚙",
            },
            {
                key: TabKey.monaco,
                text: i18n.settings.editorSettings.monacoTab.title,
                name: i18n.settings.editorSettings.monacoTab.title,
            },
            {
                key: TabKey.vditor,
                text: i18n.settings.editorSettings.vditorTab.title,
                name: i18n.settings.editorSettings.vditorTab.title,
            },
        ] as ITab[],
    };

    const default_editor_markdown_options = [
        { key: OpenScheme.Editor, text: i18n.settings.editorSettings.globalTab.defaultEditor.markdown.options.monaco },
        { key: OpenScheme.Vditor, text: i18n.settings.editorSettings.globalTab.defaultEditor.markdown.options.vditor },
    ];

    const assets_upload_mode_options = [
        { key: AssetsUploadMode.assets, text: i18n.settings.editorSettings.vditorTab.assetsUploadMode.options.assets },
        { key: AssetsUploadMode.relative, text: i18n.settings.editorSettings.vditorTab.assetsUploadMode.options.relative },
        { key: AssetsUploadMode.absolute, text: i18n.settings.editorSettings.vditorTab.assetsUploadMode.options.absolute },
    ];

    const word_wrap_options = [
        { key: "off", text: i18n.settings.editorSettings.monacoTab.wordWrap.options.off },
        { key: "on", text: i18n.settings.editorSettings.monacoTab.wordWrap.options.on },
        { key: "wordWrapColumn", text: i18n.settings.editorSettings.monacoTab.wordWrap.options.wordWrapColumn },
        { key: "bounded", text: i18n.settings.editorSettings.monacoTab.wordWrap.options.bounded },
    ];
</script>

<Panels
    focus={panels_focus_key}
    {panels}
    let:focus={focusPanel}
>
    <!-- 常规设置面板 -->
    <Panel display={panels[0]?.key === focusPanel}>
        <!-- 编辑器面板 -->
        <Item
            text={i18n.settings.generalSettings.editor.description}
            title={i18n.settings.generalSettings.editor.title}
        >
            <Input
                slot="input"
                settingKey="Editor"
                settingValue={config.dock.editor.enable}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.dock.editor.enable = e.detail.value;
                    await updated();
                    globalThis.location.reload();
                }}
            />
        </Item>

        <!-- 资源管理器面板 -->
        <Item
            text={i18n.settings.generalSettings.explorer.description}
            title={i18n.settings.generalSettings.explorer.title}
        >
            <Input
                slot="input"
                settingKey="Explorer"
                settingValue={config.dock.explorer.enable}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.dock.explorer.enable = e.detail.value;
                    await updated();
                    globalThis.location.reload();
                }}
            />
        </Item>

        <!-- 安全模式 -->
        <Item
            text={i18n.settings.generalSettings.safeMode.description}
            title={i18n.settings.generalSettings.safeMode.title}
        >
            <Input
                slot="input"
                settingKey="Safe Mode"
                settingValue={config.dock.explorer.safe}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.dock.explorer.safe = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 重置设置 -->
        <Item
            text={i18n.settings.generalSettings.reset.description}
            title={i18n.settings.generalSettings.reset.title}
        >
            <Input
                slot="input"
                settingKey="Reset"
                settingValue={i18n.settings.generalSettings.reset.text}
                type={ItemType.button}
                on:clicked={resetOptions}
            />
        </Item>
    </Panel>

    <!-- 菜单面板 -->
    <Panel display={panels[1]?.key === focusPanel}>
        <!-- 代码片段右键菜单 -->
        <Item
            text={i18n.settings.menuSettings.snippet.description}
            title={i18n.settings.menuSettings.snippet.title}
        >
            <Input
                slot="input"
                settingKey="Snippet"
                settingValue={config.operates.menu.snippet}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.operates.menu.snippet = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 收集箱速记右键菜单 -->
        <Item
            text={i18n.settings.menuSettings.shorthand.description}
            title={i18n.settings.menuSettings.shorthand.title}
        >
            <Input
                slot="input"
                settingKey="Shorthand"
                settingValue={config.operates.menu.shorthand}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.operates.menu.shorthand = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 文件历史面板 -->
        <Item
            text={i18n.settings.menuSettings.history1.description}
            title={i18n.settings.menuSettings.history1.title}
        >
            <Input
                slot="input"
                settingKey="File hostory"
                settingValue={config.operates.menu.history1}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.operates.menu.history1 = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 文档历史面板 -->
        <Item
            text={i18n.settings.menuSettings.history2.description}
            title={i18n.settings.menuSettings.history2.title}
        >
            <Input
                slot="input"
                settingKey="Document hostory"
                settingValue={config.operates.menu.history2}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.operates.menu.history2 = e.detail.value;
                    await updated();
                }}
            />
        </Item>

        <!-- 快照 -->
        <Item
            text={i18n.settings.menuSettings.snapshot.description}
            title={i18n.settings.menuSettings.snapshot.title}
        >
            <Input
                slot="input"
                settingKey="Snapshot"
                settingValue={config.operates.menu.snapshot}
                type={ItemType.checkbox}
                on:changed={async (e) => {
                    config.operates.menu.snapshot = e.detail.value;
                    await updated();
                }}
            />
        </Item>
    </Panel>

    <!-- 编辑器面板 -->
    <Panel display={panels[2]?.key === focusPanel}>
        <Tabs
            focus={editor_settings_tabs_focus_key}
            tabs={tabs.editor}
            let:focus={focusTab}
        >
            <!-- 标签页 1 - 全局设置 -->
            <div
                class:fn__none={tabs.editor[0]?.key !== focusTab}
                data-type={tabs.editor[0]?.name}
            >
                <!-- Markdown 文件默认编辑器 -->
                <Item
                    text={i18n.settings.editorSettings.globalTab.defaultEditor.markdown.description}
                    title={i18n.settings.editorSettings.globalTab.defaultEditor.markdown.title}
                >
                    <Input
                        slot="input"
                        options={default_editor_markdown_options}
                        settingKey="open.markdown"
                        settingValue={config.open.markdown}
                        type={ItemType.select}
                        on:changed={async (e) => {
                            config.open.markdown = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 2 - Monaco 编辑器设置 -->
            <div
                class:fn__none={tabs.editor[1]?.key !== focusTab}
                data-type={tabs.editor[1]?.name}
            >
                <!-- 自动折行方案 -->
                <Item
                    block={true}
                    text={i18n.settings.editorSettings.monacoTab.wordWrap.description}
                    title={i18n.settings.editorSettings.monacoTab.wordWrap.title}
                >
                    <Input
                        slot="input"
                        block={true}
                        options={word_wrap_options}
                        settingKey="editor.wordWrap"
                        settingValue={config.editor.options.wordWrap}
                        type={ItemType.select}
                        on:changed={async (e) => {
                            config.editor.options.wordWrap = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 3 - Vditor 编辑器设置 -->
            <div
                class:fn__none={tabs.editor[2]?.key !== focusTab}
                data-type={tabs.editor[2]?.name}
            >
                <!-- 资源文件保存方案 -->
                <Item
                    block={true}
                    text={i18n.settings.editorSettings.vditorTab.assetsUploadMode.description}
                    title={i18n.settings.editorSettings.vditorTab.assetsUploadMode.title}
                >
                    <Input
                        slot="input"
                        block={true}
                        options={assets_upload_mode_options}
                        settingKey="vditor.assetsUploadMode"
                        settingValue={config.vditor.assetsUploadMode}
                        type={ItemType.select}
                        on:changed={async (e) => {
                            config.vditor.assetsUploadMode = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 资源文件保存目录 -->
                <Item
                    block={true}
                    text={i18n.settings.editorSettings.vditorTab.assetsDirPath.description}
                    title={i18n.settings.editorSettings.vditorTab.assetsDirPath.title}
                >
                    <Input
                        slot="input"
                        block={true}
                        settingKey="vditor.assetsDirPath"
                        settingValue={config.vditor.assetsDirPath}
                        type={ItemType.text}
                        on:changed={async (e) => {
                            config.vditor.assetsDirPath = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>
            </div>
        </Tabs>
    </Panel>
</Panels>

<style lang="less">
</style>
