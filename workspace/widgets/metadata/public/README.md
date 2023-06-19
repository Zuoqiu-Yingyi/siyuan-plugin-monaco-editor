<div align="center">
<img alt="icon" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/widget-metadata/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/widget-metadata?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/widget-metadata?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Zuoqiu-Yingyi/widget-metadata?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/widget-metadata?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/widget-metadata?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/widget-metadata.svg)
[![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/widget-metadata/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/widget-metadata/releases)

---
[简体中文](./README_zh_CN.md) \| English

---
</div>

# Document Metadata

A Widget of document block metadata for [SiYuan Note](https://github.com/siyuan-note/siyuan).

## PREVIEW

![preview](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/widget-metadata/public/preview.png)  

## FUNCTIONAL DESCRIPTION

- Edit the basic attributes of document block.
  - `created`
    - Document Creation Time
  - `updated`
    - Document Modification Time
  - `title`
    - Document Title
  - `name`
    - Document Name
  - `alias`
    - Document Alias
  - `tags`
    - Document Tags
  - `bookmark`
    - Document Bookmark
  - `memo`
    - Document Memo
- Edit the custom attributes of document block.
  - `custom-*`
    - Custom attribute name can contain only `a-z`, `A-Z`, `0-9`, `-`
    - Delete the custom attribute when the attribute value is empty.
- Edit the custom attributes of document block.
  - `id`
    - Document Identification
  - `icon`
    - Document Icon
  - `scroll`
    - Document Browse Location
  - `title-img`
    - Document Cover Image
- Export metadata for document blocks to YAML Front Matter (YFM)
  - You can select partial attributes to export.
  - You can rename the attributes on export.
  - You can sort the attributes on export.
  - You can preview the exported content.
  - You can select the parser of custom attributes value.
    - `string`
      - Parse as string
    - `JSON`
      - Parse as JSON object
      - Valid value
        - `JSON` string
        - `JSON5` string
        - `JavaScript Object`
        - `JavaScript` self-executing function
    - `YAML`
      - Parse as YAML object
      - Valid value
        - `YAML` string
        - `JSON` string


## START

The widget has been put on the shelves at [SiYuan community bazaar](https://github.com/siyuan-note/bazaar) and can be installed directly in the Bazaar.

## REFERENCE & THANKS

## DEPENDENCIES

| Author                                            | Project                                                                                                                   | License                                                                           |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------- |
| **[vitejs](https://github.com/vitejs)**           | [vitejs/vite: Next generation frontend tooling. It's fast!](https://github.com/vitejs/vite)                               | *[MIT license](https://github.com/vitejs/vite/blob/main/LICENSE)*                 |
| **[vuejs](https://github.com/vuejs)**             | [vuejs/vue: This is the repo for Vue 2. For Vue 3, go to https://github.com/vuejs/core](https://github.com/vuejs/vue)     | *[MIT license](https://github.com/vuejs/vue/blob/main/LICENSE)*                   |
| **[kazupon](https://github.com/kazupon)**         | [kazupon/vue-i18n: Internationalization plugin for Vue.js](https://github.com/kazupon/vue-i18n)                           | *[MIT license](https://github.com/kazupon/vue-i18n/blob/v8.x/LICENSE)*            |
| **[arco-design](https://github.com/arco-design)** | [arco-design/arco-design-vue: A Vue.js 3 UI Library based on Arco Design](https://github.com/arco-design/arco-design-vue) | *[MIT license](https://github.com/arco-design/arco-design-vue/blob/main/LICENSE)* |
| **[moment](https://github.com/moment)**           | [GitHub - moment/moment: Parse, validate, manipulate, and display dates in javascript.](https://github.com/moment/moment) | *[MIT license](https://github.com/moment/moment/blob/develop/LICENSE)*            |


ps: Sort by introduction time.

## CHANGE LOGS

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/widget-metadata/blob/main/CHANGELOG.md)
