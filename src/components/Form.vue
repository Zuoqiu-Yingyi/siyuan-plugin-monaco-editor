<script setup lang="ts">
import { reactive, shallowReactive, toRaw, onUpdated } from "vue";
import moment from "moment";

import { Client } from "./../client/Client";
import { IForm, IAttr } from "./../types/form";
import { IData } from "./../types/data";

const props = defineProps<{
    editable: boolean;
    client: Client;
    data: IData;
}>();

const emits = defineEmits<{
    (e: "updated"): void; // 界面更新
}>();

function updated(): void {
    emits("updated");
}

function timestampFormat(timestamp: string): string {
    return moment(timestamp, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
}

function tokenSplit(token: string): string[] {
    return token
        .replaceAll("\\,", "\n")
        .split(",")
        .map(t => t.replaceAll("\n", ","));
}

const form = reactive<IForm>({
    created: props.data.ial.created ? timestampFormat(props.data.ial.created) : "",
    updated: props.data.ial.updated ? timestampFormat(props.data.ial.updated) : "",
    title: props.data.ial.title ?? "",
    name: props.data.ial.name ?? "",
    alias: props.data.ial.alias ? tokenSplit(props.data.ial.alias) : [],
    tags: props.data.ial.tags ? tokenSplit(props.data.ial.tags) : [],
    bookmark: props.data.ial.bookmark ?? "",
    memo: props.data.ial.memo ?? "",

    custom: {
        key: "",
        value: "",
    },
    customs: Object.keys(props.data.ial)
        .filter(k => k.startsWith("custom-"))
        .map(k => ({ key: k.substring(7), value: props.data.ial[k] })),

    icon: props.data.ial.icon ?? "",
    "title-img": props.data.ial["title-img"] ?? "",
});

/* 添加自定义属性 */
function onclickAdd(_: MouseEvent): void {
    form.customs.unshift(
        shallowReactive<IAttr>({
            key: toRaw(form.custom.key),
            value: toRaw(form.custom.value),
        }),
    );
    form.custom.key = "";
    form.custom.value = "";
}

/* 删除自定义属性 */
function onclickDel(index: number): void {
    form.customs.splice(index, 1);
}

/* 文档重命名 */
var title = toRaw(form.title);
function renameDoc(value: string): void {
    if (title !== value) {
        /* 仅在文档名发生变化时重命名 */
        props.client
            .renameDoc({
                notebook: props.data.doc_notebook,
                path: props.data.doc_path,
                title: value,
            })
            .then(() => {
                props.data.hpaths.splice(-1, 1, value);
                title = value;
            });
    }
}

/* 保存原生属性 */
function saveNativeAttrs(key: string, value: string | string[]): void {
    const v = Array.isArray(value) ? value.join(",") : value;

    if (props.data.ial[key] !== v) {
        props.client
            .setBlockAttrs({
                id: props.data.doc_id,
                attrs: {
                    [key]: v,
                },
            })
            .then(() => {
                console.log(`Form.saveNativeAttrs ${key}=${v}`);
                props.data.ial[key] = v;
                updated();
            });
    }
}

/* 设置自定义属性 */
function setCustomAttrs(): void {}

/* 组件更新 */
onUpdated(() => {
    console.log("Form.onUpdated");
    updated();
});
</script>

<template>
    <a-form
        class="form"
        size="mini"
        :model="form"
        :disabled="!props.editable"
        auto-label-width
    >
        <a-collapse
            class="collapse"
            :default-active-key="[1, 2]"
        >
            <a-collapse-item
                class="collapse-item"
                :header="$t('attributes.basic')"
                :key="1"
            >
                <a-row :gutter="16">
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="created">
                            <template #label>
                                {{ $t("created") }}
                            </template>
                            <template #help>
                                {{ $t("help.created") }}
                            </template>
                            <a-input
                                v-model:model-value="form.created"
                                disabled
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="updated">
                            <template #label>
                                {{ $t("updated") }}
                            </template>
                            <template #help>
                                {{ $t("help.updated") }}
                            </template>
                            <a-input
                                v-model:model-value="form.updated"
                                disabled
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="title">
                            <template #label>
                                {{ $t("title") }}
                            </template>
                            <template #help>
                                {{ $t("help.title") }}
                            </template>
                            <a-input
                                v-model:model-value="form.title"
                                @change="renameDoc"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="name">
                            <template #label>
                                {{ $t("name") }}
                            </template>
                            <template #help>
                                {{ $t("help.name") }}
                            </template>
                            <a-input
                                v-model:model-value="form.name"
                                @change="value => saveNativeAttrs('name', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="alias">
                            <template #label>
                                {{ $t("alias") }}
                            </template>
                            <template #help>
                                {{ $t("help.alias") }}
                            </template>
                            <a-input-tag
                                v-model:model-value="form.alias"
                                @change="value => saveNativeAttrs('alias', value as string[])"
                                style="text-align: left"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="tags">
                            <template #label>
                                {{ $t("tags") }}
                            </template>
                            <template #help>
                                {{ $t("help.tags") }}
                            </template>
                            <a-input-tag
                                v-model:model-value="form.tags"
                                @change="value => saveNativeAttrs('tags', value as string[])"
                                style="text-align: left"
                                allow-clear
                                unique-value
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item field="bookmark">
                            <template #label>
                                {{ $t("bookmark") }}
                            </template>
                            <template #help>
                                {{ $t("help.bookmark") }}
                            </template>
                            <a-select
                                v-model:model-value="form.bookmark"
                                @change="value => saveNativeAttrs('bookmark', value as string)"
                                allow-create
                                allow-search
                            >
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item field="memo">
                            <template #label>
                                {{ $t("memo") }}
                            </template>
                            <template #help>
                                {{ $t("help.memo") }}
                            </template>
                            <a-textarea
                                v-model:model-value="form.memo"
                                @change="value => saveNativeAttrs('memo', value)"
                                auto-size
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-collapse-item>
            <a-collapse-item
                class="collapse-item"
                :header="$t('attributes.custom')"
                :key="2"
            >
                <a-row :gutter="16">
                    <!-- 待添加的元素 -->
                    <a-col :span="24">
                        <a-form-item
                            class="form-item-custom"
                            field="custom"
                        >
                            <template #label>
                                <a-button
                                    @click="onclickAdd"
                                    type="outline"
                                >
                                    <template #icon>
                                        <icon-plus />
                                    </template>
                                </a-button>
                            </template>

                            <template #help>
                                <a-input
                                    v-model:model-value="form.custom.key"
                                    allow-clear
                                >
                                    <template #prepend>custom-</template>
                                </a-input>
                                <a-divider class="divider" />
                            </template>

                            <a-textarea
                                v-model:model-value="form.custom.value"
                                auto-size
                            />
                        </a-form-item>
                    </a-col>

                    <!-- 存在的元素 -->
                    <a-col
                        v-for="(attr, index) of form.customs"
                        :span="24"
                    >
                        <a-divider class="divider" />
                        <a-form-item
                            class="form-item-custom"
                            :field="`custom-${attr.key}`"
                        >
                            <template #label>
                                <a-button
                                    @click="onclickDel(index)"
                                    type="outline"
                                    status="warning"
                                >
                                    <template #icon>
                                        <icon-delete />
                                    </template>
                                </a-button>
                            </template>

                            <template #help>
                                <a-input
                                    v-model:model-value="attr.key"
                                    allow-clear
                                >
                                    <template #prepend>custom-</template>
                                </a-input>
                                <a-divider class="divider" />
                            </template>

                            <a-textarea
                                v-model:model-value="attr.value"
                                auto-size
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-collapse-item>
            <a-collapse-item
                class="collapse-item"
                :header="$t('attributes.other')"
                :key="3"
            >
                <a-row :gutter="16">
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="icon">
                            <template #label>
                                {{ $t("icon") }}
                            </template>
                            <template #help>
                                {{ $t("help.icon") }}
                            </template>
                            <a-input
                                v-model:model-value="form.icon"
                                @change="value => saveNativeAttrs('icon', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="title-img">
                            <template #label>
                                {{ $t("title-img") }}
                            </template>
                            <template #help>
                                {{ $t("help.title-img") }}
                            </template>
                            <a-input
                                v-model:model-value="form['title-img']"
                                @change="value => saveNativeAttrs('title-img', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-collapse-item>
        </a-collapse>
    </a-form>
</template>

<style scoped lang="less">
.form {
    .collapse {
        .collapse-item {
            // 折叠面板的标题
            :deep(.arco-collapse-item-header) {
                padding-top: 0.25em;
                padding-bottom: 0.25em;
            }

            // 调整只读模式下的文本颜色
            :deep(.arco-input-disabled .arco-input[disabled]),
            :deep(.arco-textarea-disabled .arco-textarea[disabled]) {
                -webkit-text-fill-color: var(--color-text-2);
            }
            :deep(.arco-input-tag-disabled .arco-input-tag-tag),
            :deep(.arco-select-view-disabled) {
                color: var(--color-text-2);
            }

            .form-item-custom {
                // 自定义属性输入框框倒置
                :deep(.arco-form-item-wrapper-col) {
                    flex-direction: column-reverse;
                }
            }
            .divider {
                margin: 0.5em;
            }
        }
    }
}
</style>
