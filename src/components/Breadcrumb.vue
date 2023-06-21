<!--
 Copyright (C) 2023 Zuoqiu Yingyi
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<script setup lang="ts">
import { computed, UnwrapNestedRefs } from "vue";
import { BreadcrumbRoute } from "@arco-design/web-vue";

const props = defineProps<{
    paths: UnwrapNestedRefs<string[]>; // 文档路径
    hpaths: UnwrapNestedRefs<string[]>; // 可读路径
}>();

/* 面包屑路径 */
const routes = computed(() => {
    const routes: BreadcrumbRoute[] = [];
    const end = Math.min(props.paths.length, props.hpaths.length);
    for (let i = 0; i < end; ++i) {
        routes.push({
            label: props.hpaths[i],
            path: props.paths[i],
        });
    }
    return routes;
});

/* URL 生成 */
function customURL(paths: string[]): string { 
    return `siyuan://blocks/${paths.at(-1)}`;
}
</script>

<template>
    <a-breadcrumb
        :max-count="4"
        :routes="routes"
        :separator="'/'"
        :custom-url="customURL"
    />
</template>

<style scoped lang="less"></style>
