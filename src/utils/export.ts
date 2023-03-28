import yaml from "js-yaml";
import moment from "moment";

import { tokenSplit } from "./string";

import { IForm, IAttr } from "./../types/form";
import { IMetadata } from "./../types/metadata";

const KEYS_ORDER = [
    "title",
    "id",
    "date",
    "lastmod",
    "name",
    "alias",
    "tags",
    "memo",
];

export function dump(
    obj: any,
    options: yaml.DumpOptions = {},
    defaultOptions: yaml.DumpOptions = {
        indent: 2, // 缩进空格数
        noArrayIndent: false, // 数组是否缩进
        skipInvalid: false, // 跳过无效类型
        flowLevel: -1, // 哪个嵌套级别使用流式风格
        // styles: {}, // 标签 => 样式 映射表
        schema: yaml.DEFAULT_SCHEMA, // 使用的风格
        sortKeys: (k1, k2) => {
            const i1 = KEYS_ORDER.indexOf(k1);
            const i2 = KEYS_ORDER.indexOf(k2);
            if (i1 === -1 && i2 === -1) return k1.localeCompare(k2);
            if (i1 === -1) return 1;
            if (i2 === -1) return -1;
            return i1 - i2;
        }, // 键排序
        // lineWidth: 80, // 行最大宽度
        // noRefs: false, // 是否不将相同的对象转换为引用
        noCompatMode: true, // 不与旧版本兼容
        condenseFlow: false, // 是否使用紧凑流式风格
        quotingType: '"', // 引号类型
        forceQuotes: false, // 强制引号
        // replacer: (k, v) => {}, // 回调函数
    },
): string {
    Object.assign(defaultOptions, options);
    return yaml.dump(obj, defaultOptions);
}

/* 序列化 IAL */
export function dumpIAL(attrs: IMetadata[]): string {
    const ial: Record<string, any> = {};
    attrs.forEach(attr => {
        ial[attr._key] = (() => {
            switch (attr.key) {
                case "created":
                case "updated":
                    return moment(attr.value, "YYYYMMDDHHmmss").toDate();
                case "tags":
                case "alias":
                    return tokenSplit(attr.value);
                default:
                    return attr.value;
            }
        })();
    });
    return dump(ial, {
        sortKeys: (k1, k2) => {
            const l1 = attrs.findIndex(attr => attr._key === k1);
            const l2 = attrs.findIndex(attr => attr._key === k2);
            return l1 - l2;
        },
    });
}

/* 序列化 Form */
export function dumpForm(form: IForm): string {
    const ial: Record<string, any> = {
        title: form.basics.title,
        id: form.others.id,
        date: moment(form.basics.created, "YYYYMMDDHHmmss").toDate(),
        lastmod: moment(form.basics.updated, "YYYYMMDDHHmmss").toDate(),
        // date: moment(form.basics.created, "YYYYMMDDHHmmss").utc().format(),
        // lastmod: moment(form.basics.updated, "YYYYMMDDHHmmss").utc().format(),
    };

    if (form.basics.name) ial.name = form.basics.name;
    if (form.basics.memo) ial.memo = form.basics.memo;
    if (form.basics.tags.length > 0) ial.tags = form.basics.tags;
    if (form.basics.alias.length > 0) ial.alias = form.basics.alias;

    form.customs.reduce((ial, custom) => {
        ial[custom.key] = custom.value;
        return ial;
    }, ial);

    return dump(ial);
}
