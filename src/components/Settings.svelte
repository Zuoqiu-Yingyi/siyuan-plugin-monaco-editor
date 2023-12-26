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
    import Tabs from "@workspace/components/siyuan/setting/tab/Tabs.svelte";
    import Input from "@workspace/components/siyuan/setting/item/Input.svelte";

    import { ItemType } from "@workspace/components/siyuan/setting/item/item";
    import { type ITab } from "@workspace/components/siyuan/setting/tab";

    import type MonacoEditorPlugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";
    import { OpenScheme } from "@/utils/url";
    import { AssetsUploadMode } from "@/vditor/asset";

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
        editor, // 编辑器设置
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
        {
            key: PanelKey.editor,
            text: i18n.settings.editorSettings.title,
            name: i18n.settings.editorSettings.title,
            icon: "#icon-monaco-editor",
        },
    ];

    enum TabKey {
        global, // 全局设置
        monaco, // Monaco 编辑器设置
        vditor, // Vditor 编辑器设置
    }

    let editor_settings_tabs_focus_key = TabKey.global;
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

    <!-- 编辑器面板 -->
    <Panel display={panels[2].key === focusPanel}>
        <Tabs
            focus={editor_settings_tabs_focus_key}
            tabs={tabs.editor}
            let:focus={focusTab}
        >
            <!-- 标签页 1 - 全局设置 -->
            <div
                data-type={tabs.editor[0].name}
                class:fn__none={tabs.editor[0].key !== focusTab}
            >
                <!-- Markdown 文件默认编辑器 -->
                <Item
                    title={i18n.settings.editorSettings.globalTab.defaultEditor.markdown.title}
                    text={i18n.settings.editorSettings.globalTab.defaultEditor.markdown.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="open.markdown"
                        settingValue={config.open.markdown}
                        options={default_editor_markdown_options}
                        on:changed={async e => {
                            config.open.markdown = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 2 - Monaco 编辑器设置 -->
            <div
                data-type={tabs.editor[1].name}
                class:fn__none={tabs.editor[1].key !== focusTab}
            >
                <!-- 自动折行方案 -->
                <Item
                    title={i18n.settings.editorSettings.monacoTab.wordWrap.title}
                    text={i18n.settings.editorSettings.monacoTab.wordWrap.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="editor.wordWrap"
                        settingValue={config.editor.options.wordWrap}
                        block={true}
                        options={word_wrap_options}
                        on:changed={async e => {
                            config.editor.options.wordWrap = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 3 - Vditor 编辑器设置 -->
            <div
                data-type={tabs.editor[2].name}
                class:fn__none={tabs.editor[2].key !== focusTab}
            >
                <!-- 资源文件保存方案 -->
                <Item
                    title={i18n.settings.editorSettings.vditorTab.assetsUploadMode.title}
                    text={i18n.settings.editorSettings.vditorTab.assetsUploadMode.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="vditor.assetsUploadMode"
                        settingValue={config.vditor.assetsUploadMode}
                        block={true}
                        options={assets_upload_mode_options}
                        on:changed={async e => {
                            config.vditor.assetsUploadMode = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 资源文件保存目录 -->
                <Item
                    title={i18n.settings.editorSettings.vditorTab.assetsDirPath.title}
                    text={i18n.settings.editorSettings.vditorTab.assetsDirPath.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.text}
                        settingKey="vditor.assetsDirPath"
                        settingValue={config.vditor.assetsDirPath}
                        block={true}
                        on:changed={async e => {
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
