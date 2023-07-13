<div align="center">
<img alt="图标" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-webview/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub 最新发行版本 (最新一次发行/预发行)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-webview?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/releases/latest)
[![GitHub 最新发行时间](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/releases/latest)
[![GitHub 许可证](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/blob/main/LICENSE)
[![GitHub 最后一次提交时间](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commits/main)
![GitHub 仓库大小](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)
![查看次数](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-webview.svg)
[![GitHub 发行版本下载次数](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-webview/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/releases)

---
简体中文 \| [English](./README.md)

---
</div>

# 思源网页视图

一个可以让你像浏览器一样在标签页或者新窗口中浏览网页的[思源笔记](https://github.com/siyuan-note/siyuan)插件。

## 预览

![预览图片](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-webview/public/preview.png)

## 介绍

### 功能介绍

- 在思源笔记新标签页中打开超链接 (仅限桌面端)
- 在新窗口中打开超链接
- 在新窗口中打开思源笔记编辑器
- 块引用右键菜单
- 超链接右键菜单

### 设置项介绍

安装本插件后可以点击 <kbd>思源设置</kbd> \> <kbd>集市</kbd> \> <kbd>已下载</kbd> \> <kbd>插件</kbd> \> <kbd>网页视图(本插件)</kbd> 的 <kbd>设置</kbd> 按钮打开本插件的设置面板

- 常规设置
  - `用户代理字段 (User-Agent, UA)`
    - 这是一个输入框
    - 默认内容: *\<空\>*
    - 该字段详情请参考 [User-Agent - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/User-Agent)
    - 用户可以在浏览网页时使用自定义的 UA 替代默认的 UA
    - 该选项仅在桌面端可以使用
      - 在标签页打开超链接
      - 在新窗口打开超链接
    - 输入框为空时，将使用默认的 UA `SiYuan/x.y.z https://b3log.org/siyuan Electron`
      - `x.y.z` 为思源当前版本号
  - `网页背景`
    - 这是一个输入框
    - 默认内容: `transparent`
    - 用户可以在这里定义网页的背景颜色或背景图片
    - 该字段详情请参考 [background - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)
  - `重置设置选项`
    - 这是一个按钮
    - 重置所有设置选项为默认选项
    - 点击该按钮后会弹出确认对话框
      - 点击对话框确认按钮后会重置本插件所有选项为默认选项, 之后会自动刷新当前界面
- 打开页签
  - `常规设置`
    - `启用`
      - 这是一个开关
      - 默认状态: *打开*
      - 开关打开后启用 **在标签页中打开超链接** 功能
      - 由于浏览器的安全限制，该功能仅在桌面端可以使用
    - `编辑器超链接`
      - 这是一个开关
      - 默认状态: *打开*
      - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
      - 开关打开后可以通过点击编辑器中的超链接在标签页中打开超链接
    - `其他超链接`
      - 这是一个开关
      - 默认状态: *打开*
      - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
      - 开关打开后可以通过点击不在编辑器中的超链接在标签页中打开超链接
        - 例如点击导出预览页面的超链接
  - `协议`
    - 这是一组开关
    - 默认状态: *全部打开*
    - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
    - 仅激活的网络协议可以在标签页中打开
      - 其他协议/未激活的协议可以使用默认程序打开
  - `快捷键`
    - 这是一组开关
    - 默认状态: *鼠标左键单点击*
    - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
    - 配置在标签页打开超链接所需使用的按键组合
- 打开窗口
  - `常规设置`
    - `启用`
      - 这是一个开关
      - 默认状态: *打开*
      - 开关打开后启用 **在新窗口中打开超链接** 功能
    - `编辑器超链接`
      - 这是一个开关
      - 默认状态: *打开*
      - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
      - 开关打开后可以通过鼠标中键点击编辑器中的超链接在新窗口中打开超链接
    - `其他超链接`
      - 这是一个开关
      - 默认状态: *关闭*
      - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
      - 开关打开后可以通过鼠标中键点击编辑器中的超链接在新窗口中打开超链接
        - 例如点击导出预览页面的超链接
        - 会同时通过默认浏览器打开超链接
  - `协议`
    - 这是一组开关
    - 默认状态: *全部打开*
    - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
    - 仅激活的网络协议可以在新窗口中打开
      - 其他协议/未激活的协议不响应
      - 点击 `siyuan://` 协议会在新窗口打开思源编辑器并跳转到指定的块
  - `快捷键`
    - 这是一组开关
    - 默认状态: *鼠标中键点击*
    - 仅在 `常规设置` 页签中的 `启用` 开关打开后生效
    - 配置在新窗口打开超链接所需使用的按键组合
  - `思源编辑器`
    - `启用`
      - 这是一个开关
      - 默认状态: *打开*
      - 开关打开后启用 **新窗口打开思源编辑器** 功能
        - 使用按键组合点击思源界面中的元素可以在新窗口中打开思源编辑器并跳转到对应的位置
        - 可点击的元素
          - `块`: 编辑器中任意的块
          - `块标`: 鼠标悬浮在块上时显示的块标
          - `块引用`: 行内元素块引用
          - `面包屑`: 面包屑中的每一项
          - `文档标题`: 文档的标题区域
          - `大纲`: 大纲面板中的每一项
          - `文档树`: 文档树中的每一项
          - `反链面板`: 反链面板中的每一项
          - `悬浮预览窗口`: 悬浮预览窗口的标题栏
    - `桌面端编辑器`
      - 这是一个按钮
      - 点击后可以在新窗口打开一个桌面端思源编辑器
    - `移动端编辑器`
      - 这是轧钢按钮
      - 点击后可以在新窗口打开一个移动端思源编辑器
    - `聚焦`
      - 这是一个开关
      - 默认状态: *关闭*
      - 开关打开后在新窗口打开思源编辑器时会聚焦对应的块
    - `编辑器类型`
      - 这是一个下拉选择器
      - 默认状态: *移动端编辑器*
      - 可以选择在新窗口打开的思源编辑器类型

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/blob/main/CHANGELOG.md)
