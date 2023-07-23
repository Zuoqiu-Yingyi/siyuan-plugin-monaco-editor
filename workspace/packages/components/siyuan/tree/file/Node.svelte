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

<script lang="ts">
    import { createEventDispatcher, onDestroy, getContext } from "svelte";
    import { writable, type Unsubscriber } from "svelte/store";

    import { FileTreeNodeType, type IFileTreeEvent, type IFileTreeNode, type IFileTreeNodeStores, type ITree } from ".";
    import Svg from "./../../misc/Svg.svelte";
    import SvgArrow from "./../../misc/SvgArrow.svelte";

    export let type: IFileTreeNode["type"];
    export let name: IFileTreeNode["name"];
    export let path: IFileTreeNode["path"];
    export let root: IFileTreeNode["root"];
    export let depth: IFileTreeNode["depth"] = 0;
    export let indent: IFileTreeNode["indent"] = "1em";
    export let relative: IFileTreeNode["relative"];
    export let directory: IFileTreeNode["directory"];

    export let focus: IFileTreeNode["focus"] = false;
    export let folded: IFileTreeNode["folded"] = true;
    export let symlink: IFileTreeNode["symlink"] = false;
    export let draggable: IFileTreeNode["draggable"] = false;
    export let hideActions: IFileTreeNode["hideActions"] = true;

    export let title: IFileTreeNode["title"] = "";
    export let children: IFileTreeNode["children"] = undefined;

    export let toggleIcon: IFileTreeNode["toggleIcon"] = "#iconRight";
    export let toggleAriaLabel: IFileTreeNode["toggleAriaLabel"] = "";

    export let icon: IFileTreeNode["icon"] = "";
    export let iconAriaLabel: IFileTreeNode["iconAriaLabel"] = "";

    export let text: IFileTreeNode["text"];
    export let textAriaLabel: IFileTreeNode["textAriaLabel"] = "";

    export let menuIcon: IFileTreeNode["menuIcon"] = "#iconMore";
    export let menuAriaLabel: IFileTreeNode["menuAriaLabel"] = "";

    export let symlinkIcon: IFileTreeNode["symlinkIcon"] = "#iconLink";
    export let symlinkAriaLabel: IFileTreeNode["symlinkAriaLabel"] = "";

    export let count: IFileTreeNode["count"] = NaN;
    export let countAriaLabel: IFileTreeNode["countAriaLabel"] = "";

    const dispatcher = createEventDispatcher<IFileTreeEvent>();

    const props: IFileTreeNodeStores = {
        type: writable(type),
        name: writable(name),
        path: writable(path),
        root: writable(root),
        depth: writable(depth),
        indent: writable(indent),
        relative: writable(relative),
        directory: writable(directory),

        focus: writable(focus),
        folded: writable(folded),
        symlink: writable(symlink),
        draggable: writable(draggable),
        hideActions: writable(hideActions),

        title: writable(title),
        children: writable(children),

        toggleIcon: writable(toggleIcon),
        toggleAriaLabel: writable(toggleAriaLabel),

        icon: writable(icon),
        iconAriaLabel: writable(iconAriaLabel),

        text: writable(text),
        textAriaLabel: writable(textAriaLabel),

        menuIcon: writable(menuIcon),
        menuAriaLabel: writable(menuAriaLabel),

        symlinkIcon: writable(symlinkIcon),
        symlinkAriaLabel: writable(symlinkAriaLabel),

        count: writable(count),
        countAriaLabel: writable(countAriaLabel),
    };

    $: props.type.set(type);
    $: props.name.set(name);
    $: props.path.set(path);
    $: props.root.set(root);
    $: props.depth.set(depth);
    $: props.indent.set(indent);
    $: props.relative.set(relative);
    $: props.directory.set(directory);

    $: props.focus.set(focus);
    $: props.folded.set(folded);
    $: props.symlink.set(symlink);
    $: props.draggable.set(draggable);
    $: props.hideActions.set(hideActions);

    $: props.title.set(title);
    $: props.children.set(children);

    $: props.toggleIcon.set(toggleIcon);
    $: props.toggleAriaLabel.set(toggleAriaLabel);

    $: props.icon.set(icon);
    $: props.iconAriaLabel.set(iconAriaLabel);

    $: props.text.set(text);
    $: props.textAriaLabel.set(textAriaLabel);

    $: props.menuIcon.set(menuIcon);
    $: props.menuAriaLabel.set(menuAriaLabel);

    $: props.symlinkIcon.set(symlinkIcon);
    $: props.symlinkAriaLabel.set(symlinkAriaLabel);

    $: props.count.set(count);
    $: props.countAriaLabel.set(countAriaLabel);

    const unsubscribes: Unsubscriber[] = [
        props.type.subscribe(v => (type = v)), //
        props.name.subscribe(v => (name = v)), //
        props.path.subscribe(v => (path = v)), //
        props.root.subscribe(v => (root = v)), //
        props.indent.subscribe(v => (indent = v)), //
        props.depth.subscribe(v => (depth = v)), //
        props.relative.subscribe(v => (relative = v)), //
        props.directory.subscribe(v => (directory = v)), //

        props.focus.subscribe(v => (focus = v)), //
        props.folded.subscribe(v => (folded = v)), //
        props.symlink.subscribe(v => (symlink = v)), //
        props.draggable.subscribe(v => (draggable = v)), //
        props.hideActions.subscribe(v => (hideActions = v)), //

        props.title.subscribe(v => (title = v)), //
        props.children.subscribe(v => (children = v)), //

        props.toggleIcon.subscribe(v => (toggleIcon = v)), //
        props.toggleAriaLabel.subscribe(v => (toggleAriaLabel = v)), //

        props.icon.subscribe(v => (icon = v)), //
        props.iconAriaLabel.subscribe(v => (iconAriaLabel = v)), //

        props.text.subscribe(v => (text = v)), //
        props.textAriaLabel.subscribe(v => (textAriaLabel = v)), //

        props.menuIcon.subscribe(v => (menuIcon = v)), //
        props.menuAriaLabel.subscribe(v => (menuAriaLabel = v)), //

        props.symlinkIcon.subscribe(v => (symlinkIcon = v)), //
        props.symlinkAriaLabel.subscribe(v => (symlinkAriaLabel = v)), //

        props.count.subscribe(v => (count = v)), //
        props.countAriaLabel.subscribe(v => (countAriaLabel = v)), //
    ];

    const tree = getContext<ITree>("tree");
    tree.appendNode(props);

    onDestroy(() => {
        tree.removeNode(props);
        unsubscribes.forEach(unsubscribe => unsubscribe());
    });

    /* 点击节点 */
    function open(e: MouseEvent) {
        switch (type) {
            case FileTreeNodeType.File: // 文件节点派发打开事件
                dispatcher("open", {
                    e,
                    props,
                    dispatcher,
                });
                break;
            case FileTreeNodeType.Root:
            case FileTreeNodeType.Folder:
            default: // 其他节点派发折叠/展开事件
                toggle(e);
                break;
        }
    }

    /* 点击折叠/展开按钮 */
    function toggle(e: MouseEvent) {
        if (folded) {
            dispatcher("unfold", {
                e,
                props,
                dispatcher,
            });
        } else {
            dispatcher("fold", {
                e,
                props,
                dispatcher,
            });
        }
    }

    /* 点击菜单按钮/右键菜单 */
    function menu(e: MouseEvent) {
        dispatcher("menu", {
            e,
            props,
            dispatcher,
        });
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
    on:click|stopPropagation|preventDefault={open}
    on:contextmenu|stopPropagation|preventDefault={menu}
    {draggable}
    {title}
    data-type={type}
    data-name={name}
    data-path={path}
    data-depth={depth}
    data-directory={directory}
    class:b3-list-item--focus={focus}
    class:b3-list-item--hide-action={hideActions}
    class="node b3-list-item"
>
    <!-- 折叠/展开按钮 -->
    <span
        on:click|stopPropagation|preventDefault={toggle}
        style:padding-left="calc(4px + {indent} * {depth})"
        aria-label={toggleAriaLabel}
        class:b3-tooltips={!!toggleAriaLabel}
        class:b3-tooltips__se={!!toggleAriaLabel && type === FileTreeNodeType.Root}
        class:b3-tooltips__ne={!!toggleAriaLabel && type !== FileTreeNodeType.Root}
        class:fn__hidden={type === FileTreeNodeType.File}
        class="toggle b3-list-item__toggle b3-list-item__toggle--hl"
    >
        <SvgArrow
            open={!folded}
            icon={toggleIcon}
        />
    </span>

    <!-- 图标 -->
    <span
        aria-label={iconAriaLabel}
        class:b3-tooltips={!!iconAriaLabel}
        class:b3-tooltips__se={!!iconAriaLabel && type === FileTreeNodeType.Root}
        class:b3-tooltips__ne={!!iconAriaLabel && type !== FileTreeNodeType.Root}
        class="icon b3-list-item__icon"
    >
        {#if icon.startsWith("#")}
            <!-- svg 图标 -->
            <Svg {icon} />
        {:else if icon.startsWith("/")}
            <!-- url 图标 -->
            <img
                src={icon}
                alt="icon"
            />
        {:else if icon}
            <!-- emojis 字符图标 -->
            {icon}
        {:else if type === FileTreeNodeType.File}
            <!-- 文件图标 -->
            <Svg icon={"#iconFile"} />
        {:else if type === FileTreeNodeType.Folder}
            <!-- 文件夹图标 -->
            <Svg icon={"#iconFolder"} />
        {:else if type === FileTreeNodeType.Root}
            <!-- 根目录图标 -->
            <Svg icon={"#iconFilesRoot"} />
        {:else}
            <!-- 未知图标 -->
            <Svg icon={"#iconHelp"} />
        {/if}
    </span>

    <!-- 文本 -->
    <span
        aria-label={textAriaLabel}
        class:ariaLabel={!!textAriaLabel}
        class:b3-tooltips__se={!!textAriaLabel && type === FileTreeNodeType.Root}
        class:b3-tooltips__ne={!!textAriaLabel && type !== FileTreeNodeType.Root}
        class="text b3-list-item__text"
    >
        {text}
    </span>

    <!-- 菜单按钮 -->
    <span
        on:click|stopPropagation|preventDefault={menu}
        data-type="more"
        aria-label={menuAriaLabel}
        class:b3-tooltips={!!menuAriaLabel}
        class:b3-tooltips__sw={!!menuAriaLabel && type === FileTreeNodeType.Root}
        class:b3-tooltips__nw={!!menuAriaLabel && type !== FileTreeNodeType.Root}
        class="menu b3-list-item__action"
    >
        <Svg icon={menuIcon} />
    </span>

    <!-- 符号链接 -->
    {#if symlink}
        <span
            data-type="symlink"
            aria-label={symlinkAriaLabel}
            class:b3-tooltips={!!symlinkAriaLabel}
            class:b3-tooltips__sw={!!symlinkAriaLabel && type === FileTreeNodeType.Root}
            class:b3-tooltips__nw={!!symlinkAriaLabel && type !== FileTreeNodeType.Root}
            class="symblink b3-list-item__action"
        >
            <Svg icon={symlinkIcon} />
        </span>
    {/if}

    <!-- 计数器 -->
    {#if !Number.isNaN(count)}
        <span
            aria-label={countAriaLabel}
            class:b3-tooltips={!!countAriaLabel}
            class:b3-tooltips__sw={!!countAriaLabel && type === FileTreeNodeType.Root}
            class:b3-tooltips__nw={!!countAriaLabel && type !== FileTreeNodeType.Root}
            class="counter"
        >
            {count}
        </span>
    {/if}
</li>

<!-- 下级节点 -->
{#if children}
    <ul
        class="node-list"
        class:fn__none={folded}
        style:--monaco-editor-explorer-indent-left="calc(12px + {indent} * {depth})"
    >
        {#each children as node, i (node.path)}
            <svelte:self
                on:open
                on:fold
                on:menu
                on:unfold
                depth={depth + 1}
                {...node}
            />
        {/each}
    </ul>
{/if}

<style lang="less">
    .highlight() {
        // 辅助线高亮
        &::before {
            // background-color: var(--b3-theme-surface-light);
            background-color: var(--b3-theme-primary-lighter);
            // background-color: var(--b3-theme-primary-lightest);
        }
    }
    .node {
        margin: 0; // 辅助线对齐

        &.b3-list-item--focus {
            // 焦点所在节点
            &[data-type="navigation-root"],
            &[data-type="navigation-folder"] {
                // 焦点在文件夹节点
                + .node-list {
                    // 高亮下级目录
                    .highlight();
                }
            }
        }
    }

    .node-list {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            left: var(--monaco-editor-explorer-indent-left);
            width: 2px;
            height: 100%;
            background-color: var(--b3-border-color);
            z-index: 1;
        }

        &:has(> .node.b3-list-item--focus[data-type="navigation-file"]) {
            // 焦点在下级文件节点
            .highlight(); // 高亮本机目录
        }
    }
</style>
