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
    import { onMount } from "svelte";
    import BlockButton from "@workspace/components/siyuan/misc/BlockButton.svelte";
    import { TooltipsDirection } from "@workspace/components/siyuan/misc/tooltips";
    import type { Electron } from "@workspace/types/electron";
    import type WebviewPlugin from "@/index";
    import type { I18N } from "@/utils/i18n";

    export let src: string;
    export let tab: any;
    export let plugin: InstanceType<typeof WebviewPlugin>;

    export let useragent: string = plugin.useragent; // 用户代理

    const i18n = plugin.i18n as unknown as I18N;

    let fullscreen = false; // 是否为全屏模式
    let can_back = false; // 能否转到上一页
    let can_forward = false; // 能否转到下一页
    let loading = false; // 页面是否正在加载
    let address = decodeURI(src); // 地址栏
    let devtools_opened = false; // 开发者工具是否已打开
    let webview: Electron.WebviewTag; // webview 标签
    let webview_pointer_events_disable = false; // 是否禁用 webview 的鼠标事件

    /* 转到上一页 */
    function onGoBack() {
        if (can_back) {
            webview?.goBack();
        }
    }

    /* 转到下一页 */
    function onGoForward() {
        if (can_back) {
            webview?.goBack();
        }
    }

    /* 刷新或终止加载按钮 */
    function onRefreshOrStop() {
        if (loading) {
            webview?.stop();
        } else {
            webview?.reload();
        }
    }

    /* 地址栏存在来自外部更改 */
    function onAddressChange(e) {
        // plugin.logger.debug(e);

        if (address) {
            try {
                const url = new URL(address);
                webview.loadURL(url.href);
            } catch (e) {
                try {
                    const url = new URL(`http://${address}`);
                    webview.loadURL(url.href.replace(/^http:/, ""));
                } catch (error) {
                    plugin.siyuan.showMessage(`${plugin.name}:\nURL <code class="fn__code">${address}</code> ${i18n.message.nonStandardURL}\n`, undefined, "error", globalThis.crypto.randomUUID());
                }
            }
        }
    }

    /* 使用默认程序打开 */
    function onOpenWithDefaultProgram() {
        global.open(tab.data.href, "_blank");
    }

    /* 在新窗口打开 */
    function onOpenWithNewWindow(e: MouseEvent) {
        plugin.openWindow(tab.data.href, {
            x: e.screenX,
            y: e.screenY,
            title: tab.data.title,
        });
    }

    /* 进入/退出全屏模式 */
    function onEnterOrExitFullscreen() {
        fullscreen = !fullscreen;
    }

    /* 打开/关闭开发者工具 */
    function onOpenOrCloseDevTools() {
        if (webview) {
            if (webview.isDevToolsOpened()) {
                webview.closeDevTools();
                devtools_opened = false;
            } else {
                webview.openDevTools();
                devtools_opened = true;
            }
        }
    }

    onMount(() => {
        /**
         * 监听页面变化
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-load-commit
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-will-navigate
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-start-navigation
         */
        webview.addEventListener("load-commit", e => {
            // plugin.logger.debug(e)
            /* 更新地址栏地址 */
            if (e.isMainFrame) {
                address = decodeURI(e.url);
                tab.data.href = e.url;
            }

            /* 是否可后退 */
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoback
            can_back = webview.canGoBack();

            /* 是否可前进 */
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoback
            can_forward = webview.canGoForward();
        });

        /**
         * 更改页签标题
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#%E4%BA%8B%E4%BB%B6-page-title-updated
         */
        webview.addEventListener("page-title-updated", e => {
            // plugin.logger.debug(e)
            // plugin.logger.debug(tab);
            tab.tab?.updateTitle(e.title);
            tab.data.title = e.title;
        });

        /**
         * 加载时 & 加载完成设置不同的状态
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-start-loading
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-stop-loading
         */
        /* 开始加载 */
        webview.addEventListener("did-start-loading", _ => {
            // plugin.logger.debug(e)
            loading = true;
        });
        /* 停止加载 */
        webview.addEventListener("did-stop-loading", _ => {
            // plugin.logger.debug(e)
            loading = false;
        });

        /**
         * 在标签页打开链接
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-devtools-open-url
         */
        webview.addEventListener("devtools-open-url", e => {
            // plugin.logger.debug(e);
            plugin.openWebviewTab(e.url);
        });

        /**
         * 上下文菜单(右键触发)
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-context-menu
         */
        webview.addEventListener("context-menu", e => {
            plugin.logger.debug(e);

            /* 在超链接上激活上下文菜单(右键点击/键盘上下文键) */
            if (e.params.linkURL) {
                plugin.openWebviewTab(e.params.linkURL, e.params.titleText || e.params.linkText || e.params.altText);
            }
        });
    });
</script>

<div
    class:fullscreen
    class="fn__flex fn__flex-1 fn__flex-column content"
>
    <!-- 地址栏 -->
    <div class="protyle-breadcrumb">
        <!-- 后退按钮 -->
        <BlockButton
            on:click={onGoBack}
            icon="#iconLeft"
            ariaLabel={i18n.webview.goForwardOnePage}
            disabled={!can_back}
            tooltipsDirection={TooltipsDirection.se}
        />

        <!-- 前进按钮 -->
        <BlockButton
            on:click={onGoForward}
            icon="#iconRight"
            ariaLabel={i18n.webview.goBackOnePage}
            disabled={!can_forward}
            tooltipsDirection={TooltipsDirection.se}
        />

        <!-- 刷新/终止加载按钮 -->
        <BlockButton
            on:click={onRefreshOrStop}
            icon={loading ? "#iconClose" : "#iconRefresh"}
            ariaLabel={loading ? i18n.webview.stopLoadingThisPage : i18n.webview.reloadCurrentPage}
            tooltipsDirection={TooltipsDirection.se}
        />

        <!-- <div class="fn__space" /> -->

        <!-- 地址输入框 -->
        <input
            on:change={onAddressChange}
            bind:value={address}
            class="b3-text-field fn__flex-1 address-field"
            type="url"
        />

        <!-- <div class="fn__space" /> -->

        <!-- 使用默认程序(一般为浏览器)打开当前页面链接 -->
        <BlockButton
            on:click={onOpenWithDefaultProgram}
            icon="#iconLanguage"
            ariaLabel={i18n.webview.openWithDefaultProgram}
            tooltipsDirection={TooltipsDirection.sw}
        />

        <!-- 使用新窗口打开当前页面链接 -->
        <BlockButton
            on:click={onOpenWithNewWindow}
            icon="#iconOpenWindow"
            ariaLabel={i18n.webview.openWithNewWindow}
            tooltipsDirection={TooltipsDirection.sw}
        />

        <!-- 打开/关闭全屏模式 -->
        <BlockButton
            on:click={onEnterOrExitFullscreen}
            icon={fullscreen ? "#iconFullscreenExit" : "#iconFullscreen"}
            ariaLabel={fullscreen ? i18n.webview.exitFullscreen : i18n.webview.enterFullscreen}
            active={fullscreen}
            tooltipsDirection={TooltipsDirection.sw}
        />

        <!-- 打开/关闭开发者工具 -->
        <BlockButton
            on:click={onOpenOrCloseDevTools}
            icon="#iconBug"
            ariaLabel={devtools_opened ? i18n.webview.closeDevTools : i18n.webview.openDevTools}
            active={devtools_opened}
            tooltipsDirection={TooltipsDirection.sw}
        />
    </div>

    <!-- 主体 -->
    <div
        on:mouseenter={e => (webview_pointer_events_disable = e.button === 0 ? false : true)}
        on:mouseleave={() => (webview_pointer_events_disable = true)}
        class="protyle-preview"
    >
        <webview
            bind:this={webview}
            {src}
            {useragent}
            class:pointer-events-disable={webview_pointer_events_disable}
            class="fn__flex-1"
            allowpopups
        />
    </div>
</div>

<style lang="less">
    .content {
        .protyle-breadcrumb {
            height: 32px;

            .address-field {
                margin: 4px;
            }
        }

        .protyle-preview {
            user-select: none;
        }
    }

    .pointer-events-disable {
        pointer-events: none;
    }
</style>
