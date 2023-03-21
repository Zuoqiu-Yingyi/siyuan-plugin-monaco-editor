<script setup lang="ts">
import { inject, ref } from "vue";

import Breadcrumb from "./components/Breadcrumb.vue";

import { Client } from "./client/Client";
import { ISiyuan } from "./types/siyuan/siyuan";
import { IData } from "./types/data";

const client = inject("client") as Client;
const siyuan = inject("siyuan") as ISiyuan;
const data = inject("data") as IData;
const editable = ref(false);
</script>

<template>
    <a-layout class="layout">
        <a-layout-header class="header">
            <a-row>
                <a-col flex="none">
                    <breadcrumb
                        :paths="data.paths"
                        :hpaths="data.hpaths"
                    />
                </a-col>
                <a-col flex="auto">
                    <div>auto</div>
                </a-col>
                <a-col flex="none">
                    <a-switch
                        v-model:model-value="editable"
                        :title="$t('editable')"
                        type="circle"
                    >
                        <template #checked-icon>
                            <icon-edit />
                        </template>
                        <template #unchecked-icon>
                            <icon-eye />
                        </template>
                    </a-switch>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout>
            <a-layout-content>Content</a-layout-content>
        </a-layout>
        <a-layout-footer>Footer</a-layout-footer>
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
        padding: 0.5em;
    }

    :deep(.arco-layout-sider) {
    }

    :deep(.arco-layout-content) {
    }
}
</style>
