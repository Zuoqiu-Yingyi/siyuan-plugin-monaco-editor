# 更改日志 | CHANGE LOG

## 2023-05-24

- 完善插件设置界面 | Improve the plugin settings interface.
- `webview` 地址栏添加`使用默认程序打开`按钮 | Add `Open with default program` button to `webview` address bar.

## 2023-05-24

- 优化设置面板组件 | Optimize the settings panel component.
- `webview` 插件支持使用配置控制选项其行为 | The `webview` plugin supports using configuration to control its behavior.

## 2023-05-24

- 优化设置面板组件 | Optimize the settings panel component.
- 修复拖拽分屏失效问题 | Fix the issue that drag and drop split screen is invalid.
- 新增日志记录工具 | Added log recording tool.
- 新增交互事件工具 | Added interactive event tool.

## 2023-05-23

- 添加附属仓库 `siyuan-plugin-webview` | Add sub-repository `siyuan-plugin-webview`.
- 添加附属仓库 `webview` 的管理脚本 | Add management scripts for sub-repository `webview`.
- 使用 `svelte` 重构 `webview` | Refactor `webview` with `svelte`.
- 在 `<webview>` 外进行交互时设置 `<webview>` 的 `pointer-events` 为 `nont` | Set the `pointer-events` of `<webview>` to `nont` when interacting outside `<webview>`.

## 2023-05-20

- 添加 `build.yml` CD 配置 | Add `build.yml` CD configuration.
- 添加 `release-distribution.yml` CD 配置 | Add `release-distribution.yml` CD configuration.
- 新增发行步骤 | Added release steps.
- 添加 `package.json` | Add `package.json`.
- CD `release-please.yml` 支持触发其他 CD 工作流 | CD `release-please.yml` supports triggering other CD workflows.
  - REF: [GitHub credentials](https://github.com/marketplace/actions/release-please-action#github-credentials)
- 更新 `README.md` | Update `README.md`.
- 更新 `release-please.yml` CD 配置 | Update `release-please.yml` CD configuration.
- 添加 `split.ps1` 脚本 | Add `split.ps1` script.
- 修复 `build.yml` CD 配置 | Fix `build.yml` CD configuration.
- 修复 `release-distribution.yml` CD 配置 | Fix `release-distribution.yml` CD configuration.
- CI/CD 支持手动触发 | CI/CD supports manual triggering.
- 修复 `split.ps1` 脚本 | Fix `split.ps1` script.
- 更新依赖 | Update dependencies.
- 更新 `release-please.yml` CD 配置使其生成 pre-release | Update `release-please.yml` CD configuration to generate pre-release.
- 更新 `README*.md` | Update `README*.md`.
- 运行 `build.yml` 完成后调用 `release-distribution.yml` | Call `release-distribution.yml` after `build.yml` is completed.
- 修复 `release-distribution.yml` 打包时目标分支错误问题 | Fix the issue of wrong target branch when `release-distribution.yml` is packaged.
- 修复 `release-distribution.yml` 发布时标签关联分支错误问题 | Fix the issue of wrong branch associated with tag when `release-distribution.yml` is released.
- 修复清单文件中 `readme` 项文件名称错误 | Fix the file name error of the `readme` item in the manifest file.

## 2023-05-19

- 新增附属仓库的的 `CHANGELOG.md` | Added `CHANGELOG.md` for sub-repository.
- 调整更改日志格式 | Adjust the format of the change log.
- 添加 `release-please.yml` CD 配置 | Add `release-please.yml` CD configuration.
- 更新依赖 | Update dependencies.
- 更新 subtree 管理脚本 | Update subtree management scripts.
- 更新 `open-api` 插件描述信息 | Update `open-api` plugin description.
- 更新 `release-please.yml` CD 配置 | Update `release-please.yml` CD configuration.
- 更新思源插件 API 定义文件 | Update SiYuan plugin API definition file.

## 2023-05-18

- 为 `jupyter-client` 插件提供 `svelte-i18n` 支持 | Provides `svelte-i18n` support for `jupyter-client` plugin.
- 添加附属仓库 `siyuan-plugin-open-api` | Add sub-repository `siyuan-plugin-open-api`.
- `open-api` 插件实现将插件 API 暴露至全局变量的功能 | The 'open-api' plugin implement the function exposes the plugin API to global variables.

## 2023-05-17
- 添加捐助方案 | Added donation method.
- 项目初始化 | Project initialization.
- 添加附属仓库 `siyuan-plugin-jupyter-client` | Add sub-repository `siyuan-plugin-jupyter-client`.
- 调整构建工具 | Adjust the build tools.
- 初始化 `jupyter-client` 插件 | Initialize `jupyter-client` plugin.
