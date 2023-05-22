/**
 * Copyright (C) 2023 Zuoqiu Yingyi
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import siyuan from "siyuan";
import { isElectron } from "@workspace/utils/env/front-end";
import { Electron } from "@workspace/types/electron";

const panelHTML = `
<div class="fn__flex fn__flex-1 fn__flex-column">
    <div class="fn__flex" style="padding: 4px 8px;position: relative">
        <span
            class="toolbar__item fn__flex-center b3-tooltips b3-tooltips__se webview-button-back"
            aria-label="转到上一页"
        >
            <svg><use xlink:href="#iconLeft"></use></svg>
        </span>
        <span
            class="toolbar__item fn__flex-center b3-tooltips b3-tooltips__se webview-button-forward"
            aria-label="转到下一页"
        >
            <svg ><use xlink:href="#iconRight"></use></svg>
        </span>
        <span
            class="toolbar__item fn__flex-center b3-tooltips b3-tooltips__se web-view-button-refresh"
            aria-label="刷新"
        >
            <svg><use xlink:href="#iconRefresh"></use></svg>
        </span>
        <div class="fn__space"></div>
        <input class="b3-text-field fn__flex-1" type="url"/>
        <div id="searchHistoryList" data-close="false" class="fn__none b3-menu b3-list b3-list--background" style="position: absolute;top: 30px;max-height: 50vh;overflow: auto"></div>
    </div>

    <div class="fn__flex fn__flex-1 naive_ifrmeContainer" style="max-height:100%" >
        <webview
            class="fn__flex-1"
            style=" max-height:calc(100% - 200px)"
            src="" data-src="" border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            allowpopups="true"
        ></webview>
    </div>
</div>
`

/**
 * 页签管理器
 * @params webview: webview/iframe HTML 元素
 * @params backButton: 返回按钮 HTML 元素
 * @params forwardButton: 前进按钮 HTML 元素
 * @params refreshButton: 刷新按钮 HTML 元素
 * @params addressInput: 地址输入框 HTML 元素
 * @params tabContent: 页签主体 HTML 元素
 * @params tabContext: 思源自定义页签上下文
 * @params pluginContext: 插件上下文
 */
class BrowserTabManager {
    constructor(
        protected webview: Electron.WebviewTag,
        protected backButton: HTMLElement,
        protected forwardButton: HTMLElement,
        protected refreshButton: HTMLElement,
        protected addressInput: HTMLInputElement,
        protected tabContent: HTMLDivElement,
        protected tabContext: any,
        protected pluginContext: InstanceType<typeof WebviewPlugin>,
    ) {

        this.init()
    }
    initAriaLabel() {
        this.forwardButton.ariaLabel = this.pluginContext.i18n.goForwardOnePage
        this.backButton.ariaLabel = this.pluginContext.i18n.goBackOnePage
        this.refreshButton.ariaLabel = this.pluginContext.i18n.reloadCurrentPage
    }
    init() {
        this.initAriaLabel()
        this.addressInput.addEventListener('change', () => {
            this.loadURL(encodeURI(this.addressInput.value))
        })
        // this.前进按钮.addEventListener('click', this.前进按钮点击事件监听器)
        // this.后退按钮.addEventListener('click', this.后退按钮点击事件监听器)
        this.updateForwardButtonStatus(false)
        this.updateBackButtonStatus(false)
        this.updateRefreshButtonStatus(false)
        /**
         * 监听页面变化
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-load-commit
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-will-navigate
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-start-navigation
         */
        // this.view.addEventListener('will-navigate', e => {
        // this.view.addEventListener('did-start-navigation', e => {
        this.webview.addEventListener('load-commit', e => {
            // console.debug(e)
            if (e.isMainFrame) {
                this.addressInput.value = decodeURI(e.url)
            }

            /* 是否可后退 */
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoback
            this.updateBackButtonStatus(this.webview.canGoBack());

            /* 是否可前进 */
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoback
            this.updateForwardButtonStatus(this.webview.canGoForward());
        })

        /**
         * 更改页签标题
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#%E4%BA%8B%E4%BB%B6-page-title-updated
        */
        this.webview.addEventListener('page-title-updated', (e: { title: string; }) => {
            // console.debug(e)
            // console.debug(this.tabContext)
            this.tabContext.parent.updateTitle(e.title)
        })

        /**
         * 加载时 & 加载完成设置不同的图标
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-start-loading
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-stop-loading
         */
        /* 开始加载 */
        this.webview.addEventListener('did-start-loading', _ => {
            // console.debug(e)
            this.updateRefreshButtonStatus(true)
        })
        /* 停止加载 */
        this.webview.addEventListener('did-stop-loading', _ => {
            // console.debug(e)
            this.updateRefreshButtonStatus(false)
        })

        /**
         * 更改页签图标
         * TODO: 插件 API 支持网络图标
         * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#%E4%BA%8B%E4%BB%B6-page-favicon-updated
        */
        // this.view.addEventListener('page-favicon-updated', e => {
        //     console.debug(e)
        //     console.debug(this.tabContext)
        // })
    }
    backButtonClickEventListener = () => {
        // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoback
        if (this.webview.canGoBack()) {
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewgoback
            this.webview.goBack()
        }
    }
    forwardButtonClickEventListener = () => {
        // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoforward
        if (this.webview.canGoForward()) {
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewgoforward
            this.webview.goForward()
        }
    }
    stopButtonClickEventListener = () => {
        // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewstop
        // REF https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement#%E6%B5%8F%E8%A7%88%E5%99%A8_api_%E6%96%B9%E6%B3%95
        this.webview.stop()
    }
    reloadButtonClickEventListener = () => {
        this.reload()
    }
    updateBackButtonStatus(enable: boolean) {
        if (enable) {
            this.backButton.addEventListener('click', this.backButtonClickEventListener)
            this.backButton.classList.remove("toolbar__item--disabled") // 启用后退按钮
        }
        else {
            this.backButton.removeEventListener('click', this.backButtonClickEventListener)
            this.backButton.classList.add("toolbar__item--disabled") // 禁用后退按钮
        }
    }
    updateForwardButtonStatus(enable: boolean) {
        if (enable) {
            this.forwardButton.addEventListener('click', this.forwardButtonClickEventListener)
            this.forwardButton.classList.remove("toolbar__item--disabled") // 启用前进按钮
        }
        else {
            this.forwardButton.removeEventListener('click', this.forwardButtonClickEventListener)
            this.forwardButton.classList.add("toolbar__item--disabled") // 禁用前进按钮
        }
    }
    updateRefreshButtonStatus(loading: boolean) {
        if (loading) { // 正在加载中
            this.refreshButton.removeEventListener('click', this.reloadButtonClickEventListener) // 移除刷新监听器
            this.refreshButton.addEventListener('click', this.stopButtonClickEventListener) // 添加停止监听器
            this.refreshButton.innerHTML = `<svg><use xlink:href="#iconClose"></use></svg>` // 图标改为停止图标
            this.refreshButton.ariaLabel = this.pluginContext.i18n.stopLoadingThisPage // 更新提示
        }
        else {
            this.refreshButton.removeEventListener('click', this.stopButtonClickEventListener) // 移除停止监听器
            this.refreshButton.addEventListener('click', this.reloadButtonClickEventListener) // 添加刷新监听器
            this.refreshButton.innerHTML = `<svg><use xlink:href="#iconRefresh"></use></svg>` // 图标改为刷新图标
            this.refreshButton.ariaLabel = this.pluginContext.i18n.reloadCurrentPage // 更新提示
        }
    }
    loadURL(url: string) {
        this.webview.src = url
    }
    reload() {
        // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewreload
        // REF https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement#%E6%B5%8F%E8%A7%88%E5%99%A8_api_%E6%96%B9%E6%B3%95
        this.webview.reload?.();
    }
}
//反向链接等官方编辑器接口再移植
/*class BacklinksEditor  {
    constructor(element,key){
        this.element= element
        this.element.innerHTML = ''
        this.element.classList.add('fn__flex-1')
        this.查找反向链接(key)
    }
    async 查找反向链接(key){
        if(!key){
            this.element.innerHTML='未找到相关内容'
        }
        let blocks =  await 核心api.fullTextSearchBlock({
            path:'',
            query:key,
            "types":{"document":true,"heading":true,"list":true,"listItem":true,"codeBlock":true,"htmlBlock":true,"mathBlock":true,"table":true,"blockquote":true,"superBlock":true,"paragraph":true}
        })
        if(blocks.blocks.length==0){
            this.element.innerHTML='未找到相关内容'
        }
        else{
            console.log(blocks.blocks)
            new BlockListEditor(this.element,blocks.blocks)
        }
    }
}*/

export default class WebviewPlugin extends siyuan.Plugin {
    static isUrlSchemeAvailable(url: string): boolean {
        switch (true) {
            case url.startsWith("https://"):
            case url.startsWith("http://"):
            case url.startsWith("file://"):
            case url.startsWith("ftp://"):
            case url.startsWith("//"):
                return true;
            default:
                return false;
        }
    }
    protected readonly webview_tab: ReturnType<siyuan.Plugin["addTab"]>

    constructor(options: any) {
        super(options);

        const plugin = this;
        this.webview_tab = this.addTab(options = {
            type: "webview",
            init() {
                // console.debug(this)
                this.element.innerHTML = panelHTML;
                const browser_tab_manager = new BrowserTabManager(
                    this.element.querySelector("webview"),
                    this.element.querySelector('.webview-button-back'),
                    this.element.querySelector('.webview-button-forward'),
                    this.element.querySelector('.web-view-button-refresh'),
                    this.element.querySelector("input"),
                    this.element,
                    this,
                    plugin,
                )
                browser_tab_manager.loadURL(this.data.url)
            }
        });
    }

    onload(): void {
        // console.debug(this);
        if (isElectron()) {
            globalThis.addEventListener("click", this.linkClientEventListener, true);
        }
    }

    onunload(): void {
        if (isElectron()) {
            globalThis.removeEventListener("click", this.linkClientEventListener, true);
        }
    }

    linkClientEventListener = (e: MouseEvent) => {
        // console.debug(e);
        const target = e.target as HTMLElement;
        if (
            target.dataset &&
            target.dataset.type === "a" &&
            target.dataset.href
        ) {
            console.info(`[${this.name}]: ${target.dataset.href}`);
            const plugin = this
            if (WebviewPlugin.isUrlSchemeAvailable(target.dataset.href)) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    siyuan.openTab({
                        custom: {
                            icon: "iconLanguage",
                            title: target.innerText || target.dataset.href,
                            fn: plugin.webview_tab,
                            data: {
                                url: target.dataset.href,
                                title: target.innerText,
                            },
                        },
                    });
                } catch (e) {
                    console.warn(e)
                }
            }
        }
    }
};
