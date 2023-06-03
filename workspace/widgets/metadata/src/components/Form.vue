<script setup lang="ts">
import { inject, ref, shallowRef, reactive, shallowReactive, toRaw, onUpdated, watch, toRef } from "vue";
import { I18n, VueI18nTranslation } from "vue-i18n";
import moment from "moment";

import { Client } from "./../client/Client";
import { notify } from "./../utils/notify";
import { tokenSplit, isCustomAttrKey } from "./../utils/string";

import { IForm, IAttr } from "./../types/form";
import { IData, IAL } from "./../types/data";

const i18n = inject("i18n") as I18n;
const t = i18n.global.t as VueI18nTranslation;

const props = defineProps<{
    editable: boolean;
    client: Client;
    data: IData;
    activeKey: number[];
}>();

const emits = defineEmits<{
    (e: "updated"): void; // 界面更新
    (e: "update:activeKey", activeKey: number[]): void; // 折叠面板更新
}>();

/* 推送组件更新 */
function updated(): void {
    emits("updated");
}

const active_key = ref(props.activeKey);

/* 监听折叠面板更改 */
watch(
    () => props.activeKey,
    value => {
        active_key.value = value;
    },
    {
        flush: "post",
    },
);

/* 推送折叠面板更改 */
watch(
    active_key,
    value => {
        emits("update:activeKey", value);
    },
    {
        flush: "post",
    },
);

/* 属性表单 */
const form = reactive(
    (() => {
        const form: IForm = {
            basics: {
                created: "",
                updated: "",
                title: "",
                name: "",
                alias: [],
                tags: [],
                bookmark: "",
                memo: "",
            },
            customs: [],
            others: {
                id: "",
                icon: "",
                scroll: "",
                "title-img": "",
            },
            unknowns: {},
        };
        for (const key in props.data.ial) {
            const value = props.data.ial[key];
            switch (key) {
                /* 基本属性 */
                case "created":
                case "updated":
                    form.basics[key] = timestampFormat(value);
                    break;
                case "alias":
                case "tags":
                    form.basics[key] = tokenSplit(value);
                    break;
                case "title":
                case "name":
                case "bookmark":
                case "memo":
                    form.basics[key] = value;
                    break;

                /* 其他属性 */
                case "id":
                case "icon":
                case "scroll":
                case "title-img":
                    form.others[key] = value;
                    break;

                default:
                    switch (true) {
                        /* 自定义属性 */
                        case isCustomAttrKey(key):
                            const _key = key.replace(/^custom-/, "");
                            form.customs.push({
                                _key,
                                key: _key,
                                value: value,
                            });
                            break;

                        /* 未知属性 */
                        default:
                            form.unknowns[key] = value;
                            break;
                    }
            }
        }
        if (import.meta.env.DEV) {
            console.log(form);
        }
        return form;
    })(),
);

/* 书签选项 */
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
    const v = (() => {
        switch (key) {
            case "alias":
                return (value as string[]).map(a => a.replaceAll(",", "\\,")).join(",");

            default:
                if (Array.isArray(value)) {
                    return value.join(",");
                } else {
                    return value;
                }
        }
    })();

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
                delete props.data.ial[key];
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

/* 折叠所有面板 */
function collapse(): void {
    active_key.value = [];
}

/* 展开所有面板 */
function expand(): void {
    active_key.value = [1, 2, 3];
}

/* 组件更新 */
onUpdated(() => {
    if (import.meta.env.DEV) {
        console.log("Form.onUpdated");
    }
    setTimeout(updated, 250);
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
            v-model:active-key="active_key"
        >
            <a-collapse-item
                class="collapse-item"
                :header="$t('attributes.basic')"
                :key="1"
            >
                <template #extra>
                    <a-button
                        v-if="active_key.length === 0"
                        :title="$t('expand')"
                        @click.stop="expand"
                        size="mini"
                        type="primary"
                    >
                        <template #icon>
                            <icon-expand />
                        </template>
                    </a-button>
                    <a-button
                        v-else
                        :title="$t('collapse')"
                        @click.stop="collapse"
                        size="mini"
                        type="primary"
                    >
                        <template #icon>
                            <icon-shrink />
                        </template>
                    </a-button>
                </template>
                <a-row :gutter="8">
                    <a-col
                        :xs="24"
                        :sm="12"
                        :xl="6"
                    >
                        <a-form-item field="created">
                            <template #label>
                                {{ $t("created") }}
                                <br />
                                <span class="attr-key">[created]</span>
                            </template>
                            <template #help>
                                {{ $t("help.created") }}
                            </template>
                            <a-input
                                v-model:model-value="form.basics.created"
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
                                <br />
                                <span class="attr-key">[updated]</span>
                            </template>
                            <template #help>
                                {{ $t("help.updated") }}
                            </template>
                            <a-input
                                v-model:model-value="form.basics.updated"
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
                                <br />
                                <span class="attr-key">[title]</span>
                            </template>
                            <template #help>
                                {{ $t("help.title") }}
                            </template>
                            <a-input
                                v-model:model-value="form.basics.title"
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
                                <br />
                                <span class="attr-key">[name]</span>
                            </template>
                            <template #help>
                                {{ $t("help.name") }}
                            </template>
                            <a-input
                                v-model:model-value="form.basics.name"
                                @change="value => updateNativeAttr('name', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :xs="24"
                        :md="12"
                    >
                        <a-form-item field="alias">
                            <template #label>
                                {{ $t("alias") }}
                                <br />
                                <span class="attr-key">[alias]</span>
                            </template>
                            <template #help>
                                {{ $t("help.alias") }}
                            </template>
                            <a-input-tag
                                v-model:model-value="form.basics.alias"
                                @change="value => updateNativeAttr('alias', value as string[])"
                                style="text-align: left"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col
                        :xs="24"
                        :md="12"
                    >
                        <a-form-item field="tags">
                            <template #label>
                                {{ $t("tags") }}
                                <br />
                                <span class="attr-key">[tags]</span>
                            </template>
                            <template #help>
                                {{ $t("help.tags") }}
                            </template>
                            <a-input-tag
                                v-model:model-value="form.basics.tags"
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
                                <br />
                                <span class="attr-key">[bookmark]</span>
                            </template>
                            <template #help>
                                {{ $t("help.bookmark") }}
                            </template>
                            <a-select
                                v-model:model-value="form.basics.bookmark"
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
                                <br />
                                <span class="attr-key">[memo]</span>
                            </template>
                            <template #help>
                                {{ $t("help.memo") }}
                            </template>
                            <a-textarea
                                v-model:model-value="form.basics.memo"
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

                <a-row :gutter="8">
                    <a-col
                        v-for="(attr, index) of form.customs"
                        :span="24"
                    >
                        <a-divider
                            v-if="index !== 0"
                            class="divider"
                            margin="0.5em"
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
                                <a-divider
                                    class="divider"
                                    margin="0.5em"
                                />
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
                <a-row :gutter="8">
                    <a-col
                        :sm="12"
                        :xs="24"
                    >
                        <a-form-item field="id">
                            <template #label>
                                {{ $t("id") }}
                                <br />
                                <span class="attr-key">[id]</span>
                            </template>
                            <template #help>
                                {{ $t("help.id") }}
                            </template>
                            <a-input
                                v-model:model-value="form.others.id"
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
                                <br />
                                <span class="attr-key">[icon]</span>
                            </template>
                            <template #help>
                                {{ $t("help.icon") }}
                            </template>
                            <a-input
                                v-model:model-value="form.others.icon"
                                @change="value => updateNativeAttr('icon', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item field="scroll">
                            <template #label>
                                {{ $t("scroll") }}
                                <br />
                                <span class="attr-key">[scroll]</span>
                            </template>
                            <template #help>
                                {{ $t("help.scroll") }}
                            </template>
                            <a-input
                                v-model:model-value="form.others.scroll"
                                @change="value => updateNativeAttr('scroll', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item field="title-img">
                            <template #label>
                                {{ $t("title-img") }}
                                <br />
                                <span class="attr-key">[title-img]</span>
                            </template>
                            <template #help>
                                {{ $t("help.title-img") }}
                            </template>
                            <a-input
                                v-model:model-value="form.others['title-img']"
                                @change="value => updateNativeAttr('title-img', value)"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>

                    <!-- 未知属性 -->
                    <a-col
                        v-for="(value, key, index) in form.unknowns"
                        :span="24"
                    >
                        <a-divider
                            v-if="index === 0"
                            class="divider"
                            margin="0.5em"
                        />
                        <a-form-item :field="key as string">
                            <template #label> [{{ key }}] </template>
                            <a-input
                                v-model:model-value="form.unknowns[key]"
                                @change="value => updateNativeAttr(key as string, value)"
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

            /* 表单标签 */
            :deep(.arco-form-item-label-col) {
                padding-right: 0.5em;
            }
            :deep(.arco-form-item-label) {
                line-height: 1.5;
                text-align: right;
            }

            /* 表单标签中的属性键名 */
            .attr-key {
                color: var(--color-text-4);
            }

            .form-item-custom {
                // 自定义属性输入框框倒置
                :deep(.arco-form-item-wrapper-col) {
                    flex-direction: column-reverse;
                }
            }
            .divider {
            }

            .textarea {
            }
        }
    }
}
</style>
