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
    import siyuan from "siyuan";
    import type { Electron } from "@workspace/types/electron";
    import { onMount } from "svelte";

    export let url: string;
    export let tabContext: any;
    export let pluginContext: InstanceType<typeof siyuan.Plugin>;

    let fullscreen = false; // 是否为全屏模式
    let can_back = false; // 能否转到上一页
    let can_forward = false; // 能否转到下一页
    let loading = false; // 页面是否正在加载
    let address = decodeURI(url); // 地址栏
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
        // console.debug(e);
        url = encodeURI(e.target.value);
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
            // console.debug(e)
            /* 更新地址栏地址 */
            if (e.isMainFrame) {
                address = decodeURI(e.url);
                tabContext.data.title = e.url;
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
            // console.debug(e)
            // console.debug(tabContext);
            tabContext.tab?.updateTitle(e.title);
            tabContext.data.title = e.title;
        });

        /**
         * 加载时 & 加载完成设置不同的状态
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-start-loading
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-stop-loading
         */
        /* 开始加载 */
        webview.addEventListener("did-start-loading", _ => {
            // console.debug(e)
            loading = true;
        });
        /* 停止加载 */
        webview.addEventListener("did-stop-loading", _ => {
            // console.debug(e)
            loading = false;
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
        <button
            on:click={onGoBack}
            aria-label={pluginContext.i18n.goForwardOnePage}
            class:toolbar__item--disabled={!can_back}
            class="block__icon block__icon--show fn__flex-center b3-tooltips b3-tooltips__se"
        >
            <svg><use xlink:href="#iconLeft" /></svg>
        </button>

        <!-- 前进按钮 -->
        <button
            on:click={onGoForward}
            aria-label={pluginContext.i18n.goBackOnePage}
            class:toolbar__item--disabled={!can_forward}
            class="block__icon block__icon--show fn__flex-center b3-tooltips b3-tooltips__se"
        >
            <svg><use xlink:href="#iconRight" /></svg>
        </button>

        <!-- 刷新/终止加载按钮 -->
        <button
            on:click={onRefreshOrStop}
            aria-label={loading ? pluginContext.i18n.stopLoadingThisPage : pluginContext.i18n.reloadCurrentPage}
            class="block__icon block__icon--show fn__flex-center b3-tooltips b3-tooltips__se"
        >
            <svg><use xlink:href={loading ? "#iconClose" : "#iconRefresh"} /></svg>
        </button>

        <div class="fn__space" />

        <!-- 地址输入框 -->
        <input
            on:change={onAddressChange}
            bind:value={address}
            class="b3-text-field fn__flex-1 address-field"
            type="url"
        />

        <div class="fn__space" />

        <!-- 打开/关闭全屏模式 -->
        <button
            on:click={onEnterOrExitFullscreen}
            aria-label={fullscreen ? pluginContext.i18n.exitFullscreen : pluginContext.i18n.enterFullscreen}
            class:toolbar__item--active={fullscreen}
            class="block__icon block__icon--show fn__flex-center b3-tooltips b3-tooltips__sw"
        >
            <svg><use xlink:href={fullscreen ? "#iconFullscreenExit" : "#iconFullscreen"} /></svg>
        </button>

        <!-- 打开/关闭开发者工具 -->
        <button
            on:click={onOpenOrCloseDevTools}
            aria-label={devtools_opened ? pluginContext.i18n.closeDevTools : pluginContext.i18n.openDevTools}
            class:toolbar__item--active={devtools_opened}
            class="block__icon block__icon--show fn__flex-center b3-tooltips b3-tooltips__sw"
        >
            <svg><use xlink:href="#iconBug" /></svg>
        </button>
    </div>

    <!-- 主体 -->
    <div
        on:mouseenter={e => (webview_pointer_events_disable = e.buttons === 0 ? false : true)}
        on:mouseleave={() => (webview_pointer_events_disable = true)}
        class="protyle-preview"
    >
        <!-- <webview
            bind:this={webview}
            on:mouseenter={() => (webview.style.pointerEvents = null)}
            on:mouseleave={() => (webview.style.pointerEvents = "none")}
            src={url}
            class="fn__flex-1"
            allowpopups
        /> -->
        <webview
            bind:this={webview}
            src={url}
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
