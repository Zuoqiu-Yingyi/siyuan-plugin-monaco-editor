<script setup lang="ts">
import { shallowReactive, reactive, shallowRef, watch, inject, ref, unref, onUpdated } from "vue";
import { I18n, VueI18nTranslation } from "vue-i18n";
import { TableColumnData, TableData, TableDraggable, TableRowSelection } from "@arco-design/web-vue";

import { Client } from "./../client/Client";
import { notify } from "./../utils/notify";
import { dumpIAL } from "./../utils/export";

import { IMetadata } from "./../types/metadata";
import { IData, IAL } from "./../types/data";

const i18n = inject("i18n") as I18n;
const t = i18n.global.t as VueI18nTranslation;

const props = defineProps<{
    data: IData;
    client: Client;
    activate: boolean; // 是否激活面板的控件
}>();

const emits = defineEmits<{
    (e: "updated"): void; // 界面更新
}>();

/* 推送组件更新 */
function updated(): void {
    emits("updated");
}

const yaml = ref(props.data.block_ial["custom-metadata"] ?? ""); // YFM 文本
const selected_rows = shallowRef<TableData[]>([]); // 选中的表格行
const selected_keys = shallowRef<string[]>(
    (() => {
        const keys: string[] = [];
        props.data.block_config.rows.forEach(row => {
            if (row.activate) keys.push(row.key);
        });
        return keys;
    })(),
); // 选中的行的键列表
const key_map = new Map<string, string>(
    (() => {
        const map: [string, string][] = [];
        props.data.block_config.rows.forEach(row => {
            if (row._key) map.push([row.key, row._key]);
        });
        return map;
    })(),
);

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
    props.data.ial,
    ial => {
        const attrs: TableData[] = [];
        for (const key in ial) {
            attrs.push({
                key,
                _key: (() => {
                    /* 如果存在自定义的属性名 */
                    const _key = key_map.get(key);
                    if (_key) {
                        return _key;
                    } else {
                        return key.startsWith("custom-") ? key.replace(/^custom-/, "") : key;
                    }
                })(),
                value: ial[key],
            });
        }

        /* 排序 */
        attrs.sort((a1, a2) => {
            const i1 = props.data.block_config.rows.findIndex(row => row.key === a1.key);
            const i2 = props.data.block_config.rows.findIndex(row => row.key === a2.key);
            if (i1 === -1 && i2 === -1) return a1.key!.localeCompare(a2.key!);
            if (i1 === -1) return 1;
            if (i2 === -1) return -1;
            return i1 - i2;
        });
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

    updateSelectedRows();
}

/* 选择发生更改 */
function onSelectionChange(rowKeys: string[]): void {
    if (import.meta.env.DEV) {
        console.log("Export.onSelectionChange");
    }

    selected_keys.value = rowKeys;
    updateSelectedRows();
}

/* 输入框发生更改 */
function onChangeInput(record: TableData, value: string) {
    if (import.meta.env.DEV) {
        console.log("Export.onChangeInput");
    }

    const _key = record.key?.startsWith("custom-") ? `custom-${value}` : value;

    if (record.key === _key) {
        // 非自定义映射
        key_map.delete(record.key);
    } else {
        key_map.set(record.key!, value);
    }

    updateSelectedRows();
}

/* 更新选中的行 */
function updateSelectedRows() {
    selected_rows.value = table.data.filter(a => selected_keys.value.includes(a.key as string));
}

/* 更新文本框 */
watch(
    selected_rows,
    rows => {
        /* 更新文本域中显示的 YFM */
        if (rows.length > 0) {
            const metadata: string[] = [];
            metadata.push("---");
            metadata.push("\n");
            metadata.push(dumpIAL(rows as IMetadata[]));
            metadata.push("---");
            yaml.value = metadata.join("");
        } else {
            yaml.value = "";
        }

        setTimeout(updated, 250);
    },
    {
        flush: "post",
    },
);

/* 保存 */
function save(attrs: Record<string, string | null>, then?: (response: any) => void): void {
    /* 保存配置 */
    props.client
        .setBlockAttrs({
            id: props.data.block_id,
            attrs,
        })
        .then(response => {
            if (import.meta.env.DEV) {
                console.log(`Export.onClickSave`, attrs);
            }

            if (then) then(response);
        })
        .catch(error => {
            notify(error.toString());
        });
}

/* 导出时是否保留元数据 */
watch(
    () => props.data.block_config.retain,
    retain => {
        const attrs = {
            "custom-config": JSON.stringify(props.data.block_config),
            "data-export-md": props.data.block_config.retain ? yaml.value : "\n",
        };

        save(attrs, _r => {
            Object.assign(props.data.block_ial, attrs);
        });
    },
);

/* 点击保存按钮 */
function onClickSave(e: MouseEvent): void {
    /* 更新配置 */
    props.data.block_config.rows = table.data.map(row => {
        return {
            key: row.key!,
            _key: key_map.get(row.key!),
            activate: selected_keys.value.includes(row.key!),
        };
    });

    const attrs = {
        "custom-config": JSON.stringify(props.data.block_config),
        "custom-metadata": yaml.value,
        "data-export-md": props.data.block_config.retain ? yaml.value : "\n",
    };

    save(attrs, _r => {
        Object.assign(props.data.block_ial, attrs);
        notify(t("notification.metadata-save-success"), "S", 2000);
    });
}

/* 组件更新 */
onUpdated(() => {
    if (import.meta.env.DEV) {
        console.log("Export.onUpdated");
    }
    // setTimeout(updated, 250);
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
                @click="onClickSave"
                type="primary"
                size="mini"
            >
                <template #icon>
                    <icon-save />
                </template>
            </a-button>
            <a-switch
                v-model:model-value="props.data.block_config.retain"
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
                    @change="value => onChangeInput(record, value)"
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
