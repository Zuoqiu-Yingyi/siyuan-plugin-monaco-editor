# Changelog

## [1.1.0](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/compare/v1.0.1...v1.1.0) (2023-06-06)


### Features

* **webview:** 改进顶部工具栏菜单项隐藏时的菜单位置 | Improve the menu position when the top toolbar menu item is hidden. ([d627c81](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/d627c81618a5f412bd8011242d4f14ef17b43036))
* **webview:** 新增块菜单菜单项 `在新窗口打开` 用 `在新窗口打开并聚焦` | Add block menu item `Open in new window` with `Open in new window and focus`. ([4461104](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/4461104fa1c787a64f3cabd7b9fee50ae8d09852))
* **webview:** 新增超链接地址提示功能 | Add hyperlink address prompt function. ([aaca46c](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/aaca46c52073a40427ca12328b029c221e45545e))
* **webview:** 添加顶部工具栏菜单项 | Add top toolbar menu items. ([400eaae](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/400eaae0b2cc77b61c43052c201a03cd8ec1611e))
* **webview:** 设置页签图标为网页图标 | Set the tab icon to the web icon. ([c76238a](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/c76238aa92d6d4586d1b8735dbcef28a1e391cb4))
* **webview:** 设置页签图标为网页图标 | Set the tab icon to the web icon. ([9d57359](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/9d57359b464402088eb6e37e8f1217915329a46a))


### Bug Fixes

* **webview:** 修复页签图标未显示问题 | Fix the issue of tab icon not displayed. ([ca43c09](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/ca43c09bdc6dc98accb9abee06c02517eccf9ea7))


### Miscellaneous

* **webview:** release v1.0.2 ([9f04d1c](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/9f04d1c5be0146a84fd3cea8d0ebbbe007262eb5))

## [1.0.1](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/compare/v1.0.0...v1.0.1) (2023-05-31)


### Build System

* **siyuan:** 使用思源提供的类型定义文件 | Use the type definition file provided by SiYuan. ([7247bd8](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/7247bd8af617f79584f3f20ff956a1a31ee7408a))


### Miscellaneous

* **webviewi:** remove webview module ([bef8182](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/bef81826b75bb8cb99d8433d5845d8de918bea74))
* **webview:** release v1.0.1 ([de89d32](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/de89d325f4a8136a5382273c8c601138cc8431d1))
* **webview:** 清单新增字段 `backends` 与 `frontends` | Manifest adds fields `backends` and `frontends`. ([67cc633](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/67cc6335361991a093512ee31710639cf6a89148))

## 1.0.0 (2023-05-27)


### Features

* **components:** 优化设置面板组件 | Optimize the settings panel component. ([8b029cd](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/8b029cd3e634936e521d10f91c26d6792de49b9b))
* **utils:** 新增日志记录工具 | Added log recording tool. ([a89086a](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/a89086a7662df922d971457275d02256fc5e0f1e))
* **webview:** `webview` 地址栏添加`使用默认程序打开`按钮 | Add `Open with default program` button to `webview` address bar. ([262f673](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/262f6731fba3f441af8d30f4bee468bcaf7b6bcf))
* **webview:** `webview` 插件支持使用配置选项控制其行为 | The `webview` plugin supports using configuration to control its behavior. ([03b8c75](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/03b8c75904fb4ef3aed6a1d05466a445153640e6))
* **webview:** `webview` 添加在新标签页打开功能 | Add open in new tab function to `webview`. ([2f054d3](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/2f054d3fd8e9260a0296a607c074e31d906d4c94))
* **webview:** 在 `&lt;webview&gt;` 外进行交互时设置 `<webview>` 的 `pointer-events` 为 `nont` | Set the `pointer-events` of `<webview>` to `nont` when interacting outside `<webview>`. ([aa751a6](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/aa751a6deb6591c9d2315775cc08391936ff00b3))
* **webview:** 在新窗口打开的思源编辑器中添加 `Electron` 上下文 | Add `Electron` context to SiYuan Editor opened in a new window. ([1b939ed](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/1b939edac284e0484ae6f761897a8b59a5b7f533))
* **webview:** 完善插件设置界面 | Improve the plugin settings interface. ([909beb3](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/909beb3e52bff20809178f276c1a31eb04a86a8c))
* **webview:** 完善新窗口打开功能的设置界面 | Improve the settings interface of the open in new window function. ([6daad67](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/6daad67c362666eb9727ce5822151fd2ae3b0563))
* **webview:** 实现在新窗口打开功能 | Implement open in new window function. ([fefc779](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/fefc77988091070c06f436949708f207672da41d))
* **webview:** 添加 `使用新窗口打开` 按钮 | Add `Open with a new window` button. ([469f9af](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/469f9af0ce6c6ee11a3e8cd1e36cd962a1a4de29))
* **webview:** 添加 `使用新窗口打开思源编辑器` 功能 | Add `Open SiYuan Editor in a new window` function. ([009d4c4](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/009d4c4e460ce364a82af366b0d4950d64313ec7))
* **webview:** 添加自定义 `User-Agent` 功能 | Add custom `User-Agent` function. ([1b3ed58](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/1b3ed58a613e4ac880abc35e9f3b58c08fe2bad5))
* **webview:** 调整桌面端与移动端窗口的默认设置 | Adjust the default settings of desktop and mobile windows. ([b5c23ad](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/b5c23adedd4a5fe7a1b4a08b38197ccb8940a0ca))
* 取消对非 Election 环境的支持 ([ae20f9b](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/ae20f9bb6503f75c2f278cefc2b083e6563ff67b))
* 添加附属仓库 `siyuan-plugin-webview` | Add sub-repository `siyuan-plugin-webview`. ([dd5b98b](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/dd5b98bb829cc5b4961cfdd90e8230b0c7675127))


### Bug Fixes

* **components:** 修复设置面板无法完全填充问题 | Fix the issue that the settings panel cannot be fully filled. ([6f60f22](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/6f60f222349c63c0c8a4840b2c5311a6cf82694f))
* **webview:** 修复拖拽分屏失效问题 | Fix the issue that drag and drop split screen is invalid. ([c32ec02](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/c32ec02e4d89b7c22ce23ac8488c8df391a6784d))
* **webview:** 修复菜单栏状态设置失效问题 | Fix the issue that the menu bar status setting is invalid. ([47d9f38](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/47d9f38ccfc9c10bd7103d68c1e31ea5ec04bf8a))


### Code Refactoring

* **components:** 使用封装后的 `Svg.svelte` 组件 | Use the encapsulated `Svg.svelte` component. ([3648da3](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/3648da342a3a90fdcf130fd0433b85de360b3f2d))
* **webview:** 使用 `svelte` 重构 `webview` | Refactor `webview` with `svelte`. ([3411718](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/3411718fe3db20c5833330d4ab9bd5dbd273dc0d))
* **webview:** 调整在新窗口打开触发策略 | Adjust the trigger strategy for opening in a new window. ([b9e8b5d](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/b9e8b5df75b0a3a6329da996239fd20cf6b2f4a8))
* 优化设置面板组件 | Optimize the settings panel component. ([f694a0f](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/f694a0fb70289e70ad671f40c30ad86afb0fe186))
* 使用 `&lt;webview&gt;` 原生 API 管理历史 ([bda1338](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/bda133853cca9adbd0b32bf0762e8e9b27f0a450))


### Documentation

* **webview:** 完善用户文档 | Improve user documentation. ([9dd1e56](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/9dd1e5644e6b29b8af4c6e9d381b08e78f6c5c87))


### Continuous Integration

* **webview:** 添加 CD 配置 | Add CD configuration. ([5c3c64c](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/5c3c64ccec28ed10dce4714cacf34f097ada5a2f))


### Miscellaneous

* **webview:** release v1.0.0 ([06bc992](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commit/06bc992b257702297d0c8c7854d0fee661d144fe))

## 更改日志 | CHANGE LOG

本文档由持续集成工作流自动构建，不要直接编辑此文件。  
This document is automatically built by the continuous integration workflow. Do not edit this file directly.
