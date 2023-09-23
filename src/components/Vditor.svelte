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
    import { createEventDispatcher, onMount } from "svelte";

    import Vditor from "vditor";
    import "vditor/dist/index.css";

    import { merge } from "@workspace/utils/misc/merge";
    import { isLightTheme } from "@workspace/utils/siyuan/theme";
    import { CODE_THEME_SET } from "@/vditor/theme";
    import { mapLocaleVditor } from "@/utils/locale";
    import type { IVditorEvents, IVditorProps, IOptions } from "@/types/vditor";

    export let plugin: IVditorProps["plugin"];
    export let baseURL: IVditorProps["baseURL"];
    export let rootURL: IVditorProps["rootURL"];

    export let vditorID: IVditorProps["vditorID"] = `vditor-${new Date().toISOString()}`;
    export let options: IVditorProps["options"] = {};
    export let value: IVditorProps["value"] = "";
    export let theme: IVditorProps["theme"] = isLightTheme();
    export let codeBlockThemeLight: IVditorProps["codeBlockThemeLight"] = "xcode";
    export let codeBlockThemeDark: IVditorProps["codeBlockThemeDark"] = "dracula";
    export let debug: IVditorProps["debug"] = false;

    let vditorElement: HTMLElement;
    let globalTheme: "classic" | "dark";
    let contentTheme: "light" | "dark" | string;
    let codeTheme: string;
    let vditor: InstanceType<typeof Vditor>;

    const dispatcher = createEventDispatcher<IVditorEvents>();

    function updateTheme(
        light: boolean, // 是否为明亮主题
        code: boolean = false, // 是否更新代码主题
        codeThemeLight: string = codeBlockThemeLight, // 代码主题模式 (明亮)
        codeThemeDark: string = codeBlockThemeDark, // 代码主题模式 (黑暗)
    ): void {
        globalTheme = light ? "classic" : "dark";
        contentTheme = light // 根据主题模式设置内容主题模式
            ? contentTheme === "dark" // 内容主题为暗色主题
                ? "light" // 将内容主题也切换为亮色
                : vditor?.vditor.options.preview?.theme?.current ?? "light" // 保留内容主题不变
            : "dark"; // 内容主题同步切换为暗色主题

        if (code) {
            codeTheme = light // 根据主题模式设置代码主题模式
                ? CODE_THEME_SET.has(codeThemeLight)
                    ? codeThemeLight
                    : "xcode"
                : CODE_THEME_SET.has(codeThemeDark)
                ? codeThemeDark
                : "dracula";

            vditor?.setTheme(globalTheme, contentTheme, codeTheme);
        } else {
            vditor?.setTheme(globalTheme, contentTheme);
        }
    }

    function updateContent(markdown: string): void {
        vditor?.setValue(markdown);
    }

    $: {
        if (debug) {
            globalThis.vditor = vditor;
        } else {
            delete globalThis.vditor;
        }
    }

    $: updateContent(value);
    $: updateTheme(theme, true, codeBlockThemeLight, codeBlockThemeDark);

    $: mergedOptions = merge<IOptions>(
        {
            /**
             * 从右向左书写
             * @default false
             */
            // rtl: false,

            /**
             * 历史记录间隔
             * @default 800
             */
            // undoDelay: 800,

            /**
             * 自定义 lute.min.js URL
             * @default undefined
             */
            _lutePath: undefined,

            /**
             * 自定义静态资源基础路径
             * @default
             * `${cdn}/${dist}`
             * `${cdn}/dist`
             * `https://unpkg.com/vditor@${VDITOR_VERSION}/dist`
             */
            // _baseURL: undefined,

            /**
             * 自定义静态资源路径
             * @default undefined
             */
            _staticPath: {
                i18n: `${baseURL}/js/i18n`,
                icons: `${baseURL}/js/icons`,
                mathjax: `${baseURL}/js/jsthjax`,
                highlight: `${baseURL}/js/highlight.js`,
                method: `${baseURL}/js/method.min.js`,
                style: `${baseURL}/css/index.css`,
                logo: `${baseURL}/images/logo.png`,
                emoji: `${rootURL}/emojies`,
            },

            /**
             * 编辑器初始化值
             * @default ""
             */
            value,

            /**
             * 是否显示日志
             * @default false
             */
            debugger: debug, // 是否显示日志

            /**
             * 是否启用打字机模式
             * @default false
             */
            // typewriterMode: false,

            /**
             * 编辑器总高度
             * @default "auto"
             */
            height: "100%",

            /**
             * 编辑器最小高度
             * @default 63 + 工具栏高度
             */
            // minHeight: undefined,

            /**
             * 编辑器总宽度
             * @default "auto"
             */
            // width: "auto",

            /**
             * 输入区域为空时的提示
             * @default ""
             */
            // placeholder: "",

            /**
             * 本地化
             * @default "zh_CN"
             */
            lang: mapLocaleVditor("zh-Hans"),

            /**
             * 国际化 (自定义语言包)
             * 优先级低于 `lang`
             * @default undefined
             */
            // i18n: undefined,

            /**
             * 全屏层级
             * @default 90
             */
            // fullscreen: {
            //     index: 90,
            // },

            /**
             * 工具栏
             */
            toolbar: [
                {
                    name: "undo",
                    tipPosition: "se",
                },
                {
                    name: "redo",
                    tipPosition: "se",
                },
                "|",
                {
                    name: "insert-before",
                    tipPosition: "se",
                },
                {
                    name: "insert-after",
                    tipPosition: "se",
                },
                {
                    name: "outdent",
                    tipPosition: "se",
                },
                {
                    name: "indent",
                    tipPosition: "se",
                },
                "|",
                {
                    name: "headings",
                    tipPosition: "s",
                },
                "|",
                {
                    name: "bold",
                    tipPosition: "s",
                },
                {
                    name: "italic",
                    tipPosition: "s",
                },
                {
                    name: "strike",
                    tipPosition: "s",
                },
                {
                    name: "inline-code",
                    tipPosition: "s",
                },
                {
                    name: "link",
                    tipPosition: "s",
                },
                {
                    name: "emoji",
                    tipPosition: "s",
                },
                "|",
                {
                    name: "list",
                    tipPosition: "s",
                },
                {
                    name: "ordered-list",
                    tipPosition: "s",
                },
                {
                    name: "check",
                    tipPosition: "s",
                },
                "|",
                {
                    name: "quote",
                    tipPosition: "s",
                },
                {
                    name: "line",
                    tipPosition: "s",
                },
                {
                    name: "code",
                    tipPosition: "s",
                },
                "|",
                {
                    name: "upload",
                    tipPosition: "s",
                },
                {
                    name: "record",
                    tipPosition: "s",
                },
                "|",
                {
                    name: "edit-mode",
                    tipPosition: "sw",
                },
                {
                    name: "both",
                    tipPosition: "sw",
                },
                {
                    name: "fullscreen",
                    tipPosition: "sw",
                },
                {
                    name: "outline",
                    tipPosition: "sw",
                },
                "|",
                {
                    name: "style",
                    icon: '<svg><use xlink:href="#vditor-icon-theme"></use></svg>',
                    tip: "🎨",
                    tipPosition: "w",
                    click(): void {},
                    toolbar: [
                        {
                            name: "theme",
                            icon: "🔆 | 🌙",
                            click(event, vditor_) {
                                switch (vditor_.options.theme) {
                                    case "dark": {
                                        updateTheme(true);
                                        break;
                                    }
                                    case "classic":
                                    default: {
                                        updateTheme(false);
                                        break;
                                    }
                                }
                            },
                        },
                        "content-theme",
                        "code-theme",
                    ],
                },
                {
                    name: "more",
                    tipPosition: "e",
                    toolbar: ["preview", "export", "devtools", "info", "help"],
                },
            ],

            /**
             * 是否支持拖拽调整大小
             * @param enable 是否启用拖拽调整大小
             * @param position 拖拽栏位置
             * - "top": 顶部
             * - "bottom": 底部
             * @param after 拖拽完成回调函数
             */
            // resize: {
            //     enable: false,
            //     position: "top",
            //     after(height: number) { },
            // },

            /**
             * 计数器
             */
            counter: {
                /**
                 * 是否启用计数器
                 * @default false
                 */
                enable: true,

                /**
                 * 输入内容最大值
                 * @default Infinity
                 */
                // max: 0,

                /**
                 * 统计类型
                 * - "markdown": 文本数量
                 * - "text": 字符数量
                 * @default "markdown"
                 */
                type: "text",

                /**
                 * 字数统计回调函数
                 */
                // after(length: number, counter: this): void { },
            },

            /**
             * 缓存设置
             */
            cache: {
                /**
                 * localStorage 缓存 markdown 文本
                 * - 绑定 HTMLElement 元素时必填
                 * - 绑定 HTMLElement ID 时选填
                 */
                id: vditorID,

                /**
                 * 是否启用缓存
                 * @default true
                 */
                enable: true,

                /**
                 * 缓存后的回调
                 */
                // after(markdown: string): void { },
            },

            /**
             * 编辑模式
             * - "wysiwyg" 所见即所得
             * - "ir": 即时渲染
             * - "sv": 分屏预览
             */
            mode: "ir",

            /**
             * 预览
             * @param hljs 代码块高亮设置
             */
            preview: {
                /**
                 * 消除抖动延时 (ms)
                 * @default 1000
                 */
                // delay: 1000,

                /**
                 * 预览区域最大宽度
                 * @default 800
                 */
                // maxWidth: 800,

                /**
                 * 显示模式
                 * - "both"
                 * - "editor"
                 * @default "both"
                 */
                // mode: "both",

                /**
                 * markdown 解析请求请求
                 */
                // url: "",

                /**
                 * 代码高亮设置
                 */
                hljs: {
                    /**
                     * 是否启用代码高亮
                     * @default true
                     */
                    // enable: true,

                    /**
                     * 是否启用行号
                     * @default false
                     */
                    lineNumber: true,

                    /**
                     * 默认代码高亮风格
                     * @default "github"
                     */
                    style: codeTheme,

                    /**
                     * 代码未设置语言时的默认值
                     * @default ""
                     */
                    // defaultLang: "",

                    /**
                     * 代码语言列表
                     */
                    // langs: [],
                },

                /**
                 * 数学公式设置
                 */
                math: {
                    /**
                     * 内联数学公式起始 $ 后是否允许数字
                     * @default false
                     */
                    inlineDigit: false,

                    /**
                     * 默认渲染引擎
                     * - "KaTeX"
                     * - "MathJax"
                     * @default "KaTeX"
                     */
                    // engine: "KaTeX",

                    /**
                     * MathJax 宏定义
                     * @default {}
                     */
                    // macros: {},

                    /**
                     * MathJax 参数
                     * @default undefined
                     */
                    // mathJaxOptions: undefined,
                },

                /**
                 * markdown 渲染设置
                 */
                markdown: {
                    /**
                     * 自动空格
                     * @default false
                     */
                    autoSpace: true,

                    /**
                     * 段落开头是否空两格
                     * @default false
                     */
                    // paragraphBeginningSpace: false,

                    /**
                     * 自动矫正术语
                     * @default false
                     */
                    // fixTermTypo: false,

                    /**
                     * 插入目录
                     * @default false
                     */
                    toc: true,

                    /**
                     * 启用脚注
                     * @default true
                     */
                    // footnotes: true,

                    /**
                     * wysiwyg & ir 模式下代码块是否渲染
                     * @default true
                     */
                    // codeBlockPreview: true,

                    /**
                     * wysiwyg & ir 模式下公式块是否渲染
                     * @default true
                     */
                    // mathBlockPreview: true,

                    /**
                     * 是否启用过滤 XSS
                     * @default true
                     */
                    // sanitize: true,

                    /**
                     * 链接相对路径前缀
                     * @default ""
                     */
                    // linkBase: "",

                    /**
                     * 链接强制前缀
                     * @default ""
                     */
                    // linkPrefix: "",

                    /**
                     * 为列表添加标记，以便自定义列表样式
                     * @default false
                     */
                    // listStyle: false,

                    /**
                     * 支持 mark 标记
                     * @defalut false
                     */
                    // mark: true,

                    /**
                     * 支持自动探测链接
                     * @default true
                     */
                    // gfmAutoLink: true,
                },

                /**
                 * 渲染主题
                 */
                theme: {
                    /**
                     * 当前主题
                     * @default "light"
                     */
                    current: contentTheme,

                    /**
                     * 主题文件目录
                     * @default `${cdn}/${dist}/css/content-theme`
                     */
                    path: `${baseURL}/css/themes`,

                    /**
                     * 主题列表
                     * [key: 主文件名]: 主题名称
                     */
                    // list: {},
                },

                /**
                 * 可选预览模式列表
                 * 可自定义
                 * @default ["desktop", "tablet", "mobile", "mp-wechat", "zhihu"]
                 */
                // actions: [
                //     "desktop", //
                //     "tablet", //
                //     "mobile", //
                //     "mp-wechat", //
                //     "zhihu", //
                // ],

                /**
                 * 预览回调函数
                 * @param elemeent <div class="vditor-preview">...</div>
                 */
                parse(element: HTMLElement): void {
                    plugin.logger.debug(element);
                    // <div class="vditor-preview">...</div>
                },

                /**
                 * 渲染前回调函数
                 * @param html 渲染后的 HTML 字符串, 没有其他标签包裹
                 */
                transform(html: string): string {
                    // plugin.logger.debug(html);
                    return html;
                },
            },

            /**
             * 超链接
             */
            link: {
                /**
                 * 超链接是否可打开
                 * @default true
                 */
                // isOpen: true,

                /**
                 * 点击链接事件
                 * @param bom 所点击超链接元素的 DOM 对象
                 * @example 所见即所得模式 | 分屏编辑模式的预览面板 | 预览模式
                 * ```html
                 * <a href="http://超链接目标" title="超链接标题">超链接锚文本</a>
                 * <span class="vditor-ir__marker vditor-ir__marker--link">https://xxx</span>
                 * ```
                 * @example 实时渲染模式
                 * ```html
                 * <span data-type="a" class="vditor-ir__node">
                 *     <span class="vditor-ir__marker vditor-ir__marker--bracket">[</span>
                 *     <span class="vditor-ir__link">超链接锚文本</span>
                 *     <span class="vditor-ir__marker vditor-ir__marker--bracket">]</span>
                 *     <span class="vditor-ir__marker vditor-ir__marker--paren">(</span>
                 *  👉<span class="vditor-ir__marker vditor-ir__marker--link">http://超链接目标</span>
                 *     <span class="vditor-ir__marker vditor-ir__marker--title">"标题"</span>
                 *     <span class="vditor-ir__marker vditor-ir__marker--paren">)</span>
                 * </span>
                 * ```
                 */
                click(bom: Element): void {
                    // plugin.logger.debug(bom);

                    switch (true) {
                        case bom instanceof HTMLAnchorElement: {
                            const link = bom as HTMLAnchorElement;
                            dispatcher("open-link", {
                                href: link.href,
                                title: link.title,
                                anchor: link.textContent,
                                target: link.target,
                            });
                            break;
                        }
                        case bom instanceof HTMLSpanElement && bom.classList.contains("vditor-ir__marker--link"): {
                            const link = bom as HTMLSpanElement;
                            let anchor = link;
                            let title = link;
                            while (anchor && !anchor.classList.contains("vditor-ir__link")) {
                                anchor = anchor.previousElementSibling as HTMLSpanElement;
                            }
                            while (title && !title.classList.contains("vditor-ir__marker--title")) {
                                title = title.nextElementSibling as HTMLSpanElement;
                            }
                            dispatcher("open-link", {
                                href: link.textContent,
                                title: title?.textContent,
                                anchor: anchor?.textContent.slice(1, -1), // 移除首尾的 " 号
                            });
                        }
                        default:
                            break;
                    }
                },
            },

            /**
             * 图片
             */
            image: {
                /**
                 * 是否预览图片
                 * @default true
                 */
                // isPreview: true,

                /**
                 * 图片预览处理
                 */
                preview(bom: Element): void {
                    // TODO: 将无法直接访问的路径转换为 dataURL
                },
            },

            /**
             * 自动补全
             */
            hint: {
                /**
                 * emojis 图片路径
                 */
                emojiPath: "https://unpkg.com/vditor@1.8.3/dist/images/emoji",

                /**
                 * emojis 选择菜单底部的 HTML 字符串
                 */
                // emojiTail: "",

                /**
                 * emojis 名称 => 图标
                 */
                // emoji: {},

                /**
                 * 提示内容是否进行 md 解析
                 */
                parse: false,

                /**
                 * 其他自动补全
                 */
                // extend: [
                //     {
                //         key: "@",
                //         hint: (key) => {
                //             console.log(key)
                //             if ("vanessa".indexOf(key.toLocaleLowerCase()) > -1) {
                //                 return [
                //                     {
                //                         value: "@Vanessa",
                //                         html: `<img src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4"/> Vanessa`,
                //                     },
                //                 ]
                //             }
                //             return []
                //         },
                //     },
                //     {
                //         key: "#",
                //         hint: (key) => {
                //             console.log(key)
                //             if ("vditor".indexOf(key.toLocaleLowerCase()) > -1) {
                //                 return [
                //                     {
                //                         value: "#Vditor",
                //                         html: `<span style="color: #999;">#Vditor</span> ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。`,
                //                     }]
                //             }
                //             return []
                //         },
                //     },
                // ],
            },

            /**
             * 工具栏样式设置
             */
            toolbarConfig: {
                /**
                 * 是否隐藏工具栏
                 * @default false
                 */
                // hide: false,

                /**
                 * 是否钉在顶部
                 * @default false
                 */
                pin: true,
            },

            /**
             * 评论
             */
            // comment: {
            // },

            /**
             * 默认主题
             * - "classic"
             * - "dark"
             * @default "classic"
             */
            theme: globalTheme,

            /**
             * 默认图标主题
             * - "ant"
             * - "material"
             * @default "ant"
             */
            // icon: "ant",

            /**
             * 文件上传
             * TODO: 自定义文件上传
             */
            upload: {},

            /**
             * 预览元素的 className
             * @default ""
             */
            // classes: "",

            /**
             * 静态资源地址
             * @default `https://unpkg.com/vditor@${VDITOR_VERSION}`
             */
            cdn: rootURL,

            /**
             * 静态资源路径
             * @default "dist"
             */
            dist: "stage/protyle",

            /**
             * Tab 键输入的字符串
             */
            tab: "\t",

            /**
             * 大纲显示
             */
            outline: {
                /**
                 * 是否显示大纲
                 * @default false
                 */
                enable: true,

                /**
                 * 大纲显示位置
                 * - "left"
                 * - "right"
                 * @default "left"
                 */
                position: "right",
            },
        },
        options,
    );
    onMount(() => {
        // vditor = new Vditor(vditorID);
        vditor = new Vditor(vditorElement, mergedOptions);
    });
</script>

<div
    bind:this={vditorElement}
    id={vditorID}
    class="vditor"
/>

<style lang="less">
</style>
