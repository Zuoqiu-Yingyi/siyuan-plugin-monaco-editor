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
    import type MonacoEditorPlugin from "@/index";
    import { FileTree } from "@/explorer/filetree";
    import List from "@workspace/components/siyuan/list/List.svelte";
    import type { IListItem } from "@workspace/components/siyuan/list/list";
    import { createEventDispatcher } from "svelte";
    import type { IUpdateDialogEvent } from "@/types/upload";
    import { join } from "@workspace/utils/path/browserify";
    import { fn__code } from "@workspace/utils/siyuan/text/span";

    export let plugin: InstanceType<typeof MonacoEditorPlugin>; // 插件对象
    export let path: string; // 当前路径
    export let files: FileList | File[]; // 待上传的文件列表

    let cancelButtonText: string = globalThis.siyuan?.languages?.cancel ?? "Cancel"; // 取消按钮文本
    let confirmButtonText: string = plugin.i18n.menu.upload.tips.startUpload; // 确定按钮文本
    let confirmButtonDisabled: boolean = true; // 确定按钮是否禁用

    let cancel: HTMLButtonElement; // 取消按钮
    let confirm: HTMLButtonElement; // 确认按钮

    let text: string; // 提示文本
    let items: IListItem[]; // 列表
    let filetree: InstanceType<typeof FileTree>;
    let uploaded_file: number = 0; // 已上传文件数
    let uploaded_byte: number = 0; // 已上传比特数

    var fold: boolean = true; // 是否折叠下级列表
    var finished: boolean = false; // 上传完成
    const dispatcher = createEventDispatcher<IUpdateDialogEvent>();

    const total_file = files.length; // 总文件数
    const total_byte = (() => {
        let size = 0;
        for (let i = 0; i < files.length; i++) {
            size += files[i].size;
        }
        return size;
    })(); // 总文件大小

    /* 通过文件路径构建文件树 */
    $: {
        filetree = new FileTree(plugin, files);
        items = filetree.toList(fold);
        confirmButtonDisabled = false;
    }

    $: {
        text = plugin.i18n.menu.upload.tips.statusInfo // 提示信息
            .replaceAll("${1}", fn__code(uploaded_file.toString())) // 已上传文件数
            .replaceAll("${2}", fn__code(total_file.toString())) // 总文件数
            .replaceAll("${3}", fn__code(uploaded_byte.toString())) // 已上传文件大小
            .replaceAll("${4}", fn__code(total_byte.toString())); // 文件总大小
    }

    function onCancle(event: MouseEvent): void {
        dispatcher("cancel", { finished, event });
    }
    async function onConfirm(event: MouseEvent): Promise<void> {
        if (finished) {
            dispatcher("cancel", { finished, event });
        } else {
            confirmButtonDisabled = true;
            const errorList: File[] = []; // 上传失败的文件列表
            for (const file of filetree.files) {
                try {
                    await plugin.client.putFile({
                        path: join(path, file.webkitRelativePath || file.name),
                        file,
                        modTime: file.lastModified,
                    });
                    uploaded_file++;
                    uploaded_byte += file.size;
                } catch (error) {
                    errorList.push(file);
                }
            }

            if (errorList.length > 0) {
                // 存在上传出错的文件
                fold = false;
                files = errorList;
                confirmButtonText = plugin.i18n.menu.upload.tips.reUpload;
            } else {
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
        {@html text}
    </div>

    <div class="fn__hr" />

    <!-- 文件列表 -->
    <List {items} />
</div>

<!-- 按鈕 -->
<div class="b3-dialog__action">
    <button
        bind:this={cancel}
        on:click={onCancle}
        class="b3-button b3-button--cancel"
    >
        {cancelButtonText}
    </button>
    <div class="fn__space" />
    <button
        bind:this={confirm}
        on:click={onConfirm}
        disabled={confirmButtonDisabled}
        class="b3-button b3-button--text"
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
