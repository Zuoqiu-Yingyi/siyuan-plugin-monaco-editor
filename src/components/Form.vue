<script setup lang="ts">
import { inject, ref, shallowRef, reactive, shallowReactive, toRaw, onUpdated } from "vue";
import { I18n, VueI18nTranslation } from "vue-i18n";
import moment from "moment";

import { Client } from "./../client/Client";
import { notify } from "./../utils/notify";

import { IForm, IAttr } from "./../types/form";
import { IData } from "./../types/data";

const i18n = inject("i18n") as I18n;
const t = i18n.global.t as VueI18nTranslation;

const props = defineProps<{
    editable: boolean;
    client: Client;
    data: IData;
}>();

const emits = defineEmits<{
    (e: "updated", form: IForm): void; // 界面更新
}>();

/* 组件更新完成 */
function updated(): void {
    emits("updated", form);
}

const loading = ref(true); // 书签选项是否加载完成
const options = shallowRef<string[]>([]); // 书签选项
props.client
    .getBookmarkLabels()
    .then(labels => {
        loading.value = false;
        options.value = labels.data;
    })
    .catch(error => {
        notify(error.toString());
    });

/* 时间戳格式化 */
function timestampFormat(timestamp: string): string {
    return moment(timestamp, "YYYYMMDDHHmmss").format("YYYY-MM-DD  HH:mm:ss  ddd");
}

/* token 分割 */
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

    customs: Object.keys(props.data.ial)
        .filter(k => k.startsWith("custom-"))
        .map(k => {
            const key = k.replace(/^custom-/, "");
            return {
                key,
                _key: key,
                value: props.data.ial[k],
            };
        }),

    id: props.data.ial.id ?? "",
    icon: props.data.ial.icon ?? "",
    scroll: props.data.ial.scroll ?? "",
    "title-img": props.data.ial["title-img"] ?? "",
});

/* 文档重命名 */
function renameDoc(value: string): void {
    const title = props.data.ial.title;
    if (value !== title) {
        /* 仅在文档名发生变化时重命名 */
        props.client
            .renameDoc({
                notebook: props.data.doc_notebook,
                path: props.data.doc_path,
                title: value,
            })
            .then(() => {
                if (import.meta.env.DEV) {
                    console.log(`Form.renameDoc ${title} => ${value}`);
                }
                props.data.ial.title = value;
                props.data.hpaths.splice(-1, 1, value);
            })
            .catch(error => {
                notify(error.toString());
            });
    }
}

/* 更新指定原生属性 */
function updateNativeAttr(key: string, value: string | string[]): void {
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
                if (import.meta.env.DEV) {
                    console.log(`Form.updateNativeAttr ${key}=${v}`);
                }
                props.data.ial[key] = v;
            })
            .catch(error => {
                notify(error.toString());
            });
    }
}

/* 添加自定义属性 */
function onclickAdd(_: MouseEvent): void {
    form.customs.unshift(
        shallowReactive<IAttr>({
            key: "",
            _key: "",
            value: "",
        }),
    );
}

/* 判断自定义属性名是否有效 */
function isCustomAttrKeyValid(key: string): boolean {
    const valid = /^[\-0-9a-zA-Z]+$/.test(key);
    return valid;
}

/* 删除自定义属性 */
function onclickDel(index: number): void {
    const custom = form.customs[index];
    const key = `custom-${custom.key}`;
    if (isCustomAttrKeyValid(custom.key)) {
        props.client
            .setBlockAttrs({
                id: props.data.doc_id,
                attrs: {
                    [key]: null,
                },
            })
            .then(() => {
                if (import.meta.env.DEV) {
                    console.log(`Form.onclickDel ${key}`);
                }
                form.customs.splice(index, 1);
            })
            .catch(error => {
                notify(error.toString());
            });
    } else {
        form.customs.splice(index, 1);
    }
}

/* 更新指定自定义属性名 */
async function updateCustomAttrKey(index: number): Promise<void> {
    const custom = form.customs[index];
    const _key = `custom-${custom._key}`;
    const key = `custom-${custom.key}`;

    try {
        /* 自定义属性名是否发生更改 */
        if (custom.key !== custom._key) {
            /* 原自定义属性名有效 */
            if (isCustomAttrKeyValid(custom._key)) {
                await props.client.setBlockAttrs({
                    id: props.data.doc_id,
                    attrs: {
                        [_key]: null,
                    },
                });
                delete props.data.ial[_key];

                /* 更新属性名 */
                custom._key = "";
            }

            /* 新自定义属性名有效 */
            if (isCustomAttrKeyValid(custom.key)) {
                await props.client.setBlockAttrs({
                    id: props.data.doc_id,
                    attrs: {
                        [key]: custom.value,
                    },
                });

                if (import.meta.env.DEV) {
                    console.log(`Form.updateCustomAttrKey ${_key} => ${key}`);
                }
                /* 设置该属性 */
                props.data.ial[key] = custom.value;

                /* 更新属性名 */
                custom._key = toRaw(custom.key);
            } else {
                notify(t("notification.attribute-key-invalid"), "W");
            }
        }
    } catch (error) {
        notify((error as Error).toString());
    }
}

/* 更新指定自定义属性值 */
function updateCustomAttrValue(index: number): void {
    const custom = form.customs[index];
    const key = `custom-${custom.key}`;
    if (custom.key.length > 0 && custom.value !== props.data.ial[key]) {
        props.client
            .setBlockAttrs({
                id: props.data.doc_id,
                attrs: {
                    [key]: custom.value,
                },
            })
            .then(() => {
                if (import.meta.env.DEV) {
                    console.log(`Form.updateCustomAttrValue ${key}=${custom.value}`);
                }
                props.data.ial[key] = custom.value;
            })
            .catch(error => {
                notify(error.toString());
            });
    }
}

/* 保存所有自定义属性 */
function saveAllCustomAttrs(): void {
    const attrs = form.customs
        .filter(custom => custom.key.length > 0)
        .reduce((attrs, custom) => {
            attrs[`custom-${custom.key}`] = custom.value;
            return attrs;
        }, {} as Record<string, string>);

    props.client
        .setBlockAttrs({
            id: props.data.doc_id,
            attrs,
        })
        .then(() => {
            if (import.meta.env.DEV) {
                console.log(`Form.setCustomAttrs`, attrs);
            }
            Object.keys(attrs).forEach(key => {
                props.data.ial[key] = attrs[key];
            });
        })
        .catch(error => {
            notify(error.toString());
        });
}

/* 组件更新 */
onUpdated(() => {
    if (import.meta.env.DEV) {
        console.log("Form.onUpdated");
    }
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
                        :xs="24"
                        :sm="12"
                        :xl="6"
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
                        :xs="24"
                        :sm="12"
                        :xl="6"
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
                        :xs="24"
                        :sm="12"
                        :xl="6"
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
                        :xs="24"
                        :sm="12"
                        :xl="6"
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
                                @change="value => updateNativeAttr('name', value)"
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
                                @change="value => updateNativeAttr('alias', value as string[])"
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
                                @change="value => updateNativeAttr('tags', value as string[])"
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
                                @change="value => updateNativeAttr('bookmark', value as string)"
                                :loading="loading"
                                :options="options"
                                allow-clear
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
                                @change="value => updateNativeAttr('memo', value)"
                                class="textarea"
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
                <template #extra>
                    <a-button
                        @click.stop="onclickAdd"
                        :disabled="!editable"
                        :title="$t('attributes.add')"
                        size="mini"
                        type="outline"
                    >
                        <template #icon>
                            <icon-plus />
                        </template>
                    </a-button>
                </template>

                <a-row :gutter="16">
                    <a-col
                        v-for="(attr, index) of form.customs"
                        :span="24"
                    >
                        <a-divider
                            v-if="index !== 0"
                            class="divider"
                        />
                        <a-form-item
                            class="form-item-custom"
                            :field="`custom-${attr.key}`"
                        >
                            <template #label>
                                <a-button
                                    @click="onclickDel(index)"
                                    :title="$t('attributes.del')"
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
                                    @change="updateCustomAttrKey(index)"
                                    allow-clear
                                >
                                    <template #prepend>custom-</template>
                                </a-input>
                                <a-divider class="divider" />
                            </template>

                            <a-textarea
                                v-model:model-value="attr.value"
                                @change="updateCustomAttrValue(index)"
                                class="textarea"
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
                                {{ $t("id") }}
                            </template>
                            <template #help>
                                {{ $t("help.id") }}
                            </template>
                            <a-input
                                v-model:model-value="form.id"
                                disabled
                            />
                        </a-form-item>
                    </a-col>

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
                                @change="value => updateNativeAttr('icon', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item field="scroll">
                            <template #label>
                                {{ $t("scroll") }}
                            </template>
                            <template #help>
                                {{ $t("help.scroll") }}
                            </template>
                            <a-input
                                v-model:model-value="form.scroll"
                                @change="value => updateNativeAttr('scroll', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item field="title-img">
                            <template #label>
                                {{ $t("title-img") }}
                            </template>
                            <template #help>
                                {{ $t("help.title-img") }}
                            </template>
                            <a-input
                                v-model:model-value="form['title-img']"
                                @change="value => updateNativeAttr('title-img', value)"
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
                padding-top: 0;
                padding-bottom: 0;
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

            .textarea {
            }
        }
    }
}
</style>
