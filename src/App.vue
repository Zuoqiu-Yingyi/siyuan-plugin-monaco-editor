<script setup lang="ts">
import { inject, ref, unref, onMounted, watch } from "vue";
import { I18n } from "vue-i18n";

import Breadcrumb from "./components/Breadcrumb.vue";
import Export from "./components/Export.vue";
import Form from "./components/Form.vue";

import { Client } from "./client/Client";
import { notify } from "./utils/notify";
import { dumpForm } from "./utils/export";
import { getArcoLang } from "./utils/language";

import { ISiyuan } from "./types/siyuan/siyuan";
import { IData, IAL } from "./types/data";
import { IForm } from "./types/form";

const client = inject("client") as Client;
const siyuan = inject("siyuan") as ISiyuan;
const data = inject("data") as IData;
const i18n = inject("i18n") as I18n;

const editable = ref(false); // 是否可编辑
const active_key_collapse = ref([1, 2]); // 属性编辑页签展开的列表
const active_key_tags = ref(1); // 选中的页签
const arch_lang = getArcoLang(unref(i18n.global.locale));

watch(active_key_tags, updated, { flush: "post" });

/* 更新文档 */
function updated(): void {
    setTimeout(() => {
        if (import.meta.env.DEV) {
            console.log("APP.updated");
        }

        /* 调整高度 */
        const height = document.getElementById("main")?.scrollHeight;
        if (height && data.element) {
            data.element.style.height = `${height + 2}px`;
        }
    }, 0);
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
    <a-config-provider :locale="arch_lang">
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
                    <a-col flex="auto" />
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
                        <a-switch
                            v-model:model-value="editable"
                            :title="$t('editable')"
                            style="margin-top: -4px"
                            type="circle"
                            size="medium"
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
                    v-model:active-key="active_key_tags"
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
                            v-model:active-key="active_key_collapse"
                            :client="client"
                            :data="data"
                            :editable="editable"
                            @updated="updated"
                        />
                    </a-tab-pane>

                    <!-- 属性导出 -->
                    <a-tab-pane :key="2">
                        <template #title>
                            <icon-edit />
                            {{ $t("export") }}
                        </template>

                        <Export
                            :client="client"
                            :data="data"
                            :activate="active_key_tags === 2"
                            @updated="updated"
                        />
                    </a-tab-pane>
                </a-tabs>
            </a-layout-content>
            <!-- <a-layout-footer>Footer</a-layout-footer> -->
        </a-layout>
    </a-config-provider>
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
