<script setup lang="ts">
import { BreadcrumbRoute } from "@arco-design/web-vue";

const props = defineProps<{
    paths: string[]; // 文档路径
    hpaths: string[]; // 可读路径
}>();

/* 面包屑路径 */
const end = Math.min(props.paths.length, props.hpaths.length);
const routes: BreadcrumbRoute[] = [];
for (let i = 0; i < end; ++i) {
    routes.push({
        label: props.hpaths[i],
        path: props.paths[i],
    });
}

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
