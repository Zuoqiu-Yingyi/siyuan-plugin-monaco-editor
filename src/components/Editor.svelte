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
        IEditorHandlers,
        IEditorProps,
        IStandaloneEditorOptions,
    } from "@/types/editor";

    export interface IProps {
        plugin: IEditorProps["plugin"];
        embed?: IEditorProps["embed"];
        path?: IEditorProps["path"];
        diff?: IEditorProps["diff"];
        locale?: IEditorProps["locale"];
        savable?: IEditorProps["savable"];
        changeable?: IEditorProps["changeable"];
        original?: IEditorProps["original"];
        modified?: IEditorProps["modified"];
        options?: IEditorProps["options"];
        originalOptions?: IEditorProps["originalOptions"];
        modifiedOptions?: IEditorProps["modifiedOptions"];
        diffOptions?: IEditorProps["diffOptions"];
    }
</script>

<script lang="ts">
    import loader from "@monaco-editor/loader";
    import { onMount } from "svelte";

    import {
        //
        FLAG_ELECTRON,
        FLAG_IFRAME,
    } from "@workspace/utils/env/native-front-end";
    import { merge } from "@workspace/utils/misc/merge";
    import { saveFileAs } from "@workspace/utils/misc/save";

    import { DEFAULT_EDITOR_PROPS } from "@/configs/editor";
    import { Languages } from "@/editor/language";
    import { mapLocale } from "@/utils/locale";

    import type { editor as Editor } from "monaco-editor";
    import type Monaco from "monaco-editor";

    let {
        plugin,
        embed = DEFAULT_EDITOR_PROPS.embed,
        path = DEFAULT_EDITOR_PROPS.path,
        diff = DEFAULT_EDITOR_PROPS.diff,
        locale = DEFAULT_EDITOR_PROPS.locale,
        savable = DEFAULT_EDITOR_PROPS.savable,
        changeable = DEFAULT_EDITOR_PROPS.changeable,
        original = DEFAULT_EDITOR_PROPS.original,
        modified = DEFAULT_EDITOR_PROPS.modified,
        options = DEFAULT_EDITOR_PROPS.options,
        originalOptions = DEFAULT_EDITOR_PROPS.originalOptions,
        modifiedOptions = DEFAULT_EDITOR_PROPS.modifiedOptions,
        diffOptions = DEFAULT_EDITOR_PROPS.diffOptions,

        onChanged,
        onSave,
        onHover,
        onOpen,
    }: IProps & IEditorHandlers = $props();

    let editorElement: HTMLDivElement | undefined = $state(); // 编辑器挂载的元素

    let monaco: typeof Monaco | undefined = $state(); // monaco-editor 实例
    let editor: Editor.IStandaloneCodeEditor | undefined = $state(); // 常规编辑器实例 (差异对比模式下的修改编辑器)
    let diffEditor: Editor.IStandaloneDiffEditor | undefined = $state(); // 差异对比编辑器实例
    let languages: InstanceType<typeof Languages> | undefined = $state(); // 语言包实例

    let inited = $state(false); // 编辑器是否初始化完成

    const i18n = plugin.i18n;

    /* 设置保存功能 (闭包) */
    const setSaveAction = (() => {
        let disposable: Monaco.IDisposable | void;
        return (savable: boolean) => {
            if (savable) {
                /* 可保存 */
                if (disposable) {
                /* 存在保存菜单项 */
                }
                else {
                    /* 不存在保存菜单项 */
                    disposable = editor?.addAction({
                        id: "18730D32-5451-4102-B299-BE281BA929B9",
                        label: i18n.editor.action.save.label,
                        keybindings: [monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyS],
                        contextMenuGroupId: "3_file",
                        contextMenuOrder: 1,
                        run: () => {
                            onSave?.({
                                value: editor!.getValue(),
                            });
                        },
                    });
                }
            }
            else {
                /* 不可保存 */
                if (disposable) {
                    /* 存在保存菜单项 */
                    disposable.dispose();
                    disposable = undefined;
                }
                else {
                /* 不存在保存菜单项 */
                }
            }
        };
    })();

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
            }
            else {
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

    function updateOptions(options: IStandaloneEditorOptions) {
        if (inited && options) {
            updateOriginalOptions(options);
            updateModifiedOptions(options);
        }
    }

    function setOriginalModelLanguage(lang: string) {
        if (inited && diffEditor) {
            const model = diffEditor.getOriginalEditor().getModel();
            if (model) {
                monaco?.editor.setModelLanguage(
                    model,
                    lang,
                );
            }
        }
    }

    function setModifiedModelLanguage(lang: string) {
        if (inited) {
            if (diff) {
                if (diffEditor) {
                    const model = diffEditor.getModifiedEditor().getModel();
                    if (model) {
                        monaco?.editor.setModelLanguage(
                            model,
                            lang,
                        );
                    }
                }
            }
            else {
                if (editor) {
                    const model = editor.getModel();
                    if (model) {
                        monaco?.editor.setModelLanguage(
                            model,
                            lang,
                        );
                    }
                }
            }
        }
    }

    function setModelLanguage(lang: string) {
        if (inited) {
            setOriginalModelLanguage(lang);
            setModifiedModelLanguage(lang);
        }
    }

    /* 更改编辑器语言类型 */
    $effect(() => {
        if (inited) {
            original && setOriginalModelLanguage(languages!.map(original?.language ?? ""));
            modified && setModifiedModelLanguage(languages!.map(modified?.language ?? ""));
        }
    });

    /* 更改编辑器内容 */
    $effect(() => {
        const temp = changeable;
        if (inited) {
            changeable = false; // 避免触发 changed 监听器
            if (diff) {
                original && diffEditor!.getOriginalEditor().setValue(original.value);
                modified && diffEditor!.getModifiedEditor().setValue(modified.value);
            }
            else {
                modified && editor!.setValue(modified.value);
            }
            changeable = temp;
        }
    });

    /* 编辑内容是否可保存 */
    $effect(() => {
        if (editor) {
            setSaveAction(savable);
        }
    });

    /* 更新编辑器选项 */
    $effect(() => {
        updateOptions(options);
    });
    $effect(() => {
        updateOriginalOptions(originalOptions);
    });
    $effect(() => {
        updateModifiedOptions(modifiedOptions);
    });

    /* 更新差异对比编辑器选项 */
    $effect(() => {
        updateDiffOptions(diffOptions);
    });

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
                            return globalThis.require("node:path").resolve(window.siyuan.config!.system.workspaceDir, `./data/plugins/${plugin.name}/libs/monaco-editor/min/vs`);
                        // return `${window.siyuan.system.workspaceDir}/data/plugins/${plugin.name}/libs/monaco-editor/min/vs`;
                        }
                        default: {
                            // 浏览器环境
                            const url = new URL(`${globalThis.document.baseURI}plugins/${plugin.name}/libs/monaco-editor/min/vs`);
                            return url.pathname;
                        }
                    }
                }
                else {
                    // 通过 iframe/BrowserWindow 加载
                    switch (true) {
                        case FLAG_ELECTRON: // Electron BrowserWindow 环境
                            return globalThis.require("node:path").resolve(path, `./data/plugins/${plugin.name}/libs/monaco-editor/min/vs`);
                        case FLAG_IFRAME: // iframe 环境
                        default: {
                            const url = new URL(`./../libs/monaco-editor/min/vs`, globalThis.document.baseURI);
                            return url.pathname;
                        }
                    }
                }
        }
    })();
    // plugin.logger.debug(vs);

    loader.config({
        "paths": {
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
        init.then((instance) => {
            monaco = instance;
            // plugin.logger.debug(monaco.languages.getLanguages());
            languages = new Languages(plugin, monaco, {
                onChanged,
                onSave,
                onHover,
                onOpen,
            });

            if (diff) {
                // 差异对比编辑器
                diffEditor = monaco.editor.createDiffEditor(
                    editorElement!, //
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
            }
            else {
                // 常规编辑器
                if (modified) {
                    editor = monaco.editor.create(
                        editorElement!, //
                        merge(options, modified, { language: languages.map(modified?.language ?? "") }), //
                    );
                }
                else {
                    editor = monaco.editor.create(
                        editorElement!, //
                        options, //
                    );
                }
            }

            /**
             * 监听编辑器内容变更事件
             * REF: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneCodeEditor.html#onDidChangeModelContent
             */
            editor.onDidChangeModelContent((e) => {
                if (changeable) {
                    onChanged?.({
                        value: editor!.getValue(),
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
                    const wordWrap: Editor.EditorOption.wordWrap = 133;
                    const wordWrapOverride1: Editor.EditorOption.wordWrapOverride1 = 137;
                    let word_wrap_status: boolean;
                    switch (editor!.getOption(wordWrapOverride1)) {
                        case "off":
                            word_wrap_status = true;
                            break;
                        case "on":
                            word_wrap_status = false;
                            break;
                        default:
                            switch (editor!.getOption(wordWrap)) {
                                case "off":
                                    word_wrap_status = true;
                                    break;

                                case "on":
                                case "wordWrapColumn":
                                case "bounded":
                                default:
                                    word_wrap_status = false;
                                    break;
                            }
                            break;
                    }
                    updateOptions({ wordWrapOverride1: word_wrap_status ? "on" : "off" });
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
                    const model = editor!.getModel();
                    if (model) {
                        saveFileAs({
                            data: editor!.getValue(),
                            filetype: languages!.getMimeType(model.getLanguageId()),
                        });
                    }
                },
            });

            /* 语言模式切换命令 */
            monaco.languages.getLanguages().forEach((lang) => {
                editor!.addAction({
                    id: `set-model-language-${lang.id}`,
                    label: `${i18n.editor.action.setModelLanguage.label}: ${lang.id}`,
                    run: () => {
                        setModelLanguage(lang.id);
                    },
                });
            });

            inited = true;
        }).catch((err) => {
            inited = false;
            plugin.logger.error(err);
        });
    });
</script>

<!-- REF: https://www.svelte.cn/docs#bind_element -->
<div
    bind:this={editorElement}
    class:editor={!embed}
    class:fn__flex-1={embed}
></div>

<style lang="less">
    .editor {
        width: 100%;
        height: 100%;
    }
</style>
