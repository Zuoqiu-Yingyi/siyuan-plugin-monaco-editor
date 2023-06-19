<div align="center">
<img alt="图标" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/widget-metadata/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub 最新发行版本 (最新一次发行/预发行)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/widget-metadata?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/releases/latest)
[![GitHub 最新发行时间](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/widget-metadata?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/releases/latest)
[![GitHub 许可证](https://img.shields.io/github/license/Zuoqiu-Yingyi/widget-metadata?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/blob/main/LICENSE)
[![GitHub 最后一次提交时间](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/widget-metadata?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/commits/main)
![GitHub 仓库大小](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/widget-metadata?style=flat-square)
![查看次数](https://hits.b3log.org/Zuoqiu-Yingyi/widget-metadata.svg)
[![GitHub 发行版本下载次数](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/widget-metadata/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/releases)

---
简体中文 \| [English](./README.md)

---
</div>

# 文档元数据

一个适用于 [思源笔记](https://github.com/siyuan-note/siyuan) 的文档块元数据挂件

## 预览

![预览](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/widget-metadata/public/preview.png)

## 功能介绍

- 编辑文档块的基本属性
  - `created`
    - 文档创建时间
  - `updated`
    - 文档修改时间
  - `title`
    - 文档标题
  - `name`
    - 文档命名
  - `alias`
    - 文档别名
  - `tags`
    - 文档标签
  - `bookmark`
    - 文档书签
  - `memo`
    - 文档备注
- 编辑文档块的自定义属性
  - `custom-*`
    - 自定义属性名仅能包含 `a-z`, `A-Z`, `0-9`, `-`
    - 自定义属性值为空时删除该属性
- 编辑文档块的其他属性
  - `id`
    - 文档标识
  - `icon`
    - 文档图标
  - `scroll`
    - 文档浏览位置
  - `title-img`
    - 文档题头图
- 导出文档块的元数据为 YAML Front Matter (YFM)
  - 可选择部分属性导出
  - 可在导出时重命名属性
  - 可在导出时对属性排序
  - 可预览导出的内容
  - 可选择自定义属性值的解析器
    - `string`
      - 解析为字符串
    - `JSON`
      - 解析为 JSON 对象
      - 有效值
        - `JSON` 字符串
        - `JSON5` 字符串
        - `JavaScript Object`
        - `JavaScript` 自执行函数
    - `YAML`
      - 解析为 YAML 对象
      - 有效值
        - `YAML` 字符串
        - `JSON` 字符串


## 开始

该挂件已在[思源笔记社区集市](https://github.com/siyuan-note/bazaar)上架, 可直接在集市中安装

## 参考 & 感谢

## 依赖

| 作者                                              | 项目                                                                                                                      | 许可证                                                                            |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------- |
| **[vitejs](https://github.com/vitejs)**           | [vitejs/vite: Next generation frontend tooling. It's fast!](https://github.com/vitejs/vite)                               | *[MIT license](https://github.com/vitejs/vite/blob/main/LICENSE)*                 |
| **[vuejs](https://github.com/vuejs)**             | [vuejs/vue: This is the repo for Vue 2. For Vue 3, go to https://github.com/vuejs/core](https://github.com/vuejs/vue)     | *[MIT license](https://github.com/vuejs/vue/blob/main/LICENSE)*                   |
| **[kazupon](https://github.com/kazupon)**         | [kazupon/vue-i18n: Internationalization plugin for Vue.js](https://github.com/kazupon/vue-i18n)                           | *[MIT license](https://github.com/kazupon/vue-i18n/blob/v8.x/LICENSE)*            |
| **[arco-design](https://github.com/arco-design)** | [arco-design/arco-design-vue: A Vue.js 3 UI Library based on Arco Design](https://github.com/arco-design/arco-design-vue) | *[MIT license](https://github.com/arco-design/arco-design-vue/blob/main/LICENSE)* |
| **[moment](https://github.com/moment)**           | [GitHub - moment/moment: Parse, validate, manipulate, and display dates in javascript.](https://github.com/moment/moment) | *[MIT license](https://github.com/moment/moment/blob/develop/LICENSE)*            |


注: 按引入时间排序

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/widget-metadata/blob/main/CHANGELOG.md)
