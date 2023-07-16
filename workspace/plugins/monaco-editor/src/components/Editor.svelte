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
    import { onMount, createEventDispatcher } from "svelte";

    import type { default as Monaco, editor as Editor } from "monaco-editor";
    import loader from "@monaco-editor/loader";

    import { mapLocale } from "@/utils/locale";
    import type { IEditorEvent, IEditorModel, IPlugin } from "@/types/editor";
    import type { IMonacoEditorOptions } from "@/types/config";

    import { merge } from "@workspace/utils/misc/merge";
    import { SaveFileAs } from "@workspace/utils/misc/save";
    import { FLAG_ELECTRON } from "@workspace/utils/env/native-front-end";

    export let plugin: IPlugin; // 插件接口

    export let embed: boolean = false; // 是否为嵌入模式 (嵌入在思源页面中)

    export let diff: boolean = false; // 是否为差异对比模式
    export let savable: boolean = false; // 是否可保存 (保存按钮+派生保存事件)
    export let changable: boolean = false; // 是否可更改 (派生更改事件)

    export let locale = "zh-Hans"; // 界面语言
    export let original: IEditorModel = { value: "" }; // 编辑器原始内容
    export let modified: IEditorModel = { value: "" }; // 编辑器内容 (差异对比模式下的变更内容)
    export let options: IMonacoEditorOptions = {}; // 编辑器配置 (编辑器初始化 & 常规模式更新)
    export let diffOptions: Editor.IDiffEditorOptions = {}; // 对比编辑器配置 (仅用于差异对比模式更新)

    let editorElement: HTMLDivElement; // 编辑器挂载的元素

    var monaco: typeof Monaco; // monaco-editor 实例
    var editor: Editor.IStandaloneCodeEditor; // 常规编辑器实例 (差异对比模式下的修改编辑器)
    var diffEditor: Editor.IStandaloneDiffEditor; // 差异对比编辑器实例

    var inited = false; // 编辑器是否初始化完成

    const i18n = plugin.i18n;
    const dispatch = createEventDispatcher<IEditorEvent>();

    /* 设置保存功能 (闭包) */
    const setSaveAction = (() => {
        var disposable: Monaco.IDisposable | void;
        return (savable: boolean) => {
            if (savable) {
                /* 可保存 */
                if (disposable) {
                    /* 存在保存菜单项 */
                } else {
                    /* 不存在保存菜单项 */
                    disposable = editor?.addAction({
                        id: "18730D32-5451-4102-B299-BE281BA929B9",
                        label: i18n.editor.action.save.label,
                        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
                        contextMenuGroupId: "3_file",
                        contextMenuOrder: 1,
                        run: () => {
                            dispatch("save", {
                                value: editor.getValue(),
                            });
                        },
                    });
                }
            } else {
                /* 不可保存 */
                if (disposable) {
                    /* 存在保存菜单项 */
                    disposable.dispose();
                    disposable = undefined;
                } else {
                    /* 不存在保存菜单项 */
                }
            }
        };
    })();

    function updateOptions(options: Editor.IEditorOptions & Editor.IGlobalEditorOptions) {
        if (diff) {
            // diffEditor?.updateOptions(options);
            diffEditor?.getOriginalEditor().updateOptions(options);
            diffEditor?.getModifiedEditor().updateOptions(options);
        } else {
            editor?.updateOptions(options);
        }
    }

    function updateDiffOptions(diffOptions: Editor.IDiffEditorOptions) {
        if (diff) {
            diffEditor?.updateOptions(options);
        }
    }

    /* 更改编辑器语言类型 */
    $: {
        if (inited) {
            if (diff) {
                monaco.editor.setModelLanguage(
                    diffEditor.getOriginalEditor().getModel(), //
                    original.language, //
                );
                monaco.editor.setModelLanguage(
                    diffEditor.getModifiedEditor().getModel(), //
                    modified.language, //
                );
            } else {
                monaco.editor.setModelLanguage(
                    editor.getModel(), //
                    modified.language, //
                );
            }
        }
    }

    /* 更改编辑器内容 */
    $: {
        if (inited) {
            if (diff) {
                diffEditor.getOriginalEditor().setValue(original.value);
                diffEditor.getModifiedEditor().setValue(modified.value);
            } else {
                editor.setValue(modified.value);
            }
        }
    }

    /* 编辑内容是否可保存 */
    $: {
        if (editor) {
            setSaveAction(savable);
        }
    }

    /* 更新编辑器选项 */
    $: {
        if (inited) {
            updateOptions(options);
        }
    }

    /* 更新差异对比编辑器选项 */
    $: {
        if (inited) {
            updateDiffOptions(diffOptions);
        }
    }

    // monaco editor 资源目录
    const vs = (() => {
        switch (true) {
            case import.meta.env.DEV: // 开发模式
                return "node_modules/monaco-editor/min/vs";

            case import.meta.env.PROD: // 生产环境
            default:
                switch (true) {
                    case embed: // 嵌入到思源内部
                        switch (true) {
                            case FLAG_ELECTRON: {
                                // Electron 环境
                                return globalThis.require("path").resolve(globalThis.siyuan.config.system.workspaceDir, `./data/plugins/${plugin.name}/libs/monaco-editor/min/vs`);
                                // return `${globalThis.siyuan.system.workspaceDir}/data/plugins/${plugin.name}/libs/monaco-editor/min/vs`;
                            }
                            default: {
                                // 浏览器环境
                                const url = new URL(`${globalThis.document.baseURI}plugins/${plugin.name}/libs/monaco-editor/min/vs`);
                                return url.pathname;
                            }
                        }

                    default: // 通过 iframe 加载
                        return "./../libs/monaco-editor/min/vs";
                }
        }
    })();
    // plugin.logger.debug(vs);

    loader.config({
        paths: {
            vs,
        },
        // monaco,
        "vs/nls": {
            availableLanguages: {
                "*": mapLocale(locale),
            },
        },
    });
    const init = loader.init();

    onMount(() => {
        init.then(instance => {
            monaco = instance;
            if (diff) {
                // 差异对比编辑器
                diffEditor = monaco.editor.createDiffEditor(
                    editorElement, //
                    options, //
                );
                diffEditor.setModel({
                    original: monaco.editor.createModel(
                        original.value, //
                        original.language, //
                        original.uri, //
                    ),
                    modified: monaco.editor.createModel(
                        modified.value, //
                        modified.language, //
                        modified.uri, //
                    ),
                });
                editor = diffEditor.getModifiedEditor();
            } else {
                // 常规编辑器
                editor = monaco.editor.create(
                    editorElement, //
                    merge(options, modified), //
                );
            }

            /**
             * 监听编辑器内容变更事件
             * REF: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneCodeEditor.html#onDidChangeModelContent
             */
            editor.onDidChangeModelContent(e => {
                if (changable) {
                    dispatch("changed", {
                        value: editor.getValue(),
                        event: e,
                    });
                }
            });

            /**
             * 注册命令
             * REF: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IActionDescriptor.html
             */
            /* 切换自动换行 */
            editor.addAction({
                id: "F9E62A24-619E-49EA-A870-B31E6F9D284F", // 菜单项 id
                label: i18n.editor.action.toggleWordWrap.label, // 菜单项名称
                /**
                 * REF: https://microsoft.github.io/monaco-editor/api/classes/monaco.KeyMod.html
                 * REF: https://microsoft.github.io/monaco-editor/api/enums/monaco.KeyCode.html
                 */
                keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ], // 绑定快捷键
                contextMenuGroupId: "2_view", // 所属菜单的分组
                contextMenuOrder: 1, // 菜单分组内排序
                run: () => {
                    // 点击后执行的操作
                    // Editor.EditorOption.wordWrap === 128
                    const word_wrap_status = editor.getOption(128) === "off" ? "on" : "off";
                    updateOptions({ wordWrap: word_wrap_status });
                },
            });

            /* 保存 */
            setSaveAction(savable);

            /* 另存为文件 */
            editor.addAction({
                id: "D68588DD-8D0C-4435-8DC2-145B0F464FF8",
                label: i18n.editor.action.saveAs.label,
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS],
                contextMenuGroupId: "3_file",
                contextMenuOrder: 2,
                run: () => {
                    SaveFileAs({
                        data: editor.getValue(),
                    });
                },
            });

            inited = true;
        }).catch(err => {
            inited = false;
            plugin.logger.error(err);
        });
    });
</script>

<!-- REF: https://www.svelte.cn/docs#bind_element -->
<div
    bind:this={editorElement}
    class:fn__flex-1={embed}
    class:editor={!embed}
/>

<style lang="less">
    .editor {
        width: 100%;
        height: 100%;
    }
</style>
