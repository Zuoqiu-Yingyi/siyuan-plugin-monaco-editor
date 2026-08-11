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

<script
    lang="ts"
    module
>
    import type {
        IOptions,
        IVditorHandlers,
        IVditorProps,
    } from "@/types/vditor";

    export const RequestMode = {
        none: "none",
        getFile: "getFile",
        forwardProxy: "forwardProxy",
    } as const;

    export type RequestMode = typeof RequestMode[keyof typeof RequestMode];

    export interface IProps {
        plugin: IVditorProps["plugin"];
        src2url: IVditorProps["src2url"];
        baseURL: IVditorProps["baseURL"];
        rootURL: IVditorProps["rootURL"];

        path?: IVditorProps["path"];
        vditorID?: IVditorProps["vditorID"];
        assetsDirPath?: IVditorProps["assetsDirPath"];
        assetsUploadMode?: IVditorProps["assetsUploadMode"];
        options?: IVditorProps["options"];
        value?: IVditorProps["value"];
        theme?: IVditorProps["theme"];
        codeBlockThemeLight?: IVditorProps["codeBlockThemeLight"];
        codeBlockThemeDark?: IVditorProps["codeBlockThemeDark"];
        updatable?: IVditorProps["updatable"];
        changeable?: IVditorProps["changeable"];
        debug?: IVditorProps["debug"];
    }
</script>

<script lang="ts">
    import Vditor from "@siyuan-community/vditor";
    import {
        onDestroy,
        onMount,
    } from "svelte";

    import { lookup } from "@workspace/utils/file/browserify-mime";
    import { isValidName } from "@workspace/utils/file/filename";
    import { escapeMark } from "@workspace/utils/markdown/mark";
    import { base64ToBlob } from "@workspace/utils/misc/dataurl";
    import { escapeHTML } from "@workspace/utils/misc/html";
    import { merge } from "@workspace/utils/misc/merge";
    import { trimPrefix } from "@workspace/utils/misc/string";
    import { join, parse } from "@workspace/utils/path/browserify";
    import {
        isStaticPathname,
        staticPathname2WorkspacePath,
    } from "@workspace/utils/siyuan/url";

    import icon_save from "@/assets/icons/icon-save.svg?raw";
    import { DEFAULT_VDITOR_PROPS } from "@/configs/vditor";
    import { mapLocaleVditor } from "@/utils/locale";
    import { AssetsUploadMode } from "@/vditor/asset";
    import { CODE_THEME_SET } from "@/vditor/theme";

    import type * as sdk from "@siyuan-community/siyuan-sdk";

    import "@siyuan-community/vditor/dist/index.css";

    const {
        plugin,
        src2url,
        baseURL,
        rootURL,
        path = DEFAULT_VDITOR_PROPS.path,
        vditorID = DEFAULT_VDITOR_PROPS.vditorID,
        assetsDirPath = DEFAULT_VDITOR_PROPS.assetsDirPath,
        assetsUploadMode = DEFAULT_VDITOR_PROPS.assetsUploadMode,
        options = DEFAULT_VDITOR_PROPS.options,
        value = DEFAULT_VDITOR_PROPS.value,
        theme = DEFAULT_VDITOR_PROPS.theme,
        codeBlockThemeLight = DEFAULT_VDITOR_PROPS.codeBlockThemeLight,
        codeBlockThemeDark = DEFAULT_VDITOR_PROPS.codeBlockThemeDark,
        updatable = DEFAULT_VDITOR_PROPS.updatable,
        changeable = DEFAULT_VDITOR_PROPS.changeable,
        debug = DEFAULT_VDITOR_PROPS.debug,

        onOpenLink,
        onChanged,
        onSave,
    }: IProps & IVditorHandlers = $props();

    let vditorElement: HTMLElement | undefined = $state();
    let globalTheme: "classic" | "dark" | undefined = $state();
    let contentTheme: "dark" | "light" | string | undefined = $state();
    let codeTheme: string | undefined = $state();
    let vditor: InstanceType<typeof Vditor> | undefined = $state();

    const pathInfo = $derived(parse(path)); // 当前文件路径信息

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
        }
        else {
            vditor?.setTheme(globalTheme, contentTheme);
        }
    }

    function updateContent(markdown: string): void {
        vditor?.setValue(markdown);
    }

    function updateUpdatable(enable: boolean): void {
        // plugin.logger.debug("updateUpdatable", enable);
        if (enable) {
            vditor?.enable();
        }
        else {
            vditor?.disabled();
        }
    }

    function updatechangeable(enable: boolean): void {
        // plugin.logger.debug("updatechangeable", enable);
        if (enable) {
            vditor?.enableCache();
        }
        else {
            vditor?.disabledCache();
        }
    }

    function assetsUploadCallback(entries: [string, string][]): void {
        if (entries.length <= 0)
            return;

        const markdowns: string[] = [];
        for (const [name, path] of entries) {
            const mime = lookup(name);
            const name_escaped_mark = escapeMark(name);
            const path_escaped_html = escapeHTML(path);
            const path_escaped_uri = encodeURI(path);

            if (mime) {
                switch (true) {
                    case mime.startsWith("image/"):
                        markdowns.push(`![${name_escaped_mark}](${path_escaped_uri})`);
                        continue;
                    case mime.startsWith("audio/"):
                        markdowns.push(`<audio controls="controls" src="${path_escaped_html}"/>`);
                        continue;
                    case mime.startsWith("video/"):
                        markdowns.push(`<video controls="controls" src="${path_escaped_html}"/>`);
                        continue;
                    default:
                        break;
                }
            }
            markdowns.push(`[${name_escaped_mark}](${path_escaped_uri})`);
        }

        if (vditor && markdowns.length > 0) {
            // plugin.logger.debug(markdowns);
            vditor.insertValue(markdowns.join("\n"));
        }
    }

    async function assetsUploadHandler(files: File[], relative: boolean): Promise<null | string> {
        const asset_directory_path = relative //
            ? join(pathInfo.dir, assetsDirPath) //
            : assetsDirPath;
        const entries: [string, string][] = [];
        const assets = files
            .filter((file) => isValidName(file.name))
            .map((file) => ({
                file,
                name: file.name,
                path: relative //
                    ? `./${join(assetsDirPath, file.name)}` //
                    : `/${join(trimPrefix(assetsDirPath, "/"), file.name)}`,
                fullpath: join(asset_directory_path, file.name),
            }));

        const result = await Promise.allSettled(
            assets.map((asset) =>
                plugin.client.putFile({
                    path: asset.fullpath,
                    file: asset.file,
                }),
            ),
        );
        result.forEach((promise, index) => {
            if (promise.status === "fulfilled") {
                const asset = assets[index]!;
                entries.push([asset.name, asset.path]);
            }
        });
        assetsUploadCallback(entries);
        return null;
    }

    function updateAssetsUploadMode(assetsUploadMode_: AssetsUploadMode, options: IOptions | undefined = vditor?.vditor?.options): void {
        if (options?.upload) {
            switch (assetsUploadMode_) {
                case AssetsUploadMode.assets:
                    options.upload.handler = undefined;
                    break;

                case AssetsUploadMode.relative:
                    // @ts-expect-error
                    options.upload.handler = (files: File[]) => assetsUploadHandler(files, true);
                    break;

                case AssetsUploadMode.absolute:
                    // @ts-expect-error
                    options.upload.handler = (files: File[]) => assetsUploadHandler(files, false);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 解析文件路径
     * @param src - 文件路径
     * @returns 相对于工作空间根目录的文件路径
     */
    function parseFilePath(src: string): string {
        switch (true) {
            /* 相对路径 */
            case src.startsWith("./"):
            case src.startsWith("../"):
                return join(pathInfo.dir, src);

            case src.startsWith("//"):
                return "";

            /* 相对于工作空间根目录 */
            case src.startsWith("/"):
                return src;

            /* 思源静态文件服务 */
            case isStaticPathname(src):
                return staticPathname2WorkspacePath(src);

            default:
                return "";
        }
    }

    async function onerror(e: ErrorEvent): Promise<void> {
        // plugin.logger.debug(e);
        const target = e.target;

        /* 资源文件目标重定向 */
        if (target instanceof HTMLElement && ["audio", "img", "source", "track", "video"].includes(target.localName)) {
            const element = target as HTMLImageElement & HTMLVideoElement & HTMLAudioElement & HTMLSourceElement & HTMLTrackElement;
            const src = element.getAttribute("src") || element.getAttribute("srcset");
            if (!src)
                return;

            const object_url = src2url.get(src);
            let source = src;

            if (object_url) {
                source = object_url;
            }
            else {
                let mode: RequestMode = RequestMode.none;

                switch (true) {
                    /* HTTP */
                    case src.startsWith("//"):
                        source = `https:${src}`;
                    // fallthrough
                    case src.startsWith("http://"):
                    case src.startsWith("https://"):
                        mode = RequestMode.forwardProxy;
                        break;

                    /* 相对路径 */
                    case src.startsWith("./"):
                    case src.startsWith("../"):
                    // fallthrough
                    case src.startsWith("/"): // 相对于工作空间根目录
                        source = parseFilePath(src);
                        mode = RequestMode.getFile;
                        break;

                    /* 思源静态文件服务 */
                    case isStaticPathname(src):
                        source = `${rootURL}/${src}`;
                        break;

                    /* 其他 */
                    default:
                        return;
                }

                switch (mode) {
                    case RequestMode.getFile:
                        try {
                            const blob = await plugin.client.getFile({ path: source }, "blob");
                            const object_url = URL.createObjectURL(blob);
                            src2url.set(src, object_url);
                            source = object_url;
                            break;
                        }
                        catch (error) {
                            void error;
                            return;
                        }
                    case RequestMode.forwardProxy:
                        try {
                            const response = await plugin.client.forwardProxy({
                                url: source,
                                headers: [],
                                responseEncoding: "base64",
                            });
                            const blob = base64ToBlob(response.data.body, response.data.contentType);
                            const object_url = URL.createObjectURL(blob!);
                            src2url.set(src, object_url);
                            source = object_url;
                            break;
                        }
                        catch (error) {
                            void error;
                            return;
                        }

                    case RequestMode.none:
                    default:
                        break;
                }
            }

            if (src !== source) {
                if (element.src) {
                    element.src = source;
                }
                else {
                    element.srcset = source;
                }
            }
        }
    }

    function loadVditor(element?: HTMLElement, options?: IOptions): void {
        if (element) {
            try {
                /**
                 * 可能出现 `Uncaught TypeError: this.vditor is undefined`
                 */
                vditor?.destroy();
            }
            catch (error) {
                void error;
            }
            finally {
                updateAssetsUploadMode(assetsUploadMode, options);
                vditor = new Vditor(element, options);
            }
        }
    }

    $effect(() => {
        if (debug) {
            // @ts-expect-error
            globalThis.vditor = vditor;
        }
        else {
            // @ts-expect-error
            delete globalThis.vditor;
        }
    });

    $effect(() => {
        updateContent(value);
    });
    $effect(() => {
        updateUpdatable(updatable);
    });
    $effect(() => {
        updatechangeable(changeable);
    });
    $effect(() => {
        updateAssetsUploadMode(assetsUploadMode);
    });
    $effect(() => {
        updateTheme(theme, true, codeBlockThemeLight, codeBlockThemeDark);
    });

    onMount(() => {
        const mergedOptions = merge<IOptions>(
            {
                /**
                 * 从右向左书写
                 * @defaultValue false
                 */
                // rtl: false,

                /**
                 * 历史记录间隔
                 * @defaultValue 800
                 */
                // undoDelay: 800,

                /**
                 * 自定义 lute.min.js URL
                 * @defaultValue undefined
                 */
                _lutePath: undefined,

                /**
                 * 自定义静态资源基础路径
                 * @defaultValue
                 * `${cdn}/${dist}`
                 * `${cdn}/dist`
                 * `https://unpkg.com/vditor@${VDITOR_VERSION}/dist`
                 */
                // _baseURL: undefined,

                /**
                 * 自定义静态资源路径
                 * @defaultValue undefined
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
                 * @defaultValue ""
                 */
                value,

                /**
                 * 是否显示日志
                 * @defaultValue false
                 */
                debugger: debug, // 是否显示日志

                /**
                 * 是否启用打字机模式
                 * @defaultValue false
                 */
                // typewriterMode: false,

                /**
                 * 编辑器总高度
                 * @defaultValue "auto"
                 */
                height: "100%",

                /**
                 * 编辑器最小高度
                 * @defaultValue 63 + 工具栏高度
                 */
                // minHeight: undefined,

                /**
                 * 编辑器总宽度
                 * @defaultValue "auto"
                 */
                // width: "auto",

                /**
                 * 输入区域为空时的提示
                 * @defaultValue ""
                 */
                // placeholder: "",

                /**
                 * 本地化
                 * @defaultValue "zh_CN"
                 */
                lang: mapLocaleVditor("zh-Hans"),

                /**
                 * 国际化 (自定义语言包)
                 * 优先级低于 `lang`
                 * @defaultValue undefined
                 */
                // i18n: undefined,

                /**
                 * 全屏层级
                 * @defaultValue 90
                 */
                // fullscreen: {
                //     index: 90,
                // },

                /**
                 * 工具栏
                 */
                toolbar: [
                    {
                        name: "save",
                        // icon: "💾",
                        icon: icon_save,
                        hotkey: "⌘S",
                        tip: plugin.i18n?.editor.action.save.label,
                        tipPosition: "se",
                        click(_e: Event, _vditor: IVditor): void {
                            // plugin.logger.debugs("save.click", this, event, vditor);
                            if (updatable) {
                                onSave?.({ markdown: vditor!.getValue() });
                            }
                        },
                    },
                    "|",
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
                        icon: "<svg><use xlink:href=\"#vditor-icon-theme\"></use></svg>",
                        tip: "🎨",
                        tipPosition: "w",
                        click(): void {},
                        toolbar: [
                            {
                                name: "theme",
                                icon: "🔆 | 🌙",
                                click(_event, vditor_) {
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
                 * @param enable - 是否启用拖拽调整大小
                 * @param position - 拖拽栏位置
                 * - "top": 顶部
                 * - "bottom": 底部
                 * @param after - 拖拽完成回调函数
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
                     * @defaultValue false
                     */
                    enable: true,

                    /**
                     * 输入内容最大值
                     * @defaultValue Infinity
                     */
                    // max: 0,

                    /**
                     * 统计类型
                     * - "markdown": 文本数量
                     * - "text": 字符数量
                     * @defaultValue "markdown"
                     */
                    type: "text",

                    /**
                     * 字数统计回调函数
                     */
                    after(_length, _counter): void {
                    // plugin.logger.debug("counter.after", length, counter);
                        // if (changeable) {
                        //     dispatcher("changed", { markdown: vditor?.getValue() });
                        // }
                    },
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
                    id: path,

                    /**
                     * 是否启用缓存
                     * @defaultValue true
                     */
                    enable: changeable,

                    /**
                     * 缓存后的回调
                     */
                    after(markdown: string): void {
                        // plugin.logger.debugs("cache.after", markdown);

                        if (changeable) {
                            onChanged?.({ markdown });
                        }
                    },
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
                 * @param hljs - 代码块高亮设置
                 */
                preview: {
                    /**
                     * 消除抖动延时 (ms)
                     * @defaultValue 1000
                     */
                    // delay: 1000,

                    /**
                     * 预览区域最大宽度
                     * @defaultValue 800
                     */
                    // maxWidth: 800,

                    /**
                     * 显示模式
                     * - "both"
                     * - "editor"
                     * @defaultValue "both"
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
                         * @defaultValue true
                         */
                        // enable: true,

                        /**
                         * 是否启用行号
                         * @defaultValue false
                         */
                        lineNumber: true,

                        /**
                         * 默认代码高亮风格
                         * @defaultValue "github"
                         */
                        style: codeTheme,

                    /**
                     * 代码未设置语言时的默认值
                     * @defaultValue ""
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
                    // math: {
                    //     /**
                    //      * 内联数学公式起始 $ 后是否允许数字
                    //      * @defaultValue false
                    //      */
                    //     inlineDigit: false,

                    //     /**
                    //      * 默认渲染引擎
                    //      * - "KaTeX"
                    //      * - "MathJax"
                    //      * @defaultValue "KaTeX"
                    //      */
                    //     engine: "KaTeX",

                    //     /**
                    //      * MathJax 宏定义
                    //      * @defaultValue \{\}
                    //      */
                    //     macros: {},

                    //     /**
                    //      * MathJax 参数
                    //      * @defaultValue undefined
                    //      */
                    //     mathJaxOptions: undefined,
                    // },

                    /**
                     * markdown 渲染设置
                     */
                    markdown: {
                        /**
                         * 自动空格
                         * @defaultValue false
                         */
                        autoSpace: true,

                        /**
                         * 段落开头是否空两格
                         * @defaultValue false
                         */
                        // paragraphBeginningSpace: false,

                        /**
                         * 自动矫正术语
                         * @defaultValue false
                         */
                        // fixTermTypo: false,

                        /**
                         * 插入目录
                         * @defaultValue false
                         */
                        toc: true,

                    /**
                     * 启用脚注
                     * @defaultValue true
                     */
                        // footnotes: true,

                        /**
                         * wysiwyg & ir 模式下代码块是否渲染
                         * @defaultValue true
                         */
                        // codeBlockPreview: true,

                        /**
                         * wysiwyg & ir 模式下公式块是否渲染
                         * @defaultValue true
                         */
                        // mathBlockPreview: true,

                        /**
                         * 是否启用过滤 XSS
                         * @defaultValue true
                         */
                        // sanitize: true,

                        /**
                         * 链接相对路径前缀
                         * @defaultValue ""
                         */
                        // linkBase: "",

                        /**
                         * 链接强制前缀
                         * @defaultValue ""
                         */
                        // linkPrefix: "",

                        /**
                         * 为列表添加标记，以便自定义列表样式
                         * @defaultValue false
                         */
                        // listStyle: false,

                        /**
                         * 支持 mark 标记
                         * @defaultValue false
                         */
                        // mark: true,

                        /**
                         * 支持自动探测链接
                         * @defaultValue true
                         */
                        // gfmAutoLink: true,
                    },

                    /**
                     * 渲染主题
                     */
                    theme: {
                        /**
                         * 当前主题
                         * @defaultValue "light"
                         */
                        current: contentTheme!,

                        /**
                         * 主题文件目录
                         * @defaultValue `${cdn}/${dist}/css/content-theme`
                         */
                        path: `${baseURL}/css/content-theme`,

                    /**
                     * 主题列表
                     * [key: 主文件名]: 主题名称
                     */
                        // list: {},
                    },

                    /**
                     * 可选预览模式列表
                     * 可自定义
                     * @defaultValue ["desktop", "tablet", "mobile", "mp-wechat", "zhihu"]
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
                     * @param _element - <div class="vditor-preview">...</div>
                     */
                    parse(_element: HTMLElement): void {
                    // plugin.logger.debug(element);
                        // <div class="vditor-preview">...</div>
                    },

                    /**
                     * 渲染前回调函数
                     * @param html - 渲染后的 HTML 字符串, 没有其他标签包裹
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
                     * @defaultValue true
                     */
                    // isOpen: true,

                    /**
                     * 点击链接事件
                     * @param bom - 所点击超链接元素的 DOM 对象
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
                                onOpenLink?.({
                                    path: {
                                        current: path,
                                        target: parseFilePath(link.href),
                                    },
                                    href: link.href,
                                    title: link.title,
                                    anchor: link.textContent ?? undefined,
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
                                const textContent = anchor?.textContent ?? "";
                                onOpenLink?.({
                                    path: {
                                        current: path,
                                        target: parseFilePath(textContent),
                                    },
                                    href: textContent,
                                    title: title?.textContent ?? undefined,
                                    anchor: anchor?.textContent ?? undefined,
                                });
                                break;
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
                     * @defaultValue true
                     */
                    // isPreview: true,

                    /**
                     * 图片预览处理
                     * 双击图片进行预览模式
                     */
                    preview(_bom: Element): void {
                    // plugin.logger.debug(bom);
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
                     * emojis 名称 → 图标
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
                     * @defaultValue false
                     */
                    // hide: false,

                    /**
                     * 是否钉在顶部
                     * @defaultValue false
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
                 * @defaultValue "classic"
                 */
                theme: globalTheme,

                /**
                 * 默认图标主题
                 * - "ant"
                 * - "material"
                 * @defaultValue "ant"
                 */
                // icon: "ant",

                /**
                 * 文件上传
                 * TODO: 自定义文件上传
                 */
                upload: {
                    /**
                     * 上传 url
                     */
                    url: `${rootURL}/api/asset/upload`,

                    /**
                     * 上传文件最大 Byte
                     * @defaultValue 10 * 1024 * 1024
                     */
                    max: Infinity,

                    /**
                     * 剪切板中包含图片地址时，使用此 url 重新上传
                     */
                    // linkToImgUrl: "",

                    /**
                     * CORS 上传验证，头为 X-Upload-Token
                     */
                    // token: "",

                    /**
                     * 文件上传类型，同 [input accept](https://www.w3schools.com/tags/att_input_accept.asp)
                     */
                    // accept: "",

                    /**
                     * 跨站点访问控制
                     * @defaultValue false
                     */
                    // withCredentials: false,

                    /**
                     * 请求头设置
                     */
                    // headers: {},

                    /**
                     * 额外请求参数
                     */
                    extraData: {
                        assetsDirPath,
                    },

                    /**
                     * 是否允许多文件上传
                     * @defaultValue true
                     */
                    // multiple: true,

                    /**
                     * 上传字段名
                     * @defaultValue "file[]"
                     */
                    // fieldName: "file[]",

                    /**
                     * 每次上传前都会重新设置请求头
                     */
                    // setHeaders() {},

                    /**
                     * 第 1 步
                     * 将上传的文件处理后再返回
                     */
                    file(files: File[]): File[] | Promise<File[]> {
                        // plugin.logger.debugs("upload.file", files);
                        return files;
                    },

                    /**
                     * 第 2 步
                     * 校验，成功时返回 true 否则返回错误信息
                     */
                    validate(_files: File[]): boolean | string {
                        // plugin.logger.debugs("upload.validate", files);
                        return true;
                    },

                    /**
                     * 第 3 步
                     * 文件名安全处理。 默认值: `name => name.replace(/\W/g, '')`
                     * @param name - 不包含扩展名的文件名 (主文件名)
                     */
                    filename(name: string): string {
                        // plugin.logger.debugs("upload.filename", name);
                        return name;
                    },

                    /**
                     * 第 4 步
                     * 上传成功回调
                     * @param _editor - 编辑器元素
                     * @param msg - 服务端返回的数据
                     */
                    success(_editor: HTMLPreElement, msg: string): void {
                        // plugin.logger.debugs("upload.success", editor, msg);
                        try {
                            const response = JSON.parse(msg) as sdk.types.kernel.api.asset.upload.IResponse;
                            const succMap = response.data.succMap;
                            assetsUploadCallback(Object.entries(succMap));
                        }
                        catch (error) {
                            plugin.logger.warn(error);
                        }
                    },

                    /**
                     * 第 4 步
                     * 上传失败回调
                     * @param msg - 服务端返回的数据
                     */
                    error(msg: string): void {
                        plugin.logger.warns("upload.error", msg);
                    },

                    /**
                     * 自定义上传，当发生错误时返回错误信息
                     * 覆盖默认的上传行为
                     */
                    // handler(files: File[]): string | null | Promise<string> | Promise<null> {
                    //     plugin.logger.debugs("upload.handler", files);
                    //     return null;
                    // },

                    /**
                     * 对服务端返回的数据进行转换，以满足内置的数据结构
                     */
                    format(_files: File[], responseText: string): string {
                        // plugin.logger.debugs("upload.format", files, responseText);
                        return responseText;
                    },

                    /**
                     * 对服务端返回的数据进行转换(对应linkToImgUrl)，以满足内置的数据结构
                     */
                    linkToImgFormat(responseText: string): string {
                        // plugin.logger.debugs("upload.linkToImgFormat", responseText);
                        return responseText;
                    },

                    /**
                     * 图片地址上传后的回调
                     */
                    linkToImgCallback(_responseText: string): void {
                    // plugin.logger.debugs("upload.linkToImgCallback", responseText);
                    },
                },

                /**
                 * 预览元素的 className
                 * @defaultValue ""
                 */
                // classes: "",

                /**
                 * 静态资源地址
                 * @defaultValue `https://unpkg.com/vditor@${VDITOR_VERSION}`
                 */
                cdn: rootURL,

                /**
                 * 静态资源路径
                 * @defaultValue "dist"
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
                     * @defaultValue false
                     */
                    enable: true,

                    /**
                     * 大纲显示位置
                     * - "left"
                     * - "right"
                     * @defaultValue "left"
                     */
                    position: "right",
                },
            },
            options,
        );
        vditorElement!.addEventListener("error", onerror, true);
        loadVditor(vditorElement, mergedOptions);
    });

    onDestroy(() => {
        if (vditor) {
            vditor.clearCache();
            vditor.clearStack();
            vditor.destroy();
        }
    });
</script>

<div
    bind:this={vditorElement}
    id={vditorID}
    class="vditor"
></div>

<style lang="less">
</style>
