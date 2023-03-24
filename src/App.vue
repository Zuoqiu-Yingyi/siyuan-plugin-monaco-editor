<script setup lang="ts">
import { inject, ref, onMounted } from "vue";

import Breadcrumb from "./components/Breadcrumb.vue";
import Export from "./components/Export.vue";
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
const active_key = ref([1, 2]);

/* 更新文档 */
function updated(form?: IForm): void {
    setTimeout(() => {
        if (import.meta.env.DEV) {
            console.log("APP.updated");
        }

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

/* 折叠所有面板 */
function collapse(): void {
    active_key.value = [];
}

/* 展开所有面板 */
function expand(): void {
    active_key.value = [1, 2, 3];
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
        <!-- 页眉 -->
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
                    <a-divider
                        class="divider-vertical"
                        direction="vertical"
                        margin="0.5em"
                        :size="2"
                    />
                    <a-button
                        v-if="active_key.length === 0"
                        @click="expand"
                        :title="$t('expand')"
                        size="mini"
                        type="secondary"
                    >
                        <template #icon>
                            <icon-expand />
                        </template>
                    </a-button>
                    <a-button
                        v-else
                        @click="collapse"
                        :title="$t('collapse')"
                        size="mini"
                        type="secondary"
                    >
                        <template #icon>
                            <icon-shrink />
                        </template>
                    </a-button>
                    <a-divider
                        class="divider-vertical"
                        direction="vertical"
                        margin="0.5em"
                        :size="2"
                    />
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

        <!-- 主体 -->
        <a-layout-content class="content">
            <a-tabs
                class="tags"
                size="mini"
                type="card-gutter"
            >
                <!-- 属性编辑 -->
                <a-tab-pane :key="1">
                    <template #title>
                        <icon-edit />
                        {{ $t("edit") }}
                    </template>

                    <Form
                        @updated="updated"
                        v-model:active-key="active_key"
                        :client="client"
                        :data="data"
                        :editable="editable"
                    />
                </a-tab-pane>

                <!-- 属性导出 -->
                <a-tab-pane :key="2">
                    <template #title>
                        <icon-edit />
                        {{ $t("export") }}
                    </template>

                    <Export />
                </a-tab-pane>
            </a-tabs>
        </a-layout-content>
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

    .divider-vertical {
    }

    /* 主体 */
    .content {
        /* 标签页 */
        .tags {
            /* 标签页内容 */
            :deep(.arco-tabs-content) {
                padding: 0;
            }
        }
    }
}
</style>
