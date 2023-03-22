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
