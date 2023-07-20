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

    import { merge } from "@workspace/utils/misc/merge";
    import { SaveFileAs } from "@workspace/utils/misc/save";
    import { FLAG_ELECTRON, FLAG_IFRAME } from "@workspace/utils/env/native-front-end";

    import { mapLocale } from "@/utils/locale";
    import { DEFAULT_EDITOR_PROPS } from "@/configs/editor";

    import type { IEditorEvent, IEditorProps, IStandaloneEditorOptions } from "@/types/editor";
    import { Languages } from "@/utils/language";

    export let plugin: IEditorProps["plugin"];

    export let embed: IEditorProps["embed"] = DEFAULT_EDITOR_PROPS.embed;
    export let path: IEditorProps["path"] = DEFAULT_EDITOR_PROPS.path;

    export let diff: IEditorProps["diff"] = DEFAULT_EDITOR_PROPS.diff;
    export let locale: IEditorProps["locale"] = DEFAULT_EDITOR_PROPS.locale;

    export let savable: IEditorProps["savable"] = DEFAULT_EDITOR_PROPS.savable;
    export let changable: IEditorProps["changable"] = DEFAULT_EDITOR_PROPS.changable;

    export let original: IEditorProps["original"] = DEFAULT_EDITOR_PROPS.original;
    export let modified: IEditorProps["modified"] = DEFAULT_EDITOR_PROPS.modified;
    export let options: IEditorProps["options"] = DEFAULT_EDITOR_PROPS.options;
    export let originalOptions: IEditorProps["originalOptions"] = DEFAULT_EDITOR_PROPS.originalOptions;
    export let modifiedOptions: IEditorProps["modifiedOptions"] = DEFAULT_EDITOR_PROPS.modifiedOptions;
    export let diffOptions: IEditorProps["diffOptions"] = DEFAULT_EDITOR_PROPS.diffOptions;

    let editorElement: HTMLDivElement; // 编辑器挂载的元素

    var monaco: typeof Monaco; // monaco-editor 实例
    var editor: Editor.IStandaloneCodeEditor; // 常规编辑器实例 (差异对比模式下的修改编辑器)
    var diffEditor: Editor.IStandaloneDiffEditor; // 差异对比编辑器实例
    var languages: InstanceType<typeof Languages>; // 语言包实例

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

    function updateOptions(options: IStandaloneEditorOptions) {
        if (inited && options) {
            updateOriginalOptions(options);
            updateModifiedOptions(options);
        }
    }

    function updateOriginalOptions(options: IStandaloneEditorOptions) {
        if (inited && options) {
            if (diff) {
                diffEditor?.getOriginalEditor().updateOptions(options);
            }
        }
    }

    function updateModifiedOptions(options: IStandaloneEditorOptions) {
        if (inited && options) {
            if (diff) {
                diffEditor?.getModifiedEditor().updateOptions(options);
            } else {
                editor?.updateOptions(options);
            }
        }
    }

    function updateDiffOptions(diffOptions: Editor.IDiffEditorOptions) {
        if (inited) {
            if (diff) {
                diffEditor?.updateOptions(diffOptions);
            }
        }
    }

    /* 更改编辑器语言类型 */
    $: {
        if (inited) {
            if (diff) {
                if (diffEditor && languages) {
                    monaco.editor.setModelLanguage(
                        diffEditor.getOriginalEditor().getModel(), //
                        languages.map(original?.language ?? ""), //
                    );
                    monaco.editor.setModelLanguage(
                        diffEditor.getModifiedEditor().getModel(), //
                        languages.map(modified?.language ?? ""), //
                    );
                }
            } else {
                if (editor && languages) {
                    monaco.editor.setModelLanguage(
                        editor.getModel(), //
                        languages.map(modified?.language ?? ""), //
                    );
                }
            }
        }
    }

    /* 更改编辑器内容 */
    $: {
        const temp = changable;
        if (inited) {
            changable = false; // 避免触发 changed 监听器
            if (diff) {
                original && diffEditor.getOriginalEditor().setValue(original.value);
                modified && diffEditor.getModifiedEditor().setValue(modified.value);
            } else {
                modified && editor.setValue(modified.value);
            }
            changable = temp;
        }
    }

    /* 编辑内容是否可保存 */
    $: {
        if (editor) {
            setSaveAction(savable);
        }
    }

    /* 更新编辑器选项 */
    $: updateOptions(options);
    $: updateOriginalOptions(originalOptions);
    $: updateModifiedOptions(modifiedOptions);

    /* 更新差异对比编辑器选项 */
    $: updateDiffOptions(diffOptions);

    // monaco editor 资源目录
    const vs = (() => {
        switch (true) {
            case import.meta.env.DEV: // 开发模式
                return "node_modules/monaco-editor/min/vs";

            case import.meta.env.PROD: // 生产环境
            default:
                if (embed) {
                    // 嵌入到思源内部
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
                } else {
                    // 通过 iframe/BrowserWindow 加载
                    switch (true) {
                        case FLAG_ELECTRON: // Electron BrowserWindow 环境
                            return globalThis.require("path").resolve(path, `./data/plugins/${plugin.name}/libs/monaco-editor/min/vs`);
                        case FLAG_IFRAME: // iframe 环境
                        default:
                            return "./../libs/monaco-editor/min/vs";
                    }
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
            // plugin.logger.debug(monaco.languages.getLanguages());
            languages = new Languages(
                plugin,
                monaco,
                dispatch,
            );

            if (diff) {
                // 差异对比编辑器
                diffEditor = monaco.editor.createDiffEditor(
                    editorElement, //
                    options, //
                );
                diffEditor.setModel({
                    original: monaco.editor.createModel(
                        original.value, //
                        languages.map(original?.language ?? ""), //
                    ),
                    modified: monaco.editor.createModel(
                        modified.value, //
                        languages.map(modified?.language ?? ""), //
                    ),
                });
                editor = diffEditor.getModifiedEditor();
            } else {
                // 常规编辑器
                if (modified) {
                    editor = monaco.editor.create(
                        editorElement, //
                        merge(options, modified, { language: languages.map(modified.language) }), //
                    );
                } else {
                    editor = monaco.editor.create(
                        editorElement, //
                        options, //
                    );
                }
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
                        filetype: languages.getMimeType(editor.getModel().getLanguageId()),
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
