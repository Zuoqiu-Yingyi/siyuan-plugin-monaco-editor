<script setup lang="ts">
import { shallowReactive, reactive, shallowRef, watch, inject, ref, unref, onUpdated } from "vue";
import { I18n, VueI18nTranslation } from "vue-i18n";
import { TableColumnData, TableData, TableDraggable, TableRowSelection } from "@arco-design/web-vue";

import { Client } from "./../client/Client";
import { notify } from "./../utils/notify";
import { dumpIAL } from "./../utils/export";

import { IMetadata } from "./../types/metadata";
import { IAL } from "./../types/data";

const i18n = inject("i18n") as I18n;
const t = i18n.global.t as VueI18nTranslation;

const props = defineProps<{
    ial: IAL;
    // data: IData;
    client: Client;
    activate: boolean;
}>();

const emits = defineEmits<{
    (e: "updated"): void; // 界面更新
}>();

/* 推送组件更新 */
function updated(): void {
    emits("updated");
}

const yaml = ref(""); // YFM 文本
const ial = shallowRef<TableData[]>([]); // IAL 列表
const selected_keys = shallowRef<string[]>([]); // 选中的行
const metadata_retain = ref(false); // 导出时是否显示元数据

/* 表格配置 */
const table = reactive<{
    columns: TableColumnData[];
    data: TableData[];
    draggable: TableDraggable;
    rowSelection: TableRowSelection;
}>({
    columns: [
        {
            title: t("attributes.name"),
            dataIndex: "key",
            slotName: "key",
        },
        {
            title: t("attributes.key"),
            dataIndex: "_key",
            slotName: "_key",
        },
        {
            title: t("attributes.value"),
            dataIndex: "value",
            slotName: "value",
        },
    ],
    data: [],
    draggable: {
        type: "handle",
        title: t("sort"),
    },
    rowSelection: {
        type: "checkbox",
        showCheckedAll: true,
    },
});

watch(
    props.ial,
    ial => {
        const attrs: TableData[] = [];
        for (const key in ial) {
            attrs.push({
                key,
                _key: key.startsWith("custom-") ? key.replace(/^custom-/, "") : key,
                value: ial[key],
            });
        }
        table.data = attrs;
    },
    {
        immediate: true,
    },
);

/* 排序发生更改 */
function onChange(data: TableData[]): void {
    if (import.meta.env.DEV) {
        console.log("Export.onChange");
    }

    table.data = data;

    updateIAL();
}

/* 选择发生更改 */
function onSelectionChange(rowKeys: string[]): void {
    if (import.meta.env.DEV) {
        console.log("Export.onSelectionChange");
    }

    selected_keys.value = rowKeys;
    updateIAL();
}

/* 输入框发生更改 */
function onInputChange(value: string) {
    updateIAL();
}

/* 更新需要导出的 IAL */
function updateIAL() {
    ial.value = table.data.filter(a => selected_keys.value.includes(a.key as string));
}

/* 更新文本框 */
watch(
    ial,
    ial => {
        /* 优化 IAL */
        if (ial.length > 0) {
            const metadata: string[] = [];
            metadata.push("---");
            metadata.push("\n");
            metadata.push(dumpIAL(ial as IMetadata[]));
            metadata.push("---");
            yaml.value = metadata.join("");
        } else {
            yaml.value = "";
        }
    },
    {
        immediate: true,
        flush: "post",
    },
);

/* 组件更新 */
onUpdated(() => {
    if (import.meta.env.DEV) {
        console.log("Export.onUpdated");
    }
    setTimeout(updated, 250);
});
</script>

<template>
    <a-space
        :size="0"
        direction="vertical"
        fill
    >
        <!-- 控件 -->
        <a-space
            v-show="props.activate"
            class="control"
        >
            <a-button
                :title="$t('metadata.save')"
                type="primary"
                size="mini"
            >
                <template #icon>
                    <icon-save />
                </template>
            </a-button>
            <a-switch
                v-model:model-value="metadata_retain"
                :title="$t('metadata.retain')"
                type="circle"
                size="small"
            >
                <template #checked-icon>
                    <icon-check />
                </template>
                <template #unchecked-icon>
                    <icon-close />
                </template>
            </a-switch>
        </a-space>

        <a-table
            :default-selected-keys="selected_keys"
            :columns="table.columns"
            :data="table.data"
            :row-selection="table.rowSelection"
            :draggable="table.draggable"
            :pagination="false"
            :bordered="{ cell: true }"
            @change="onChange"
            @selection-change="rowKeys => onSelectionChange(rowKeys as string[])"
            column-resizable
            size="mini"
            class="table"
        >
            <template #_key="{ record, rowIndex }">
                <a-input
                    size="mini"
                    v-model="record._key"
                    @change="onInputChange"
                />
            </template>
            <template #value="{ record, rowIndex }">
                <pre class="value">{{ record.value }}</pre>
            </template>
        </a-table>

        <a-textarea
            v-model:model-value="yaml"
            auto-size
        />
    </a-space>
</template>

<style scoped lang="less">
.control {
    position: absolute;
    top: 23px;
    right: 3px;
    z-index: 1;
}
.table {
    pre.value {
        margin: 0;
    }
}
</style>
