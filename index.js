const siyuan = require("siyuan");

const panelHTML = `
<div class="fn__flex fn__flex-1 fn__flex-column">
    <div class="fn__flex" style="padding: 4px 8px;position: relative">
        <span
            class="toolbar__item fn__flex-center b3-tooltips b3-tooltips__se btnBack"
            aria-label="转到上一页"
        >
            <svg><use xlink:href="#iconLeft"></use></svg>
        </span>
        <span
            class="toolbar__item fn__flex-center b3-tooltips b3-tooltips__se btnForward"
            aria-label="转到下一页"
        >
            <svg ><use xlink:href="#iconRight"></use></svg>
        </span>
        <span
            class="toolbar__item fn__flex-center b3-tooltips b3-tooltips__se btnRefresh"
            aria-label="刷新"
        >
            <svg><use xlink:href="#iconRefresh"></use></svg>
        </span>
        <div class="fn__space"></div>
        <input class="b3-text-field fn__flex-1">
        <span class="fn__space"></span>
        <span
            style="opacity: 1"
            class="fn__flex-center b3-tooltips b3-tooltips__w debug fn__none"
            aria-label="反向链接"
        >
            <svg><use xlink:href="#iconLink"></use></svg>
        </span>
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

const iframeHTML = `
<iframe
    class="fn__flex-1"
    style=" max-height:calc(100% - 200px)"
    src=""
    data-src=""
    border="0"
    frameborder="no"
    framespacing="0"
    allowfullscreen="true"
    allowpopups="true"
></iframe  >
`

function BrowserTabContainerFactory(pluginContext) {
    return {
        type: "common",
        init() {
            // console.debug(this)
            this.element.innerHTML = panelHTML;
            this.urlInputter = this.element.querySelector("input")
            this.urlInputter.value = this.data.url
            this.webview = this.element.querySelector("webview")

            /* 非 Electron 环境回退到 iframe */
            if (!globalThis.require) {
                this.webview.outerHTML = iframeHTML
                this.webview = this.element.querySelector('iframe')
                this.webview.reload = () => { this.webview.src = this.webview.src }
            }

            // console.debug(this)
            this.browser_tab_manager = new BrowserTabManager(
                this.webview,
                this.element.querySelector('.btnBack'),
                this.element.querySelector('.btnForward'),
                this.element.querySelector('.btnRefresh'),
                this.urlInputter,
                this.element,
                this,
                pluginContext,
            )
            this.browser_tab_manager.loadURL(this.data.url)
        }
    }
}

/**
 * 页签管理器
 * @params {HTMLElement} webview: webview/iframe HTML 元素
 * @params {HTMLElement} btnBack: 返回按钮 HTML 元素
 * @params {HTMLElement} btnForward: 前进按钮 HTML 元素
 * @params {HTMLElement} btnRefresh: 刷新按钮 HTML 元素
 * @params {HTMLElement} addressInputBox: 地址输入框 HTML 元素
 * @params {HTMLElement} tabContent: 页签主体 HTML 元素
 * @params {Custom} tabContext: 思源自定义页签上下文
 * @params {BrowserTabPlugin} pluginContext: 插件上下文
 */
class BrowserTabManager {
    constructor(
        webview,
        btnBack,
        btnForward,
        btnRefresh,
        addressInputBox,
        tabContent,
        tabContext,
        pluginContext,
    ) {
        this.webview = webview
        this.button_back = btnBack
        this.buttom_forward = btnForward
        this.button_refrash = btnRefresh
        this.input_address = addressInputBox
        this.tab = tabContent

        this.context_tab = tabContext
        this.context_plugin = pluginContext

        this.isWebview = this.webview.localName === "webview"

        this.init()
    }
    initAriaLabel() {
        this.buttom_forward.ariaLabel = this.context_plugin.i18n.goForwardOnePage
        this.button_back.ariaLabel = this.context_plugin.i18n.goBackOnePage
        this.button_refrash.ariaLabel = this.context_plugin.i18n.reloadCurrentPage
    }
    init() {
        this.initAriaLabel()
        this.input_address.addEventListener('change', () => {
            this.loadURL(encodeURI(this.input_address.value))
        })
        // this.前进按钮.addEventListener('click', this.前进按钮点击事件监听器)
        // this.后退按钮.addEventListener('click', this.后退按钮点击事件监听器)
        this.updateForwardButtonStatus(false)
        this.updateBackButtonStatus(false)
        this.updateRefreshButtonStatus(false)
        if (this.isWebview) { // Election 环境
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
                    this.input_address.value = decodeURI(e.url)

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
            this.webview.addEventListener('page-title-updated', e => {
                // console.debug(e)
                // console.debug(this.context_tab)
                this.context_tab.parent.updateTitle(e.title)
            })

            /**
             * 加载时 & 加载完成设置不同的图标
             * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-start-loading
             * REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#event-did-stop-loading
             */
            /* 开始加载 */
            this.webview.addEventListener('did-start-loading', e => {
                // console.debug(e)
                this.updateRefreshButtonStatus(true)
            })
            /* 停止加载 */
            this.webview.addEventListener('did-stop-loading', e => {
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
            //     console.debug(this.context_tab)
            // })
        }
        else { // 浏览器环境
            /* 页面加载完成 */
            this.webview.addEventListener('load', e => {
                /* 是否可后退 */
                // REF https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement#%E6%B5%8F%E8%A7%88%E5%99%A8_api_%E6%96%B9%E6%B3%95
                this.updateBackButtonStatus(this.webview.getCanGoBack?.());

                /* 是否可前进 */
                // REF https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement#%E6%B5%8F%E8%A7%88%E5%99%A8_api_%E6%96%B9%E6%B3%95
                this.updateForwardButtonStatus(this.webview.getCanGoForward?.());
            })
        }
    }
    backButtonClickEventListener = () => {
        if (this.isWebview) {
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoback
            if (this.webview.canGoBack()) {
                // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewgoback
                this.webview.goBack()
            }
        }
        else {
            // REF https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement#%E6%B5%8F%E8%A7%88%E5%99%A8_api_%E6%96%B9%E6%B3%95
            if (this.webview.getCanGoBack?.()) {
                this.webview.goBack?.()
            }
        }
    }
    forwardButtonClickEventListener = () => {
        if (this.isWebview) {
            // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewcangoforward
            if (this.webview.canGoForward()) {
                // REF https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewgoforward
                this.webview.goForward()
            }
        }
        else {
            // REF https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement#%E6%B5%8F%E8%A7%88%E5%99%A8_api_%E6%96%B9%E6%B3%95
            if (this.webview.getCanGoForward?.()) {
                this.webview.goForward?.()
            }
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
    updateBackButtonStatus(enable) {
        if (enable) {
            this.button_back.addEventListener('click', this.backButtonClickEventListener)
            this.button_back.classList.remove("toolbar__item--disabled") // 启用后退按钮
        }
        else {
            this.button_back.removeEventListener('click', this.backButtonClickEventListener)
            this.button_back.classList.add("toolbar__item--disabled") // 禁用后退按钮
        }
    }
    updateForwardButtonStatus(enable) {
        if (enable) {
            this.buttom_forward.addEventListener('click', this.forwardButtonClickEventListener)
            this.buttom_forward.classList.remove("toolbar__item--disabled") // 启用前进按钮
        }
        else {
            this.buttom_forward.removeEventListener('click', this.forwardButtonClickEventListener)
            this.buttom_forward.classList.add("toolbar__item--disabled") // 禁用前进按钮
        }
    }
    updateRefreshButtonStatus(loading) {
        if (loading) { // 正在加载中
            this.button_refrash.removeEventListener('click', this.reloadButtonClickEventListener) // 移除刷新监听器
            this.button_refrash.addEventListener('click', this.stopButtonClickEventListener) // 添加停止监听器
            this.button_refrash.innerHTML = `<svg><use xlink:href="#iconClose"></use></svg>` // 图标改为停止图标
            this.button_refrash.ariaLabel = this.context_plugin.i18n.stopLoadingThisPage // 更新提示
        }
        else {
            this.button_refrash.removeEventListener('click', this.stopButtonClickEventListener) // 移除停止监听器
            this.button_refrash.addEventListener('click', this.reloadButtonClickEventListener) // 添加刷新监听器
            this.button_refrash.innerHTML = `<svg><use xlink:href="#iconRefresh"></use></svg>` // 图标改为刷新图标
            this.button_refrash.ariaLabel = this.context_plugin.i18n.reloadCurrentPage // 更新提示
        }
    }
    loadURL(url) {
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

module.exports = class BrowserTabPlugin extends siyuan.Plugin {
    static isUrlSchemeAvailable(url) {
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
    static isElection() {
        return !!globalThis.require;
    }

    onload() {
        // console.debug(this);
        if (BrowserTabPlugin.isElection()) {
            this.custom_tab = this.addTab(BrowserTabContainerFactory(this));
            globalThis.addEventListener("click", this.linkClientEventListener, true);
        }
    }

    onunload() {
        if (BrowserTabPlugin.isElection()) {
            globalThis.removeEventListener("click", this.linkClientEventListener, true);
        }
    }

    linkClientEventListener = e => {
        // console.debug(e);
        if (
            e.target.dataset &&
            e.target.dataset.type === "a" &&
            e.target.dataset.href
        ) {
            console.info(`[${this.name}]: ${e.target.dataset.href}`);
            const plugin = this
            if (BrowserTabPlugin.isUrlSchemeAvailable(e.target.dataset.href)) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    siyuan.openTab({
                        custom: {
                            icon: "iconLanguage",
                            title: e.target.innerText || e.target.dataset.href,
                            fn: plugin.custom_tab,
                            data: {
                                url: e.target.dataset.href,
                                title: e.target.innerText,
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
