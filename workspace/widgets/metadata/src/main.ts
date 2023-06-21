import "@arco-design/web-vue/dist/arco.css";

import "./style.css";

import { createApp, reactive } from "vue";
import { createI18n } from "vue-i18n";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

import { mapLang } from "@workspace/utils/locale/language";

/* 组件 */
import App from "./App.vue";

import { Client } from "@workspace/apis/siyuan/client/Client";
import { setThemeMode } from "./utils/theme";

/* 类型 */
import { ISiyuan } from "./types/siyuan";
import { IData } from "./types/data";

/* 语言包 */
import en from "./locales/en.json";
import zh_Hans from "./locales/zh-Hans.json";
import zh_Hant from "./locales/zh-Hant.json";

async function init() {
    /* 配置 */
    const data = reactive<IData>({
        url: new URL(globalThis.location.href),
        doc_id: "",
        doc_path: "",
        doc_notebook: "",
        block_id: "",
        block_ial: {},
        block_config: {
            rows: [],
            retain: false,
        },
        paths: [],
        hpaths: [],
        ial: {},
    });

    /* 客户端 */
    const client = new Client();

    if (import.meta.env.DEV) { // 开发环境
        client.update(
            new URL(import.meta.env.VITE_SIYUAN_SERVE),
            import.meta.env.VITE_SIYUAN_TOKEN,
        )
    }

    var siyuan: ISiyuan;

    if (globalThis.frameElement) { // 以 widget 或者 iframe 模式加载
        /* 获取思源应用对象 */
        siyuan = (globalThis.top as any).siyuan;

        /* 获取 iframe 元素 */
        data.element = globalThis.frameElement as HTMLElement;
        const block = data.element.parentElement!.parentElement;

        /* 获取挂件块 ID */
        data.block_id = block!.dataset.nodeId!;
    }
    else {
        /* 获取思源应用对象 */
        const config = (await client.getConf()).data.conf;
        const notebooks = (await client.lsNotebooks()).data.notebooks;
        siyuan = {
            config,
            notebooks,
        };

        /* 获取挂件块 ID */
        data.block_id = data.url.searchParams.get('id')!;
    }

    /* 设置主题 */
    setThemeMode(siyuan.config.appearance.mode);

    /* 获取文档块 ID */
    const doc_info = (await client.getDocInfo({ id: data.block_id })).data;
    data.doc_id = doc_info.ial.id;

    /* 获取文档 IAL */
    Object.assign(data.ial, doc_info.ial);

    /* 获取文档路径 */
    const doc_data = (await client.sql({
        stmt: `SELECT box, path, hpath, created FROM blocks WHERE id = '${data.doc_id}';`,
    })).data[0];
    data.doc_path = doc_data.path;
    data.doc_notebook = doc_data.box;
    data.paths.push(...`${doc_data.box}${doc_data.path.slice(0, -3)}`.split('/'));
    data.hpaths.push(...`${siyuan.notebooks.find(notebook => notebook.id === doc_data.box)?.name}${doc_data.hpath}`.split('/'));
    data.ial.created = doc_data.created;

    /* 获取挂件块属性 */
    const block_ial = (await client.getBlockAttrs({ id: data.block_id })).data;
    Object.assign(data.block_ial, block_ial);

    /* 读取保存在挂件块属性中的配置 */
    Object.assign(data.block_config, JSON.parse(block_ial["custom-config"] ?? null));

    /* 本地化 */
    const locale = mapLang(siyuan.config.lang); // 语言
    const fallbackLocale = "en"; // 回退语言

    const messages = {
        "en": en,
        "zh-Hans": zh_Hans,
        "zh-Hant": zh_Hant,
    };

    const i18n = createI18n({
        locale, // set locale
        fallbackLocale, // set fallback locale
        messages,
    });

    const app = createApp(App);

    if (import.meta.env.DEV) { // 开发环境
        console.log(data);
    }

    // REF [应用实例 API | Vue.js](https://cn.vuejs.org/api/application.html#app-config-performance)
    app.config.performance = true; // 启用开发模式的性能分析

    app.use(i18n); // 国际化
    app.use(ArcoVue); // Arco 组件库
    app.use(ArcoVueIcon); // Arco 组件库图标

    /* 注入全局依赖 */
    app.provide("i18n", i18n);
    app.provide("client", client);
    app.provide("siyuan", siyuan);
    app.provide("data", data);

    /* 添加 #app 元素挂载 */
    const id = "app";
    globalThis.document.body.insertAdjacentHTML("beforeend", `<div id="${id}"></div>`);
    app.mount(`#${id}`);

    return app;
}

init().catch(error => {
    console.warn(error);

    if (import.meta.env.PROD) { // 生产环境
        setTimeout(() => globalThis.location.reload(), 1000); // 重新加载
    }
})
