/**
 * Copyright (C) 2023 Zuoqiu Yingyi
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import yaml from "js-yaml";
import moment from "moment";

import {
    tokenSplit,
    isCustomAttrKey,
    looseJsonParse,
} from "./string";

import { IForm, IAttr } from "@/types/form";
import { IMetadata } from "@/types/metadata";

/* 解析器 */
export enum Parser {
    "string" = "string",
    "JSON" = "JSON",
    "YAML" = "YAML",
}

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
        noArrayIndent: false, // 禁用数组缩进
        skipInvalid: false, // 跳过无效类型
        flowLevel: -1, // 哪个嵌套级别开始启用流式风格 (-1 表示禁用)
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
        condenseFlow: true, // 是否使用紧凑流式风格
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
                    if (isCustomAttrKey(attr.key)) {
                        switch (attr.parser) {
                            case Parser.JSON:
                                return looseJsonParse(attr.value);
                            case Parser.YAML:
                                return yaml.load(attr.value);
                            case Parser.string:
                            default:
                                return attr.value;
                        }
                    }
                    else {
                        return attr.value;
                    }
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
