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
    import { fn__code } from "@workspace/utils/siyuan/text/span";
    import { type ITab } from "@workspace/components/siyuan/setting/tab";

    import { Category } from "@/wakatime/heartbeats";
    import type MonacoEditorPlugin from "@/index";

    import type { IConfig } from "@/types/config";
    import type { I18N } from "@/utils/i18n";
    import WakaTimePlugin from "@/index";

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

    function cleanCache() {
        plugin.siyuan.confirm(
            i18n.settings.generalSettings.cleanCache.title, // 标题
            i18n.settings.generalSettings.cleanCache.description, // 文本
            async () => {
                await plugin.clearCache(); // 重置配置
                globalThis.location.reload(); // 刷新页面
            }, // 确认按钮回调
        );
    }

    /* 测试服务 */
    async function testService(): Promise<boolean> {
        const status = await plugin.testService();
        if (status) {
            plugin.siyuan.showMessage(
                i18n.settings.wakatimeSettings.serviceTab.test.messages.success.replaceAll(
                    "${1}", //
                    fn__code(plugin.wakatimeApiUrl), //
                ), //
                undefined, //
                "info", //
            );
        } else {
            plugin.siyuan.showMessage(
                i18n.settings.wakatimeSettings.serviceTab.test.messages.error.replaceAll(
                    "${1}", //
                    fn__code(plugin.wakatimeApiUrl), //
                ), //
                undefined, //
                "error", //
            );
        }
        return status;
    }

    enum PanelKey {
        general, // 常规设置
        wakatime, // WakaTime 设置
    }

    enum TabKey {
        general, // 常规设置
        service, // 服务设置
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
            key: PanelKey.wakatime,
            text: i18n.settings.wakatimeSettings.title,
            name: i18n.settings.wakatimeSettings.title,
            icon: "#icon-wakatime",
        },
    ];

    let wakatime_settings_tabs_focus_key = TabKey.general;
    const tabs = {
        wakatime: [
            {
                key: TabKey.general,
                text: i18n.settings.wakatimeSettings.generalTab.title,
                name: i18n.settings.wakatimeSettings.generalTab.title,
                icon: "⚙",
            },
            {
                key: TabKey.service,
                text: i18n.settings.wakatimeSettings.serviceTab.title,
                name: i18n.settings.wakatimeSettings.serviceTab.title,
                icon: "🌐",
            },
        ] as ITab[],
    };

    /* 时间选择 */
    const time_limits = {
        min: 1,
        max: Infinity,
        step: 1,
    } as const;

    /* 操作类型标签 */
    const category_options = [
        { key: Category.Coding, text: Category.Coding },
        { key: Category.Building, text: Category.Building },
        { key: Category.Indexing, text: Category.Indexing },
        { key: Category.Debugging, text: Category.Debugging },
        { key: Category.Browsing, text: Category.Browsing },
        { key: Category.RunningTests, text: Category.RunningTests },
        { key: Category.WritingTests, text: Category.WritingTests },
        { key: Category.ManualTesting, text: Category.ManualTesting },
        { key: Category.WritingDocs, text: Category.WritingDocs },
        { key: Category.CodeReviewing, text: Category.CodeReviewing },
        { key: Category.Researching, text: Category.Researching },
        { key: Category.Learning, text: Category.Learning },
        { key: Category.Designing, text: Category.Designing },
    ];
</script>

<Panels
    {panels}
    focus={panels_focus_key}
    let:focus={focusPanel}
>
    <!-- 常规设置面板 -->
    <Panel display={panels[0].key === focusPanel}>
        <!-- 清理离线缓存 -->
        <Item
            title={i18n.settings.generalSettings.cleanCache.title}
            text={i18n.settings.generalSettings.cleanCache.description}
        >
            <Input
                slot="input"
                type={ItemType.button}
                settingKey="cleanCache"
                settingValue={i18n.settings.generalSettings.cleanCache.text}
                on:clicked={cleanCache}
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

    <!-- 服务设置面板 -->
    <Panel display={panels[1].key === focusPanel}>
        <Tabs
            focus={wakatime_settings_tabs_focus_key}
            tabs={tabs.wakatime}
            let:focus={focusTab}
        >
            <!-- 标签页 1 - 常规设置 -->
            <div
                data-type={tabs.wakatime[0].name}
                class:fn__none={tabs.wakatime[0].key !== focusTab}
            >
                <!-- 心跳连接 -->
                <Item
                    title={i18n.settings.wakatimeSettings.generalTab.heartbeats.title}
                    text={i18n.settings.wakatimeSettings.generalTab.heartbeats.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="Heartbeats"
                        settingValue={config.wakatime.heartbeats}
                        on:changed={async e => {
                            config.wakatime.heartbeats = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 工作空间名称 -->
                <Item
                    title={i18n.settings.wakatimeSettings.generalTab.project.title}
                    text={i18n.settings.wakatimeSettings.generalTab.project.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.text}
                        settingKey="project"
                        settingValue={config.wakatime.project}
                        placeholder={plugin.wakatimeDefaultProject}
                        on:changed={async e => {
                            config.wakatime.project = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 语言名称 -->
                <Item
                    title={i18n.settings.wakatimeSettings.generalTab.language.title}
                    text={i18n.settings.wakatimeSettings.generalTab.language.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.text}
                        settingKey="language"
                        settingValue={config.wakatime.language}
                        placeholder={plugin.wakatimeDefaultLanguage}
                        on:changed={async e => {
                            config.wakatime.language = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 推送时间间隔 -->
                <Item
                    title={i18n.settings.wakatimeSettings.generalTab.interval.title}
                    text={i18n.settings.wakatimeSettings.generalTab.interval.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.number}
                        settingKey="interval"
                        settingValue={config.wakatime.interval}
                        limits={time_limits}
                        on:changed={async e => {
                            config.wakatime.interval = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 查看操作标签 -->
                <Item
                    title={i18n.settings.wakatimeSettings.generalTab.viewCategory.title}
                    text={i18n.settings.wakatimeSettings.generalTab.viewCategory.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="view.category"
                        settingValue={config.wakatime.view.category}
                        options={category_options}
                        on:changed={async e => {
                            config.wakatime.view.category = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 编辑操作标签 -->
                <Item
                    title={i18n.settings.wakatimeSettings.generalTab.editCategory.title}
                    text={i18n.settings.wakatimeSettings.generalTab.editCategory.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.select}
                        settingKey="edit.category"
                        settingValue={config.wakatime.edit.category}
                        options={category_options}
                        on:changed={async e => {
                            config.wakatime.edit.category = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>
            </div>

            <!-- 标签页 2 - 服务设置 -->
            <div
                data-type={tabs.wakatime[1].name}
                class:fn__none={tabs.wakatime[1].key !== focusTab}
            >
                <!-- 测试连接状态 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.test.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.test.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.button}
                        settingKey="Test"
                        settingValue={i18n.settings.wakatimeSettings.serviceTab.test.text}
                        on:clicked={testService}
                    />
                </Item>

                <!-- API URL -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.apiURL.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.apiURL.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.text}
                        settingKey="api_url"
                        settingValue={config.wakatime.api_url}
                        placeholder={plugin.wakatimeDefaultApiUrl}
                        block={true}
                        on:changed={async e => {
                            config.wakatime.api_url = e.detail.value;
                            await updated();
                            await testService();
                        }}
                    />
                </Item>

                <!-- API KEY -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.apiKey.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.apiKey.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.text}
                        settingKey="api_key"
                        settingValue={config.wakatime.api_key}
                        placeholder="API KEY"
                        block={true}
                        on:changed={async e => {
                            config.wakatime.api_key = e.detail.value;
                            await updated();
                            await testService();
                        }}
                    />
                </Item>

                <!-- 主机名称 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.hostname.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.hostname.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.text}
                        settingKey="hostname"
                        settingValue={config.wakatime.hostname}
                        placeholder={plugin.wakatimeDefaultHostname}
                        on:changed={async e => {
                            config.wakatime.hostname = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 超时时间 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.timeout.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.timeout.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.number}
                        settingKey="timeout"
                        settingValue={config.wakatime.timeout}
                        limits={time_limits}
                        on:changed={async e => {
                            config.wakatime.timeout = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 隐藏笔记本名 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.hide_branch_names.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.hide_branch_names.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="hide_branch_names"
                        settingValue={config.wakatime.hide_branch_names}
                        on:changed={async e => {
                            config.wakatime.hide_branch_names = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 隐藏文件名 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.hide_file_names.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.hide_file_names.description}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="hide_file_names"
                        settingValue={config.wakatime.hide_file_names}
                        on:changed={async e => {
                            config.wakatime.hide_file_names = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- 离线缓存 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.offline.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.offline.description.replaceAll(
                        "${1}", //
                        fn__code(WakaTimePlugin.OFFLINE_CACHE_PATH), //
                    )}
                >
                    <Input
                        slot="input"
                        type={ItemType.checkbox}
                        settingKey="offline"
                        settingValue={config.wakatime.offline}
                        on:changed={async e => {
                            config.wakatime.offline = e.detail.value;
                            await updated();
                        }}
                    />
                </Item>

                <!-- ID 包含列表 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.includeID.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.includeID.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.textarea}
                        settingKey="includeID"
                        settingValue={config.wakatime.includeID.join("\n")}
                        placeholder={i18n.settings.wakatimeSettings.serviceTab.includeID.placeholder}
                        block={true}
                        on:changed={async e => {
                            config.wakatime.includeID = e.detail.value.split("\n");
                            await updated();
                        }}
                    />
                </Item>

                <!-- ID 排除列表 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.excludeID.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.excludeID.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.textarea}
                        settingKey="excludeID"
                        settingValue={config.wakatime.excludeID.join("\n")}
                        placeholder={i18n.settings.wakatimeSettings.serviceTab.excludeID.placeholder}
                        block={true}
                        on:changed={async e => {
                            config.wakatime.excludeID = e.detail.value.split("\n");
                            await updated();
                        }}
                    />
                </Item>

                <!-- 包含列表 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.include.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.include.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.textarea}
                        settingKey="include"
                        settingValue={config.wakatime.include.join("\n")}
                        placeholder={i18n.settings.wakatimeSettings.serviceTab.include.placeholder}
                        block={true}
                        on:changed={async e => {
                            config.wakatime.include = e.detail.value.split("\n");
                            await updated();
                        }}
                    />
                </Item>

                <!-- 排除列表 -->
                <Item
                    title={i18n.settings.wakatimeSettings.serviceTab.exclude.title}
                    text={i18n.settings.wakatimeSettings.serviceTab.exclude.description}
                    block={true}
                >
                    <Input
                        slot="input"
                        type={ItemType.textarea}
                        settingKey="exclude"
                        settingValue={config.wakatime.exclude.join("\n")}
                        placeholder={i18n.settings.wakatimeSettings.serviceTab.exclude.placeholder}
                        block={true}
                        on:changed={async e => {
                            config.wakatime.exclude = e.detail.value.split("\n");
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
