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

<!-- 文件资源管理器面板 -->
<script lang="ts">
    import { setContext } from "svelte";
    import Bar from "@workspace/components/siyuan/dock/Bar.svelte";
    import FileTree from "@workspace/components/siyuan/tree/file/FileTree.svelte";

    import { TooltipsDirection } from "@workspace/components/siyuan/misc/tooltips";

    import type { IBar } from "@workspace/components/siyuan/dock/index";
    import type MonacoEditorPlugin from "@/index";
    import { Explorer } from "@/explorer";
    import type { ITree } from "@workspace/components/siyuan/tree/file";
    import { ExplorerIcon } from "@/explorer/icon";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
    export let workspace: string; // 工作空间目录

    const explorer = new Explorer(plugin, workspace);
    let roots = explorer.createRootNodes();
    setContext<ITree>("tree", explorer);

    /* 标题栏配置 */
    const bar: IBar = {
        logo: ExplorerIcon.ICONS.filetree,
        title: plugin.i18n.explorer.title,
        icons: [
            {
                // 刷新
                icon: "#iconRefresh",
                type: "refresh",
                ariaLabel: plugin.i18n.explorer.refresh.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick: (_e, _element, _props) => {
                    try {
                        roots.forEach(root => {
                            const node = explorer.path2node(root.path);
                            if (node) explorer.updateNode(node, true);
                        });
                    } catch (error) {
                        plugin.catch(error);
                    }
                },
            },
            {
                // 折叠
                icon: "#iconContract",
                type: "collapse",
                ariaLabel: plugin.i18n.dock.collapse.ariaLabel,
                tooltipsDirection: TooltipsDirection.sw,
                onClick: (_e, _element, _props) => {
                    try {
                        roots.forEach(root => {
                            const node = explorer.path2node(root.path);
                            if (node) explorer.collapseNode(node, true);
                        });
                    } catch (error) {
                        plugin.catch(error);
                    }
                },
            },
            {
                // 最小化
                icon: "#iconMin",
                type: "min",
                ariaLabel: `${globalThis.siyuan.languages.min} ${plugin.siyuan.adaptHotkey("⌘W")}`,
                tooltipsDirection: TooltipsDirection.sw,
            },
        ],
    };
</script>

<Bar {...bar} />
<FileTree
    on:menu={explorer.menu}
    on:open={explorer.open}
    on:fold={explorer.fold}
    on:unfold={explorer.unfold}
    on:dragstart={explorer.dragstart}
    on:dragend={explorer.dragend}
    on:dragenter={explorer.dragenter}
    on:dragover={explorer.dragover}
    on:dragleave={explorer.dragleave}
    on:drop={explorer.drop}
    {roots}
/>
