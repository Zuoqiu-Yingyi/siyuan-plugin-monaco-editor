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
    import List from "@workspace/components/siyuan/list/List.svelte";
    import { trimPrefix } from "@workspace/utils/misc/string";
    import { join } from "@workspace/utils/path/browserify";
    import { normalize } from "@workspace/utils/path/normalize";
    import { fn__code } from "@workspace/utils/siyuan/text/span";

    import { FileTree } from "@/explorer/filetree";

    import type { IListItem } from "@workspace/components/siyuan/list/list";

    import type { IFile } from "@/explorer/filetree";
    import type MonacoEditorPlugin from "@/index";
    import type { IUpdateDialogEvent } from "@/types/upload";

    interface IProps {
        plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
        path: string; // 当前路径
        files: FileList | IFile[]; // 待上传的文件列表
        prefix?: string; // 需要移除的目录前缀
    }

    interface IEvents {
        onCancel?: (params: IUpdateDialogEvent["cancel"]) => void; // 取消事件
    }

    let {
        plugin,
        path,
        files,
        prefix = "/",

        onCancel,
    }: IEvents & IProps = $props();

    const cancelButtonText: string = window.siyuan.languages?.cancel ?? "Cancel"; // 取消按钮文本
    let confirmButtonText: string = $state(plugin.i18n.menu.upload.tips.startUpload); // 确定按钮文本
    let confirmButtonDisabled: boolean = $state(true); // 确定按钮是否禁用

    let cancel: HTMLButtonElement | undefined = $state(); // 取消按钮
    let confirm: HTMLButtonElement | undefined = $state(); // 确认按钮

    void cancel;
    void confirm;

    let items: IListItem[] | undefined = $state(); // 列表
    let filetree: InstanceType<typeof FileTree> | undefined = $state();
    let uploaded_file: number = $state(0); // 已上传文件数
    let uploaded_byte: number = $state(0); // 已上传比特数

    let fold: boolean = $state(true); // 是否折叠下级列表
    let finished: boolean = $state(false); // 上传完成

    const total_file = files.length; // 总文件数
    const total_byte = (() => {
        let size = 0;
        for (let i = 0; i < files.length; i++) {
            size += files[i]!.size;
        }
        return size;
    })(); // 总文件大小
    const text = $derived(plugin.i18n.menu.upload.tips.statusInfo // 提示文本
        .replaceAll("{{1}}", fn__code(uploaded_file.toString())) // 已上传文件数
        .replaceAll("{{2}}", fn__code(total_file.toString())) // 总文件数
        .replaceAll("{{3}}", fn__code(uploaded_byte.toString())) // 已上传文件大小
        .replaceAll("{{4}}", fn__code(total_byte.toString()))); // 文件总大小

    /* 通过文件路径构建文件树 */
    $effect(() => {
        filetree = new FileTree(plugin, files, prefix);
        items = filetree.toList(fold);
        confirmButtonDisabled = false;
    });

    function _onCancle(event: MouseEvent): void {
        onCancel?.({ finished, event });
    }
    async function _onConfirm(event: MouseEvent): Promise<void> {
        if (finished) {
            onCancel?.({ finished, event });
        }
        else {
            confirmButtonDisabled = true;
            const errorList: IFile[] = []; // 上传失败的文件列表
            for (const file of filetree!.files) {
                try {
                    await plugin.client.putFile({
                        path: join(path, file.webkitRelativePath || normalize(trimPrefix(file.path ?? "", prefix)) || file.name),
                        file,
                        modTime: file.lastModified,
                    });
                    uploaded_file++;
                    uploaded_byte += file.size;
                }
                catch (error) {
                    void error;
                    errorList.push(file);
                }
            }

            if (errorList.length > 0) {
                // 存在上传出错的文件
                fold = false;
                files = errorList;
                confirmButtonText = plugin.i18n.menu.upload.tips.reUpload;
            }
            else {
                // 全部上传完成
                confirmButtonText = plugin.i18n.menu.upload.tips.confirm;
                confirmButtonDisabled = false;
                finished = true;
            }
        }
    }
</script>

<div class="b3-dialog__content">
    <!-- 提示文本 -->
    <div class="ft__center">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html text}
    </div>

    <div class="fn__hr"></div>

    <!-- 文件列表 -->
    <List {items} />
</div>

<!-- 按鈕 -->
<div class="b3-dialog__action">
    <button
        bind:this={cancel}
        class="b3-button b3-button--cancel"
        onclick={_onCancle}
    >
        {cancelButtonText}
    </button>
    <div class="fn__space"></div>
    <button
        bind:this={confirm}
        class="b3-button b3-button--text"
        disabled={confirmButtonDisabled}
        onclick={_onConfirm}
    >
        {confirmButtonText}
    </button>
</div>

<style lang="less">
    .b3-dialog__content {
        padding: 0.5em;
        // max-height: 75vh;
        // min-width: 50vw;
    }
</style>
