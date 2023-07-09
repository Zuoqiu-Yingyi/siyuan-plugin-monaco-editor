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

import type {
    IBlockContext,
    IBlockMenuContext,
} from "@workspace/utils/siyuan/menu/block";

import type { IFeature } from "@/types/config";

/* 判断一个功能是否支持某个块 */
export function isValidBlock(feature: IFeature, block: IBlockContext): boolean {
    /* 定义了块类型, 需要进一步判断 */
    if (feature.type) {
        const type = feature.type[block.type];
        /* 存在具体类型定义, 需要进一步判断 */
        if (type) {
            /* 该块类型不支持 */
            if (!type.enable) return false;
        }
        /* 存在默认 */
        else if (feature.type.default) {
            /* 默认不支持 */
            if (!feature.type.default.enable) return false;
        }
    }
    /* 通过块类型校验 */

    /* 定义了块子类型, 需要进一步判断 */
    if (feature.subtype) {
        const subtype = feature.subtype[block.subtype];
        /* 存在具体子类型定义, 需要进一步判断 */
        if (subtype) {
            /* 该块子类型不支持 */
            if (!subtype.enable) return false;
        }
        /* 存在默认 */
        else if (feature.subtype.default) {
            /* 默认不支持 */
            if (!feature.subtype.default.enable) return false;
        }
    }
    /* 通过块子类型校验 */

    /* 支持该块 */
    return true;
}

/* 过滤受支持功能的过滤器 */
export function featureFilter(feature: IFeature, context: IBlockMenuContext): boolean {
    /* 功能未启用 */
    // if (!feature.enable) return false;

    /* 选择了多个块 */
    if (context.isMultiBlock) {
        /* 功能不支持多个块 */
        if (!feature.multi) return false;
    }

    /* 存在该功能不支持的块 */
    if (context.blocks.find(block => !isValidBlock(feature, block))) return false;

    /* 功能支持所有所选块 */
    return true;
}
