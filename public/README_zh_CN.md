<div align="center">
<img alt="图标" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-custom-block/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub 最新发行版本 (最新一次发行/预发行)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-custom-block?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-block/releases/latest)
[![GitHub 最新发行时间](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-custom-block?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-block/releases/latest)
[![GitHub 许可证](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-custom-block?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-block/blob/main/LICENSE)
[![GitHub 最后一次提交时间](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-custom-block?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-block/commits/main)
![GitHub 仓库大小](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-custom-block?style=flat-square)
![查看次数](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-custom-block.svg)
[![GitHub 发行版本下载次数](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-custom-block/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-block/releases)

---
简体中文 \| [English](./README.md)

---
</div>

# 思源自定义块样式插件

一款可以使用自定义块属性设置块样式的[思源笔记](https://github.com/siyuan-note/siyuan)插件。

## 预览

![预览图片](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/public/preview.png)

## 介绍

### 功能介绍

使用 <kbd>块菜单</kbd> \> <kbd>插件</kbd> > <kbd>自定义块样式</kbd> 设置选中块所支持的样式。

| 菜单项名称      | 块属性                                                                           | 功能介绍                                                                                                                                                                                                                     | 文档块 | 超级块 | 引述块 | 列表块 | 列表项 | 标题块 | 段落块 | 公式块 | 表格块 | 代码块 | HTML 块 | 分割线 | 音频块 | 视频块 | iframe 块 | 挂件块 | 嵌入块 |
| --------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :-----: | :----: | :----: | :----: | :-------: | :----: | :----: |
| 块样式          | `style`                                                                          | 自定义块的 `style` 属性<br />详情请参考: [style - HTML（超文本标记语言）\| MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/style)                                                                   |        |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |   ✔    |   ✔    |   ✔    |     ✔     |   ✔    |   ✔    |
| 全宽显示        | `block-width`:`full`                                                             | 设置该块的宽度为文档宽度                                                                                                                                                                                                     |        |        |        |        |        |        |        |        |        |        |         |        |   ✔    |   ✔    |     ✔     |   ✔    |        |
| 全屏显示        | 无                                                                               | 全屏显示该块                                                                                                                                                                                                                 |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |   ✔    |   ✔    |   ✔    |     ✔     |   ✔    |   ✔    |
| 弹幕            | `block-render`:`danmaku`                                                         | 文档块: 该文档下所有块都以弹幕的形式显示<br />其他块: 以弹幕的形式显示该块                                                                                                                                                   |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |   ✔    |   ✔    |   ✔    |     ✔     |   ✔    |   ✔    |
| 滚屏显示        | `block-render`:`scroll`                                                          | 文档块: 该文档下所有过高的块都显示块内的纵向滚动条<br />其他块: 若该块高度过高则在块内显示纵向滚动条                                                                                                                         |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |   ✔    |   ✔    |   ✔    |     ✔     |   ✔    |   ✔    |
| 显示块 ID       | `block-render`:`id`                                                              | 文档块: 该文档下所有块都在其下方显示块 ID<br />其他块: 该块及其下级块都在其下方显示块 ID                                                                                                                                     |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |   ✔    |   ✔    |   ✔    |     ✔     |   ✔    |   ✔    |
| 显示块序号      | `block-render`:`index`                                                           | 显示文档下顶层块在文档中的序号                                                                                                                                                                                               |   ✔    |        |        |        |        |        |        |        |        |        |         |        |        |        |           |        |        |
| 显示块内容      | `block-render`:`content`                                                         | 文档块: 该文档下所有的块都显示隐藏的内容<br />其他块: 该块内所有的块都显示隐藏的内容<br />超链接显示链接地址<br />行内公式显示公式文本<br />行内备注显示备注文本<br />公式块显示公式文本<br />其他需要渲染的块显示对应的文本 |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |        |        |        |           |        |   ✔    |
| 显示块轮廓      | `block-render`:`outline`                                                         | 文档块: 该文档下所有块显示其轮廓<br />其他块: 显示该块轮廓                                                                                                                                                                   |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |    ✔    |   ✔    |   ✔    |   ✔    |     ✔     |   ✔    |   ✔    |
| 排版模式        | `block-writing-mode`:`vertical-rl`<br />`block-writing-mode`:`vertical-lr`<br /> | 文档块: 切换该文档下所有块的书写模式<br />其他块: 切换该块及其下级块的书写模式<br />`vertical-rl`: 从右向左竖排显示文本<br />`vertical-lr`: 从左向右竖排显示文本<br />                                                       |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |   ✔    |        |   ✔    |        |         |        |        |        |           |        |        |
| 表格-默认宽度   | 无                                                                               | 默认样式<br />表格中未手动调整宽度的列不会自动换行<br />                                                                                                                                                                     |        |        |        |        |        |        |        |        |   ✔    |        |         |        |        |        |           |        |        |
| 表格-自动宽度   | `block-table-width`:`auto`                                                       | 表格最大宽度与文档宽度一致<br />表格单元格中的内容自动换行                                                                                                                                                                   |        |        |        |        |        |        |        |        |   ✔    |        |         |        |        |        |           |        |        |
| 表格-单元格等宽 | `block-table-width`:`equal`                                                      | 表格所有单元格宽度为固定值                                                                                                                                                                                                   |        |        |        |        |        |        |        |        |   ✔    |        |         |        |        |        |           |        |        |
| 列表-默认视图   | 无                                                                               | 默认样式<br />文档块: 该文档下所有列表以大纲的样式显示<br />列表块: 以大纲的样式显示该列表<br />                                                                                                                             |   ✔    |        |        |        |   ✔    |        |        |        |        |        |         |        |        |        |           |        |        |
| 列表-导图视图   | `block-list-view`:`map`                                                          | 文档块: 该文档下所有列表以思维导图的样式显示<br />列表块: 以思维导图的样式显示该列表<br />                                                                                                                                   |   ✔    |        |        |        |   ✔    |        |        |        |        |        |         |        |        |        |           |        |        |
| 列表-表格视图   | `block-list-view`:`table`                                                        | 文档块: 该文档下所有列表以表格的样式显示<br />列表块: 以表格的样式显示该列表<br />                                                                                                                                           |   ✔    |        |        |        |   ✔    |        |        |        |        |        |         |        |        |        |           |        |        |
| 列表-看板视图   | `block-list-view`:`board`                                                        | 文档块: 该文档下所有列表以看板的样式显示<br />列表块: 以看板的样式显示该列表<br />                                                                                                                                           |   ✔    |        |        |        |   ✔    |        |        |        |        |        |         |        |        |        |           |        |        |

### 设置项介绍

* `常规设置`

  * `重置设置选项`

    * 这是一个按钮
    * 重置所有设置选项为默认选项
    * 点击该按钮后会弹出确认对话框

      * 点击对话框确认按钮后会重置本插件所有选项为默认选项, 之后会自动刷新当前界面
* `菜单设置`

  * `菜单`

    * 这是一个开关
    * 默认状态: *打开*
    * 关闭该开关后禁用对应的菜单项
  * `样式`

    * 这是一个开关
    * 默认状态: *打开*
    * 关闭该开关后禁用插件对应的内置样式
    * 若主题兼容对应的样式, 可关闭该开关

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-block/blob/main/CHANGELOG.md)
