<script setup lang="ts">
import { inject, ref, onMounted } from "vue";

import Breadcrumb from "./components/Breadcrumb.vue";
import Form from "./components/Form.vue";

import { Client } from "./client/Client";
import { notify } from "./utils/notify";
import { dump } from "./utils/export";

import { ISiyuan } from "./types/siyuan/siyuan";
import { IData } from "./types/data";
import { IForm } from "./types/form";

const client = inject("client") as Client;
const siyuan = inject("siyuan") as ISiyuan;
const data = inject("data") as IData;
const editable = ref(false);

/* 更新文档 */
function updated(form?: IForm): void {
    setTimeout(() => {
        /* 调整高度 */
        const height = document.getElementById("main")?.scrollHeight;
        if (height && data.element) {
            data.element.style.height = `${height + 2}px`;
        }

        /* 保存元数据 */
        // if (form) {
        //     saveMetadata(form);
        // }
    }, 0);
}

/* 保存元数据 */
function saveMetadata(form: IForm): void {
    const yaml = dump(form);

    const metadata: string[] = [];

    metadata.push("---");
    metadata.push("\n");
    metadata.push(yaml);
    metadata.push("---");

    const markdown = metadata.join("");
    if (import.meta.env.DEV) {
        console.log(markdown);
    }

    if (markdown !== data.block_ial["data-export-md"]) {
        client
            .setBlockAttrs({
                id: data.block_id,
                attrs: {
                    "data-export-md": markdown,
                },
            })
            .then(() => {
                if (import.meta.env.DEV) {
                    console.log(`Form.saveMetadata\n${markdown}`);
                }
            })
            .catch(error => {
                notify(error.toString());
            });
    }

}

/* 重新加载 */
function reload(): void {
    globalThis.location.reload();
}

/* 组件挂载 */
onMounted(() => {
    if (import.meta.env.DEV) {
        console.log("APP.onMounted");
    }
    updated();
});
</script>

<template>
    <a-layout
        id="main"
        class="layout"
    >
        <a-layout-header class="header">
            <a-row>
                <a-col flex="none">
                    <Breadcrumb
                        :paths="data.paths"
                        :hpaths="data.hpaths"
                    />
                </a-col>
                <a-col flex="auto">
                    <div>auto</div>
                </a-col>
                <a-col flex="none">
                    <a-button
                        @click="reload"
                        :title="$t('reload')"
                        size="mini"
                        type="outline"
                    >
                        <template #icon>
                            <icon-refresh />
                        </template>
                    </a-button>
                    <a-divider direction="vertical" />
                    <a-switch
                        v-model:model-value="editable"
                        :title="$t('editable')"
                        style="margin-top: -4px"
                        type="circle"
                    >
                        <template #checked-icon>
                            <icon-check />
                        </template>
                        <template #unchecked-icon>
                            <icon-close />
                        </template>
                    </a-switch>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout>
            <a-layout-content>
                <Form
                    @updated="updated"
                    :client="client"
                    :data="data"
                    :editable="editable"
                />
            </a-layout-content>
        </a-layout>
        <!-- <a-layout-footer>Footer</a-layout-footer> -->
    </a-layout>
</template>

<style scoped lang="less">
.layout {
    :deep(.arco-layout-header),
    :deep(.arco-layout-footer),
    :deep(.arco-layout-sider-children),
    :deep(.arco-layout-content) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
    :deep(.arco-layout-header),
    :deep(.arco-layout-footer) {
        padding: 0.25em 0.5em;
    }

    :deep(.arco-layout-sider) {
    }

    :deep(.arco-layout-content) {
    }
}
</style>
